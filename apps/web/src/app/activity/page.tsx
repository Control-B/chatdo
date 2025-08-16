"use client";

import { useState } from "react";
import Link from "next/link";

export default function ActivityPage() {
  const [activities] = useState([
    {
      id: 1,
      type: "message",
      user: "John Driver",
      action: "sent a message in #logistics",
      content:
        "Delivery completed for route A-12. All packages delivered on time.",
      timestamp: "2 minutes ago",
      avatar: "JD",
      priority: "normal",
    },
    {
      id: 2,
      type: "document",
      user: "Sarah Dispatcher",
      action: "uploaded a new document",
      content: "Delivery Schedule.pdf",
      timestamp: "15 minutes ago",
      avatar: "SD",
      priority: "high",
    },
    {
      id: 3,
      type: "channel",
      user: "Mike Mechanic",
      action: "joined #maintenance",
      content: "New team member joined the maintenance channel",
      timestamp: "1 hour ago",
      avatar: "MM",
      priority: "normal",
    },
    {
      id: 4,
      type: "mention",
      user: "Alice Johnson",
      action: "mentioned you in #general",
      content: "@you Can you review the new safety guidelines?",
      timestamp: "2 hours ago",
      avatar: "AJ",
      priority: "high",
    },
    {
      id: 5,
      type: "reaction",
      user: "Bob Smith",
      action: "reacted to your message",
      content: "👍 on your message in #logistics",
      timestamp: "3 hours ago",
      avatar: "BS",
      priority: "normal",
    },
    {
      id: 6,
      type: "system",
      user: "System",
      action: "channel created",
      content: "New channel #emergency has been created",
      timestamp: "4 hours ago",
      avatar: "S",
      priority: "normal",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true;
    if (filter === "mentions") return activity.type === "mention";
    if (filter === "documents") return activity.type === "document";
    if (filter === "messages") return activity.type === "message";
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return "💬";
      case "document":
        return "📄";
      case "channel":
        return "#";
      case "mention":
        return "@";
      case "reaction":
        return "👍";
      case "system":
        return "⚙️";
      default:
        return "📢";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-xl">←</span>
              <span>Back to Chat</span>
            </Link>
            <div className="w-px h-6 bg-slate-600"></div>
            <div>
              <h1 className="text-2xl font-bold">Activity Feed</h1>
              <p className="text-slate-400 mt-1">
                Stay updated with all the latest activities in your workspace.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            All Activities
          </button>
          <button
            onClick={() => setFilter("mentions")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "mentions"
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Mentions
          </button>
          <button
            onClick={() => setFilter("documents")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "documents"
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setFilter("messages")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "messages"
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Messages
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-slate-800 border border-slate-700 rounded-lg p-4 border-l-4 ${getPriorityColor(
                activity.priority
              )} hover:bg-slate-750 transition-colors`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {activity.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {getActivityIcon(activity.type)}
                    </span>
                    <span className="font-semibold text-white">
                      {activity.user}
                    </span>
                    <span className="text-slate-400">{activity.action}</span>
                    <span className="text-slate-500 text-sm">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-300">{activity.content}</p>
                </div>
                {activity.priority === "high" && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No activities found
            </h3>
            <p className="text-slate-400">
              Try adjusting your filters or check back later for new activities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
