"use client";

import { Hash, Users, Search, Bell, Pin } from "lucide-react";

interface ChatHeaderProps {
  channelName: string;
}

export function ChatHeader({ channelName }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border-primary bg-background-secondary">
      <div className="flex items-center space-x-3">
        <Hash size={20} className="text-text-tertiary" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {channelName}
          </h2>
          <p className="text-sm text-text-tertiary">Channel • 3 members</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-md hover:bg-background-hover transition-colors">
          <Bell size={18} className="text-text-secondary" />
        </button>
        <button className="p-2 rounded-md hover:bg-background-hover transition-colors">
          <Pin size={18} className="text-text-secondary" />
        </button>
        <button className="p-2 rounded-md hover:bg-background-hover transition-colors">
          <Users size={18} className="text-text-secondary" />
        </button>
        <div className="w-px h-6 bg-border-primary mx-2" />
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-background-card border border-border-primary rounded-md px-3 py-1.5 pl-8 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
          />
          <Search
            size={16}
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary"
          />
        </div>
      </div>
    </div>
  );
}



