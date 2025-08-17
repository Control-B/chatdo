"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignaturePad from "@/components/signature-pad";

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
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [userName, setUserName] = useState<string>("Banjah Marah");
  const [savedSignatures, setSavedSignatures] = useState<
    Array<{ name: string; dataUrl: string }>
  >([]);
  const [selectedSignature, setSelectedSignature] = useState<
    { name: string; dataUrl: string } | null
  >(null);
  const [showAddSignatureModal, setShowAddSignatureModal] = useState(false);
  const [newSignatureName, setNewSignatureName] = useState("");
  const [newSignatureType, setNewSignatureType] = useState<"auto" | "draw">("auto");
  const [showSignatureViewer, setShowSignatureViewer] = useState(false);
  const [viewingSignature, setViewingSignature] = useState<{ name: string; dataUrl: string } | null>(null);

  // Load persisted signatures and user name
  useEffect(() => {
    try {
      const stored = localStorage.getItem("chatdo.signatures");
      if (stored) setSavedSignatures(JSON.parse(stored));
      const storedName = localStorage.getItem("chatdo.username");
      if (storedName) setUserName(storedName);
  const storedSelected = localStorage.getItem("chatdo.selectedSignature");
  if (storedSelected) setSelectedSignature(JSON.parse(storedSelected));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("chatdo.signatures", JSON.stringify(savedSignatures));
    } catch {}
  }, [savedSignatures]);

  useEffect(() => {
    try {
      localStorage.setItem("chatdo.username", userName);
    } catch {}
  }, [userName]);

  useEffect(() => {
    try {
      if (selectedSignature) {
        localStorage.setItem("chatdo.selectedSignature", JSON.stringify(selectedSignature));
      } else {
        localStorage.removeItem("chatdo.selectedSignature");
      }
    } catch {}
  }, [selectedSignature]);

  const generateAutoSignature = (name: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    canvas.width = 350;
    canvas.height = 80;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const words = name.split(" ");
    let currentX = 20;
    const baseY = 50;
    words.forEach((word, index) => {
      const fontSize = index === 0 ? 32 : 28;
      ctx.font = `${fontSize}px "Segoe Script", "Brush Script MT", cursive, serif`;
      const rotation = (Math.random() - 0.5) * 0.15;
      const yOffset = (Math.random() - 0.5) * 8;
      ctx.save();
      ctx.translate(currentX, baseY + yOffset);
      ctx.rotate(rotation);
      ctx.fillStyle = "#000000";
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#000000";
      for (let i = 0; i < 3; i++) {
        const offset = i * 0.3;
        ctx.fillText(word, offset, offset);
      }
      ctx.restore();
      const wordWidth = ctx.measureText(word).width;
      currentX += wordWidth + (index === 0 ? 8 : 12);
    });
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    const underlineY = baseY + 15;
    ctx.beginPath();
    ctx.moveTo(15, underlineY);
    for (let i = 0; i < currentX - 10; i += 3) {
      const wave = Math.sin(i * 0.08) * 1.5 + Math.sin(i * 0.15) * 0.8;
      ctx.lineTo(15 + i, underlineY + wave);
    }
    ctx.stroke();
    ctx.restore();
    return canvas.toDataURL("image/png");
  };

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
      onTabChange('more');
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
                    : "text-slate-300 hover:text-white active:text-blue-300"
                }`}
              >
                <span className="text-2xl mb-0.5 leading-none">{tab.icon}</span>
                <span className="text-[11px] font-medium">{tab.label}</span>
              </button>
            ) : (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-2 transition-colors touch-manipulation pointer-events-auto ${
                  activeTab === tab.id
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-white active:text-blue-300"
                }`}
              >
                <span className="text-2xl mb-0.5 leading-none">{tab.icon}</span>
                <span className="text-[11px] font-medium">{tab.label}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* More Menu Fullscreen Modal */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-[110]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMoreMenu(false)}
          />
          <div
            className="absolute inset-0 bg-slate-800 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="bg-slate-800 border-b border-slate-700 px-4 py-3"
              style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.25rem)' }}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="text-slate-300 hover:text-white px-2 py-1 rounded"
                  aria-label="Close More menu"
                >
                  ✕
                </button>
                <h1 className="text-lg font-bold text-white">More</h1>
                <div className="w-8" aria-hidden>
                  {/* spacer to balance close button width */}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              {/* E-Signature Section */}
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✍️</span>
                    <h2 className="text-sm font-semibold text-white">E‑Signature</h2>
                  </div>
                  <button
                    onClick={() => setShowSignaturePad(true)}
                    className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Draw
                  </button>
                </div>
                <div className="flex items-center justify-end -mt-1 mb-2">
                  <button
                    onClick={() => setShowAddSignatureModal(true)}
                    className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600"
                    title="Add New Signature"
                  >
                    + Add
                  </button>
                </div>

                {/* User name row */}
                <div className="flex items-center justify-between bg-slate-800 rounded px-2 py-1 mb-2">
                  <span className="text-xs text-slate-300">User: {userName}</span>
                  <button
                    className="text-[11px] text-blue-300 hover:text-blue-200"
                    onClick={() => {
                      const newName = prompt("Enter your name:", userName);
                      if (newName && newName.trim()) setUserName(newName.trim());
                    }}
                  >
                    Edit
                  </button>
                </div>

                {/* Selected and saved signatures */}
                {selectedSignature && (
                  <div className="flex items-center justify-between bg-slate-800 rounded px-2 py-1 mb-2">
                    <span className="text-xs text-slate-300 truncate">Selected: {selectedSignature.name}</span>
                    <button
                      className="text-[11px] text-slate-400 hover:text-red-400"
                      onClick={() => setSelectedSignature(null)}
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {/* Saved list */}
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">Saved Signatures</p>
                    {savedSignatures.length ? (
                      <div className="space-y-1">
                        {savedSignatures.map((sig, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-800 rounded px-2 py-1">
                            <button
                              className="flex-1 text-left text-xs text-slate-200 truncate hover:text-white"
                              onClick={() => setSelectedSignature(sig)}
                            >
                              {sig.name}
                            </button>
                            <button
                              className="text-[11px] text-blue-300 hover:text-blue-200"
                              onClick={() => {
                                setViewingSignature(sig);
                                setShowSignatureViewer(true);
                              }}
                              title="Preview"
                            >
                              View
                            </button>
                            <button
                              className="text-[11px] text-red-300 hover:text-red-200"
                              onClick={() => setSavedSignatures(prev => prev.filter((_, idx) => idx !== i))}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">No saved signatures</p>
                    )}
                  </div>

                  {/* Auto-generate options */}
                  <div className="pt-1">
                    <p className="text-[11px] text-slate-400 mb-1">Auto‑generated</p>
                    <div className="flex items-center gap-2">
                      <button
                        className="flex-1 text-left text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700"
                        onClick={() => setSelectedSignature({ name: `${userName.split(" ")[0]} (Auto)`, dataUrl: generateAutoSignature(userName.split(" ")[0]) })}
                      >
                        {userName.split(" ")[0]} (Auto)
                      </button>
                      <button
                        className="flex-1 text-left text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700"
                        onClick={() => setSelectedSignature({ name: `${userName} (Auto)`, dataUrl: generateAutoSignature(userName) })}
                      >
                        {userName} (Auto)
                      </button>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700"
                      onClick={() => {
                        const name = prompt("Save as (name)", selectedSignature?.name || `${userName} Signature`);
                        if (!name) return;
                        const dataUrl = selectedSignature?.dataUrl || generateAutoSignature(userName);
                        setSavedSignatures(prev => [...prev, { name, dataUrl }]);
                      }}
                    >
                      Save Selected
                    </button>
                    {selectedSignature && (
                      <a
                        download={`${selectedSignature.name}.png`}
                        href={selectedSignature.dataUrl}
                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  router.push('/channels');
                  setShowMoreMenu(false);
                  onTabChange('home');
                }}
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left"
              >
                <span className="text-lg">🏠</span>
                <span>All Channels</span>
              </button>
              <button
                onClick={() => {
                  router.push('/direct-messages');
                  setShowMoreMenu(false);
                  onTabChange('dms');
                }}
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left"
              >
                <span className="text-lg">💬</span>
                <span>Direct Messages</span>
              </button>
              <button
                onClick={() => {
                  router.push('/documents');
                  setShowMoreMenu(false);
                  onTabChange('files');
                }}
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left"
              >
                <span className="text-lg">📁</span>
                <span>Documents</span>
              </button>
              <button
                onClick={() => {
                  router.push('/activity');
                  setShowMoreMenu(false);
                  onTabChange('activity');
                }}
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg w-full text-left"
              >
                <span className="text-lg">🔔</span>
                <span>Activity Feed</span>
              </button>
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

      {showSignaturePad && (
        <SignaturePad
          onCancel={() => setShowSignaturePad(false)}
          onSave={(dataUrl) => {
            const name = prompt("Save signature as:", `${userName} (Drawn)`);
            if (name && name.trim()) {
              const sig = { name: name.trim(), dataUrl };
              setSavedSignatures(prev => [...prev, sig]);
              setSelectedSignature(sig);
            }
            setShowSignaturePad(false);
          }}
        />
      )}

      {/* Add New Signature Modal */}
      {showAddSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-slate-800 p-4 rounded-lg w-[500px] max-w-[92vw] border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-base font-semibold">Add New Signature</h3>
              <button
                onClick={() => setShowAddSignatureModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-slate-300 text-sm mb-2">Choose how to create your signature:</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-slate-300 text-sm">
                    <input type="radio" name="signatureType" value="auto" checked={newSignatureType === 'auto'} onChange={() => setNewSignatureType('auto')} />
                    Auto‑generate from name
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 text-sm">
                    <input type="radio" name="signatureType" value="draw" checked={newSignatureType === 'draw'} onChange={() => setNewSignatureType('draw')} />
                    Draw signature manually
                  </label>
                </div>
              </div>

              {newSignatureType === 'auto' && (
                <div>
                  <label className="block text-slate-300 text-xs mb-1">Enter your name:</label>
                  <input
                    type="text"
                    value={newSignatureName}
                    onChange={(e) => setNewSignatureName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newSignatureName.trim() && (
                    <div className="mt-3 p-2 bg-slate-700 rounded">
                      <p className="text-slate-300 text-xs mb-1">Preview:</p>
                      <img
                        src={generateAutoSignature(newSignatureName.trim())}
                        alt="Signature preview"
                        className="h-12 object-contain bg-white rounded border"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddSignatureModal(false);
                    setNewSignatureName("");
                    setNewSignatureType('auto');
                  }}
                  className="px-3 py-2 bg-slate-600 text-white rounded text-sm hover:bg-slate-500"
                >
                  Cancel
                </button>

                {newSignatureType === 'auto' ? (
                  <button
                    onClick={() => {
                      if (newSignatureName.trim()) {
                        const newSig = { name: newSignatureName.trim(), dataUrl: generateAutoSignature(newSignatureName.trim()) };
                        setSavedSignatures(prev => [...prev, newSig]);
                        setSelectedSignature(newSig);
                        setShowAddSignatureModal(false);
                        setNewSignatureName("");
                      }
                    }}
                    disabled={!newSignatureName.trim()}
                    className={`px-3 py-2 rounded text-sm ${newSignatureName.trim() ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-600 text-slate-400 cursor-not-allowed'}`}
                  >
                    Create Signature
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowAddSignatureModal(false);
                      setShowSignaturePad(true);
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
                  >
                    Open Signature Pad
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Viewer Modal */}
      {showSignatureViewer && viewingSignature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-slate-800 p-4 rounded-lg w-[600px] max-w-[92vw] border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-base font-semibold">Signature: {viewingSignature.name}</h3>
              <button
                onClick={() => { setShowSignatureViewer(false); setViewingSignature(null); }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-white rounded p-4 mb-3 flex items-center justify-center">
              <img src={viewingSignature.dataUrl} alt={`Signature: ${viewingSignature.name}`} className="max-w-full max-h-64 object-contain" />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedSignature(viewingSignature);
                  setShowSignatureViewer(false);
                  setViewingSignature(null);
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
              >
                Use This
              </button>
              <button
                onClick={() => { setShowSignatureViewer(false); setViewingSignature(null); }}
                className="px-3 py-2 bg-slate-600 text-white rounded text-sm hover:bg-slate-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
