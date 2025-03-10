"use client";

import { useState } from "react";
import { Wheel } from "@/lib/mock-data";
import { generateMockPriceHistory } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PriceHistoryChart } from "./price-history-chart";
import { TimeRangeSelector, TimeRange } from "./time-range-selector";
import { SalesHistory } from "./sales-history";

interface PriceHistoryCardProps {
  wheel: Wheel;
  className?: string;
}

export function PriceHistoryCard({ wheel, className }: PriceHistoryCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");
  const [showSales, setShowSales] = useState(false);
  const priceHistory = generateMockPriceHistory(wheel.id, timeRange);

  return (
    <div className="space-y-4">
      <Card className={`w-full bg-gray-900 border-gray-800 ${className}`}>
        <CardHeader>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">{wheel.name}</div>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white text-xl">Price History</CardTitle>
              <button 
                onClick={() => setShowSales(!showSales)}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                View Sales →
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <TimeRangeSelector
            selectedRange={timeRange}
            onRangeChange={setTimeRange}
          />
          
          <div className="mt-4">
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-sm text-gray-400">Latest Sale Price</div>
              <div className="text-2xl font-medium text-white">${Math.round(priceHistory.pricePoints[priceHistory.pricePoints.length - 1].price)}</div>
            </div>
            <PriceHistoryChart priceHistory={priceHistory} />
          </div>

          <div>
            <h3 className="text-lg text-white mb-4">12-Month Historical</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl text-white font-medium mb-1">
                  ${Math.round(priceHistory.lowestPrice)} - ${Math.round(priceHistory.highestPrice)}
                </div>
                <div className="text-sm text-gray-400">12-Month Trade Range</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl text-white font-medium mb-1">
                  ${Math.round(priceHistory.averagePrice)}
                </div>
                <div className="text-sm text-gray-400">Average Sale Price</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl text-white font-medium mb-1">
                  ${Math.round(priceHistory.lowestPrice)}
                </div>
                <div className="text-sm text-gray-400">Lowest Sale Price</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSales && <SalesHistory wheelId={wheel.id} />}
    </div>
  );
} 