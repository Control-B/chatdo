"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: "🏠",
  href: "/channels",
    },
    {
      id: "dms",
      label: "DMs",
      icon: "💬",
  href: "/direct-messages",
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
      const target = tabs.find((t) => t.id === tabId);
      onTabChange(tabId);
      setShowMoreMenu(false);
      if (target && target.href && target.href !== "#") {
        router.push(target.href);
      }
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
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-[100] pointer-events-auto"
        role="tablist"
        aria-label="Bottom Navigation"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch justify-around py-1">
          {tabs.map((tab) =>
            tab.id === "more" ? (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-2 transition-colors touch-manipulation pointer-events-auto ${
                  activeTab === tab.id
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span className="text-2xl mb-0.5 leading-none">{tab.icon}</span>
                <span className="text-[11px] font-medium">{tab.label}</span>
              </button>
            ) : (
              <Link
                key={tab.id}
                href={tab.href}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-2 transition-colors touch-manipulation ${
                  activeTab === tab.id
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-white"
                }`}
                onTouchStart={(e) => {
                  try {
                    e.preventDefault();
                  } catch {}
                  onTabChange(tab.id);
                  setShowMoreMenu(false);
                  // Fallback navigation for some mobile PWAs
                  try {
                    router.push(tab.href);
                  } catch {}
                }}
              >
                <span className="text-2xl mb-0.5 leading-none">{tab.icon}</span>
                <span className="text-[11px] font-medium">{tab.label}</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* More Menu Modal */}
    {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-[110] pointer-events-none">
          <div
            className="absolute inset-0 bg-black/50 pointer-events-auto"
            onClick={() => setShowMoreMenu(false)}
          />
          <div
            className="pointer-events-auto w-full absolute bottom-0 bg-slate-800 rounded-t-xl shadow-xl max-h-[70vh] overflow-y-auto"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-2">
              <Link
                href="/channels"
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">🏠</span>
                <span>All Channels</span>
              </Link>
              <Link
                href="/direct-messages"
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
