"use client";

import { Wheel } from "@/lib/mock-data";
import { WheelCard } from "./wheel-card";

interface WheelGridProps {
  wheels: Wheel[];
  className?: string;
}

export function WheelGrid({ wheels, className }: WheelGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {wheels.map((wheel) => (
        <WheelCard key={wheel.id} wheel={wheel} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow" />
      ))}
    </div>
  );
} 