"use client";

import { wheels, getAllWheels } from "@/lib/mock-data";
import { WheelGrid } from "@/components/price-history/wheel-grid";
import { WheelTicker } from "@/components/price-history/wheel-ticker";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { bbsE88Wheel } from "@/lib/scraper";
import { usePriceHistory } from "@/lib/hooks";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const allWheels = getAllWheels();
  
  // Fetch real data for BBS E88
  const { data: bbsE88Data, loading } = usePriceHistory(bbsE88Wheel.id);
  
  // Format current date for the "Latest Sale" display
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(currentDate);
  
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

        {mounted && <WheelTicker wheels={allWheels} />}

        {/* Featured wheel with real data */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-800">Featured: BBS E88 Sale History</h2>
            <Link href={`/wheels/${bbsE88Wheel.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
              View Full History →
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-gray-800">
            <div className="relative w-full md:w-48 h-48 overflow-hidden rounded-lg">
              <Image 
                src="/bbse88.jpg" 
                alt="BBS E88 Wheels" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 192px"
                className="rounded-lg"
                priority
              />
            </div>
            <div className="flex-1">
              <p className="mb-4">{bbsE88Wheel.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Average Sale Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "Loading..." : `$${bbsE88Data?.averagePrice.toLocaleString()}`}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Highest Sale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "Loading..." : `$${bbsE88Data?.highestPrice.toLocaleString()}`}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Latest Sale ({formattedDate})</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "Loading..." : `$${bbsE88Data?.pricePoints[0]?.price.toLocaleString() ?? bbsE88Wheel.currentPrice.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-medium text-gray-800 mb-4 mt-8">Other Popular Wheels</h2>
        <WheelGrid wheels={wheels} />
      </div>
    </div>
  );
}
