import { PriceHistory } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

interface PriceStatisticsProps {
  priceHistory: PriceHistory;
  className?: string;
}

export function PriceStatistics({ priceHistory, className }: PriceStatisticsProps) {
  const { lowestPrice, highestPrice, averagePrice } = priceHistory;

  return (
    <div className={`${className} space-y-2 sm:space-y-4`}>
      <h2 className="text-lg sm:text-xl font-medium text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">12-Month Historical</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-gray-100 rounded-lg p-3 sm:p-5 border border-gray-200">
          <div className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900">
            {formatPrice(lowestPrice)} - {formatPrice(highestPrice)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">
            12-Month Trade Range
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-3 sm:p-5 border border-gray-200">
          <div className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900">
            {formatPrice(averagePrice)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">
            Average Sale Price
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-3 sm:p-5 border border-gray-200">
          <div className="text-base sm:text-xl md:text-2xl font-semibold text-gray-900">
            {formatPrice(lowestPrice)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">
            Lowest Sale Price
          </div>
        </div>
      </div>
    </div>
  );
} 