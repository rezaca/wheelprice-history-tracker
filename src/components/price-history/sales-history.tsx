"use client";

import { format, parseISO } from "date-fns";
import { usePriceHistory } from "@/lib/hooks";
import { AuctionResult } from "@/lib/types";
import { useState, useEffect } from "react";
import axios from "axios";

interface SalesHistoryProps {
  wheelId: string;
}

export function SalesHistory({ wheelId }: SalesHistoryProps) {
  const [auctionResults, setAuctionResults] = useState<AuctionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: priceHistory, loading: priceHistoryLoading } = usePriceHistory(wheelId);
  
  // Fetch detailed auction results for wheels with real data
  useEffect(() => {
    async function fetchAuctionData() {
      // Only fetch for wheels with dedicated API endpoints
      if (wheelId !== 'bbsE88' && wheelId !== 'bbsRS') return;
      
      try {
        const endpoint = wheelId === 'bbsE88' ? '/api/wheels/bbs-e88' : '/api/wheels/bbs-rs';
        const response = await axios.get(endpoint);
        if (response.data.success) {
          setAuctionResults(response.data.data.results);
        }
      } catch (error) {
        console.error(`Error fetching auction results for ${wheelId}:`, error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAuctionData();
  }, [wheelId]);
  
  if (loading || priceHistoryLoading) {
    return <div className="text-gray-500">Loading sales data...</div>;
  }

  if (!priceHistory) {
    return <div className="text-gray-500">No sales data available</div>;
  }

  // For wheels with detailed auction data, display it
  if (wheelId === 'bbsE88' || wheelId === 'bbsRS') {
    // Get top 5 most recent auctions
    const recentAuctions = [...auctionResults]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    // If no auction results from the API, fallback to using priceHistory
    const displayAuctions = recentAuctions.length > 0 
      ? recentAuctions 
      : priceHistory.pricePoints.slice(0, 5).map(point => ({
          date: point.date,
          title: `${wheelId === 'bbsE88' ? 'BBS E88' : 'BBS RS'} Wheels (Sold: ${format(parseISO(point.date), 'MMM d, yyyy')})`,
          price: point.price,
          link: undefined // Add link property with undefined value
        }));

    return (
      <div className="space-y-4">
        {displayAuctions.map((auction, index) => {
          // Keep titles without excessive processing
          // Only remove the "and " prefix if present
          const simplifiedTitle = auction.title.startsWith('and ') 
            ? auction.title.replace('and ', '')
            : auction.title;
            
          return (
            <div key={index} className="bg-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-800 font-medium">{simplifiedTitle}</div>
                  <div className="text-sm text-gray-500">
                    {format(parseISO(auction.date), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="text-xl text-gray-900 font-medium">${auction.price.toLocaleString()}</div>
              </div>
              {auction.link && (
                <div className="mt-2">
                  <a 
                    href={auction.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    View Listing →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  
  // For other wheels, display simpler sales history
  return (
    <div className="space-y-4">
      {priceHistory.pricePoints.slice(-5).reverse().map((point, index) => (
        <div key={index} className="bg-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {format(parseISO(point.date), 'MMM d, yyyy')}
            </div>
            <div className="text-xl text-gray-900 font-medium">${point.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 