import { Server as SocketIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { redisClient } from "../config/redis";
import { SocketEvents, SocketEventNames } from "@chatdo/shared";

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers = new Map<
    string,
    { userId: string; socketId: string }
  >();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      adapter: createAdapter(redisClient, redisClient.duplicate()),
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.split(" ")[1];

        if (!token) {
          return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, name: true, email: true },
        });

        if (!user) {
          return next(new Error("User not found"));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        logger.error("Socket authentication failed:", error);
        next(new Error("Authentication error"));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      const user = socket.data.user;
      logger.info("User connected", { userId: user.id, socketId: socket.id });

      // Store connected user
      this.connectedUsers.set(socket.id, {
        userId: user.id,
        socketId: socket.id,
      });

      // Join workspace namespace
      socket.on("join_workspace", async (workspaceId: string) => {
        try {
          // Check if user is member of workspace
          const membership = await prisma.workspaceMember.findUnique({
            where: {
              workspaceId_userId: {
                workspaceId,
                userId: user.id,
              },
            },
          });

          if (!membership) {
            socket.emit("error", { message: "Workspace access denied" });
            return;
          }

          socket.join(`workspace:${workspaceId}`);
          logger.info("User joined workspace", {
            userId: user.id,
            workspaceId,
          });
        } catch (error) {
          logger.error("Join workspace failed:", error);
          socket.emit("error", { message: "Failed to join workspace" });
        }
      });

      // Join room (channel or DM)
      socket.on("join_room", async (data: any) => {
        try {
          const { roomId, roomType } = data;

          // Check access
          const hasAccess = await this.checkRoomAccess(roomId, user.id);
          if (!hasAccess) {
            socket.emit("error", { message: "Room access denied" });
            return;
          }

          socket.join(`room:${roomId}`);

          // Update user count
          const room = this.io.sockets.adapter.rooms.get(`room:${roomId}`);
          const userCount = room ? room.size : 0;

          socket.emit("room_user_count", {
            roomId,
            roomType,
            count: userCount,
          });

          logger.info("User joined room", {
            userId: user.id,
            roomId,
            roomType,
          });
        } catch (error) {
          logger.error("Join room failed:", error);
          socket.emit("error", { message: "Failed to join room" });
        }
      });

      // Leave room
      socket.on("leave_room", (data: SocketEvents["leave_room"]) => {
        const { roomId } = data;
        socket.leave(`room:${roomId}`);
        logger.info("User left room", { userId: user.id, roomId });
      });

      // Send message
      socket.on("message_send", async (data: SocketEvents["message_send"]) => {
        try {
          const {
            roomId,
            roomType,
            content,
            attachments,
            parentId,
            idempotencyKey,
          } = data;

          // Check access
          const hasAccess = await this.checkRoomAccess(roomId, user.id);
          if (!hasAccess) {
            socket.emit("error", { message: "Room access denied" });
            return;
          }

          // Create message in database
          const message = await prisma.message.create({
            data: {
              roomId,
              roomType,
              authorId: user.id,
              content,
              parentId,
              attachments: attachments
                ? {
                    create: attachments.map((att) => ({
                      filename: att.filename,
                      originalName: att.originalName,
                      mimeType: att.mimeType,
                      size: att.size,
                      url: att.url,
                      thumbnailUrl: att.thumbnailUrl,
                    })),
                  }
                : undefined,
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
              attachments: true,
            },
          });

          // Broadcast to room
          socket.to(`room:${roomId}`).emit("message_new", {
            ...message,
            roomId,
            roomType,
          });

          logger.info("Message sent", {
            messageId: message.id,
            roomId,
            userId: user.id,
          });
        } catch (error) {
          logger.error("Send message failed:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      // Typing indicators
      socket.on("typing_start", (data: SocketEvents["typing_start"]) => {
        const { roomId, roomType } = data;
        socket.to(`room:${roomId}`).emit("typing", {
          roomId,
          roomType,
          userId: user.id,
          userName: user.name,
        });
      });

      socket.on("typing_stop", (data: SocketEvents["typing_stop"]) => {
        const { roomId, roomType } = data;
        socket.to(`room:${roomId}`).emit("typing", {
          roomId,
          roomType,
          userId: user.id,
          userName: user.name,
          isTyping: false,
        });
      });

      // Read receipts
      socket.on("receipt_ack", async (data: SocketEvents["receipt_ack"]) => {
        try {
          const { roomId, roomType, messageId } = data;

          // Update read receipt
          await prisma.readReceipt.upsert({
            where: {
              roomId_userId: {
                roomId,
                userId: user.id,
              },
            },
            update: {
              messageId,
              lastSeenAt: new Date(),
            },
            create: {
              roomId,
              userId: user.id,
              messageId,
              lastSeenAt: new Date(),
            },
          });

          // Get all read receipts for this message
          const readReceipts = await prisma.readReceipt.findMany({
            where: { messageId },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

          // Broadcast read receipt update
          this.io.to(`room:${roomId}`).emit("receipt_update", {
            roomId,
            roomType,
            messageId,
            readBy: readReceipts.map((rr: any) => ({
              userId: rr.user.id,
              userName: rr.user.name,
              readAt: rr.lastSeenAt,
            })),
          });
        } catch (error) {
          logger.error("Read receipt failed:", error);
        }
      });

      // Presence
      socket.on("presence_ping", (data: SocketEvents["presence_ping"]) => {
        const { status } = data;
        // Broadcast presence to workspace
        socket.broadcast.emit("presence", {
          userId: user.id,
          status,
          lastSeenAt: new Date(),
        });
      });

      // Disconnect
      socket.on("disconnect", () => {
        this.connectedUsers.delete(socket.id);
        logger.info("User disconnected", {
          userId: user.id,
          socketId: socket.id,
        });
      });
    });
  }

  private async checkRoomAccess(
    roomId: string,
    userId: string
  ): Promise<boolean> {
    // Check if it's a channel
    const channel = await prisma.channel.findFirst({
      where: {
        id: roomId,
        OR: [
          { isPrivate: false },
          {
            isPrivate: true,
            members: {
              some: { userId },
            },
          },
        ],
        workspace: {
          members: {
            some: { userId },
          },
        },
      },
    });

    if (channel) return true;

    // Check if it's a DM thread
    const dmThread = await prisma.dMThread.findFirst({
      where: {
        id: roomId,
        participants: {
          has: userId,
        },
      },
    });

    return !!dmThread;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}
