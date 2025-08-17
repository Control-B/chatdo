import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import {
  createMessageSchema,
  updateMessageSchema,
  messagesQuerySchema,
} from "@chatdo/shared";

export async function getMessages(req: Request, res: Response) {
  try {
    const { roomId, cursor, limit = 50 } = messagesQuerySchema.parse(req.query);
    const limitNumber = typeof limit === "string" ? parseInt(limit) : limit;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: "Room ID is required",
      });
    }

    // Check if user has access to the room
    const hasAccess = await checkRoomAccess(roomId, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: "Access denied to this room",
      });
    }

    // Build query based on room type
    const roomType = await getRoomType(roomId);
    const where: any =
      roomType === "channel" ? { channelId: roomId } : { dmThreadId: roomId };

    if (cursor) {
      where.createdAt = { lt: new Date(cursor) };
    }

    const messages = await prisma.message.findMany({
      where,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
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
        parent: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    // Get next cursor
    const nextCursor =
      messages.length === limitNumber
        ? messages[messages.length - 1].createdAt.toISOString()
        : null;

    res.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
      pagination: {
        nextCursor,
        hasMore: messages.length === limitNumber,
      },
    });
  } catch (error) {
    logger.error("Get messages failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get messages",
    });
  }
}

export async function createMessage(req: Request, res: Response) {
  try {
    const { roomId, content, attachments, parentId } =
      createMessageSchema.parse(req.body);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: "Room ID is required",
      });
    }

    // Check if user has access to the room
    const hasAccess = await checkRoomAccess(roomId, userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: "Access denied to this room",
      });
    }

    // Determine room type
    const roomType = await getRoomType(roomId);

    // Create message
    const messageData: any = {
      roomType,
      authorId: userId,
      content,
      parentId,
      attachments: attachments
        ? {
            create: attachments.map((att: any) => ({
              filename: att.filename,
              originalName: att.originalName,
              mimeType: att.mimeType,
              size: att.size,
              url: att.url,
              thumbnailUrl: att.thumbnailUrl,
            })),
          }
        : undefined,
    };

    // Set the correct room field based on room type
    if (roomType === "channel") {
      messageData.channelId = roomId;
    } else {
      messageData.dmThreadId = roomId;
    }

    const message = await prisma.message.create({
      data: messageData,
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
        parent: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Update thread count if this is a reply
    if (parentId) {
      await prisma.message.update({
        where: { id: parentId },
        data: {
          threadCount: {
            increment: 1,
          },
        },
      });
    }

    // Update DM thread last message time
    if (roomType === "dm") {
      await prisma.dMThread.update({
        where: { id: roomId },
        data: { lastMessageAt: new Date() },
      });
    }

    logger.info("Message created successfully", {
      messageId: message.id,
      roomId,
      userId,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    logger.error("Create message failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create message",
    });
  }
}

export async function updateMessage(req: Request, res: Response) {
  try {
    const { messageId } = req.params;
    const { content } = updateMessageSchema.parse(req.body);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user owns the message
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        authorId: userId,
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found or you do not have permission to edit it",
      });
    }

    // Update message
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
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

    logger.info("Message updated successfully", { messageId, userId });

    res.json({
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    logger.error("Update message failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update message",
    });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  try {
    const { messageId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user owns the message or is admin
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        OR: [
          { authorId: userId },
          {
            channel: {
              workspace: {
                members: {
                  some: {
                    userId,
                    role: { in: ["owner", "admin"] },
                  },
                },
              },
            },
          },
          {
            dmThread: {
              workspace: {
                members: {
                  some: {
                    userId,
                    role: { in: ["owner", "admin"] },
                  },
                },
              },
            },
          },
        ],
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found or you do not have permission to delete it",
      });
    }

    // Delete message
    await prisma.message.delete({
      where: { id: messageId },
    });

    logger.info("Message deleted successfully", { messageId, userId });

    res.json({
      success: true,
      data: { message: "Message deleted successfully" },
    });
  } catch (error) {
    logger.error("Delete message failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete message",
    });
  }
}

// Helper functions
async function checkRoomAccess(
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

async function getRoomType(roomId: string): Promise<"channel" | "dm"> {
  const channel = await prisma.channel.findUnique({
    where: { id: roomId },
  });

  return channel ? "channel" : "dm";
}
