"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";

interface MessageInputProps {
  channelId: string;
  currentUser: any;
}

export function MessageInput({ channelId, currentUser }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMessage } = useMessages(channelId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Message:", message);
    console.log("CurrentUser:", currentUser);

    if (!message.trim()) {
      console.log("Message is empty");
      return;
    }

    if (!currentUser) {
      console.log("No user found");
      return;
    }

    console.log("Sending message:", message.trim());
    console.log("CurrentUser:", currentUser);

    try {
      addMessage(message.trim(), {
        id: currentUser.id || "1",
        name: currentUser.name || "User",
        avatar: currentUser.image,
      });
      console.log("Message added successfully");
    } catch (error) {
      console.error("Error adding message:", error);
    }

    setMessage("");
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log("Key pressed:", e.key, "Shift:", e.shiftKey);
    if (e.key === "Enter" && !e.shiftKey) {
      console.log("Enter pressed without shift - submitting form");
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file.name);
    }
  };

  return (
    <div className="border-t border-border-primary bg-background-secondary p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${channelId}`}
            className="w-full bg-background-card border border-border-primary rounded-lg px-4 py-3 text-text-primary placeholder-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
            rows={1}
            style={{
              minHeight: "44px",
              maxHeight: "120px",
            }}
          />

          {isTyping && (
            <div className="absolute bottom-2 right-2">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleFileUpload}
            className="p-2 rounded-md hover:bg-background-hover transition-colors text-text-tertiary hover:text-text-primary"
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            className="p-2 rounded-md hover:bg-background-hover transition-colors text-text-tertiary hover:text-text-primary"
          >
            <Smile size={20} />
          </button>

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 rounded-md bg-accent-blue hover:bg-blue-600 disabled:bg-background-hover disabled:text-text-tertiary transition-colors text-white"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
}
