"use client";

import { generateMockPriceHistory } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface SalesHistoryProps {
  wheelId: string;
}

interface Sale {
  date: string;
  price: number;
  condition: string;
  seller: string;
}

function generateMockSales(wheelId: string): Sale[] {
  const priceHistory = generateMockPriceHistory(wheelId, "1m");
  
  // Generate 10 mock sales with random conditions and sellers
  return priceHistory.pricePoints.slice(0, 10).map(point => ({
    date: point.date,
    price: point.price,
    condition: ["New", "Like New", "Used - Excellent", "Used - Good"][Math.floor(Math.random() * 4)],
    seller: ["WheelDirect", "TireRack", "Fitment Industries", "Wheel Warehouse"][Math.floor(Math.random() * 4)],
  }));
}

export function SalesHistory({ wheelId }: SalesHistoryProps) {
  const sales = generateMockSales(wheelId);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg text-white mb-4">Recent Sales</h3>
      
      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400">Condition</TableHead>
              <TableHead className="text-gray-400">Seller</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow key={index} className="border-gray-800 hover:bg-gray-800/50">
                <TableCell className="text-gray-300">{format(new Date(sale.date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-gray-300">${Math.round(sale.price)}</TableCell>
                <TableCell className="text-gray-300">{sale.condition}</TableCell>
                <TableCell className="text-gray-300">{sale.seller}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 