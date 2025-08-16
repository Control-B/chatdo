import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { createChannelSchema, updateChannelSchema } from "@chatdo/shared";

export async function createChannel(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { name, description, isPrivate } = createChannelSchema.parse(
      req.body
    );
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user has permission to create channels
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions to create channels",
      });
    }

    // Check if channel name already exists in workspace
    const existingChannel = await prisma.channel.findUnique({
      where: {
        workspaceId_name: {
          workspaceId,
          name,
        },
      },
    });

    if (existingChannel) {
      return res.status(409).json({
        success: false,
        error: "Channel with this name already exists",
      });
    }

    // Create channel
    const channel = await prisma.channel.create({
      data: {
        workspaceId,
        name,
        description,
        isPrivate,
        members: {
          create: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    logger.info("Channel created successfully", {
      channelId: channel.id,
      workspaceId,
      userId,
    });

    res.status(201).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    logger.error("Create channel failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create channel",
    });
  }
}

export async function getChannel(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        OR: [
          { isPrivate: false },
          {
            isPrivate: true,
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        members: {
          include: {
            user: {
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
            members: true,
            messages: true,
          },
        },
      },
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        error: "Channel not found",
      });
    }

    res.json({
      success: true,
      data: channel,
    });
  } catch (error) {
    logger.error("Get channel failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get channel",
    });
  }
}

export async function updateChannel(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const updates = updateChannelSchema.parse(req.body);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user has permission to update channel
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspace: {
          channels: {
            some: {
              id: channelId,
            },
          },
        },
        userId,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    const channel = await prisma.channel.update({
      where: { id: channelId },
      data: updates,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        members: {
          include: {
            user: {
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

    logger.info("Channel updated successfully", { channelId, userId });

    res.json({
      success: true,
      data: channel,
    });
  } catch (error) {
    logger.error("Update channel failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update channel",
    });
  }
}

export async function joinChannel(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if channel exists and is public
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        isPrivate: false,
      },
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        error: "Channel not found or is private",
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        error: "Already a member of this channel",
      });
    }

    // Add user to channel
    await prisma.channelMember.create({
      data: {
        channelId,
        userId,
      },
    });

    logger.info("User joined channel", { channelId, userId });

    res.json({
      success: true,
      data: { message: "Successfully joined channel" },
    });
  } catch (error) {
    logger.error("Join channel failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to join channel",
    });
  }
}

export async function leaveChannel(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Remove user from channel
    await prisma.channelMember.delete({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });

    logger.info("User left channel", { channelId, userId });

    res.json({
      success: true,
      data: { message: "Successfully left channel" },
    });
  } catch (error) {
    logger.error("Leave channel failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to leave channel",
    });
  }
}
