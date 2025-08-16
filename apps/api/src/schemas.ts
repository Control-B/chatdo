import { z } from "zod";

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
});

// Workspace schemas
export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

// Channel schemas
export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Channel name must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
});

export const updateChannelSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Channel name must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  description: z.string().max(500).optional(),
});

// Message schemas
export const createMessageSchema = z.object({
  content: z.string().min(1).max(10000),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        originalName: z.string(),
        mimeType: z.string(),
        size: z.number().positive(),
        url: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
      })
    )
    .optional(),
  parentId: z.string().uuid().optional(),
});

export const updateMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

// Invite schemas
export const createInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]).default("member"),
});

// File upload schemas
export const presignedUploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z
    .number()
    .positive()
    .max(100 * 1024 * 1024), // 100MB max
});

// Socket event schemas
export const joinRoomSchema = z.object({
  roomId: z.string(),
  roomType: z.enum(["channel", "dm"]),
});

export const leaveRoomSchema = z.object({
  roomId: z.string(),
  roomType: z.enum(["channel", "dm"]),
});

export const messageSendSchema = z.object({
  roomId: z.string(),
  roomType: z.enum(["channel", "dm"]),
  content: z.string().min(1).max(10000),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        originalName: z.string(),
        mimeType: z.string(),
        size: z.number().positive(),
        url: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
      })
    )
    .optional(),
  parentId: z.string().uuid().optional(),
  idempotencyKey: z.string(),
});

export const typingSchema = z.object({
  roomId: z.string(),
  roomType: z.enum(["channel", "dm"]),
});

export const receiptAckSchema = z.object({
  roomId: z.string(),
  roomType: z.enum(["channel", "dm"]),
  messageId: z.string().uuid(),
});

export const presencePingSchema = z.object({
  status: z.enum(["online", "away", "dnd"]),
});

// Query schemas
export const messagesQuerySchema = z.object({
  roomId: z.string(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
});

export const searchQuerySchema = z.object({
  workspaceId: z.string(),
  query: z.string().min(1),
  roomId: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
    })
    .optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
