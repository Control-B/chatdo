import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
    author: string;
  };
}

export interface ChatState {
  // UI State
  isSidebarOpen: boolean;
  currentChannelId: string | null;

  // Data
  channels: Channel[];
  onlineUsers: string[];

  // Actions
  toggleSidebar: () => void;
  setCurrentChannel: (channelId: string) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  removeChannel: (channelId: string) => void;
  setOnlineUsers: (users: string[]) => void;
  markChannelAsRead: (channelId: string) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isSidebarOpen: true,
      currentChannelId: "general",
      channels: [
        {
          id: "general",
          name: "general",
          type: "text",
          unreadCount: 0,
          lastMessage: {
            content: "Welcome to ChatDO!",
            timestamp: new Date(),
            author: "System",
          },
        },
        {
          id: "random",
          name: "random",
          type: "text",
          unreadCount: 2,
          lastMessage: {
            content: "Anyone up for a game?",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            author: "Alex",
          },
        },
        {
          id: "help",
          name: "help",
          type: "text",
          unreadCount: 0,
          lastMessage: {
            content: "How do I create a new channel?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            author: "Sarah",
          },
        },
      ],
      onlineUsers: ["Alex", "Sarah", "Mike"],

      // Actions
      toggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      setCurrentChannel: (channelId: string) =>
        set({
          currentChannelId: channelId,
        }),

      addChannel: (channel: Channel) =>
        set((state) => ({
          channels: [...state.channels, channel],
        })),

      updateChannel: (channelId: string, updates: Partial<Channel>) =>
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, ...updates } : channel
          ),
        })),

      removeChannel: (channelId: string) =>
        set((state) => ({
          channels: state.channels.filter(
            (channel) => channel.id !== channelId
          ),
        })),

      setOnlineUsers: (users: string[]) => set({ onlineUsers: users }),

      markChannelAsRead: (channelId: string) =>
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, unreadCount: 0 } : channel
          ),
        })),
    }),
    {
      name: "chat-store",
    }
  )
);

