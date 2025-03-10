"use client";

import { format } from "date-fns";
import { generateMockPriceHistory } from "@/lib/mock-data";

interface SalesHistoryProps {
  wheelId: string;
}

interface Sale {
  date: Date;
  price: number;
  condition: string;
  seller: string;
}

// Helper function to create a deterministic hash from a string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Seeded random number generator (0-1)
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function SalesHistory({ wheelId }: SalesHistoryProps) {
  // Generate mock sales data based on price history
  const generateMockSales = (wheelId: string): Sale[] => {
    const priceHistory = generateMockPriceHistory(wheelId, "3m");
    const conditions = ["New", "Like New", "Excellent", "Good", "Fair"];
    const sellers = ["WheelDealz", "TireKingdom", "AutoZone", "PerformancePlus", "WheelWarehouse"];
    
    // Create 10 sales from the last 10 price points
    return priceHistory.pricePoints.slice(-10).map((point, index) => {
      const date = new Date(point.date);
      
      // Use deterministic selection based on wheelId and index
      const seed = hashCode(wheelId + index.toString());
      const conditionIndex = Math.floor(seededRandom(seed) * conditions.length);
      const sellerIndex = Math.floor(seededRandom(seed + 1) * sellers.length);
      
      // Add some deterministic variation to the price
      const priceVariation = (seededRandom(seed + 2) * 0.1) - 0.05; // -5% to +5%
      const adjustedPrice = point.price * (1 + priceVariation);
      
      return {
        date,
        price: Math.round(adjustedPrice),
        condition: conditions[conditionIndex],
        seller: sellers[sellerIndex]
      };
    }).reverse(); // Most recent first
  };
  
  const sales = generateMockSales(wheelId);
  
  return (
    <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl text-white mb-4">Recent Sales</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400">Date</th>
              <th className="text-left p-3 text-gray-400">Price</th>
              <th className="text-left p-3 text-gray-400">Condition</th>
              <th className="text-left p-3 text-gray-400">Seller</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-3 text-gray-300">{format(sale.date, "MMM d, yyyy")}</td>
                <td className="p-3 text-gray-300">${sale.price}</td>
                <td className="p-3 text-gray-300">{sale.condition}</td>
                <td className="p-3 text-gray-300">{sale.seller}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 