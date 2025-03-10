import { NextRequest, NextResponse } from "next/server";
import { generateMockPriceHistory } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const timeRange = request.nextUrl.searchParams.get("timeRange") || "6m";
  
  try {
    const priceHistory = generateMockPriceHistory(id, timeRange);
    return NextResponse.json(priceHistory);
  } catch (error) {
    console.error("Error generating price history:", error);
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
} 