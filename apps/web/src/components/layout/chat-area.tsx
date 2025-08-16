"use client";

import { useState } from "react";
import { MessageList } from "../chat/message-list";
import { MessageInput } from "../chat/message-input";
import { ChatHeader } from "../chat/chat-header";

interface ChatAreaProps {
  isSidebarOpen: boolean;
  currentUser: any;
}

export function ChatArea({ isSidebarOpen, currentUser }: ChatAreaProps) {
  const [currentChannel] = useState("general");

  return (
    <div className="flex-1 flex flex-col bg-background-primary">
      <ChatHeader channelName={currentChannel} />

      <div className="flex-1 flex flex-col min-h-0">
        <MessageList channelId={currentChannel} />
        <MessageInput channelId={currentChannel} currentUser={currentUser} />
      </div>
    </div>
  );
}
