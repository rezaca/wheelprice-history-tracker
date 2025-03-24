import { Wheel, PricePoint, PriceHistory } from './mock-data';
import { ApiResponse, BbsE88ApiData } from './types';
import axios from 'axios';

// BBS E88 wheel data
export const bbsE88Wheel: Wheel = {
  id: 'bbsE88',
  name: 'BBS E88',
  brand: 'BBS',
  model: 'E88',
  size: '18"', // Default size, not focusing on specific sizes for MVP
  finish: 'Various',
  currentPrice: 8200, // Updated to latest known price
  retailPrice: 7500,
  description: 'The BBS E88 is a classic mesh-style wheel popular in motorsports and among enthusiasts. This forged wheel is known for its exceptional build quality and is commonly used on Porsche and other high-performance vehicles.'
};

// BBS RS wheel data
export const bbsRSWheel: Wheel = {
  id: 'bbsRS',
  name: 'BBS RS',
  brand: 'BBS',
  model: 'RS',
  size: '16-18"', // Common sizes
  finish: 'Various',
  currentPrice: 4000, // Updated to latest known price
  retailPrice: 3500,
  description: 'The BBS RS is one of the most iconic wheels ever produced. With its classic cross-spoke design and multi-piece construction, these wheels became a symbol of automotive culture in the 1980s and continue to be highly sought after by collectors and enthusiasts.'
};

/**
 * Fetches BBS E88 wheel data from our API route
 */
export async function fetchBBSE88Data(): Promise<PriceHistory> {
  try {
    const response = await axios.get<ApiResponse<BbsE88ApiData>>('/api/wheels/bbs-e88');
    
    if (response.data.success) {
      const { results, stats } = response.data.data;
      
      // Convert auction results to price points
      const pricePoints: PricePoint[] = results.map(item => ({
        date: item.date,
        price: item.price
      }));
      
      return {
        wheelId: 'bbsE88',
        pricePoints,
        lowestPrice: stats.lowestPrice,
        highestPrice: stats.highestPrice,
        averagePrice: stats.averagePrice
      };
    } else {
      throw new Error('Failed to fetch BBS E88 data');
    }
  } catch (error) {
    console.error('Error fetching BBS E88 data:', error);
    
    // Return fallback data
    return {
      wheelId: 'bbsE88',
      pricePoints: [
        { date: '2025-02-23', price: 5746 },
        { date: '2024-09-13', price: 8200 },
        { date: '2024-04-29', price: 4750 },
        { date: '2023-08-15', price: 8700 },
        { date: '2023-07-13', price: 5000 }
      ],
      lowestPrice: 4750,
      highestPrice: 8700,
      averagePrice: 6479
    };
  }
}

/**
 * Fetches BBS RS wheel data from our API route
 */
export async function fetchBBSRSData(): Promise<PriceHistory> {
  try {
    const response = await axios.get<ApiResponse<BbsE88ApiData>>('/api/wheels/bbs-rs');
    
    if (response.data.success) {
      const { results, stats } = response.data.data;
      
      // Convert auction results to price points
      const pricePoints: PricePoint[] = results.map(item => ({
        date: item.date,
        price: item.price
      }));
      
      return {
        wheelId: 'bbsRS',
        pricePoints,
        lowestPrice: stats.lowestPrice,
        highestPrice: stats.highestPrice,
        averagePrice: stats.averagePrice
      };
    } else {
      throw new Error('Failed to fetch BBS RS data');
    }
  } catch (error) {
    console.error('Error fetching BBS RS data:', error);
    
    // Return fallback data with some reasonable values for RS wheels
    return {
      wheelId: 'bbsRS',
      pricePoints: [
        { date: '2024-05-10', price: 3500 },
        { date: '2024-01-15', price: 2900 },
        { date: '2023-10-22', price: 3200 },
        { date: '2023-07-05', price: 2800 },
        { date: '2023-03-18', price: 3600 }
      ],
      lowestPrice: 2800,
      highestPrice: 3600,
      averagePrice: 3200
    };
  }
}

/**
 * Get the latest BBS E88 auction price
 */
export async function fetchLatestBBSE88Price(): Promise<number> {
  try {
    const response = await axios.get<ApiResponse<BbsE88ApiData>>('/api/wheels/bbs-e88');
    const { data } = response;
    
    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    return data.data.stats.latestPrice;
  } catch (error) {
    console.error('Error fetching latest BBS E88 price:', error);
    // Return the latest price from fallback data
    return 8200;
  }
}

// This function represents the scraping logic that would normally fetch data from Bring a Trailer
// In a real implementation, this would use a library like Puppeteer, Playwright, or Cheerio
// to scrape the auction site for wheel data
export async function scrapeAuctionData(wheelType: string): Promise<{
  title: string;
  price: number;
  date: string;
  link: string;
}[]> {
  console.log(`Scraping data for ${wheelType}...`);
  
  // Simulate the scraping process with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is a mock implementation. In a real-world scenario, this function would:
  // 1. Navigate to the auction site
  // 2. Search for the specified wheel type
  // 3. Extract auction data from search results
  // 4. Process and return the data
  
  // Mock results - in a real implementation, this would be actual scraped data
  const mockResults: {
    title: string;
    price: number;
    date: string;
    link: string;
  }[] = [];
  const resultCount = Math.floor(Math.random() * 5) + 3; // Random number between 3-7
  
  const currentDate = new Date();
  
  for (let i = 0; i < resultCount; i++) {
    // Generate a random date in the past year
    const auctionDate = new Date();
    auctionDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 365));
    
    // Generate a random price depending on wheel type
    const basePrice = wheelType === 'BBS E88' ? 6000 : 4000;
    const priceVariation = Math.floor(Math.random() * 2000) - 1000; // Random between -1000 and 1000
    const price = basePrice + priceVariation;
    
    mockResults.push({
      title: `${Math.floor(Math.random() * 3) + 16}x${Math.floor(Math.random() * 3) + 7}" ${wheelType} Wheels for ${['BMW', 'Porsche', 'Audi', 'Mercedes'][Math.floor(Math.random() * 4)]}`,
      price,
      date: auctionDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      link: `https://bringatrailer.com/listing/${wheelType.toLowerCase().replace(' ', '-')}-wheels-${i}`
    });
  }
  
  console.log(`Scraped ${mockResults.length} results for ${wheelType}`);
  return mockResults;
} 