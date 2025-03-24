"use client";

import { useState } from "react";
import { Wheel } from "@/lib/mock-data";
import { TimeRangeSelector, TimeRange } from "./time-range-selector";
import { PriceHistoryChart } from "./price-history-chart";
import { PriceStatistics } from "./price-statistics";
import { SalesHistory } from "./sales-history";
import { usePriceHistory } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";

interface PriceHistoryCardProps {
  wheel: Wheel;
}

export function PriceHistoryCard({ wheel }: PriceHistoryCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");
  const { data: priceHistory, loading, error } = usePriceHistory(wheel.id, timeRange);
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{wheel.name}</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              {wheel.brand} {wheel.model} {wheel.finish && `- ${wheel.finish}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {loading ? "Loading..." : formatPrice(priceHistory?.averagePrice || wheel.currentPrice)}
            </div>
            <p className="text-xs sm:text-sm text-gray-500">Average Sales Price</p>
          </div>
        </div>
        
        <div>
          <div className="flex flex-col">
            <div className="flex items-center justify-end">
              <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
            </div>
            
            <div className="mt-6 relative">
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-400">Loading price history...</p>
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-red-400">Error loading price history</p>
                </div>
              ) : priceHistory && priceHistory.pricePoints.length > 0 ? (
                <PriceHistoryChart priceHistory={priceHistory} />
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-400">No price history available</p>
                </div>
              )}
            </div>
          </div>
          
          {priceHistory && !loading && (
            <>
              <PriceStatistics priceHistory={priceHistory} />
              
              <div className="mt-8 mb-4">
                <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">Recent Sales</h2>
                <SalesHistory wheelId={wheel.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 