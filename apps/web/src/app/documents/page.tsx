"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SignaturePad from "@/components/signature-pad";
import DraggableSignature from "@/components/draggable-signature";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  uploadedBy?: string;
  status?: "pending" | "signed" | "expired";
  category?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Delivery Schedule.pdf",
      type: "pdf",
      size: "2.3 MB",
      date: "2024-01-15",
      uploadedBy: "Alice Johnson",
      status: "signed",
      category: "Schedules",
    },
    {
      id: "2",
      name: "Maintenance Log.xlsx",
      type: "document",
      size: "1.1 MB",
      date: "2024-01-14",
      uploadedBy: "Bob Smith",
      status: "pending",
      category: "Maintenance",
    },
    {
      id: "3",
      name: "Safety Guidelines.pdf",
      type: "pdf",
      size: "3.2 MB",
      date: "2024-01-13",
      uploadedBy: "Charlie Brown",
      status: "signed",
      category: "Safety",
    },
    {
      id: "4",
      name: "Route Optimization.xlsx",
      type: "document",
      size: "0.8 MB",
      date: "2024-01-12",
      uploadedBy: "Alice Johnson",
      status: "expired",
      category: "Routes",
    },
    {
      id: "5",
      name: "Vehicle Inspection Report.pdf",
      type: "pdf",
      size: "1.5 MB",
      date: "2024-01-11",
      uploadedBy: "Mike Mechanic",
      status: "signed",
      category: "Inspections",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Signature states
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const categories = [
    "all",
    "Schedules",
    "Maintenance",
    "Safety",
    "Routes",
    "Inspections",
  ];
  const statuses = ["all", "pending", "signed", "expired"];

  const filteredDocuments = documents
    .filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || doc.category === selectedCategory) &&
        (selectedStatus === "all" || doc.status === selectedStatus)
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "size":
          comparison = parseFloat(a.size) - parseFloat(b.size);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSignDocument = (documentId: string) => {
    setCurrentDocumentId(documentId);
    setShowSignaturePad(true);
  };

  const handleSignatureSave = (signatureDataUrl: string) => {
    if (currentDocumentId) {
      setSignatures((prev) => ({
        ...prev,
        [currentDocumentId]: signatureDataUrl,
      }));

      // Update document status to signed
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === currentDocumentId
            ? { ...doc, status: "signed" as const }
            : doc
        )
      );
    }
    setShowSignaturePad(false);
    setCurrentDocumentId(null);
  };

  const handleSignatureCancel = () => {
    setShowSignaturePad(false);
    setCurrentDocumentId(null);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleRemoveSignature = (documentId: string) => {
    setSignatures((prev) => {
      const newSignatures = { ...prev };
      delete newSignatures[documentId];
      return newSignatures;
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "document":
        return "📝";
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      default:
        return "📁";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Header */}
      <div className="hidden lg:block bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold">Documents</h1>
              <p className="text-slate-400 mt-1">
                Manage and view all your documents
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 pt-16">
        <h1 className="text-xl font-bold text-center">Documents ({filteredDocuments.length})</h1>
      </div>

      {/* Filters and Search */}
      <div className="p-4 md:p-6 border-b border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Search Documents
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 transition-colors"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Documents ({filteredDocuments.length})
          </h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            + Upload Document
          </button>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">No documents found</h3>
            <p className="text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 md:p-4 hover:border-slate-600 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{getFileIcon(doc.type)}</div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        doc.status || ""
                      )}`}
                    ></span>
                    <span className="text-xs text-slate-400 capitalize">
                      {doc.status || "unknown"}
                    </span>
                  </div>
                </div>

                <h3
                  className="font-semibold text-white mb-1 truncate"
                  title={doc.name}
                >
                  {doc.name}
                </h3>

                <div className="space-y-1 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{doc.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{doc.category}</span>
                  </div>
                  {doc.uploadedBy && (
                    <div className="flex justify-between">
                      <span>By:</span>
                      <span className="truncate ml-2">{doc.uploadedBy}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleViewDocument(doc)}
                    className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    View
                  </button>
                  <button className="flex-1 px-3 py-1 bg-slate-600 text-white rounded text-sm hover:bg-slate-500 transition-colors">
                    Download
                  </button>
                  {doc.status === "pending" && (
                    <button
                      onClick={() => handleSignDocument(doc.id)}
                      className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      Sign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePad
          onSave={handleSignatureSave}
          onCancel={handleSignatureCancel}
        />
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90vw] h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">
                {selectedDocument.name}
              </h3>
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div
              className="flex-1 relative bg-gray-100 rounded border overflow-hidden"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.backgroundColor = "#e5e7eb";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.backgroundColor = "#f3f4f6";

                try {
                  const signatureData = e.dataTransfer.getData("text/plain");
                  if (signatureData) {
                    const signature = JSON.parse(signatureData);
                    setSignatures((prev) => ({
                      ...prev,
                      [selectedDocument.id]: signature.dataUrl,
                    }));

                    // Update document status to signed
                    setDocuments((prev) =>
                      prev.map((doc) =>
                        doc.id === selectedDocument.id
                          ? { ...doc, status: "signed" as const }
                          : doc
                      )
                    );
                  }
                } catch (error) {
                  console.log("No signature data dropped");
                }
              }}
            >
              {/* Document Preview Area */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg">Document Preview</p>
                  <p className="text-sm">
                    This would show the actual document content
                  </p>
                  <p className="text-sm text-blue-500 mt-2">
                    Drop signatures here from the E-Signature section
                  </p>
                </div>
              </div>

              {/* Draggable Signatures */}
              {signatures[selectedDocument.id] && (
                <DraggableSignature
                  signatureDataUrl={signatures[selectedDocument.id]}
                  onRemove={() => handleRemoveSignature(selectedDocument.id)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal Placeholder */}
      <div className="fixed inset-0 bg-black bg-opacity-50 hidden">
        <div className="bg-slate-800 p-6 rounded-lg w-96">
          <h3 className="text-white text-lg font-semibold mb-4">
            Upload Document
          </h3>
          {/* Upload form would go here */}
        </div>
      </div>
    </div>
  );
}
