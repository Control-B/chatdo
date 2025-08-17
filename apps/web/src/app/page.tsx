"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
// MobileNavigation is rendered globally via GlobalMobileNavigation in layout
// import MobileNavigation from "@/components/mobile-navigation";
import SignaturePad from "@/components/signature-pad";

export default function Home() {
  // State for sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // State for messages
  const [messages, setMessages] = useState<any[]>([]);

  // State for UI
  const [newMessage, setNewMessage] = useState("");
  type Channel = {
    id: number;
    name: string;
    description: string;
    visibility: "public" | "private";
    doorNumber: string;
    unread: number;
    active: boolean;
  };
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 1,
      name: "general",
      description: "General discussion channel",
      visibility: "public",
      doorNumber: "",
      unread: 0,
      active: true,
    },
    {
      id: 2,
      name: "logistics",
      description: "Logistics and delivery coordination",
      visibility: "public",
      doorNumber: "",
      unread: 3,
      active: false,
    },
    {
      id: 3,
      name: "maintenance",
      description: "Vehicle maintenance and repairs",
      visibility: "private",
      doorNumber: "",
      unread: 1,
      active: false,
    },
    {
      id: 4,
      name: "1893327",
      description: "ontime",
      visibility: "public",
      doorNumber: "105",
      unread: 0,
      active: false,
    },
    {
      id: 5,
      name: "87697",
      description: "hot load",
      visibility: "public",
      doorNumber: "203",
      unread: 2,
      active: false,
    },
    {
      id: 6,
      name: "54321",
      description: "late delivery",
      visibility: "public",
      doorNumber: "45",
      unread: 1,
      active: false,
    },
    {
      id: 7,
      name: "98765",
      description: "early pickup",
      visibility: "public",
      doorNumber: "12",
      unread: 0,
      active: false,
    },
  ]);

  type DMListItem = {
    id: number;
    name: string;
    avatar: string;
    unread: number;
    phone: string;
  };
  const [directMessages, setDirectMessages] = useState<DMListItem[]>([
    {
      id: 1,
      name: "John Driver",
      avatar: "JD",
      unread: 2,
      phone: "+1-555-0101",
    },
    {
      id: 2,
      name: "Sarah Dispatcher",
      avatar: "SD",
      unread: 0,
      phone: "+1-555-0102",
    },
    {
      id: 3,
      name: "Mike Mechanic",
      avatar: "MM",
      unread: 5,
      phone: "+1-555-0103",
    },
    {
      id: 4,
      name: "Lisa Loader",
      avatar: "LL",
      unread: 1,
      phone: "+1-555-0104",
    },
    {
      id: 5,
      name: "Tom Trucker",
      avatar: "TT",
      unread: 0,
      phone: "+1-555-0105",
    },
    {
      id: 6,
      name: "Anna Admin",
      avatar: "AA",
      unread: 3,
      phone: "+1-555-0106",
    },
    {
      id: 7,
      name: "Bob Boss",
      avatar: "BB",
      unread: 0,
      phone: "+1-555-0107",
    },
  ]);

  // State for modals
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelVisibility, setNewChannelVisibility] = useState("public");
  const [newChannelDoorNumber, setNewChannelDoorNumber] = useState("");
  const [showCreateDMModal, setShowCreateDMModal] = useState(false);
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false);
  const [showDeleteDMModal, setShowDeleteDMModal] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const [dmToDelete, setDmToDelete] = useState<DMListItem | null>(null);
  const [showChannelContextMenu, setShowChannelContextMenu] = useState(false);
  const [showDMContextMenu, setShowDMContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuChannel, setContextMenuChannel] = useState<Channel | null>(
    null
  );
  const [contextMenuDM, setContextMenuDM] = useState<DMListItem | null>(null);

  // Channel Details Modal State
  const [showChannelDetails, setShowChannelDetails] = useState(false);
  const [selectedChannelForDetails, setSelectedChannelForDetails] =
    useState<Channel | null>(null);
  const [channelDetailsTab, setChannelDetailsTab] = useState("about");
  const [showSettings, setShowSettings] = useState(false);
  const [showPushToTalk, setShowPushToTalk] = useState(false);
  const [showDocumentManager, setShowDocumentManager] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showSignatureDropdown, setShowSignatureDropdown] = useState(false);
  const [showAddSignatureModal, setShowAddSignatureModal] = useState(false);
  const [newSignatureName, setNewSignatureName] = useState("");
  const [newSignatureType, setNewSignatureType] = useState<"auto" | "draw">(
    "auto"
  );
  const [savedSignatures, setSavedSignatures] = useState<
    Array<{ name: string; dataUrl: string }>
  >([]);
  const [selectedSignature, setSelectedSignature] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);
  const [showSignatureViewer, setShowSignatureViewer] = useState(false);
  const [viewingSignature, setViewingSignature] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);
  const [showSignatureManager, setShowSignatureManager] = useState(false);
  const [userName, setUserName] = useState("Banjah Marah"); // Default user name - in real app this would come from auth

  // Global Search State
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    channels: Array<{
      id: number;
      name: string;
      description: string;
      doorNumber: string;
      matchType: string;
    }>;
    documents: Array<{
      id: number;
      name: string;
      type: string;
      matchType: string;
    }>;
    signatures: Array<{ name: string; dataUrl: string; matchType: string }>;
    dms: Array<{ id: number; name: string; matchType: string }>;
    help: Array<{
      title: string;
      description: string;
      category: string;
      matchType: string;
    }>;
    features: Array<{
      title: string;
      description: string;
      category: string;
      matchType: string;
    }>;
  }>({
    channels: [],
    documents: [],
    signatures: [],
    dms: [],
    help: [],
    features: [],
  });

  // Function to perform global search
  const performGlobalSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults({
        channels: [],
        documents: [],
        signatures: [],
        dms: [],
        help: [],
        features: [],
      });
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = {
      channels: [] as Array<{
        id: number;
        name: string;
        description: string;
        doorNumber: string;
        matchType: string;
      }>,
      documents: [] as Array<{
        id: number;
        name: string;
        type: string;
        matchType: string;
      }>,
      signatures: [] as Array<{
        name: string;
        dataUrl: string;
        matchType: string;
      }>,
      dms: [] as Array<{ id: number; name: string; matchType: string }>,
      help: [] as Array<{
        title: string;
        description: string;
        category: string;
        matchType: string;
      }>,
      features: [] as Array<{
        title: string;
        description: string;
        category: string;
        matchType: string;
      }>,
    };

    // Search channels
    channels.forEach((channel) => {
      const nameMatch = channel.name.toLowerCase().includes(lowerQuery);
      const descMatch = channel.description.toLowerCase().includes(lowerQuery);
      const doorMatch = channel.doorNumber.toLowerCase().includes(lowerQuery);

      if (nameMatch || descMatch || doorMatch) {
        let matchType = "";
        if (nameMatch) matchType = "Channel name";
        else if (doorMatch) matchType = "Door number";
        else if (descMatch) matchType = "Description";

        results.channels.push({
          id: channel.id,
          name: channel.name,
          description: channel.description,
          doorNumber: channel.doorNumber,
          matchType,
        });
      }
    });

    // Search documents (mock data - in real app this would come from API)
    const mockDocuments = [
      { id: 1, name: "Invoice-2024-001.pdf", type: "PDF" },
      { id: 2, name: "PO-87697-Delivery.pdf", type: "PDF" },
      { id: 3, name: "Contract-Agreement.docx", type: "DOCX" },
      { id: 4, name: "Receipt-2024-002.pdf", type: "PDF" },
    ];

    mockDocuments.forEach((doc) => {
      const nameMatch = doc.name.toLowerCase().includes(lowerQuery);
      if (nameMatch) {
        results.documents.push({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          matchType: "Document name",
        });
      }
    });

    // Search signatures
    savedSignatures.forEach((sig) => {
      const nameMatch = sig.name.toLowerCase().includes(lowerQuery);
      if (nameMatch) {
        results.signatures.push({
          name: sig.name,
          dataUrl: sig.dataUrl,
          matchType: "Signature name",
        });
      }
    });

    // Search DMs
    directMessages.forEach((dm) => {
      const nameMatch = dm.name.toLowerCase().includes(lowerQuery);
      if (nameMatch) {
        results.dms.push({
          id: dm.id,
          name: dm.name,
          matchType: "Direct message",
        });
      }
    });

    // Search Help content
    const helpContent = [
      {
        title: "Help Center",
        description: "Get help with using ChatDO features and troubleshooting",
        category: "Help",
        keywords: [
          "help",
          "support",
          "assistance",
          "guide",
          "tutorial",
          "how to",
          "faq",
          "question",
        ],
      },
      {
        title: "How to Create Channels",
        description:
          "Learn how to create new channels for different PO numbers and assignments",
        category: "Help",
        keywords: [
          "create",
          "channel",
          "new",
          "po",
          "number",
          "assignment",
          "door",
          "description",
        ],
      },
      {
        title: "E-Signature Guide",
        description:
          "How to create, save, and use digital signatures on documents",
        category: "Help",
        keywords: [
          "signature",
          "e-signature",
          "digital",
          "sign",
          "document",
          "draw",
          "pen",
          "auto",
          "save",
        ],
      },
      {
        title: "Document Management",
        description:
          "Upload, view, and manage documents in the Documents section",
        category: "Help",
        keywords: [
          "document",
          "upload",
          "file",
          "pdf",
          "view",
          "manage",
          "drag",
          "drop",
        ],
      },
      {
        title: "Direct Messages",
        description:
          "How to start and manage private conversations with team members",
        category: "Help",
        keywords: [
          "dm",
          "direct message",
          "private",
          "conversation",
          "chat",
          "message",
        ],
      },
      {
        title: "Member Management",
        description: "Add, remove, and manage team members in channels",
        category: "Help",
        keywords: [
          "member",
          "team",
          "add",
          "remove",
          "manage",
          "user",
          "online",
          "offline",
        ],
      },
      {
        title: "Global Search",
        description:
          "Use Ctrl+K to search across all channels, documents, and features",
        category: "Help",
        keywords: [
          "search",
          "global",
          "find",
          "ctrl+k",
          "cmd+k",
          "keyboard",
          "shortcut",
        ],
      },
      {
        title: "Mobile Navigation",
        description:
          "Use the bottom tabs on mobile devices to navigate between features",
        category: "Help",
        keywords: [
          "mobile",
          "navigation",
          "tabs",
          "bottom",
          "phone",
          "tablet",
          "responsive",
        ],
      },
      {
        title: "Context Menus",
        description: "Right-click on channels and DMs for additional options",
        category: "Help",
        keywords: [
          "context",
          "menu",
          "right click",
          "options",
          "delete",
          "mute",
          "star",
        ],
      },
      {
        title: "Door Numbers",
        description:
          "Assign door numbers to channels for shipping and logistics",
        category: "Help",
        keywords: [
          "door",
          "number",
          "shipping",
          "logistics",
          "truck",
          "driver",
          "loading",
        ],
      },
    ];

    helpContent.forEach((item) => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description.toLowerCase().includes(lowerQuery);
      const keywordMatch = item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowerQuery)
      );

      if (titleMatch || descMatch || keywordMatch) {
        let matchType = "";
        if (titleMatch) matchType = "Help title";
        else if (descMatch) matchType = "Help description";
        else if (keywordMatch) matchType = "Help keyword";

        results.help.push({
          title: item.title,
          description: item.description,
          category: item.category,
          matchType,
        });
      }
    });

    // Search Features and Pages
    const features = [
      {
        title: "Dashboard",
        description: "Main chat interface with channels and direct messages",
        category: "Feature",
        keywords: ["dashboard", "main", "home", "chat", "interface"],
      },
      {
        title: "Documents",
        description: "View and manage all uploaded documents",
        category: "Feature",
        keywords: ["documents", "files", "upload", "view", "manage"],
      },
      {
        title: "Activities",
        description: "Track recent activities and system events",
        category: "Feature",
        keywords: ["activities", "activity", "track", "events", "recent"],
      },
      {
        title: "E-Signature",
        description: "Create and manage digital signatures",
        category: "Feature",
        keywords: ["e-signature", "signature", "digital", "sign", "draw"],
      },
      {
        title: "Settings",
        description: "Configure account settings and preferences",
        category: "Feature",
        keywords: ["settings", "config", "preferences", "account", "profile"],
      },
      {
        title: "Account",
        description: "Manage your account details and subscription",
        category: "Feature",
        keywords: ["account", "profile", "subscription", "plan", "billing"],
      },
      {
        title: "Profile",
        description: "Update your personal information and avatar",
        category: "Feature",
        keywords: ["profile", "personal", "avatar", "information", "details"],
      },
    ];

    features.forEach((item) => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description.toLowerCase().includes(lowerQuery);
      const keywordMatch = item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowerQuery)
      );

      if (titleMatch || descMatch || keywordMatch) {
        let matchType = "";
        if (titleMatch) matchType = "Feature name";
        else if (descMatch) matchType = "Feature description";
        else if (keywordMatch) matchType = "Feature keyword";

        results.features.push({
          title: item.title,
          description: item.description,
          category: item.category,
          matchType,
        });
      }
    });

    setSearchResults(results);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performGlobalSearch(query);
  };

  // Handle search result click
  const handleSearchResultClick = (type: string, item: any) => {
    switch (type) {
      case "channel":
        setCurrentChannel(item.name);
        setCurrentDM(null);
        break;
      case "document":
        // In real app, this would open the document
        console.log("Opening document:", item.name);
        break;
      case "signature":
        setSelectedSignature({ name: item.name, dataUrl: item.dataUrl });
        break;
      case "dm":
        setCurrentDM({ id: item.id, name: item.name });
        setCurrentChannel(null);
        break;
      case "help":
        // Open help page or show help content
        if (item.title === "Help Center") {
          setShowHelpPage(true);
        } else {
          console.log("Opening help:", item.title);
        }
        break;
      case "feature":
        // Navigate to feature pages
        switch (item.title) {
          case "Documents":
            window.location.href = "/documents";
            break;
          case "Activities":
            window.location.href = "/activity";
            break;
          case "Settings":
            setShowSettings(true);
            break;
          case "Account":
            setShowAccountPage(true);
            break;
          case "Profile":
            setShowProfilePage(true);
            break;
          default:
            console.log("Opening feature:", item.title);
        }
        break;
    }
    setShowGlobalSearch(false);
    setSearchQuery("");
  };

  // Keyboard shortcuts
  // Handle URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const channelParam = urlParams.get("channel");
      const dmParam = urlParams.get("dm");
      
      if (channelParam) {
        setCurrentChannel(channelParam);
        setCurrentDM(null);
        setChannels(prev =>
          prev.map((ch) => ({
            ...ch,
            active: ch.name === channelParam,
            unread: 0,
          }))
        );
      } else if (dmParam) {
        const targetDM = directMessages.find(dm => dm.name === dmParam);
        if (targetDM) {
          setCurrentDM(targetDM);
          setCurrentChannel(null);
          setDirectMessages(prev =>
            prev.map((d) => (d.id === targetDM.id ? { ...d, unread: 0 } : d))
          );
        }
      }
    }
  }, [directMessages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open global search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowGlobalSearch(true);
      }

      // Escape to close global search
      if (e.key === "Escape" && showGlobalSearch) {
        setShowGlobalSearch(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showGlobalSearch]);

  // Close context menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = () => {
      setShowChannelContextMenu(false);
      setShowDMContextMenu(false);
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowChannelContextMenu(false);
        setShowDMContextMenu(false);
        setShowChannelDetails(false);
      }
    };

    if (showChannelContextMenu || showDMContextMenu || showChannelDetails) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [showChannelContextMenu, showDMContextMenu, showChannelDetails]);

  // Function to update user name
  const updateUserName = (newName: string) => {
    setUserName(newName);
    // In a real app, this would also update the user's profile in the database
  };
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showImageSubmenu, setShowImageSubmenu] = useState(false);
  const [showVideoSubmenu, setShowVideoSubmenu] = useState(false);

  // State for settings pages
  const [showAccountPage, setShowAccountPage] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);

  // State for mobile navigation
  const [activeMobileTab, setActiveMobileTab] = useState("home");

  // State for right panel (member drawer)
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  // Mobile-only menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // State for current chat
  const [currentChannel, setCurrentChannel] = useState<string | null>(
    "general"
  );

  // Mock member data for current channel
  const channelMembers = [
    {
      id: 1,
      name: "Banjah Marah",
      avatar: "BM",
      status: "online",
      role: "admin",
      isCurrentUser: true,
    },
    {
      id: 2,
      name: "John Driver",
      avatar: "JD",
      status: "online",
      role: "member",
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "Sarah Dispatcher",
      avatar: "SD",
      status: "away",
      role: "member",
      isCurrentUser: false,
    },
    {
      id: 4,
      name: "Mike Mechanic",
      avatar: "MM",
      status: "offline",
      role: "member",
      isCurrentUser: false,
    },
  ];
  const [currentDM, setCurrentDM] = useState<{
    id: number;
    name: string;
    avatar?: string;
    unread?: number;
    phone?: string;
    status?: "online" | "away" | "offline";
  } | null>(null);
  type ChatMessage = {
    id: number;
    text: string;
    user: string;
    timestamp: string;
  };
  const [channelMessages, setChannelMessages] = useState<
    Record<string, ChatMessage[]>
  >({
    // No seeded system messages
  });

  // Clean up any system messages on component mount
  useEffect(() => {
    setChannelMessages((prev) => {
      const cleaned: Record<string, ChatMessage[]> = {};
      Object.keys(prev).forEach((channelId) => {
        cleaned[channelId] = prev[channelId].filter(
          (msg) => msg.user?.toLowerCase?.() !== "system"
        );
      });
      return cleaned;
    });
  }, []);

  // State for documents
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Delivery Schedule.pdf",
      type: "pdf",
      size: "2.3 MB",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Maintenance Log.xlsx",
      type: "document",
      size: "1.1 MB",
      date: "2024-01-14",
    },
  ]);
  const [documentsExpanded, setDocumentsExpanded] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  // State for recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, channelMessages]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !(moreMenuRef.current as any).contains(event.target)
      ) {
        setShowMoreMenu(false);
      }
      if (
        settingsRef.current &&
        !(settingsRef.current as any).contains(event.target)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Functions
  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        user: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (currentChannel) {
        setChannelMessages((prev) => ({
          ...prev,
          [currentChannel]: [...(prev[currentChannel] || []), newMsg],
        }));
      } else if (currentDM) {
        setMessages([...messages, newMsg]);
      }

      setNewMessage("");
    }
  };

  const switchToChannel = (channelName: string) => {
    setCurrentChannel(channelName);
    setCurrentDM(null);
    setChannels(
      channels.map((ch) => ({
        ...ch,
        active: ch.name === channelName,
        unread: 0,
      }))
    );
  };

  const openChannelDetails = (channel: Channel) => {
    setSelectedChannelForDetails(channel);
    setShowChannelDetails(true);
  };

  const switchToDM = (dm: DMListItem) => {
    setCurrentDM(dm);
    setCurrentChannel(null);
    setDirectMessages(
      directMessages.map((d) => (d.id === dm.id ? { ...d, unread: 0 } : d))
    );
  };

  // Delete functions
  const handleDeleteChannel = (channel: Channel) => {
    setChannelToDelete(channel);
    setShowDeleteChannelModal(true);
  };

  const confirmDeleteChannel = () => {
    if (channelToDelete) {
      setChannels(channels.filter((ch) => ch.id !== channelToDelete.id));
      // If we're currently in the channel being deleted, switch to general
      if (currentChannel === channelToDelete.name) {
        setCurrentChannel("general");
        setCurrentDM(null);
      }
      setShowDeleteChannelModal(false);
      setChannelToDelete(null);
    }
  };

  const handleDeleteDM = (dm: DMListItem) => {
    setDmToDelete(dm);
    setShowDeleteDMModal(true);
  };

  const confirmDeleteDM = () => {
    if (dmToDelete) {
      setDirectMessages(directMessages.filter((dm) => dm.id !== dmToDelete.id));
      // If we're currently in the DM being deleted, switch to general
      if (currentDM && currentDM.id === dmToDelete.id) {
        setCurrentChannel("general");
        setCurrentDM(null);
      }
      setShowDeleteDMModal(false);
      setDmToDelete(null);
    }
  };

  // Context menu functions
  const handleChannelContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    channel: any
  ) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuChannel(channel);
    setShowChannelContextMenu(true);
  };

  const handleDMContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    dm: any
  ) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuDM(dm);
    setShowDMContextMenu(true);
  };

  type ChannelContextAction =
    | "view-details"
    | "copy"
    | "mute"
    | "notifications"
    | "star"
    | "leave"
    | "delete";
  const handleContextMenuAction = (action: ChannelContextAction) => {
    if (!contextMenuChannel) return;

    switch (action) {
      case "view-details":
        setSelectedChannelForDetails(contextMenuChannel);
        setShowChannelDetails(true);
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
        setShowDeleteChannelModal(true);
        break;
    }
    setShowChannelContextMenu(false);
  };

  type DMContextAction =
    | "view-profile"
    | "copy"
    | "mute"
    | "notifications"
    | "star"
    | "delete";
  const handleDMContextMenuAction = (action: DMContextAction) => {
    if (!contextMenuDM) return;

    switch (action) {
      case "view-profile":
        console.log("View profile for:", contextMenuDM.name);
        break;
      case "copy":
        navigator.clipboard.writeText(contextMenuDM.name);
        break;
      case "mute":
        console.log("Mute conversation with:", contextMenuDM.name);
        break;
      case "notifications":
        console.log("Change notifications for:", contextMenuDM.name);
        break;
      case "star":
        console.log("Star conversation with:", contextMenuDM.name);
        break;
      case "delete":
        setDmToDelete(contextMenuDM);
        setShowDeleteDMModal(true);
        break;
    }
    setShowDMContextMenu(false);
  };

  // Remove member from channel
  const handleRemoveMember = (member: any) => {
    // In a real app, this would call an API to remove the member
    // For now, we'll just show a confirmation
    if (
      confirm(
        `Are you sure you want to remove ${member.name} from this channel?`
      )
    ) {
      // Remove member logic would go here
      console.log(`Removed ${member.name} from channel`);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    const newMsg = {
      id: Date.now(),
      text: `🎤 Voice message (${recordingTime}s)`,
      user: "You",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (currentChannel) {
      setChannelMessages((prev) => ({
        ...prev,
        [currentChannel]: [...(prev[currentChannel] || []), newMsg],
      }));
    } else if (currentDM) {
      setMessages([...messages, newMsg]);
    }

    setRecordingTime(0);
  };

  const handleDocumentUpload = () => {
    // Open document folder/file picker
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      ".pdf,.doc,.docx,.txt,.rtf,.odt,.pages,.xls,.xlsx,.csv,.ppt,.pptx,.key";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          const newMsg = {
            id: Date.now() + Math.random(),
            text: `📄 Attached document: ${file.name}`,
            user: "You",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          if (currentChannel) {
            setChannelMessages((prev) => ({
              ...prev,
              [currentChannel]: [...(prev[currentChannel] || []), newMsg],
            }));
          } else if (currentDM) {
            setMessages([...messages, newMsg]);
          }
        });
      }
    };
    input.click();
  };

  const handleImagePicker = () => {
    // Simulate image picker from library
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newMsg = {
          id: Date.now(),
          text: `🖼️ Attached image: ${file.name}`,
          user: "You",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        if (currentChannel) {
          setChannelMessages((prev) => ({
            ...prev,
            [currentChannel]: [...(prev[currentChannel] || []), newMsg],
          }));
        } else if (currentDM) {
          setMessages([...messages, newMsg]);
        }
      }
    };
    input.click();
  };

  const generateAutoSignature = (name: string) => {
    // Create a canvas to generate a realistic handwritten signature
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    canvas.width = 350;
    canvas.height = 80;

    // Set background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a realistic handwritten signature
    const words = name.split(" ");
    let currentX = 20;
    const baseY = 50;

    // Draw each word with handwritten style
    words.forEach((word, index) => {
      // Use a more realistic handwritten font
      const fontSize = index === 0 ? 32 : 28;
      ctx.font = `${fontSize}px "Segoe Script", "Brush Script MT", cursive, serif`;

      // Add slight rotation and positioning for realism
      const rotation = (Math.random() - 0.5) * 0.15;
      const yOffset = (Math.random() - 0.5) * 8;

      ctx.save();
      ctx.translate(currentX, baseY + yOffset);
      ctx.rotate(rotation);

      // Draw the text with realistic pen stroke
      ctx.fillStyle = "#000000";
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#000000";

      // Create a more realistic stroke by drawing multiple times with slight offsets
      for (let i = 0; i < 3; i++) {
        const offset = i * 0.3;
        ctx.fillText(word, offset, offset);
      }

      ctx.restore();

      // Move to next word position with realistic spacing
      const wordWidth = ctx.measureText(word).width;
      currentX += wordWidth + (index === 0 ? 8 : 12);
    });

    // Add a realistic signature underline
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";

    const underlineY = baseY + 15;
    ctx.beginPath();
    ctx.moveTo(15, underlineY);

    // Create a natural squiggly underline
    for (let i = 0; i < currentX - 10; i += 3) {
      const wave = Math.sin(i * 0.08) * 1.5 + Math.sin(i * 0.15) * 0.8;
      ctx.lineTo(15 + i, underlineY + wave);
    }
    ctx.stroke();
    ctx.restore();

    return canvas.toDataURL("image/png");
  };

  const handleVideoPicker = () => {
    // Simulate video picker from library
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newMsg = {
          id: Date.now(),
          text: `🎥 Attached video: ${file.name}`,
          user: "You",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        if (currentChannel) {
          setChannelMessages((prev) => ({
            ...prev,
            [currentChannel]: [...(prev[currentChannel] || []), newMsg],
          }));
        } else if (currentDM) {
          setMessages([...messages, newMsg]);
        }
      }
    };
    input.click();
  };

  const openDocument = (doc: any) => {
    setCurrentDocument(doc);
    setShowDocumentManager(true);
  };

  // Mobile: open hamburger menu and close other floating UI
  const openMobileMenu = () => {
    setShowMoreMenu(false);
    setShowSettings(false);
    setShowSignatureDropdown(false);
    setShowDocumentManager(false);
    setShowSignaturePad(false);
    setShowGlobalSearch(false);
    setShowChannelDetails(false);
    setShowDMContextMenu(false);
    setShowChannelContextMenu(false);
    setShowDeleteChannelModal(false);
    setShowDeleteDMModal(false);
    setShowCreateChannelModal(false);
    setShowCreateDMModal(false);
    setShowAttachmentMenu(false);
    setShowMobileMenu(true);
  };

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Top Bar hidden per spec (use only hamburger via bottom More) */}
      <div className="hidden" />
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div
        className={`hidden md:flex ${
          sidebarCollapsed ? "w-16" : "w-80"
        } bg-slate-800 border-r border-slate-700 flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-white font-semibold">ChatDO</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700"
            >
              {sidebarCollapsed ? "☰" : "◀"}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            {/* Collapsed Sidebar Icons */}
            {sidebarCollapsed ? (
              <div className="space-y-4">
                {/* Home/Dashboard */}
                <div className="flex flex-col items-center">
                  <Link href="/home" className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
                      🏠
                    </div>
                    <span className="text-xs text-slate-400 mt-1">Home</span>
                  </Link>
                </div>

                {/* DMs */}
                <div className="flex flex-col items-center">
                  <Link href="/dms" className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
                      💬
                    </div>
                    <span className="text-xs text-slate-400 mt-1">DMs</span>
                  </Link>
                </div>

                {/* Files/Documents */}
                <div className="flex flex-col items-center">
                  <Link
                    href="/documents"
                    className="flex flex-col items-center"
                  >
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
                      📁
                    </div>
                    <span className="text-xs text-slate-400 mt-1">Files</span>
                  </Link>
                </div>

                {/* Activity */}
                <div className="flex flex-col items-center">
                  <Link href="/activity" className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
                      🔔
                    </div>
                    <span className="text-xs text-slate-400 mt-1">
                      Activity
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Text Channels */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      TEXT CHANNELS
                    </h3>
                    <button
                      onClick={() => setShowCreateChannelModal(true)}
                      className="text-blue-300 hover:text-blue-200 text-lg font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {channels.slice(0, 3).map((channel) => (
                      <div
                        key={channel.id}
                        className={`flex flex-col px-2 py-1 rounded group cursor-pointer ${
                          channel.active
                            ? "bg-slate-700"
                            : "text-slate-300 hover:bg-slate-700"
                        }`}
                        onClick={() => switchToChannel(channel.name)}
                        onContextMenu={(e) =>
                          handleChannelContextMenu(e, channel)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-300">#</span>
                            <span
                              className={
                                channel.active
                                  ? "text-blue-200 font-medium"
                                  : "text-blue-200"
                              }
                            >
                              {channel.name}
                            </span>
                            {channel.visibility === "private" && (
                              <span className="text-slate-500 text-xs">🔒</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openChannelDetails(channel);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-300 text-xs transition-opacity"
                            title="Channel details"
                          >
                            ℹ️
                          </button>
                        </div>
                        {channel.description && (
                          <div className="ml-6 mt-1">
                            <p className="text-xs text-slate-500 truncate">
                              {channel.description}
                            </p>
                          </div>
                        )}
                        {channel.doorNumber && (
                          <div className="ml-6 mt-1">
                            <p className="text-xs text-blue-400 font-medium">
                              🚪 {channel.doorNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* More Channels Button */}
                    {channels.length > 3 && (
                      <div className="px-2 py-1">
                        <Link
                          href="/channels"
                          className="w-full text-left text-xs text-blue-300 hover:text-blue-200 transition-colors flex items-center space-x-1"
                        >
                          <span>▶</span>
                          <span>View All {channels.length} Channels</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Messages */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      DIRECT MESSAGES
                    </h3>
                    <button
                      onClick={() => setShowCreateDMModal(true)}
                      className="text-blue-300 hover:text-blue-200 text-lg font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-1">
                    {directMessages.slice(0, 3).map((dm) => (
                      <div
                        key={dm.id}
                        onClick={() => switchToDM(dm)}
                        onContextMenu={(e) => handleDMContextMenu(e, dm)}
                        className="flex items-center justify-between px-2 py-1 text-blue-200 hover:bg-slate-700 rounded group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {dm.avatar}
                            </span>
                          </div>
                          <span>{dm.name}</span>
                        </div>
                      </div>
                    ))}

                    {/* More DMs Button */}
                    {directMessages.length > 3 && (
                      <div className="px-2 py-1">
                        <Link
                          href="/direct-messages"
                          className="w-full text-left text-xs text-blue-300 hover:text-blue-200 transition-colors flex items-center space-x-1"
                        >
                          <span>▶</span>
                          <span>View All {directMessages.length} DMs</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Link
                        href="/documents"
                        className="flex items-center space-x-2 cursor-pointer hover:bg-slate-700 px-2 py-1 rounded transition-colors"
                      >
                        <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                          DOCUMENTS
                        </h3>
                        <span className="text-xs text-slate-500">
                          ({documents.length})
                        </span>
                      </Link>
                      <button
                        onClick={() => setDocumentsExpanded(!documentsExpanded)}
                        className="text-blue-300 hover:text-blue-200 text-xs"
                      >
                        {documentsExpanded ? "▼" : "▶"}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.multiple = true;
                        input.accept = "*/*";
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) {
                            Array.from(files).forEach((file) => {
                              const newDoc = {
                                id: Date.now() + Math.random(),
                                name: file.name,
                                type: file.type.includes("image")
                                  ? "image"
                                  : file.type.includes("video")
                                  ? "video"
                                  : "document",
                                size: `${(file.size / (1024 * 1024)).toFixed(
                                  1
                                )} MB`,
                                date: new Date().toISOString().split("T")[0],
                              };
                              setDocuments((prev) => [...prev, newDoc]);
                            });
                          }
                        };
                        input.click();
                      }}
                      className="text-blue-300 hover:text-blue-200 text-lg font-semibold"
                    >
                      +
                    </button>
                  </div>

                  {documentsExpanded && (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {documents.slice(0, 3).map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => openDocument(doc)}
                          className="flex items-center justify-between px-2 py-1 text-blue-200 hover:bg-slate-700 rounded group cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <span className="text-sm">📄</span>
                            <span className="text-sm truncate">{doc.name}</span>
                          </div>
                        </div>
                      ))}
                      {/* View All Documents Link */}
                      <div className="pt-2 border-t border-slate-700">
                        <Link
                          href="/documents"
                          className="flex items-center space-x-2 px-2 py-1 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded group cursor-pointer"
                        >
                          <span className="text-sm">📁</span>
                          <span className="text-sm">View All Documents</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activities */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      href="/activity"
                      className="flex items-center space-x-2 cursor-pointer hover:bg-slate-700 px-2 py-1 rounded transition-colors"
                    >
                      <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                        ACTIVITIES
                      </h3>
                      <span className="text-xs text-slate-500">(12)</span>
                    </Link>
                  </div>
                </div>

                {/* E-Signature */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-700 px-2 py-1 rounded transition-colors group">
                      <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                        E-SIGNATURE
                      </h3>
                      <span className="text-xs text-slate-500">✏️</span>
                      <button
                        onClick={() =>
                          setShowSignatureDropdown(!showSignatureDropdown)
                        }
                        className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        {showSignatureDropdown ? "▼" : "▶"}
                      </button>
                    </div>
                    <button
                      onClick={() => setShowAddSignatureModal(true)}
                      className="text-blue-300 hover:text-blue-200 text-lg font-semibold"
                      title="Add New Signature"
                    >
                      +
                    </button>
                  </div>

                  {/* User Name Display */}
                  <div className="ml-4 mb-2 p-2 bg-slate-700 rounded text-xs">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowSignatureManager(true)}
                        className="text-slate-300 hover:text-blue-200 transition-colors flex-1 text-left"
                      >
                        User: {userName}
                      </button>
                      <button
                        onClick={() => {
                          const newName = prompt("Enter your name:", userName);
                          if (newName && newName.trim()) {
                            updateUserName(newName.trim());
                          }
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors ml-2"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>

                  {/* Selected Signature Indicator */}
                  {selectedSignature && (
                    <div className="ml-4 mb-2 p-2 bg-slate-700 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">
                          Selected: {selectedSignature.name}
                        </span>
                        <button
                          onClick={() => setSelectedSignature(null)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Signature Dropdown */}
                  {showSignatureDropdown && (
                    <div className="ml-4 space-y-2">
                      <button
                        onClick={() => {
                          setShowSignaturePad(true);
                          setShowSignatureDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full text-left px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 rounded transition-colors"
                      >
                        <span>✏️</span>
                        <span>Draw New Signature</span>
                      </button>

                      <div className="border-t border-slate-600 my-2"></div>

                      <div className="px-2 py-1">
                        <p className="text-xs text-slate-500 mb-2">
                          Saved Signatures:
                        </p>
                        {savedSignatures.length > 0 ? (
                          savedSignatures.map((sig, index) => (
                            <div
                              key={index}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  "text/plain",
                                  JSON.stringify(sig)
                                );
                                e.dataTransfer.effectAllowed = "copy";
                              }}
                              className="flex items-center space-x-2 w-full text-left px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 rounded transition-colors cursor-pointer group"
                            >
                              <button
                                onClick={() => {
                                  setSelectedSignature(sig);
                                  setShowSignatureDropdown(false);
                                }}
                                className="flex items-center space-x-2 flex-1"
                              >
                                <span>📄</span>
                                <span>{sig.name}</span>
                              </button>
                              <button
                                onClick={() => {
                                  setViewingSignature(sig);
                                  setShowSignatureViewer(true);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300"
                                title="View signature"
                              >
                                👁️
                              </button>
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 text-xs">
                                Drag to document
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">
                            No saved signatures
                          </p>
                        )}
                      </div>

                      <div className="border-t border-slate-600 my-2"></div>

                      <div className="px-2 py-1">
                        <p className="text-xs text-slate-500 mb-2">
                          Auto-generated:
                        </p>
                        <button
                          onClick={() => {
                            const firstName = userName.split(" ")[0];
                            setSelectedSignature({
                              name: `${firstName} (Auto)`,
                              dataUrl: generateAutoSignature(firstName),
                            });
                            setShowSignatureDropdown(false);
                          }}
                          className="flex items-center space-x-2 w-full text-left px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 rounded transition-colors"
                        >
                          <span>👤</span>
                          <span>{userName.split(" ")[0]} (Auto)</span>
                        </button>
                        <div className="ml-6 mb-2">
                          <img
                            src={generateAutoSignature(userName.split(" ")[0])}
                            alt="First name signature preview"
                            className="h-8 object-contain bg-white rounded border"
                          />
                        </div>

                        <button
                          onClick={() => {
                            setSelectedSignature({
                              name: `${userName} (Auto)`,
                              dataUrl: generateAutoSignature(userName),
                            });
                            setShowSignatureDropdown(false);
                          }}
                          className="flex items-center space-x-2 w-full text-left px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 rounded transition-colors"
                        >
                          <span>👤</span>
                          <span>{userName} (Auto)</span>
                        </button>
                        <div className="ml-6 mb-2">
                          <img
                            src={generateAutoSignature(userName)}
                            alt="Full name signature preview"
                            className="h-8 object-contain bg-white rounded border"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettings(true)}
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center relative hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <span className="text-white text-sm font-bold">U</span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
              </button>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-white text-sm font-medium">User</p>
                  <p className="text-slate-400 text-xs">Online</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
  <div className="flex-1 flex flex-col md:flex-1 min-w-0">
        {/* Desktop Header (hidden on mobile) */}
        <div className="hidden md:flex h-12 bg-slate-800 border-b border-slate-700 items-center px-4">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <p className="text-white">
                  {currentChannel ? (
                    <>
                      <span className="font-bold"># {currentChannel}</span>
                    </>
                  ) : currentDM ? (
                    <>
                      <span className="font-bold">{currentDM.name}</span>
                    </>
                  ) : (
                    <span className="font-bold"># general</span>
                  )}
                </p>
                {currentChannel &&
                  channels.find((c) => c.name === currentChannel)
                    ?.doorNumber && (
                    <span className="text-blue-400 font-medium">
                      🚪{" "}
                      {
                        channels.find((c) => c.name === currentChannel)
                          ?.doorNumber
                      }
                    </span>
                  )}
                {currentChannel &&
                  channels.find((c) => c.name === currentChannel)
                    ?.description && (
                    <span className="text-slate-300">
                      •{" "}
                      {
                        channels.find((c) => c.name === currentChannel)
                          ?.description
                      }
                    </span>
                  )}
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            {/* Member Panel Toggle Button */}
            <button
              onClick={() => setShowMemberPanel(!showMemberPanel)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title={showMemberPanel ? "Hide Members" : "Show Members"}
            >
              {showMemberPanel ? "👥" : "👤"}
            </button>

            {/* Global Search Button */}
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="hidden md:flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
              title="Global Search (Ctrl+K)"
            >
              <span>🔍</span>
              <span>Search</span>
            </button>
            <button className="hidden md:block p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
              📞
            </button>
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
              >
                ⋯
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-48">
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2">
                      <span>👥</span>
                      <span>Add users</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2">
                      <span>📧</span>
                      <span>Invite users</span>
                    </button>
                    <div className="border-t border-slate-700 my-1"></div>
                    <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2">
                      <span>📊</span>
                      <span>Channel analytics</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2">
                      <span>🔧</span>
                      <span>Channel settings</span>
                    </button>
                    <div className="border-t border-slate-700 my-1"></div>
                    <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 flex items-center space-x-2">
                      <span>🚪</span>
                      <span>Leave channel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 md:p-6 space-y-4 md:space-y-6 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-4 pt-16 md:pt-0">
          {(currentChannel
            ? (channelMessages[currentChannel] || []).filter(
                (m) => m.user?.toLowerCase?.() !== "system"
              )
            : messages.filter((m) => m.user?.toLowerCase?.() !== "system")
          ).map((message) => (
            <div
              key={message.id}
              className="flex items-start space-x-2 md:space-x-4"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm md:text-lg">
                  {message.user === "You" ? "U" : "U"}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2 md:space-x-3">
                  <span className="font-semibold text-white text-sm md:text-base">
                    {message.user}
                  </span>
                  <span className="text-slate-400 text-xs md:text-sm">
                    {message.timestamp}
                  </span>
                </div>
                <div className="text-slate-300 mt-1 text-sm md:text-base">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="px-2 py-4 md:p-4 border-t border-slate-700 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-2">
            <div className="relative">
              <button
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-1 md:p-2 text-slate-400 hover:text-white"
              >
                📤
              </button>
              {showAttachmentMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-48">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleDocumentUpload();
                        setShowAttachmentMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <span>📄</span>
                      <span>Document</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowImageSubmenu(!showImageSubmenu)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <span>🖼️</span>
                          <span>Image</span>
                        </div>
                        <span>▶</span>
                      </button>
                      {showImageSubmenu && (
                        <div className="absolute left-full top-0 ml-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-40">
                          <div className="py-2">
                            <button
                              onClick={() => {
                                alert("Opening camera...");
                                setShowImageSubmenu(false);
                                setShowAttachmentMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                            >
                              <span>📷</span>
                              <span>Camera</span>
                            </button>
                            <button
                              onClick={() => {
                                handleImagePicker();
                                setShowImageSubmenu(false);
                                setShowAttachmentMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                            >
                              <span>🖼️</span>
                              <span>Image Picker</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowVideoSubmenu(!showVideoSubmenu)}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <span>🎥</span>
                          <span>Video</span>
                        </div>
                        <span>▶</span>
                      </button>
                      {showVideoSubmenu && (
                        <div className="absolute left-full top-0 ml-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-40">
                          <div className="py-2">
                            <button
                              onClick={() => {
                                alert("Opening video camera...");
                                setShowVideoSubmenu(false);
                                setShowAttachmentMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                            >
                              <span>📹</span>
                              <span>Camera</span>
                            </button>
                            <button
                              onClick={() => {
                                handleVideoPicker();
                                setShowVideoSubmenu(false);
                                setShowAttachmentMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                            >
                              <span>🎥</span>
                              <span>Video Picker</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="w-full px-2 py-2 md:px-4 md:py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>
            <button
              onClick={() => setShowPushToTalk(true)}
              className="p-1 md:p-2 text-slate-400 hover:text-white shrink-0"
            >
              🎤
            </button>
            <button
              onClick={sendMessage}
              className="px-2 py-2 md:px-4 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm md:text-base shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-96">
            <h3 className="text-white text-lg font-semibold mb-4">
              Create Channel
            </h3>
            <input
              type="text"
              placeholder="Channel name (PO Number)"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white mb-4"
            />
            <div className="mb-4">
              <label className="block text-slate-300 text-sm mb-2">
                Door Number
              </label>
              <input
                type="text"
                placeholder="e.g., D-12, D-08"
                value={newChannelDoorNumber}
                onChange={(e) => setNewChannelDoorNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <textarea
              placeholder="Description (e.g., hot load, late, early)"
              value={newChannelDescription}
              onChange={(e) => setNewChannelDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white mb-4 resize-none"
              rows={3}
            />
            <div className="mb-4">
              <label className="block text-slate-300 text-sm mb-2">
                Visibility
              </label>
              <select
                value={newChannelVisibility}
                onChange={(e) => setNewChannelVisibility(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                <option value="public">Public - Anyone can join</option>
                <option value="private">Private - Invite only</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowCreateChannelModal(false);
                  setNewChannelName("");
                  setNewChannelDescription("");
                  setNewChannelVisibility("public");
                  setNewChannelDoorNumber("");
                }}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newChannelName.trim()) {
                    const newChannel: Channel = {
                      id: Date.now(),
                      name: newChannelName.trim(),
                      description: newChannelDescription.trim(),
                      visibility: newChannelVisibility as "public" | "private",
                      doorNumber: newChannelDoorNumber.trim(),
                      unread: 0,
                      active: false,
                    };
                    setChannels((prev) => [...prev, newChannel]);
                    setShowCreateChannelModal(false);
                    setNewChannelName("");
                    setNewChannelDescription("");
                    setNewChannelVisibility("public");
                    setNewChannelDoorNumber("");
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showPushToTalk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-96 text-center">
            <h3 className="text-white text-lg font-semibold mb-4">
              Push-to-Talk
            </h3>
            <div className="mb-4">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl hover:bg-red-600"
              >
                🎤
              </button>
            </div>
            <p className="text-slate-300 mb-4">
              {isRecording
                ? `Recording... ${recordingTime}s`
                : "Hold to record"}
            </p>
            <button
              onClick={() => setShowPushToTalk(false)}
              className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDocumentManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-3/4 h-3/4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                Document Manager
              </h3>
              <button
                onClick={() => setShowDocumentManager(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border-b border-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <span>📄</span>
                    <div>
                      <p className="text-white">{doc.name}</p>
                      <p className="text-slate-400 text-sm">
                        {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                      Sign
                    </button>
                    <button className="px-3 py-1 bg-slate-600 text-white rounded text-sm">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex z-50"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="absolute bottom-20 left-4 bg-slate-800 rounded-lg w-80 shadow-xl"
            ref={settingsRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Items */}
            <div className="p-2">
              <button className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 rounded-lg flex items-center space-x-3">
                <span className="text-lg">👤</span>
                <span>banjahmarah@gmail.com</span>
              </button>

              <button className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 rounded-lg flex items-center space-x-3">
                <span className="text-lg">⭐</span>
                <span>Upgrade plan</span>
              </button>

              <button
                onClick={() => {
                  setShowProfilePage(true);
                  setShowSettings(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 rounded-lg flex items-center space-x-3"
              >
                <span className="text-lg">👤</span>
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowAccountPage(true);
                  setShowSettings(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 rounded-lg flex items-center space-x-3"
              >
                <span className="text-lg">🔧</span>
                <span>Account</span>
              </button>

              <button className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 rounded-lg flex items-center space-x-3">
                <span className="text-lg">🔧</span>
                <span>Settings</span>
              </button>

              <div className="border-t border-slate-700 my-2"></div>

              <button
                onClick={() => {
                  setShowHelpPage(true);
                  setShowSettings(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🎯</span>
                  <span>Help</span>
                </div>
                <span className="text-slate-400">{">"}</span>
              </button>

              <button className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-700 rounded-lg flex items-center space-x-3">
                <span className="text-lg">🚪</span>
                <span>Log out</span>
              </button>
            </div>

            {/* User Profile Section */}
            <div className="border-t border-slate-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Banjah Marah</p>
                  <p className="text-slate-400 text-sm">Plus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Page Modal */}
      {showProfilePage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg w-96 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Profile</h3>
                <button
                  onClick={() => setShowProfilePage(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">U</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Banjah Marah</h4>
                    <p className="text-slate-400 text-sm">Online</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Banjah Marah"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="banjahmarah@gmail.com"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1-555-0123"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      Bio
                    </label>
                    <textarea
                      defaultValue="Digital Ocean enthusiast and developer"
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowProfilePage(false)}
                    className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Page Modal */}
      {showAccountPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-96 shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold">Account</h3>
                <button
                  onClick={() => setShowAccountPage(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">Current Plan</h4>
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      Plus
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">
                    You're currently on the Plus plan with advanced features.
                  </p>
                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Upgrade to Pro
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue="banjahmarah"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-white font-semibold mb-3">
                    Account Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">
                        Email Verified
                      </span>
                      <span className="text-green-400 text-sm">✓ Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">
                        Two-Factor Auth
                      </span>
                      <span className="text-red-400 text-sm">✗ Disabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Last Login</span>
                      <span className="text-slate-400 text-sm">
                        Today at 2:30 PM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowAccountPage(false)}
                    className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Page Modal */}
      {showHelpPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-[800px] shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold">
                  ChatDO Help Center
                </h3>
                <button
                  onClick={() => setShowHelpPage(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {/* Getting Started */}
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">🚀</span>
                    Getting Started
                  </h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <p className="text-slate-300">
                      Welcome to ChatDO! This is a modern chat platform designed
                      for Digital Ocean developers and teams. The interface is
                      divided into several key areas that help you communicate
                      effectively.
                    </p>
                    <p className="text-slate-300">
                      <strong>Quick Start:</strong> Click on any channel or
                      direct message to start chatting. Use the message input at
                      the bottom to send your messages.
                    </p>
                  </div>
                </div>

                {/* Sidebar Navigation */}
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Sidebar Navigation
                  </h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-4">
                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        📱 Collapsible Sidebar
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Click the{" "}
                        <span className="bg-slate-600 px-1 rounded">◀</span>{" "}
                        button next to "ChatDO" to collapse the sidebar. When
                        collapsed, you'll see icon-only navigation for quick
                        access.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        🏠 Home Dashboard
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Click the home icon to view your workspace overview,
                        including message statistics, active channels, and
                        recent activity.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        💬 Text Channels
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Public channels for team discussions. Each channel shows
                        unread message counts in red badges. Click the{" "}
                        <span className="bg-slate-600 px-1 rounded">+</span>{" "}
                        button to create new channels.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        👥 Direct Messages
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Private conversations with team members. Shows user
                        avatars, names, and unread counts. Click the{" "}
                        <span className="bg-slate-600 px-1 rounded">+</span>{" "}
                        button to start new DMs.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        📁 Documents
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Access shared documents and files. Click to view the
                        documents page with search, filtering, and management
                        tools.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        📊 Activity Feed
                      </h5>
                      <p className="text-slate-300 mb-2">
                        View all workspace activity, mentions, and notifications
                        in chronological order.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Chat Area */}
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">💬</span>
                    Main Chat Area
                  </h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-4">
                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        📝 Message Input
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Type your message in the input field at the bottom.
                        Press Enter or click "Send" to send your message.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        📤 Attachment Button
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Click the{" "}
                        <span className="bg-slate-600 px-1 rounded">📤</span>{" "}
                        button to attach files, images, or videos to your
                        messages.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        🎤 Voice Recording
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Click the{" "}
                        <span className="bg-slate-600 px-1 rounded">🎤</span>{" "}
                        button to record voice messages. Hold to record, release
                        to send.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        🔍 Search
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Use the search bar in the header to find messages,
                        users, or files across the workspace.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        📞 Voice Call
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Click the{" "}
                        <span className="bg-slate-600 px-1 rounded">📞</span>{" "}
                        button to start voice calls with channel members.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        ⋯ More Options
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Click the{" "}
                        <span className="bg-slate-600 px-1 rounded">⋯</span>{" "}
                        button for additional options like adding users, channel
                        analytics, settings, and leaving channels.
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Profile & Settings */}
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    User Profile & Settings
                  </h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-4">
                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        👤 User Avatar
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Click your avatar (the blue "U" circle) in the sidebar
                        to access your settings menu.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        📧 Email & Plan
                      </h5>
                      <p className="text-slate-300 mb-2">
                        View your email address and current subscription plan
                        (Plus/Pro) in the settings menu.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        👤 Profile Management
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Edit your name, email, phone number, and bio in the
                        Profile section.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        🔧 Account Settings
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Manage your username, passwords, account status, and
                        subscription in the Account section.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        🎯 Help & Support
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Access this help guide and additional support resources.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        🚪 Logout
                      </h5>
                      <p className="text-slate-300 mb-2">
                        Safely log out of your account when you're done.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">⌨️</span>
                    Keyboard Shortcuts
                  </h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Send Message</span>
                          <span className="text-slate-400">Enter</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">New Line</span>
                          <span className="text-slate-400">Shift + Enter</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Search</span>
                          <span className="text-slate-400">Ctrl/Cmd + K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Toggle Sidebar</span>
                          <span className="text-slate-400">Ctrl/Cmd + B</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Next Channel</span>
                          <span className="text-slate-400">Ctrl/Cmd + ]</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">
                            Previous Channel
                          </span>
                          <span className="text-slate-400">Ctrl/Cmd + [</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Mark as Read</span>
                          <span className="text-slate-400">
                            Ctrl/Cmd + Shift + A
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Settings</span>
                          <span className="text-slate-400">Ctrl/Cmd + ,</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips & Best Practices */}
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">💡</span>
                    Tips & Best Practices
                  </h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <p className="text-slate-300">
                        Use channels for team-wide discussions and DMs for
                        private conversations.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <p className="text-slate-300">
                        Keep your status updated so teammates know when you're
                        available.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <p className="text-slate-300">
                        Use the search function to quickly find past messages
                        and files.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <p className="text-slate-300">
                        Organize documents in the Documents section for easy
                        team access.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <p className="text-slate-300">
                        Check the Activity feed regularly to stay updated on
                        workspace happenings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePad
          onSave={(signatureDataUrl) => {
            // Prompt user to name the signature
            const signatureName = prompt("Enter a name for this signature:");
            if (signatureName && signatureName.trim()) {
              const newSignature = {
                name: signatureName.trim(),
                dataUrl: signatureDataUrl,
              };
              setSavedSignatures((prev) => [...prev, newSignature]);
              setSelectedSignature(newSignature);
            }
            setShowSignaturePad(false);
          }}
          onCancel={() => setShowSignaturePad(false)}
        />
      )}

      {/* Add New Signature Modal */}
      {showAddSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-[500px] max-w-[90vw]">
            <h3 className="text-white text-lg font-semibold mb-4">
              Add New Signature
            </h3>

            {/* Signature Type Selection */}
            <div className="mb-6">
              <p className="text-slate-300 mb-3">
                Choose how to create your signature:
              </p>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="signatureType"
                    value="auto"
                    checked={newSignatureType === "auto"}
                    onChange={() => setNewSignatureType("auto")}
                    className="text-blue-500"
                  />
                  <span className="text-slate-300">
                    Auto-generate from name
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="signatureType"
                    value="draw"
                    checked={newSignatureType === "draw"}
                    onChange={() => setNewSignatureType("draw")}
                    className="text-blue-500"
                  />
                  <span className="text-slate-300">
                    Draw signature manually
                  </span>
                </label>
              </div>
            </div>

            {/* Name Input for Auto-generation */}
            {newSignatureType === "auto" && (
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Enter your name for signature generation:
                </label>
                <input
                  type="text"
                  value={newSignatureName}
                  onChange={(e) => setNewSignatureName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Preview */}
                {newSignatureName.trim() && (
                  <div className="mt-4 p-3 bg-slate-700 rounded">
                    <p className="text-slate-300 text-sm mb-2">Preview:</p>
                    <img
                      src={generateAutoSignature(newSignatureName.trim())}
                      alt="Signature preview"
                      className="h-12 object-contain bg-white rounded border"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddSignatureModal(false);
                  setNewSignatureName("");
                  setNewSignatureType("auto");
                }}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>

              {newSignatureType === "auto" ? (
                <button
                  onClick={() => {
                    if (newSignatureName.trim()) {
                      const newSignature = {
                        name: newSignatureName.trim(),
                        dataUrl: generateAutoSignature(newSignatureName.trim()),
                      };
                      setSavedSignatures((prev) => [...prev, newSignature]);
                      setSelectedSignature(newSignature);
                      setShowAddSignatureModal(false);
                      setNewSignatureName("");
                    }
                  }}
                  disabled={!newSignatureName.trim()}
                  className={`px-4 py-2 rounded transition-colors ${
                    newSignatureName.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-slate-600 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Create Signature
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAddSignatureModal(false);
                    setShowSignaturePad(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Open Signature Pad
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signature Viewer Modal */}
      {showSignatureViewer && viewingSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Signature: {viewingSignature.name}
              </h3>
              <button
                onClick={() => {
                  setShowSignatureViewer(false);
                  setViewingSignature(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 mb-4 flex items-center justify-center">
              <img
                src={viewingSignature.dataUrl}
                alt={`Signature: ${viewingSignature.name}`}
                className="max-w-full max-h-64 object-contain"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-slate-300 text-sm">
                <p>Click and drag this signature to place it on documents</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedSignature(viewingSignature);
                    setShowSignatureViewer(false);
                    setViewingSignature(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Use This Signature
                </button>
                <button
                  onClick={() => {
                    setShowSignatureViewer(false);
                    setViewingSignature(null);
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Member Panel - Fixed Position */}
      {showMemberPanel && (
        <div className="hidden md:block fixed top-12 right-0 h-[calc(100vh-3rem)] w-80 bg-slate-800 border-l border-slate-700 flex flex-col z-40">
          {/* Member Panel Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Members</h3>
              <button
                onClick={() => setShowMemberPanel(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {currentDM
                ? "2"
                : currentChannel === "logistics"
                ? "5"
                : currentChannel === "maintenance"
                ? "3"
                : currentChannel === "87697"
                ? "3"
                : channelMembers.length}{" "}
              members in this {currentDM ? "conversation" : "channel"}
            </p>
          </div>

          {/* Member List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {(currentDM
                ? [
                    {
                      id: 1,
                      name: "Banjah Marah",
                      avatar: "BM",
                      status: "online",
                      role: "admin",
                      isCurrentUser: true,
                    },
                    {
                      id: currentDM.id || 3,
                      name: currentDM.name || "Sarah Dispatcher",
                      avatar: (currentDM.name || "Sarah Dispatcher")
                        .split(" ")
                        .map((n) => n[0])
                        .join(""),
                      status: currentDM.status || "away",
                      role: "member",
                      isCurrentUser: false,
                    },
                  ]
                : channelMembers
              ).map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    member.isCurrentUser
                      ? "bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30"
                      : "hover:bg-slate-700"
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {member.avatar}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                        member.status === "online"
                          ? "bg-green-500"
                          : member.status === "away"
                          ? "bg-yellow-500"
                          : "bg-slate-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium truncate ${
                          member.isCurrentUser ? "text-blue-300" : "text-white"
                        }`}
                      >
                        {member.name}
                      </span>
                      {member.role === "admin" && (
                        <span className="text-xs bg-red-500 text-white px-1 rounded">
                          Admin
                        </span>
                      )}
                      {member.isCurrentUser && (
                        <span className="text-xs bg-blue-500 text-white px-1 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="capitalize">{member.status}</span>
                      <span>•</span>
                      <span className="capitalize">{member.role}</span>
                      {!member.isCurrentUser && currentChannel && (
                        <button
                          onClick={() => handleRemoveMember(member)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs transition-opacity ml-2"
                          title="Remove member"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Member Panel */}
      {showMemberPanel && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-lg max-h-[70vh] flex flex-col">
            {/* Mobile Member Panel Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Members</h3>
                <button
                  onClick={() => setShowMemberPanel(false)}
                  className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {channelMembers.length} members in this channel
              </p>
            </div>

            {/* Mobile Member List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {(currentDM
                  ? [
                      {
                        id: 1,
                        name: "Banjah Marah",
                        avatar: "BM",
                        status: "online",
                        role: "admin",
                        isCurrentUser: true,
                      },
                      {
                        id: currentDM.id || 3,
                        name: currentDM.name || "Sarah Dispatcher",
                        avatar: (currentDM.name || "Sarah Dispatcher")
                          .split(" ")
                          .map((n) => n[0])
                          .join(""),
                        status: currentDM.status || "away",
                        role: "member",
                        isCurrentUser: false,
                      },
                    ]
                  : channelMembers
                ).map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      member.isCurrentUser
                        ? "bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {member.avatar}
                        </span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "away"
                            ? "bg-yellow-500"
                            : "bg-slate-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium truncate ${
                            member.isCurrentUser
                              ? "text-blue-300"
                              : "text-white"
                          }`}
                        >
                          {member.name}
                        </span>
                        {member.role === "admin" && (
                          <span className="text-xs bg-red-500 text-white px-1 rounded">
                            Admin
                          </span>
                        )}
                        {member.isCurrentUser && (
                          <span className="text-xs bg-blue-500 text-white px-1 rounded">
                            You
                          </span>
                        )}
                        {!member.isCurrentUser && currentChannel && (
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="text-red-400 hover:text-red-300 text-xs ml-2"
                            title="Remove member"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span className="capitalize">{member.status}</span>
                        <span>•</span>
                        <span className="capitalize">{member.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Channel Context Menu */}
      {showChannelContextMenu && (
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
              onClick={() => setShowChannelContextMenu(false)}
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

      {/* DM Context Menu */}
      {showDMContextMenu && (
        <div
          className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-lg py-1 min-w-48"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-600">
            <span className="text-sm text-slate-300">Conversation Options</span>
            <button
              onClick={() => setShowDMContextMenu(false)}
              className="text-slate-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>
          <button
            onClick={() => handleDMContextMenuAction("view-profile")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            View profile
          </button>
          <button
            onClick={() => handleDMContextMenuAction("copy")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm flex items-center justify-between"
          >
            Copy username
            <span className="text-slate-400 text-xs">→</span>
          </button>
          <div className="border-t border-slate-600 my-1"></div>
          <button
            onClick={() => handleDMContextMenuAction("mute")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            Mute conversation
          </button>
          <button
            onClick={() => handleDMContextMenuAction("notifications")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            Change notifications
          </button>
          <button
            onClick={() => handleDMContextMenuAction("star")}
            className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 text-sm"
          >
            Star conversation
          </button>
          <div className="border-t border-slate-600 my-1"></div>
          <button
            onClick={() => handleDMContextMenuAction("delete")}
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 text-sm"
          >
            Delete conversation
          </button>
        </div>
      )}

      {/* Signature Manager Modal */}
      {showSignatureManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-[600px] max-w-[90vw] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Signature Manager - {userName}
              </h3>
              <button
                onClick={() => setShowSignatureManager(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Saved Signatures Section */}
              <div className="mb-6">
                <h4 className="text-blue-300 font-semibold mb-3">
                  Saved Signatures
                </h4>
                {savedSignatures.length > 0 ? (
                  <div className="space-y-3">
                    {savedSignatures.map((sig, index) => (
                      <div
                        key={index}
                        className="bg-slate-700 p-3 rounded flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={sig.dataUrl}
                            alt={`Signature: ${sig.name}`}
                            className="h-8 object-contain bg-white rounded border"
                          />
                          <span className="text-slate-300">{sig.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSignature(sig);
                              setShowSignatureManager(false);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          >
                            Use
                          </button>
                          <button
                            onClick={() => {
                              setViewingSignature(sig);
                              setShowSignatureViewer(true);
                              setShowSignatureManager(false);
                            }}
                            className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSavedSignatures((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">
                    No saved signatures yet.
                  </p>
                )}
              </div>

              {/* Quick Create Section */}
              <div className="mb-6">
                <h4 className="text-blue-300 font-semibold mb-3">
                  Quick Create
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const newSignature = {
                        name: userName,
                        dataUrl: generateAutoSignature(userName),
                      };
                      setSavedSignatures((prev) => [...prev, newSignature]);
                      setSelectedSignature(newSignature);
                      setShowSignatureManager(false);
                    }}
                    className="p-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors text-left"
                  >
                    <div className="text-blue-300 font-medium mb-2">
                      Auto-Generate Full Name
                    </div>
                    <img
                      src={generateAutoSignature(userName)}
                      alt="Auto signature preview"
                      className="h-6 object-contain bg-white rounded border"
                    />
                  </button>
                  <button
                    onClick={() => {
                      const newSignature = {
                        name: userName.split(" ")[0],
                        dataUrl: generateAutoSignature(userName.split(" ")[0]),
                      };
                      setSavedSignatures((prev) => [...prev, newSignature]);
                      setSelectedSignature(newSignature);
                      setShowSignatureManager(false);
                    }}
                    className="p-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors text-left"
                  >
                    <div className="text-blue-300 font-medium mb-2">
                      Auto-Generate First Name
                    </div>
                    <img
                      src={generateAutoSignature(userName.split(" ")[0])}
                      alt="Auto signature preview"
                      className="h-6 object-contain bg-white rounded border"
                    />
                  </button>
                </div>
              </div>

              {/* Create New Section */}
              <div>
                <h4 className="text-blue-300 font-semibold mb-3">Create New</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowSignatureManager(false);
                      setShowAddSignatureModal(true);
                    }}
                    className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Create Custom Signature
                  </button>
                  <button
                    onClick={() => {
                      setShowSignatureManager(false);
                      setShowSignaturePad(true);
                    }}
                    className="w-full p-3 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
                  >
                    Draw New Signature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {showGlobalSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-[800px] max-w-[90vw] max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-semibold">
                  Global Search
                </h3>
                <button
                  onClick={() => {
                    setShowGlobalSearch(false);
                    setSearchQuery("");
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search everything: channels, help, features, documents, signatures, DMs..."
                  className="w-full px-4 py-3 pl-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  autoFocus
                />
                <span className="absolute left-4 top-4 text-slate-400 text-lg">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      performGlobalSearch("");
                    }}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {!searchQuery ? (
                <div className="text-center text-slate-400 py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg mb-2">Search Everything</p>
                  <p className="text-sm">
                    Find channels, help, features, documents, signatures, DMs,
                    and more
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Channels */}
                  {searchResults.channels.length > 0 && (
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">#</span>
                        Channels ({searchResults.channels.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.channels.map((channel, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleSearchResultClick("channel", channel)
                            }
                            className="w-full p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">
                                  {channel.name}
                                </div>
                                <div className="text-slate-400 text-sm">
                                  {channel.description}
                                </div>
                                {channel.doorNumber && (
                                  <div className="text-blue-400 text-sm">
                                    🚪 Door {channel.doorNumber}
                                  </div>
                                )}
                              </div>
                              <div className="text-slate-500 text-xs">
                                {channel.matchType}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {searchResults.documents.length > 0 && (
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">📁</span>
                        Documents ({searchResults.documents.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.documents.map((doc, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleSearchResultClick("document", doc)
                            }
                            className="w-full p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">
                                  {doc.name}
                                </div>
                                <div className="text-slate-400 text-sm">
                                  {doc.type} Document
                                </div>
                              </div>
                              <div className="text-slate-500 text-xs">
                                {doc.matchType}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Signatures */}
                  {searchResults.signatures.length > 0 && (
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">✏️</span>
                        Signatures ({searchResults.signatures.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.signatures.map((sig, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleSearchResultClick("signature", sig)
                            }
                            className="w-full p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={sig.dataUrl}
                                  alt={`Signature: ${sig.name}`}
                                  className="h-8 object-contain bg-white rounded border"
                                />
                                <div>
                                  <div className="text-white font-medium">
                                    {sig.name}
                                  </div>
                                  <div className="text-slate-400 text-sm">
                                    Signature
                                  </div>
                                </div>
                              </div>
                              <div className="text-slate-500 text-xs">
                                {sig.matchType}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Messages */}
                  {searchResults.dms.length > 0 && (
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">💬</span>
                        Direct Messages ({searchResults.dms.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.dms.map((dm, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchResultClick("dm", dm)}
                            className="w-full p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {dm.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-white font-medium">
                                    {dm.name}
                                  </div>
                                  <div className="text-slate-400 text-sm">
                                    Direct Message
                                  </div>
                                </div>
                              </div>
                              <div className="text-slate-500 text-xs">
                                {dm.matchType}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Help */}
                  {searchResults.help.length > 0 && (
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">❓</span>
                        Help ({searchResults.help.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.help.map((item, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleSearchResultClick("help", item)
                            }
                            className="w-full p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">
                                  {item.title}
                                </div>
                                <div className="text-slate-400 text-sm">
                                  {item.description}
                                </div>
                              </div>
                              <div className="text-slate-500 text-xs">
                                {item.matchType}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {searchResults.features.length > 0 && (
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">⚙️</span>
                        Features ({searchResults.features.length})
                      </h4>
                      <div className="space-y-2">
                        {searchResults.features.map((item, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleSearchResultClick("feature", item)
                            }
                            className="w-full p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">
                                  {item.title}
                                </div>
                                <div className="text-slate-400 text-sm">
                                  {item.description}
                                </div>
                              </div>
                              <div className="text-slate-500 text-xs">
                                {item.matchType}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery &&
                    searchResults.channels.length === 0 &&
                    searchResults.documents.length === 0 &&
                    searchResults.signatures.length === 0 &&
                    searchResults.dms.length === 0 &&
                    searchResults.help.length === 0 &&
                    searchResults.features.length === 0 && (
                      <div className="text-center text-slate-400 py-8">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-lg mb-2">No results found</p>
                        <p className="text-sm">
                          Try searching for different keywords
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Channel Details Modal */}
      {showChannelDetails && selectedChannelForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-[800px] max-w-[90vw] max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-white text-2xl font-bold">
                    #{selectedChannelForDetails.name}
                  </h3>
                  <button className="text-slate-400 hover:text-yellow-400 transition-colors">
                    ⭐
                  </button>
                  <button className="text-slate-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                    <span>🔔</span>
                    <span className="text-sm">Enable Notifications</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowChannelDetails(false);
                    setSelectedChannelForDetails(null);
                    setChannelDetailsTab("about");
                  }}
                  className="text-slate-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex space-x-8 border-b border-slate-700">
                <button
                  onClick={() => setChannelDetailsTab("about")}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    channelDetailsTab === "about"
                      ? "border-white text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setChannelDetailsTab("members")}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    channelDetailsTab === "members"
                      ? "border-white text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Members {channelMembers.length}
                </button>
                <button
                  onClick={() => setChannelDetailsTab("tabs")}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    channelDetailsTab === "tabs"
                      ? "border-white text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Tabs
                </button>
                <button
                  onClick={() => setChannelDetailsTab("integrations")}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    channelDetailsTab === "integrations"
                      ? "border-white text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Integrations
                </button>
                <button
                  onClick={() => setChannelDetailsTab("settings")}
                  className={`pb-2 px-1 border-b-2 transition-colors ${
                    channelDetailsTab === "settings"
                      ? "border-white text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {channelDetailsTab === "about" && (
                <div className="space-y-6">
                  {/* Channel Name */}
                  <div className="bg-slate-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-medium">
                        Channel name
                      </label>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Edit
                      </button>
                    </div>
                    <div className="text-white font-medium">
                      #{selectedChannelForDetails.name}
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="bg-slate-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-medium">
                        Topic
                      </label>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Edit
                      </button>
                    </div>
                    <div className="text-slate-400">Add a topic</div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-medium">
                        Description
                      </label>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Edit
                      </button>
                    </div>
                    <div className="text-white">
                      {selectedChannelForDetails.description ||
                        "This is the one channel that will always include everyone. It's a great spot for announcements and team-wide conversations."}
                    </div>
                    {selectedChannelForDetails.doorNumber && (
                      <div className="mt-2 text-blue-400">
                        🚪 Door {selectedChannelForDetails.doorNumber}
                      </div>
                    )}
                  </div>

                  {/* Created by */}
                  <div className="bg-slate-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-medium">
                        Created by
                      </label>
                    </div>
                    <div className="text-white">
                      BANJAH MARAH on{" "}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}

              {channelDetailsTab === "members" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">
                      {channelMembers.length} members
                    </h4>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Invite people
                    </button>
                  </div>
                  <div className="space-y-2">
                    {channelMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-slate-750 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {member.name}
                              {member.isCurrentUser && (
                                <span className="ml-2 text-xs text-slate-400">
                                  (you)
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {member.role} • {member.status}
                            </div>
                          </div>
                        </div>
                        {!member.isCurrentUser && (
                          <button className="text-red-400 hover:text-red-300 text-sm">
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {channelDetailsTab === "tabs" && (
                <div className="text-center text-slate-400 py-8">
                  <div className="text-4xl mb-4">📑</div>
                  <p className="text-lg mb-2">No tabs configured</p>
                  <p className="text-sm">
                    Add tabs to organize channel content
                  </p>
                </div>
              )}

              {channelDetailsTab === "integrations" && (
                <div className="text-center text-slate-400 py-8">
                  <div className="text-4xl mb-4">🔗</div>
                  <p className="text-lg mb-2">No integrations</p>
                  <p className="text-sm">
                    Connect external services to this channel
                  </p>
                </div>
              )}

              {channelDetailsTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-slate-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-medium">
                        Channel visibility
                      </label>
                    </div>
                    <div className="text-white">
                      {selectedChannelForDetails.visibility === "private"
                        ? "Private"
                        : "Public"}
                    </div>
                  </div>

                  <div className="bg-slate-750 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-medium">
                        Default notifications
                      </label>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Edit
                      </button>
                    </div>
                    <div className="text-white">All messages</div>
                  </div>

                  <div className="bg-red-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white text-sm font-medium">
                        Danger Zone
                      </label>
                    </div>
                    <div className="text-white text-sm mb-3">
                      Permanently delete this channel and all its messages
                    </div>
                    <button
                      onClick={() => {
                        setChannelToDelete(selectedChannelForDetails);
                        setShowDeleteChannelModal(true);
                        setShowChannelDetails(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Delete Channel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Channel Confirmation Modal */}
      {showDeleteChannelModal && (
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
                  setShowDeleteChannelModal(false);
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

      {/* Delete DM Confirmation Modal */}
      {showDeleteDMModal && (
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
                  setShowDeleteDMModal(false);
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

      {/* Mobile Navigation moved to layout to be consistent across routes */}

      {/* Mobile Slide-over Menu */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="w-4/5 max-w-sm h-full bg-slate-800 border-l border-slate-700 shadow-xl flex flex-col">
            <div className="h-12 flex items-center justify-between px-3 border-b border-slate-700">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-slate-300 hover:text-white"
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <button
                onClick={() => {
                  setShowGlobalSearch(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">🔍</span>
                <span>Search</span>
              </button>
              <div className="border-t border-slate-700 my-2" />
              <button className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg">
                <span className="text-lg">👥</span>
                <span>Add users</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg">
                <span className="text-lg">📧</span>
                <span>Invite users</span>
              </button>
              <div className="border-t border-slate-700 my-2" />
              <button className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg">
                <span className="text-lg">📊</span>
                <span>Channel analytics</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg">
                <span className="text-lg">🔧</span>
                <span>Channel settings</span>
              </button>
              <div className="border-t border-slate-700 my-2" />
              <button className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-700 rounded-lg">
                <span className="text-lg">🚪</span>
                <span>Leave channel</span>
              </button>
              <div className="border-t border-slate-700 my-2" />
              <Link
                href="/documents"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">📁</span>
                <span>Documents</span>
              </Link>
              <Link
                href="/activity"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-lg">🔔</span>
                <span>Activity</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
