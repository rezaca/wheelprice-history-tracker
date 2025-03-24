"use client";

import { useEffect, useState } from "react";
import { Wheel } from "@/lib/mock-data";
import Link from "next/link";

interface WheelTickerProps {
  wheels: Wheel[];
}

export function WheelTicker({ wheels }: WheelTickerProps) {
  const [animate, setAnimate] = useState(false);

  // Start animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Special handling for BBS E88 to show the real auction price
  const getDisplayPrice = (wheel: Wheel) => {
    if (wheel.id === 'bbsE88') {
      return 3450; // The latest auction price from BaT
    }
    return wheel.currentPrice;
  };

  return (
    <div className="bg-gray-100 text-gray-900 rounded-lg overflow-hidden shadow-sm mb-8">
      <div
        className={`flex whitespace-nowrap py-3 ${
          animate ? "animate-marquee" : ""
        }`}
      >
        {[...wheels, ...wheels].map((wheel, index) => (
          <Link
            href={`/wheels/${wheel.id}`}
            key={`${wheel.id}-${index}`}
            className="inline-flex items-center px-4 hover:bg-gray-200 transition-colors"
          >
            <span className="font-medium text-sm">{wheel.name}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm font-bold">
              ${getDisplayPrice(wheel).toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
} 