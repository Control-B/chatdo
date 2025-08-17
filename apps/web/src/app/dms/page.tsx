"use client";

import { useState } from "react";
import Link from "next/link";

export default function DMsPage() {
  const [directMessages] = useState([
    {
      id: 1,
      name: "John Driver",
      avatar: "JD",
      lastMessage: "Hey, when is the next delivery scheduled?",
      timestamp: "2 minutes ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Sarah Dispatcher",
      avatar: "SD",
      lastMessage: "The route has been updated. Please check the new schedule.",
      timestamp: "15 minutes ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Mike Mechanic",
      avatar: "MM",
      lastMessage: "Vehicle inspection completed. All checks are good.",
      timestamp: "1 hour ago",
      unread: 5,
      online: false,
    },
    {
      id: 4,
      name: "Alice Johnson",
      avatar: "AJ",
      lastMessage: "Thanks for the quick response!",
      timestamp: "2 hours ago",
      unread: 0,
      online: true,
    },
    {
      id: 5,
      name: "Bob Smith",
      avatar: "BS",
      lastMessage: "Can you send me the maintenance report?",
      timestamp: "3 hours ago",
      unread: 1,
      online: false,
    },
  ]);

  const [selectedDM, setSelectedDM] = useState(directMessages[0]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message via API
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex overflow-x-hidden">
      {/* DMs List */}
  <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col hidden md:flex">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                <span className="text-lg">←</span>
                <span>Back to Chat</span>
              </Link>
              <div className="w-px h-4 bg-slate-600"></div>
              <h1 className="text-white font-semibold">Direct Messages</h1>
            </div>
          </div>
        </div>

        {/* DMs List */}
        <div className="flex-1 overflow-y-auto">
          {directMessages.map((dm) => (
            <div
              key={dm.id}
              onClick={() => setSelectedDM(dm)}
              className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-slate-700 transition-colors ${
                selectedDM.id === dm.id ? "bg-slate-700" : ""
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {dm.avatar}
                  </span>
                </div>
                {dm.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium truncate">{dm.name}</h3>
                  <span className="text-slate-400 text-xs">{dm.timestamp}</span>
                </div>
                <p className="text-slate-400 text-sm truncate">
                  {dm.lastMessage}
                </p>
              </div>
              {dm.unread > 0 && (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {dm.unread}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
  <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-3 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {selectedDM.avatar}
                </span>
              </div>
              {selectedDM.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white truncate">
                {selectedDM.name}
              </h2>
              <p className="text-sm text-slate-400">
                {selectedDM.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {selectedDM.avatar}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline space-x-3">
                <span className="font-semibold text-white">
                  {selectedDM.name}
                </span>
                <span className="text-slate-400 text-sm">2 minutes ago</span>
              </div>
              <div className="text-slate-300 mt-1">
                {selectedDM.lastMessage}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4 justify-end">
            <div className="flex-1 max-w-xs">
              <div className="text-slate-400 text-sm text-right mb-1">You</div>
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                Thanks for the update! I'll check the schedule right away.
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-3 md:p-4 border-t border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="w-full px-3 py-2 md:px-4 md:py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={sendMessage}
              className="px-3 py-2 md:px-4 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
