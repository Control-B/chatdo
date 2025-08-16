"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Mock data - in real app this would come from API
const mockChannels = [
  {
    id: 1,
    name: "general",
    description: "General discussion channel",
    visibility: "public",
    doorNumber: "",
    unread: 0,
    active: true,
    memberCount: 15,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "logistics",
    description: "Logistics and delivery coordination",
    visibility: "public",
    doorNumber: "",
    unread: 3,
    active: false,
    memberCount: 8,
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "maintenance",
    description: "Vehicle maintenance and repairs",
    visibility: "private",
    doorNumber: "",
    unread: 1,
    active: false,
    memberCount: 5,
    createdAt: "2024-01-25",
  },
  {
    id: 4,
    name: "1893327",
    description: "ontime",
    visibility: "public",
    doorNumber: "105",
    unread: 0,
    active: false,
    memberCount: 3,
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    name: "87697",
    description: "hot load",
    visibility: "public",
    doorNumber: "203",
    unread: 2,
    active: false,
    memberCount: 4,
    createdAt: "2024-02-05",
  },
  {
    id: 6,
    name: "54321",
    description: "late delivery",
    visibility: "public",
    doorNumber: "45",
    unread: 1,
    active: false,
    memberCount: 2,
    createdAt: "2024-02-10",
  },
  {
    id: 7,
    name: "98765",
    description: "early pickup",
    visibility: "public",
    doorNumber: "12",
    unread: 0,
    active: false,
    memberCount: 3,
    createdAt: "2024-02-15",
  },
];

export default function ChannelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [channels, setChannels] = useState(mockChannels);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuChannel, setContextMenuChannel] = useState(null);

  const filteredChannels = channels
    .filter((channel) => {
      const matchesSearch =
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.doorNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVisibility =
        filterVisibility === "all" || channel.visibility === filterVisibility;

      return matchesSearch && matchesVisibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "members":
          return b.memberCount - a.memberCount;
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "unread":
          return b.unread - a.unread;
        default:
          return 0;
      }
    });

  // Delete functions
  const handleDeleteChannel = (channel) => {
    setChannelToDelete(channel);
    setShowDeleteModal(true);
  };

  const confirmDeleteChannel = () => {
    if (channelToDelete) {
      setChannels(channels.filter((ch) => ch.id !== channelToDelete.id));
      setShowDeleteModal(false);
      setChannelToDelete(null);
    }
  };

  // Context menu functions
  const handleChannelContextMenu = (e, channel) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuChannel(channel);
    setShowContextMenu(true);
  };

  const handleContextMenuAction = (action) => {
    if (!contextMenuChannel) return;

    switch (action) {
      case "view-details":
        console.log("View details for:", contextMenuChannel.name);
        break;
      case "copy":
        navigator.clipboard.writeText(`#${contextMenuChannel.name}`);
        break;
      case "mute":
        console.log("Mute channel:", contextMenuChannel.name);
        break;
      case "notifications":
        console.log("Change notifications for:", contextMenuChannel.name);
        break;
      case "star":
        console.log("Star channel:", contextMenuChannel.name);
        break;
      case "leave":
        console.log("Leave channel:", contextMenuChannel.name);
        break;
      case "delete":
        setChannelToDelete(contextMenuChannel);
        setShowDeleteModal(true);
        break;
    }
    setShowContextMenu(false);
  };

  // Close context menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(false);
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [showContextMenu]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Back to Dashboard</span>
          </Link>
          <div className="w-px h-6 bg-slate-600"></div>
          <div>
            <h1 className="text-2xl font-bold">All Channels</h1>
            <p className="text-slate-400 mt-1">
              Manage and browse all channels ({mockChannels.length} total)
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search channels, descriptions, door numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Channels</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="members">Sort by Members</option>
              <option value="created">Sort by Created</option>
              <option value="unread">Sort by Unread</option>
            </select>
          </div>
        </div>
      </div>

      {/* Channels List */}
      <div className="p-6">
        <div className="grid gap-4">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors"
              onContextMenu={(e) => handleChannelContextMenu(e, channel)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-blue-300 text-lg">#</span>
                    <h3 className="text-white font-semibold text-lg">
                      {channel.name}
                    </h3>
                    {channel.visibility === "private" && (
                      <span className="text-slate-500 text-sm">🔒</span>
                    )}
                    {channel.active && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 mb-2">{channel.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    {channel.doorNumber && (
                      <span className="flex items-center space-x-1">
                        <span>🚪</span>
                        <span>Door {channel.doorNumber}</span>
                      </span>
                    )}
                    <span>{channel.memberCount} members</span>
                    <span>
                      Created {new Date(channel.createdAt).toLocaleDateString()}
                    </span>
                    {channel.unread > 0 && (
                      <span className="text-red-400 font-medium">
                        {channel.unread} unread
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                    Join
                  </button>
                  <button className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors text-sm">
                    Settings
                  </button>
                  <button
                    onClick={() => handleDeleteChannel(channel)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChannels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg text-slate-400 mb-2">No channels found</p>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Channel Context Menu */}
      {showContextMenu && (
        <div
          className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-lg py-1 min-w-48"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-600">
            <span className="text-sm text-slate-300">Channel Options</span>
            <button
              onClick={() => setShowContextMenu(false)}
              className="text-slate-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>
          <button
            onClick={() => handleContextMenuAction("view-details")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            View channel details
          </button>
          <button
            onClick={() => handleContextMenuAction("copy")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm flex items-center justify-between"
          >
            Copy
            <span className="text-slate-400 text-xs">→</span>
          </button>
          <div className="border-t border-slate-600 my-1"></div>
          <button
            onClick={() => handleContextMenuAction("mute")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            Mute channel
          </button>
          <button
            onClick={() => handleContextMenuAction("notifications")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            Change notifications
          </button>
          <button
            onClick={() => handleContextMenuAction("star")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            Star channel
          </button>
          <div className="border-t border-slate-600 my-1"></div>
          <button
            onClick={() => handleContextMenuAction("leave")}
            className="w-full px-4 py-2 text-left text-blue-300 hover:bg-slate-700 text-sm"
          >
            Leave channel
          </button>
          <div className="border-t border-slate-600 my-1"></div>
          <button
            onClick={() => handleContextMenuAction("delete")}
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 text-sm"
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Channel Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-96">
            <h3 className="text-white text-lg font-semibold mb-4">
              Delete Channel
            </h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete the channel{" "}
              <span className="text-white font-medium">
                #{channelToDelete?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setChannelToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChannel}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
