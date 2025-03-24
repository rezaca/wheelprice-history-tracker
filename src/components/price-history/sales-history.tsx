"use client";

import { format, parseISO } from "date-fns";
import { usePriceHistory } from "@/lib/hooks";
import { AuctionResult } from "@/lib/types";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatPrice } from "@/lib/utils";

interface SalesHistoryProps {
  wheelId: string;
}

export function SalesHistory({ wheelId }: SalesHistoryProps) {
  const [auctionResults, setAuctionResults] = useState<AuctionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
    // Sort auctions by date
    const sortedAuctions = [...auctionResults]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculate pagination
    const totalPages = Math.ceil(sortedAuctions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Get current page's auctions
    const displayAuctions = sortedAuctions.slice(startIndex, endIndex);

    return (
      <div className="space-y-4">
        <div className="text-xs sm:text-sm text-gray-500 mb-4">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedAuctions.length)} of {sortedAuctions.length} results
        </div>
        
        {displayAuctions.map((auction, index) => {
          const simplifiedTitle = auction.title.startsWith('and ') 
            ? auction.title.replace('and ', '')
            : auction.title;
            
          return (
            <div key={index} className="bg-gray-100 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div>
                  <div className="text-sm sm:text-base text-gray-800 font-medium">{simplifiedTitle}</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {format(parseISO(auction.date), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="text-base sm:text-xl text-gray-900 font-medium">{formatPrice(auction.price)}</div>
              </div>
              {auction.link && (
                <div className="mt-2">
                  <a 
                    href={auction.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    View Listing →
                  </a>
                </div>
              )}
            </div>
          );
        })}
        
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
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