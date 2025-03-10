"use client";

import { PriceHistory } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Chart.js components with no SSR
const ChartComponent = dynamic<{ priceHistory: PriceHistory }>(
  () => import('./chart-component'),
  { ssr: false }
);

interface PriceHistoryChartProps {
  priceHistory: PriceHistory;
}

export function PriceHistoryChart({ priceHistory }: PriceHistoryChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-[300px] w-full">
      {isClient ? (
        <ChartComponent priceHistory={priceHistory} />
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-gray-800/50 rounded">
          <p className="text-gray-400">Loading chart...</p>
        </div>
      )}
    </div>
  );
} 