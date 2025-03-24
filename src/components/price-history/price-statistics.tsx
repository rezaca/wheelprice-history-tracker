import { PriceHistory } from "@/lib/mock-data";

interface PriceStatisticsProps {
  priceHistory: PriceHistory;
  className?: string;
}

export function PriceStatistics({ priceHistory, className }: PriceStatisticsProps) {
  const { lowestPrice, highestPrice, averagePrice } = priceHistory;

  return (
    <div className={`${className} space-y-4`}>
      <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">12-Month Historical</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 rounded-lg p-5 border border-gray-200">
          <div className="text-xl md:text-2xl font-semibold text-gray-900">
            ${lowestPrice} - ${highestPrice}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            12-Month Trade Range
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-5 border border-gray-200">
          <div className="text-xl md:text-2xl font-semibold text-gray-900">
            ${averagePrice}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Average Sale Price
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-5 border border-gray-200">
          <div className="text-xl md:text-2xl font-semibold text-gray-900">
            ${lowestPrice}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Lowest Sale Price
          </div>
        </div>
      </div>
    </div>
  );
} 