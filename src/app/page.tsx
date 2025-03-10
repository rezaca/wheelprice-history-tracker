"use client";

import { wheels } from "@/lib/mock-data";
import { WheelGrid } from "@/components/price-history/wheel-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl text-white">
            Wheel<span className="font-bold">Price</span> History
          </h1>
        </header>

        <WheelGrid wheels={wheels} />
      </div>
    </div>
  );
}
