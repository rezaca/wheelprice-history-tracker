import { PriceHistory } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

interface PriceStatisticsProps {
  priceHistory: PriceHistory;
  className?: string;
}

export function PriceStatistics({ priceHistory, className }: PriceStatisticsProps) {
  const { lowestPrice, highestPrice, averagePrice } = priceHistory;
  
  // Find the current price (last price point)
  const currentPrice = priceHistory.pricePoints[priceHistory.pricePoints.length - 1].price;
  
  // Calculate percentage differences
  const lowestDiff = ((currentPrice - lowestPrice) / lowestPrice) * 100;
  const highestDiff = ((currentPrice - highestPrice) / highestPrice) * 100;
  const avgDiff = ((currentPrice - averagePrice) / averagePrice) * 100;

  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        <span className="text-sm text-gray-500 dark:text-gray-400">Lowest</span>
        <span className="text-lg font-semibold">{formatPrice(lowestPrice)}</span>
        <span className={`text-xs ${lowestDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {lowestDiff >= 0 ? '+' : ''}{lowestDiff.toFixed(1)}%
        </span>
      </div>
      
      <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        <span className="text-sm text-gray-500 dark:text-gray-400">Average</span>
        <span className="text-lg font-semibold">{formatPrice(averagePrice)}</span>
        <span className={`text-xs ${avgDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {avgDiff >= 0 ? '+' : ''}{avgDiff.toFixed(1)}%
        </span>
      </div>
      
      <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        <span className="text-sm text-gray-500 dark:text-gray-400">Highest</span>
        <span className="text-lg font-semibold">{formatPrice(highestPrice)}</span>
        <span className={`text-xs ${highestDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {highestDiff >= 0 ? '+' : ''}{highestDiff.toFixed(1)}%
        </span>
      </div>
    </div>
  );
} 