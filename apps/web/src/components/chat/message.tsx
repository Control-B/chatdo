"use client";

import { formatRelativeTime } from "@/lib/utils";
import { Message as MessageType } from "@/hooks/use-messages";
import { Avatar } from "../ui/avatar";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  return (
    <div className="flex items-start space-x-3 group hover:bg-background-hover/50 rounded-lg p-2 -m-2 transition-colors">
      <div className="flex-shrink-0">
        <Avatar
          src={message.author.avatar}
          alt={message.author.name}
          fallback={message.author.name}
          size="lg"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2">
          <span className="text-sm font-medium text-text-primary">
            {message.author.name}
          </span>
          <span className="text-xs text-text-tertiary">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>

        <div className="mt-1">
          <p className="text-sm text-text-secondary leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded hover:bg-background-hover text-text-tertiary hover:text-text-primary">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
