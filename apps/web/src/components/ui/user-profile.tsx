"use client";

import { useState } from "react";
import { Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "./avatar";

interface UserProfileProps {
  isCollapsed: boolean;
}

export function UserProfile({ isCollapsed }: UserProfileProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={cn(
          "flex items-center w-full p-2 rounded-md hover:bg-background-hover transition-colors",
          isCollapsed && "justify-center"
        )}
      >
        <Avatar
          src={user.image || undefined}
          alt={user.name || "User"}
          fallback={user.name || user.email || "U"}
          size="md"
        />
        {!isCollapsed && (
          <div className="ml-3 flex-1 text-left">
            <p className="text-sm font-medium text-text-primary truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-text-tertiary truncate">{user.email}</p>
          </div>
        )}
      </button>

      {isMenuOpen && !isCollapsed && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-background-card border border-border-primary rounded-md shadow-lg z-50">
          <div className="p-2">
            <button className="flex items-center w-full p-2 text-sm text-text-primary hover:bg-background-hover rounded-md">
              <User size={16} className="mr-2" />
              Profile
            </button>
            <button className="flex items-center w-full p-2 text-sm text-text-primary hover:bg-background-hover rounded-md">
              <Settings size={16} className="mr-2" />
              Settings
            </button>
            <hr className="my-1 border-border-primary" />
            <button className="flex items-center w-full p-2 text-sm text-accent-red hover:bg-background-hover rounded-md">
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
