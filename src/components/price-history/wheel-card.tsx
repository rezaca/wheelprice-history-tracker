"use client";

import Link from "next/link";
import { Wheel } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";

interface WheelCardProps {
  wheel: Wheel;
  className?: string;
}

export function WheelCard({ wheel, className }: WheelCardProps) {
  const { id, name, brand, size, currentPrice } = wheel;

  return (
    <Link href={`/wheels/${id}`} className="block">
      <Card className={`overflow-hidden transition-all hover:shadow-lg p-4 ${className}`}>
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500 font-medium">{brand}</div>
          <h3 className="text-base text-gray-900 font-semibold">{name}</h3>
          
          <div className="mt-4 flex flex-col">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">${currentPrice}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">{size}</div>
            {wheel.finish && (
              <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">{wheel.finish}</div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
} 