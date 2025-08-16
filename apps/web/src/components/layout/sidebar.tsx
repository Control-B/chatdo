"use client";

import { useState } from "react";
import {
  MessageSquare,
  Users,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Hash,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile } from "../ui/user-profile";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [selectedChannel, setSelectedChannel] = useState("general");

  const channels = [
    { id: "general", name: "general", type: "text" as const },
    { id: "random", name: "random", type: "text" as const },
    { id: "help", name: "help", type: "text" as const },
  ];

  const voiceChannels = [
    { id: "general-voice", name: "General Voice", type: "voice" as const },
    { id: "gaming", name: "Gaming", type: "voice" as const },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-background-sidebar border-r border-border-primary transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-primary">
        {isOpen && (
          <h1 className="text-xl font-bold text-text-primary">ChatDO</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-background-hover transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Text Channels */}
        <div className="p-4">
          {isOpen && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Text Channels
              </h3>
              <button className="p-1 rounded hover:bg-background-hover">
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={cn(
                  "channel-item w-full flex items-center",
                  selectedChannel === channel.id && "active"
                )}
              >
                <Hash size={16} className="mr-2" />
                {isOpen && <span>{channel.name}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div className="p-4">
          {isOpen && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Voice Channels
              </h3>
              <button className="p-1 rounded hover:bg-background-hover">
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="space-y-1">
            {voiceChannels.map((channel) => (
              <button
                key={channel.id}
                className="channel-item w-full flex items-center"
              >
                <Volume2 size={16} className="mr-2" />
                {isOpen && <span>{channel.name}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border-primary">
        <UserProfile isCollapsed={!isOpen} />
      </div>
    </div>
  );
}

