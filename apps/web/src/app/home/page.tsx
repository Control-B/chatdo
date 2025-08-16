"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [stats] = useState({
    totalMessages: 1247,
    activeChannels: 8,
    teamMembers: 12,
    documentsShared: 45,
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: "message",
      user: "John Driver",
      action: "sent a message in #logistics",
      time: "2 minutes ago",
      avatar: "JD",
    },
    {
      id: 2,
      type: "document",
      user: "Sarah Dispatcher",
      action: "uploaded Delivery Schedule.pdf",
      time: "15 minutes ago",
      avatar: "SD",
    },
    {
      id: 3,
      type: "channel",
      user: "Mike Mechanic",
      action: "joined #maintenance",
      time: "1 hour ago",
      avatar: "MM",
    },
    {
      id: 4,
      type: "message",
      user: "Alice Johnson",
      action: "sent a message in #general",
      time: "2 hours ago",
      avatar: "AJ",
    },
  ]);

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
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-slate-400 mt-1">
                Welcome back! Here's what's happening in your workspace.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Messages</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalMessages}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Channels</p>
                <p className="text-2xl font-bold text-white">
                  {stats.activeChannels}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">#</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Team Members</p>
                <p className="text-2xl font-bold text-white">
                  {stats.teamMembers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Documents Shared</p>
                <p className="text-2xl font-bold text-white">
                  {stats.documentsShared}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">📄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {activity.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-slate-400">{activity.action}</span>
                  </p>
                  <p className="text-slate-500 text-sm">{activity.time}</p>
                </div>
                <div className="text-slate-400">
                  {activity.type === "message" && "💬"}
                  {activity.type === "document" && "📄"}
                  {activity.type === "channel" && "#"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
