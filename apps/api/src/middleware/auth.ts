import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("JWT verification failed:", error);
    return res.status(403).json({ success: false, error: "Invalid token" });
  }
}

export function requireWorkspaceAccess(
  requiredRole: "owner" | "admin" | "member" = "member"
) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { workspaceId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Authentication required" });
    }

    try {
      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId,
          },
        },
        include: {
          workspace: true,
        },
      });

      if (!membership) {
        return res
          .status(403)
          .json({ success: false, error: "Workspace access denied" });
      }

      // Check role permissions
      const roleHierarchy = { owner: 3, admin: 2, member: 1 };
      const userRoleLevel = roleHierarchy[membership.role];
      const requiredRoleLevel = roleHierarchy[requiredRole];

      if (userRoleLevel < requiredRoleLevel) {
        return res
          .status(403)
          .json({ success: false, error: "Insufficient permissions" });
      }

      // Add workspace info to request
      (req as any).workspace = membership.workspace;
      (req as any).membership = membership;
      next();
    } catch (error) {
      logger.error("Workspace access check failed:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  };
}

export function requireChannelAccess() {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { channelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Authentication required" });
    }

    try {
      const channelMember = await prisma.channelMember.findUnique({
        where: {
          channelId_userId: {
            channelId,
            userId,
          },
        },
        include: {
          channel: {
            include: {
              workspace: {
                include: {
                  members: {
                    where: { userId },
                  },
                },
              },
            },
          },
        },
      });

      // Allow access if user is channel member or workspace admin/owner
      if (!channelMember) {
        const workspaceMember = await prisma.workspaceMember.findFirst({
          where: {
            workspaceId: req.params.workspaceId,
            userId,
            role: { in: ["owner", "admin"] },
          },
        });

        if (!workspaceMember) {
          return res
            .status(403)
            .json({ success: false, error: "Channel access denied" });
        }
      }

      next();
    } catch (error) {
      logger.error("Channel access check failed:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  };
}
