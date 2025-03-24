import { useState, useEffect } from 'react';
import { fetchBBSE88Data, fetchBBSRSData } from './scraper';
import { PriceHistory } from './mock-data';
import { generateMockPriceHistory } from './mock-data';
import { 
  subMonths, 
  parseISO, 
  isAfter, 
  startOfYear, 
  isEqual,
  format
} from 'date-fns';

// Hook for getting price history for a specific wheel
export function usePriceHistory(wheelId: string, timeRange: string = '6m'): {
  data: PriceHistory | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        let fetchedData: PriceHistory;
        
        // For BBS E88 and BBS RS, use real data
        if (wheelId === 'bbsE88') {
          fetchedData = await fetchBBSE88Data();
        } else if (wheelId === 'bbsRS') {
          fetchedData = await fetchBBSRSData();
        } else {
          // For other wheels, use mock data
          fetchedData = generateMockPriceHistory(wheelId, timeRange);
        }
        
        // BBS E88 and BBS RS have sparse datasets, so we need special handling
        if (wheelId === 'bbsE88' || wheelId === 'bbsRS') {
          // Sort data by date from newest to oldest
          const sortedPoints = [...fetchedData.pricePoints].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          
          // Log the sorted data
          console.log('Sorted data points:', 
            sortedPoints.map(p => ({ 
              date: p.date, 
              price: p.price,
              formattedDate: format(parseISO(p.date), 'MMM d, yyyy')
            }))
          );
          
          // Handle different time ranges for sparse datasets
          let filteredPoints = sortedPoints;
          
          if (timeRange !== 'all') {
            // For sparse datasets, we'll use a different approach
            // Instead of strict date filtering, we'll just select a subset of the data
            
            const now = new Date();
            
            // Always include future dates in any view
            const futurePoints = sortedPoints.filter(point => {
              const pointDate = parseISO(point.date);
              return pointDate > now;
            });
            
            const nonFuturePoints = sortedPoints.filter(point => {
              const pointDate = parseISO(point.date);
              return pointDate <= now;
            });
            
            // Create a custom filter based on the timeRange and our limited data
            switch(timeRange) {
              case '1m':
                // For 1M, show any future points plus the most recent non-future point
                filteredPoints = [...futurePoints, ...nonFuturePoints.slice(0, 1)];
                break;
                
              case '3m':
                // For 3M, show future points plus the top 2 most recent non-future points
                filteredPoints = [...futurePoints, ...nonFuturePoints.slice(0, 2)];
                break;
                
              case '6m':
                // For 6M, show future points plus the top 3 most recent non-future points
                filteredPoints = [...futurePoints, ...nonFuturePoints.slice(0, 3)];
                break;
                
              case 'ytd':
                // For YTD, find points from this year (and future dates)
                const thisYear = now.getFullYear();
                const thisYearPoints = nonFuturePoints.filter(point => {
                  const pointDate = parseISO(point.date);
                  return pointDate.getFullYear() === thisYear;
                });
                
                // If we don't have any points this year, show the most recent 3
                filteredPoints = thisYearPoints.length > 0 
                  ? [...futurePoints, ...thisYearPoints]
                  : [...futurePoints, ...nonFuturePoints.slice(0, 3)];
                break;
                
              case '1y':
                // For 1Y, show future points plus points within a year
                const oneYearAgo = subMonths(now, 12);
                const lastYearPoints = nonFuturePoints.filter(point => {
                  const pointDate = parseISO(point.date);
                  return isAfter(pointDate, oneYearAgo) || isEqual(pointDate, oneYearAgo);
                });
                
                // If we have fewer than 2 past-year points, include more recent ones
                filteredPoints = lastYearPoints.length >= 2
                  ? [...futurePoints, ...lastYearPoints]
                  : [...futurePoints, ...nonFuturePoints.slice(0, 3)];
                break;
                
              default:
                // For all other cases, show all data
                filteredPoints = sortedPoints;
            }
            
            console.log(`Filtered data for ${timeRange}:`, 
              filteredPoints.map(p => ({ 
                date: p.date, 
                price: p.price,
                formattedDate: format(parseISO(p.date), 'MMM d, yyyy')
              }))
            );
            
            if (filteredPoints.length > 0) {
              const prices = filteredPoints.map(p => p.price);
              fetchedData = {
                ...fetchedData,
                pricePoints: filteredPoints,
                lowestPrice: Math.min(...prices),
                highestPrice: Math.max(...prices),
                averagePrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
              };
            }
          }
        } else {
          // Standard filtering for other wheels with more regular/dense data
          if (timeRange !== 'all' && fetchedData.pricePoints.length > 1) {
            const now = new Date();
            let cutoffDate: Date;
            
            switch (timeRange) {
              case '1m':
                cutoffDate = subMonths(now, 1);
                break;
              case '3m':
                cutoffDate = subMonths(now, 3);
                break;
              case '6m':
                cutoffDate = subMonths(now, 6);
                break;
              case 'ytd':
                cutoffDate = startOfYear(now);
                break;
              case '1y':
                cutoffDate = subMonths(now, 12);
                break;
              default:
                cutoffDate = subMonths(now, 6);
            }
            
            // Filter points
            const filteredPoints = fetchedData.pricePoints.filter(point => {
              const pointDate = parseISO(point.date);
              return isAfter(pointDate, cutoffDate) || isEqual(pointDate, cutoffDate);
            });
            
            if (filteredPoints.length > 0) {
              const prices = filteredPoints.map(p => p.price);
              fetchedData = {
                ...fetchedData,
                pricePoints: filteredPoints,
                lowestPrice: Math.min(...prices),
                highestPrice: Math.max(...prices),
                averagePrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
              };
            }
          }
        }
        
        setData(fetchedData);
      } catch (err) {
        console.error('Error fetching price history:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [wheelId, timeRange]);

  return { data, loading, error };
} 