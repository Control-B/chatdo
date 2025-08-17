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

// Clean up any existing system messages from the store
const cleanSystemMessages = () => {
  Object.keys(messageStore).forEach((channelId) => {
    messageStore[channelId] = messageStore[channelId].filter(
      (m) => m.author?.name?.toLowerCase() !== "system"
    );
  });
};

// Function to completely clear all messages (for debugging)
export const clearAllMessages = () => {
  Object.keys(messageStore).forEach((channelId) => {
    messageStore[channelId] = [];
  });
  console.log("All messages cleared from store");
};

// Function to inspect current messages (for debugging)
export const inspectMessages = () => {
  console.log("Current message store:", messageStore);
  return messageStore;
};

// Run cleanup on module load
cleanSystemMessages();

// Expose debugging functions globally in development
if (typeof window !== "undefined") {
  (window as any).clearAllMessages = clearAllMessages;
  (window as any).inspectMessages = inspectMessages;
  (window as any).cleanSystemMessages = cleanSystemMessages;
}

export function useMessages(channelId: string) {
  const [messages, setMessages] = useState<Message[]>(
    (messageStore[channelId] || []).filter(
      (m) => m.author?.name?.toLowerCase() !== "system"
    )
  );
  const [isLoading, setIsLoading] = useState(!messageStore[channelId]);

  useEffect(() => {
    // Do not seed any mock/system messages automatically
    if (!messageStore[channelId]) {
      messageStore[channelId] = [];
      setMessages([]);
      setIsLoading(false);
    } else {
      // Filter out any existing system messages from the store
      const filteredMessages = messageStore[channelId].filter(
        (m) => m.author?.name?.toLowerCase() !== "system"
      );
      messageStore[channelId] = filteredMessages;
      setMessages(filteredMessages);
      setIsLoading(false);
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
