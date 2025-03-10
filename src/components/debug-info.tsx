"use client";

import { useEffect, useState } from "react";

export function DebugInfo() {
  const [info, setInfo] = useState<{
    isClient: boolean;
    windowDefined: boolean;
    canvasSupported: boolean;
    userAgent: string;
  }>({
    isClient: false,
    windowDefined: false,
    canvasSupported: false,
    userAgent: "",
  });

  useEffect(() => {
    // Check if we're on the client
    const windowDefined = typeof window !== "undefined";
    
    // Check if canvas is supported
    let canvasSupported = false;
    if (windowDefined) {
      try {
        const canvas = document.createElement("canvas");
        canvasSupported = !!canvas.getContext("2d");
      } catch (e) {
        console.error("Canvas check error:", e);
      }
    }

    setInfo({
      isClient: true,
      windowDefined,
      canvasSupported,
      userAgent: windowDefined ? window.navigator.userAgent : "",
    });
  }, []);

  // Only render on client
  if (!info.isClient) return null;

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white text-xs p-2 m-2 rounded z-50 max-w-xs">
      <div>Client: {info.isClient ? "✅" : "❌"}</div>
      <div>Window: {info.windowDefined ? "✅" : "❌"}</div>
      <div>Canvas: {info.canvasSupported ? "✅" : "❌"}</div>
      <div className="truncate">UA: {info.userAgent}</div>
    </div>
  );
} 