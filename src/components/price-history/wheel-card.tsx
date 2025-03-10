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
      <Card className={`overflow-hidden transition-all hover:bg-gray-800 p-4 ${className}`}>
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-gray-400">{brand}</div>
          <h3 className="text-base text-white">{name}</h3>
          
          <div className="mt-4 flex flex-col">
            <span className="text-xs text-gray-400">Trending at</span>
            <span className="text-lg text-white">${currentPrice}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded-full">{size}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 