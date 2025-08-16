import { Request, Response } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import { createWorkspaceSchema, updateWorkspaceSchema } from "@chatdo/shared";

export async function createWorkspace(req: Request, res: Response) {
  try {
    const { name, description, avatar } = createWorkspaceSchema.parse(req.body);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug },
    });

    if (existingWorkspace) {
      return res.status(409).json({
        success: false,
        error: "Workspace with this name already exists",
      });
    }

    // Create workspace and add owner as member
    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        description,
        avatar,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "owner",
          },
        },
      },
      include: {
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

    logger.info("Workspace created successfully", {
      workspaceId: workspace.id,
      userId,
    });

    res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    logger.error("Create workspace failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create workspace",
    });
  }
}

export async function getWorkspace(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
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
        channels: {
          where: {
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
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            channels: true,
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: "Workspace not found",
      });
    }

    res.json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    logger.error("Get workspace failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get workspace",
    });
  }
}

export async function updateWorkspace(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const updates = updateWorkspaceSchema.parse(req.body);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user is workspace owner or admin
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
        error: "Insufficient permissions",
      });
    }

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: updates,
      include: {
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

    logger.info("Workspace updated successfully", { workspaceId, userId });

    res.json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    logger.error("Update workspace failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update workspace",
    });
  }
}

export async function getMyWorkspaces(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
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
            channels: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    logger.error("Get my workspaces failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get workspaces",
    });
  }
}
