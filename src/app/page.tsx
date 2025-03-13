"use client";

import { wheels } from "@/lib/mock-data";
import { WheelGrid } from "@/components/price-history/wheel-grid";
import { WheelTicker } from "@/components/price-history/wheel-ticker";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Only show ticker after component mounts to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl text-gray-900">
            Wheel<span className="font-bold">Price</span> History
          </h1>
        </header>

        {mounted && <WheelTicker wheels={wheels} />}

        <h2 className="text-xl font-medium text-gray-800 mb-4 mt-8">Popular Wheels</h2>
        <WheelGrid wheels={wheels} />
      </div>
    </div>
  );
}
