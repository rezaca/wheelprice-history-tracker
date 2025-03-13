"use client";

import { Wheel } from "@/lib/mock-data";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface WheelTickerProps {
  wheels: Wheel[];
}

// Extended interface for wheels with price change information
interface WheelWithPriceChange extends Wheel {
  changePercent: string;
  isPositive: boolean;
}

export function WheelTicker({ wheels }: WheelTickerProps) {
  const [tickerItems, setTickerItems] = useState<WheelWithPriceChange[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Prepare ticker items with price changes
  useEffect(() => {
    // Create a copy of wheels with random price changes
    const itemsWithChanges = wheels.map(wheel => {
      const changePercent = (Math.random() * 10 - 5).toFixed(2); // Random between -5% and +5%
      const isPositive = parseFloat(changePercent) >= 0;
      return {
        ...wheel,
        changePercent,
        isPositive
      } as WheelWithPriceChange;
    });
    
    // Duplicate the array to ensure continuous scrolling
    setTickerItems([...itemsWithChanges, ...itemsWithChanges]);
  }, [wheels]);

  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden mb-8">
      <div className="py-2 px-4 bg-gray-200 border-b border-gray-300 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Market Trends</h3>
        <span className="text-xs text-gray-500">Live Updates</span>
      </div>
      
      <div className="relative overflow-hidden" style={{ height: '40px' }}>
        <div 
          ref={containerRef}
          className="whitespace-nowrap animate-marquee flex items-center"
          style={{ 
            animationDuration: '60s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        >
          {tickerItems.map((wheel, index) => (
            <Link 
              href={`/wheels/${wheel.id}`} 
              key={`${wheel.id}-${index}`}
              className="inline-flex items-center mx-4 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
            >
              <span className="font-medium text-gray-900 mr-2">{wheel.brand} {wheel.model}</span>
              <span className="text-sm mr-1">${wheel.currentPrice}</span>
              <span 
                className={`text-xs ${wheel.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {wheel.isPositive ? '▲' : '▼'} {wheel.changePercent}%
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 