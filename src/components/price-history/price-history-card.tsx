"use client";

import { useState } from "react";
import { Wheel } from "@/lib/mock-data";
import { TimeRangeSelector, TimeRange } from "./time-range-selector";
import { PriceHistoryChart } from "./price-history-chart";
import { PriceStatistics } from "./price-statistics";
import { SalesHistory } from "./sales-history";
import { usePriceHistory } from "@/lib/hooks";

interface PriceHistoryCardProps {
  wheel: Wheel;
}

export function PriceHistoryCard({ wheel }: PriceHistoryCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");
  const { data: priceHistory, loading, error } = usePriceHistory(wheel.id, timeRange);
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{wheel.name}</h1>
            <p className="text-gray-500 mt-1">
              {wheel.brand} {wheel.model} {wheel.finish && `- ${wheel.finish}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${loading ? "..." : priceHistory?.averagePrice || wheel.currentPrice}
            </div>
            <p className="text-gray-500 text-sm">Average Sales Price</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-900">Price History</h2>
            <TimeRangeSelector
              selectedRange={timeRange}
              onRangeChange={(range: TimeRange) => setTimeRange(range)}
            />
          </div>

          <div className="h-64 mt-4 mb-8 relative">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-gray-500">Loading price data...</div>
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-red-500">Error loading price data</div>
              </div>
            ) : priceHistory ? (
              <PriceHistoryChart priceHistory={priceHistory} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-gray-500">No price data available</div>
              </div>
            )}
          </div>

          {priceHistory && <PriceStatistics priceHistory={priceHistory} />}

          <div className="mt-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Sales</h2>
            {loading ? (
              <div className="text-gray-500">Loading sales data...</div>
            ) : priceHistory ? (
              <SalesHistory wheelId={wheel.id} />
            ) : (
              <div className="text-gray-500">No sales data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 