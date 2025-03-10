"use client";

import { format } from "date-fns";
import { generateMockPriceHistory } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SalesHistoryProps {
  wheelId: string;
}

interface Sale {
  date: Date;
  price: number;
  condition: string;
  seller: string;
}

export function SalesHistory({ wheelId }: SalesHistoryProps) {
  // Generate mock sales data based on price history
  const generateMockSales = (wheelId: string): Sale[] => {
    const priceHistory = generateMockPriceHistory(wheelId, "3m");
    const conditions = ["New", "Like New", "Excellent", "Good", "Fair"];
    const sellers = ["WheelDealz", "TireKingdom", "AutoZone", "PerformancePlus", "WheelWarehouse"];
    
    // Create 10 sales from the last 10 price points
    return priceHistory.pricePoints.slice(-10).map((point) => {
      const date = new Date(point.date);
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
      
      // Add some random variation to the price
      const priceVariation = (Math.random() * 0.1) - 0.05; // -5% to +5%
      const adjustedPrice = point.price * (1 + priceVariation);
      
      return {
        date,
        price: Math.round(adjustedPrice),
        condition: randomCondition,
        seller: randomSeller
      };
    }).reverse(); // Most recent first
  };
  
  const sales = generateMockSales(wheelId);
  
  return (
    <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl text-white mb-4">Recent Sales</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Seller</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale, index) => (
            <TableRow key={index}>
              <TableCell>{format(sale.date, "MMM d, yyyy")}</TableCell>
              <TableCell>${sale.price}</TableCell>
              <TableCell>{sale.condition}</TableCell>
              <TableCell>{sale.seller}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 