import { NextRequest, NextResponse } from "next/server";
import { generateMockPriceHistory } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const timeRange = request.nextUrl.searchParams.get("timeRange") || "6m";
  const priceHistory = generateMockPriceHistory(params.id, timeRange);
  
  return NextResponse.json(priceHistory);
} 