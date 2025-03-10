"use client";

import { useState } from "react";
import Link from "next/link";
import { Wheel } from "@/lib/mock-data";
import { generateMockPriceHistory } from "@/lib/mock-data";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PriceHistoryChart } from "./price-history-chart";
import { TimeRange } from "./time-range-selector";

interface PriceHistoryMiniWidgetProps {
  wheelId: string;
  className?: string;
}

export function PriceHistoryMiniWidget({ wheelId, className }: PriceHistoryMiniWidgetProps) {
  const [timeRange] = useState<TimeRange>("6m");
  
  // Find the wheel by ID from the mock data
  const wheel = {
    id: wheelId,
    name: "Loading...",
    brand: "",
    model: "",
    size: "",
    finish: "",
    currentPrice: 0,
    retailPrice: 0,
    imageUrl: "",
    description: ""
  } as Wheel;
  
  // Generate price history data
  const priceHistory = generateMockPriceHistory(wheelId, timeRange);
  
  // Calculate discount percentage
  const discountPercentage = calculateDiscountPercentage(wheel.retailPrice, wheel.currentPrice);
  const isOnSale = discountPercentage > 0;
  
  // Get current price from price history
  const currentPrice = priceHistory.pricePoints[priceHistory.pricePoints.length - 1].price;
  
  // Calculate price change percentage
  const firstPrice = priceHistory.pricePoints[0].price;
  const priceChangePercentage = ((currentPrice - firstPrice) / firstPrice) * 100;
  const isPriceUp = priceChangePercentage >= 0;

  return (
    <Card className={`w-full max-w-md overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">Price History: {wheel.name}</h3>
          <Link href={`/wheels/${wheelId}`} className="text-xs text-blue-600 hover:underline">
            View Details
          </Link>
        </div>
        
        <div className="h-32 mb-2">
          <PriceHistoryChart priceHistory={priceHistory} />
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="font-medium">Current: </span>
            <span className="font-bold">{formatPrice(currentPrice)}</span>
            {isOnSale && (
              <span className="ml-1 text-green-600">
                ({discountPercentage}% off)
              </span>
            )}
          </div>
          
          <div className={isPriceUp ? "text-red-600" : "text-green-600"}>
            {isPriceUp ? "+" : ""}{priceChangePercentage.toFixed(1)}% in {timeRange}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 