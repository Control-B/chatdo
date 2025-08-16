"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { ChatArea } from "./chat-area";
import { WelcomePage } from "../auth/welcome-page";
import { useAuth } from "@/hooks/use-auth";

export function ChatLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading ChatDO...</p>
        </div>
      </div>
    );
  }

  // Temporarily bypass authentication for testing
  const mockUser = {
    id: "1",
    name: "Demo User",
    email: "demo@chatdo.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
  };

  if (!user) {
    // For testing, use mock user instead of redirecting to welcome page
    console.log("No user found, using mock user for testing");
  }

  const currentUser = user || mockUser;

  return (
    <div className="h-screen w-full flex bg-background-primary">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <ChatArea isSidebarOpen={isSidebarOpen} currentUser={currentUser} />
    </div>
  );
}
