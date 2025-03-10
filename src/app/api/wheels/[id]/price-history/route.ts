import { NextRequest, NextResponse } from "next/server";
import { generateMockPriceHistory } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const wheelId = params.id;
  const searchParams = request.nextUrl.searchParams;
  const timeRange = searchParams.get("timeRange") || "6m";
  
  try {
    // In a real app, this would fetch data from a database
    // For now, we'll use our mock data generator
    const priceHistory = generateMockPriceHistory(wheelId, timeRange);
    
    return NextResponse.json(priceHistory);
  } catch (error: unknown) {
    console.error("Error fetching price history:", 
      error instanceof Error ? error.message : "Unknown error");
    
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
} 