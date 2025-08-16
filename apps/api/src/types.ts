export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt: Date;
  user: User;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelMember {
  id: string;
  channelId: string;
  userId: string;
  joinedAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  roomType: "channel" | "dm";
  authorId: string;
  content: string;
  attachments: Attachment[];
  parentId?: string;
  threadCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  parent?: Message;
}

export interface Attachment {
  id: string;
  messageId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

export interface DMThread {
  id: string;
  workspaceId: string;
  participants: string[];
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadReceipt {
  id: string;
  roomId: string;
  userId: string;
  lastSeenAt: Date;
  messageId: string;
}

export interface Invite {
  id: string;
  workspaceId: string;
  email: string;
  role: "admin" | "member";
  invitedBy: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface File {
  id: string;
  workspaceId: string;
  uploadedBy: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  createdAt: Date;
}

// Socket Events
export interface SocketEvents {
  // Client to Server
  join_room: {
    roomId: string;
    roomType: "channel" | "dm";
  };
  leave_room: {
    roomId: string;
    roomType: "channel" | "dm";
  };
  message_send: {
    roomId: string;
    roomType: "channel" | "dm";
    content: string;
    attachments?: Omit<Attachment, "id" | "messageId" | "createdAt">[];
    parentId?: string;
    idempotencyKey: string;
  };
  typing_start: {
    roomId: string;
    roomType: "channel" | "dm";
  };
  typing_stop: {
    roomId: string;
    roomType: "channel" | "dm";
  };
  receipt_ack: {
    roomId: string;
    roomType: "channel" | "dm";
    messageId: string;
  };
  presence_ping: {
    status: "online" | "away" | "dnd";
  };

  // Server to Client
  message_new: Message & { roomId: string; roomType: "channel" | "dm" };
  message_edit: {
    messageId: string;
    content: string;
    updatedAt: Date;
  };
  message_delete: {
    messageId: string;
  };
  typing: {
    roomId: string;
    roomType: "channel" | "dm";
    userId: string;
    userName: string;
  };
  presence: {
    userId: string;
    status: "online" | "away" | "dnd";
    lastSeenAt: Date;
  };
  receipt_update: {
    roomId: string;
    roomType: "channel" | "dm";
    messageId: string;
    readBy: Array<{
      userId: string;
      userName: string;
      readAt: Date;
    }>;
  };
  room_user_count: {
    roomId: string;
    roomType: "channel" | "dm";
    count: number;
  };
}

export type SocketEventNames = keyof SocketEvents;
export type SocketEventData<T extends SocketEventNames> = SocketEvents[T];
