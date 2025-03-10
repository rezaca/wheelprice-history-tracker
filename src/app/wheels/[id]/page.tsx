"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { wheels } from "@/lib/mock-data";
import { PriceHistoryCard } from "@/components/price-history/price-history-card";
import { useParams } from "next/navigation";

export default function WheelDetailPage() {
  // Use the useParams hook to get the id
  const params = useParams();
  const id = params?.id as string;
  
  const wheel = wheels.find((w) => w.id === id);
  
  if (!wheel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center">
            ← Back to all wheels
          </Link>
        </div>
        
        <PriceHistoryCard wheel={wheel} />
      </div>
    </div>
  );
} 