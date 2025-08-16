"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: () => void;
}

export default function MobileNavigation({
  activeTab,
  onTabChange,
  onSearch,
}: MobileNavigationProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
      href: "/home",
    },
    {
      id: "dms",
      label: "DMs",
      icon: "💬",
      href: "/dms",
    },
    {
      id: "files",
      label: "Files",
      icon: "📁",
      href: "/documents",
    },
    {
      id: "activity",
      label: "Activity",
      icon: "🔔",
      href: "/activity",
    },
    {
      id: "more",
      label: "More",
      icon: "⋯",
      href: "#",
    },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "more") {
      setShowMoreMenu(!showMoreMenu);
    } else {
      onTabChange(tabId);
      setShowMoreMenu(false);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-colors ${
                activeTab === tab.id
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* More Menu Modal */}
      {showMoreMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="absolute bottom-20 left-4 right-4 bg-slate-800 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-2">
              <Link
                href="/home"
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">🏠</span>
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dms"
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">💬</span>
                <span>Direct Messages</span>
              </Link>
              <Link
                href="/documents"
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">📁</span>
                <span>Documents</span>
              </Link>
              <Link
                href="/activity"
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">🔔</span>
                <span>Activity Feed</span>
              </Link>
              <div className="border-t border-slate-700 my-2"></div>
              <button 
                onClick={handleSearch}
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left"
              >
                <span className="text-lg">🔍</span>
                <span>Search</span>
              </button>
              <button className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left">
                <span className="text-lg">👤</span>
                <span>Profile</span>
              </button>
              <button className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left">
                <span className="text-lg">🔧</span>
                <span>Account</span>
              </button>
              <button className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left">
                <span className="text-lg">🎯</span>
                <span>Help</span>
              </button>
              <button className="flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-700 rounded-lg w-full text-left">
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
