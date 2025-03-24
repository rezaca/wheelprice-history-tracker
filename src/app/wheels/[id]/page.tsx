"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWheels } from "@/lib/mock-data";
import { PriceHistoryCard } from "@/components/price-history/price-history-card";
import { useParams } from "next/navigation";

export default function WheelDetailPage() {
  // Use the useParams hook to get the id
  const params = useParams();
  const id = params?.id as string;
  
  // Look in both regular wheels and the BBS E88 wheel
  const allWheels = getAllWheels();
  const wheel = allWheels.find((w) => w.id === id);
  
  if (!wheel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center">
            ← Back to all wheels
          </Link>
        </div>
        
        <PriceHistoryCard wheel={wheel} />
      </div>
    </div>
  );
} 