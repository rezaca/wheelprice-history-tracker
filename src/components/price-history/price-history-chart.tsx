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
    
    // Find and remove the "Latest Sale Price" text if it exists
    // This removes any dynamic text added by Chart.js or other libraries
    const removeLatestSalePrice = () => {
      const latestSalePriceElements = document.querySelectorAll('div.text-sm.text-gray-500.absolute.top-0.left-0');
      latestSalePriceElements.forEach(el => {
        if (el.textContent?.includes('Latest Sale Price')) {
          el.remove();
        }
      });
    };
    
    // Run once on initial render
    removeLatestSalePrice();
    
    // Set up a MutationObserver to catch any dynamically added elements
    const observer = new MutationObserver(() => {
      removeLatestSalePrice();
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-[250px] sm:h-[300px] w-full">
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