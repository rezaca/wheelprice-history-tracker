import { PriceHistory } from "@/lib/mock-data";

interface MarketPositionIndicatorProps {
  priceHistory: PriceHistory;
  className?: string;
}

export function MarketPositionIndicator({ priceHistory, className }: MarketPositionIndicatorProps) {
  const { lowestPrice, highestPrice } = priceHistory;
  
  // Find the current price (last price point)
  const currentPrice = priceHistory.pricePoints[priceHistory.pricePoints.length - 1].price;
  
  // Calculate where the current price falls in the range
  const priceRange = highestPrice - lowestPrice;
  const positionPercentage = priceRange > 0 
    ? ((currentPrice - lowestPrice) / priceRange) * 100 
    : 50;
  
  // Determine the market position
  let marketPosition: "excellent" | "good" | "fair" | "high" = "fair";
  let marketPositionText: string;
  
  if (positionPercentage <= 25) {
    marketPosition = "excellent";
    marketPositionText = "Excellent Deal";
  } else if (positionPercentage <= 50) {
    marketPosition = "good";
    marketPositionText = "Good Deal";
  } else if (positionPercentage <= 75) {
    marketPosition = "fair";
    marketPositionText = "Fair Price";
  } else {
    marketPosition = "high";
    marketPositionText = "Above Market";
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Market Position</span>
        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
          marketPosition === "excellent" ? "bg-green-100 text-green-800" :
          marketPosition === "good" ? "bg-green-50 text-green-600" :
          marketPosition === "fair" ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {marketPositionText}
        </span>
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full flex">
          <div className="h-full bg-green-500" style={{ width: "25%" }}></div>
          <div className="h-full bg-green-300" style={{ width: "25%" }}></div>
          <div className="h-full bg-yellow-300" style={{ width: "25%" }}></div>
          <div className="h-full bg-red-300" style={{ width: "25%" }}></div>
        </div>
      </div>
      
      <div className="relative h-6 mt-1">
        <div 
          className="absolute top-0 transform -translate-x-1/2"
          style={{ left: `${positionPercentage}%` }}
        >
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="text-xs font-medium text-center mt-1">Current</div>
        </div>
      </div>
    </div>
  );
} 