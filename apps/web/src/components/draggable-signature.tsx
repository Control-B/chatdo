"use client";

import { useState, useRef, useEffect } from "react";

interface DraggableSignatureProps {
  signatureDataUrl: string;
  onRemove: () => void;
}

export default function DraggableSignature({
  signatureDataUrl,
  onRemove,
}: DraggableSignatureProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const signatureRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!signatureRef.current) return;

    const rect = signatureRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={signatureRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: 1000,
        userSelect: "none",
        backgroundColor: "transparent",
      }}
      onMouseDown={handleMouseDown}
      className="group"
    >
      <div className="relative bg-transparent">
        <img
          src={signatureDataUrl}
          alt="Signature"
          className="max-w-[200px] max-h-[100px] object-contain bg-transparent"
          draggable={false}
          style={{ backgroundColor: "transparent" }}
        />
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}
