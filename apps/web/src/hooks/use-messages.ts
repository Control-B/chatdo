"use client";

import { useState, useEffect } from "react";
import { generateId } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  channelId: string;
}

// Global message store to persist messages across component re-renders
const messageStore: Record<string, Message[]> = {};

export function useMessages(channelId: string) {
  const [messages, setMessages] = useState<Message[]>(
    messageStore[channelId] || []
  );
  const [isLoading, setIsLoading] = useState(!messageStore[channelId]);

  useEffect(() => {
    // Only load mock messages if we don't have any for this channel
    if (!messageStore[channelId]) {
      const timer = setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: generateId(),
            content: "Hey everyone! Welcome to ChatDO! 🚀",
            author: {
              id: "1",
              name: "Alex Chen",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            },
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            channelId,
          },
          {
            id: generateId(),
            content: "Thanks Alex! This looks amazing. I love the dark theme!",
            author: {
              id: "2",
              name: "Sarah Johnson",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            },
            timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
            channelId,
          },
          {
            id: generateId(),
            content:
              "The UI is really clean and modern. Great work on the design!",
            author: {
              id: "3",
              name: "Mike Rodriguez",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
            },
            timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
            channelId,
          },
          {
            id: generateId(),
            content: "Has anyone tried the voice channels yet?",
            author: {
              id: "1",
              name: "Alex Chen",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            },
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            channelId,
          },
          {
            id: generateId(),
            content: "Not yet, but I'm excited to test them out!",
            author: {
              id: "2",
              name: "Sarah Johnson",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            },
            timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
            channelId,
          },
        ];

        messageStore[channelId] = mockMessages;
        setMessages(mockMessages);
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [channelId]);

  const addMessage = (content: string, author: Message["author"]) => {
    console.log("addMessage called with:", { content, author, channelId });

    const newMessage: Message = {
      id: generateId(),
      content,
      author,
      timestamp: new Date(),
      channelId,
    };

    console.log("New message created:", newMessage);

    // Update both the local state and the global store
    const updatedMessages = [...messages, newMessage];
    messageStore[channelId] = updatedMessages;
    setMessages(updatedMessages);

    console.log("Messages updated. Total messages:", updatedMessages.length);
    console.log("Global store updated for channel:", channelId);
  };

  return {
    messages,
    isLoading,
    addMessage,
  };
}
