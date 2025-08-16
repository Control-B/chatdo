import { z } from "zod";

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

// Workspace schemas
export const createWorkspaceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  avatar: z.string().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

// Channel schemas
export const createChannelSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false),
});

export const updateChannelSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

// Message schemas
export const createMessageSchema = z.object({
  content: z.string().min(1),
  channelId: z.string().optional(),
  userId: z.string().optional(),
  parentId: z.string().optional(),
  roomId: z.string().optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    originalName: z.string(),
    mimeType: z.string(),
    size: z.number(),
    url: z.string(),
    thumbnailUrl: z.string().optional(),
  })).optional(),
});

export const updateMessageSchema = z.object({
  content: z.string().min(1),
});

export const messageReactionSchema = z.object({
  emoji: z.string().min(1),
});

export const messageReadSchema = z.object({
  messageIds: z.array(z.string()),
});

export const messagesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  before: z.string().optional(),
  after: z.string().optional(),
  roomId: z.string(),
  cursor: z.string().optional(),
});

// Upload schemas
export const presignedUploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().positive(),
});

// Socket.IO types
export interface SocketEvents {
  join_room: (data: { roomId: string; roomType: string }) => void;
  leave_room: (data: { roomId: string; roomType: string }) => void;
  message: (data: any) => void;
  message_send: (data: { 
    roomId: string; 
    roomType: string; 
    content: string; 
    attachments?: any[]; 
    parentId?: string; 
    idempotencyKey?: string; 
  }) => void;
  typing_start: (data: { roomId: string; userId: string; roomType: string }) => void;
  typing_stop: (data: { roomId: string; userId: string; roomType: string }) => void;
  user_connected: (data: { userId: string }) => void;
  user_disconnected: (data: { userId: string }) => void;
  receipt_ack: (data: { roomId: string; roomType: string; messageId: string }) => void;
  presence_ping: (data: { status: string }) => void;
}

export type SocketEventNames = keyof SocketEvents;