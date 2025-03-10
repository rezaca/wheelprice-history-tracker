"use client";

import { PriceHistory } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface PriceHistoryChartProps {
  priceHistory: PriceHistory;
}

export function PriceHistoryChart({ priceHistory }: PriceHistoryChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-gray-800/50 rounded">
        <p className="text-gray-400">Loading chart...</p>
      </div>
    );
  }

  // Find min and max prices for scaling
  const prices = priceHistory.pricePoints.map(point => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  
  // Add 10% padding to the top and bottom
  const paddedMin = Math.max(0, minPrice - priceRange * 0.1);
  const paddedMax = maxPrice + priceRange * 0.1;
  const adjustedRange = paddedMax - paddedMin;

  // Calculate points for the SVG path
  const points = priceHistory.pricePoints.map((point, index) => {
    const x = (index / (priceHistory.pricePoints.length - 1)) * 100;
    const y = 100 - ((point.price - paddedMin) / adjustedRange) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Create the SVG path
  const path = `M ${points}`;

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const timeRange = priceHistory.pricePoints.length > 90 ? 'MMM yyyy' : 'MMM d';
    return format(date, timeRange);
  };

  // Select a subset of dates to display as labels
  const numLabels = 6;
  const labelIndices = Array.from({ length: numLabels }, (_, i) => 
    Math.floor(i * (priceHistory.pricePoints.length - 1) / (numLabels - 1))
  );

  return (
    <div className="h-[300px] w-full">
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line 
            key={`grid-${y}`}
            x1="0" 
            y1={y} 
            x2="100" 
            y2={y} 
            stroke="#374151" 
            strokeWidth="0.2"
          />
        ))}
        
        {/* Price labels */}
        {[0, 25, 50, 75, 100].map(y => {
          const price = paddedMax - (y / 100) * adjustedRange;
          return (
            <text 
              key={`price-${y}`}
              x="-5" 
              y={y} 
              fill="#6b7280" 
              fontSize="3" 
              dominantBaseline="middle" 
              textAnchor="end"
            >
              ${Math.round(price)}
            </text>
          );
        })}
        
        {/* Date labels */}
        {labelIndices.map(i => (
          <text 
            key={`date-${i}`}
            x={`${(i / (priceHistory.pricePoints.length - 1)) * 100}`} 
            y="105" 
            fill="#6b7280" 
            fontSize="3" 
            dominantBaseline="hanging" 
            textAnchor="middle"
          >
            {formatDate(priceHistory.pricePoints[i].date)}
          </text>
        ))}
        
        {/* Chart line */}
        <path 
          d={path} 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Data points (hidden but shown on hover) */}
        {priceHistory.pricePoints.map((point, i) => {
          const x = (i / (priceHistory.pricePoints.length - 1)) * 100;
          const y = 100 - ((point.price - paddedMin) / adjustedRange) * 100;
          return (
            <g key={`point-${i}`} className="opacity-0 hover:opacity-100">
              <circle 
                cx={x} 
                cy={y} 
                r="1" 
                fill="#fff" 
                stroke="#10b981" 
                strokeWidth="0.5"
              />
              <title>${Math.round(point.price)} - {format(new Date(point.date), 'MMM d, yyyy')}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
} 