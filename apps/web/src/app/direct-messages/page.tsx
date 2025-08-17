"use client";

import { useState } from "react";
import Link from "next/link";

// Types
type DMStatus = "online" | "away" | "offline";
type DM = {
  id: number;
  name: string;
  avatar: string;
  unread: number;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  status: DMStatus;
};
type StatusFilter = "all" | DMStatus;
type SortBy = "name" | "unread" | "lastMessage" | "status";

// Mock data - in real app this would come from API
const mockDMs: DM[] = [
  {
    id: 1,
    name: "John Driver",
    avatar: "JD",
    unread: 2,
    phone: "+1-555-0101",
    lastMessage: "I'll be there in 10 minutes",
    lastMessageTime: "2:30 PM",
    status: "online",
  },
  {
    id: 2,
    name: "Sarah Dispatcher",
    avatar: "SD",
    unread: 0,
    phone: "+1-555-0102",
    lastMessage: "Route updated successfully",
    lastMessageTime: "1:45 PM",
    status: "away",
  },
  {
    id: 3,
    name: "Mike Mechanic",
    avatar: "MM",
    unread: 5,
    phone: "+1-555-0103",
    lastMessage: "Engine check complete",
    lastMessageTime: "12:20 PM",
    status: "offline",
  },
  {
    id: 4,
    name: "Lisa Loader",
    avatar: "LL",
    unread: 1,
    phone: "+1-555-0104",
    lastMessage: "Loading dock 3 is ready",
    lastMessageTime: "11:15 AM",
    status: "online",
  },
  {
    id: 5,
    name: "Tom Trucker",
    avatar: "TT",
    unread: 0,
    phone: "+1-555-0105",
    lastMessage: "Delivery confirmed",
    lastMessageTime: "10:30 AM",
    status: "online",
  },
  {
    id: 6,
    name: "Anna Admin",
    avatar: "AA",
    unread: 3,
    phone: "+1-555-0106",
    lastMessage: "Paperwork submitted",
    lastMessageTime: "9:45 AM",
    status: "away",
  },
  {
    id: 7,
    name: "Bob Boss",
    avatar: "BB",
    unread: 0,
    phone: "+1-555-0107",
    lastMessage: "Meeting scheduled for tomorrow",
    lastMessageTime: "Yesterday",
    status: "offline",
  },
];

export default function DirectMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [dms, setDms] = useState<DM[]>(mockDMs);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dmToDelete, setDmToDelete] = useState<DM | null>(null);

  const filteredDMs = dms
    .filter((dm) => {
      const matchesSearch =
        dm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dm.phone.includes(searchQuery);

      const matchesStatus =
        filterStatus === "all" || dm.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "unread":
          return b.unread - a.unread;
        case "lastMessage":
          return (
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
          );
        case "status":
          const statusOrder: Record<DMStatus, number> = {
            online: 1,
            away: 2,
            offline: 3,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

  // Delete functions
  const handleDeleteDM = (dm: DM) => {
    setDmToDelete(dm);
    setShowDeleteModal(true);
  };

  const confirmDeleteDM = () => {
    if (dmToDelete) {
      setDms(dms.filter((dm) => dm.id !== dmToDelete.id));
      setShowDeleteModal(false);
      setDmToDelete(null);
    }
  };

  const getStatusColor = (status: DMStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24 md:pb-0">
  {/* Header (desktop only) */}
  <div className="hidden lg:block bg-slate-800 border-b border-slate-700 p-6">
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
            <h1 className="text-2xl font-bold">Direct Messages</h1>
            <p className="text-slate-400 mt-1">
              Manage and browse all direct message conversations (
              {mockDMs.length} total)
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
              placeholder="Search by name or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="unread">Sort by Unread</option>
              <option value="lastMessage">Sort by Last Message</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* DMs List */}
  <div className="p-6 pb-24 md:pb-6">
        <div className="grid gap-4">
          {filteredDMs.map((dm) => (
            <div
              key={dm.id}
              className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {dm.avatar}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                        dm.status
                      )} rounded-full border-2 border-slate-800`}
                    ></div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-white font-semibold">{dm.name}</h3>
                      {dm.unread > 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {dm.unread}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm mb-1">{dm.phone}</p>

                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <span className="capitalize">{dm.status}</span>
                      <span>•</span>
                      <span>{dm.lastMessage}</span>
                      <span>•</span>
                      <span>{dm.lastMessageTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                    Message
                  </button>
                  <button className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors text-sm">
                    Call
                  </button>
                  <button
                    onClick={() => handleDeleteDM(dm)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDMs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg text-slate-400 mb-2">
              No direct messages found
            </p>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Delete DM Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-96">
            <h3 className="text-white text-lg font-semibold mb-4">
              Delete Direct Message
            </h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete the direct message with{" "}
              <span className="text-white font-medium">{dmToDelete?.name}</span>
              ? This action cannot be undone.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDmToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDM}
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
