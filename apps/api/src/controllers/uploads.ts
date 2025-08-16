import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import {
  generatePresignedUrl,
  getFileUrl,
  CONTAINER_NAME,
  deleteFile as deleteFileFromStorage,
} from "../config/azureStorage";
import { presignedUploadSchema } from "@chatdo/shared";

export async function getPresignedUrl(req: Request, res: Response) {
  try {
    const { filename, contentType, size } = presignedUploadSchema.parse(
      req.body
    );
    const userId = (req as any).user?.id;
    const { workspaceId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user has access to workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Workspace access denied",
      });
    }

    // Generate unique filename
    const fileExtension = filename.split(".").pop();
    const uniqueFilename = `${workspaceId}/${uuidv4()}.${fileExtension}`;

    // Generate presigned URL
    const presignedUrl = await generatePresignedUrl(
      uniqueFilename,
      contentType
    );

    // Create file record in database
    const file = await prisma.file.create({
      data: {
        workspaceId,
        uploadedBy: userId,
        filename: uniqueFilename,
        originalName: filename,
        mimeType: contentType,
        size,
        url: getFileUrl(uniqueFilename),
      },
    });

    logger.info("Presigned URL generated", {
      fileId: file.id,
      workspaceId,
      userId,
    });

    res.json({
      success: true,
      data: {
        presignedUrl,
        fileId: file.id,
        filename: uniqueFilename,
        url: file.url,
      },
    });
  } catch (error) {
    logger.error("Generate presigned URL failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate upload URL",
    });
  }
}

export async function getFiles(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const userId = (req as any).user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user has access to workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Workspace access denied",
      });
    }

    // Get files with pagination
    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where: { workspaceId },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.file.count({
        where: { workspaceId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: files,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    });
  } catch (error) {
    logger.error("Get files failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get files",
    });
  }
}

export async function deleteFile(req: Request, res: Response) {
  try {
    const { fileId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user owns the file or is workspace admin/owner
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        OR: [
          { uploadedBy: userId },
          {
            workspace: {
              members: {
                some: {
                  userId,
                  role: { in: ["owner", "admin"] },
                },
              },
            },
          },
        ],
      },
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: "File not found or you do not have permission to delete it",
      });
    }

    // Delete from Azure Blob Storage
    const deleted = await deleteFileFromStorage(file.filename);
    
    if (!deleted) {
      logger.warn("Failed to delete file from Azure storage", { fileId, filename: file.filename });
    }

    // Delete file from database
    await prisma.file.delete({
      where: { id: fileId },
    });

    logger.info("File deleted successfully", { fileId, userId });

    res.json({
      success: true,
      data: { message: "File deleted successfully" },
    });
  } catch (error) {
    logger.error("Delete file failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete file",
    });
  }
}
