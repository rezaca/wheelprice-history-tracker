import { format, subDays } from 'date-fns';
import { bbsE88Wheel, bbsRSWheel } from './scraper';

export interface Wheel {
  id: string;
  name: string;
  brand: string;
  model: string;
  size: string;
  finish: string;
  currentPrice: number;
  retailPrice: number;
  description: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface PriceHistory {
  wheelId: string;
  pricePoints: PricePoint[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

// Mock wheels data - only BBS RS as requested
export const wheels: Wheel[] = [bbsRSWheel];

// Generate mock price history data with realistic market patterns
export function generateMockPriceHistory(wheelId: string, timeRange: string): PriceHistory {
  const today = new Date();
  let days;
  let pointFrequency; // Days between each data point
  
  switch(timeRange) {
    case '1m':
      days = 30;
      pointFrequency = 1; // Daily points for 1 month
      break;
    case '3m':
      days = 90;
      pointFrequency = 3; // Every 3 days for 3 months
      break;
    case '6m':
      days = 180;
      pointFrequency = 7; // Weekly points for 6 months
      break;
    case 'ytd':
      days = Math.floor(Number(today) - Number(new Date(today.getFullYear(), 0, 1))) / (1000 * 60 * 60 * 24);
      pointFrequency = 7; // Weekly points for YTD
      break;
    case '1y':
      days = 365;
      pointFrequency = 14; // Bi-weekly points for 1 year
      break;
    case 'all':
      days = 730; // 2 years
      pointFrequency = 30; // Monthly points for all time
      break;
    default:
      days = 180;
      pointFrequency = 7;
  }
  
  const wheel = wheels.find(w => w.id === wheelId);
  const basePrice = wheel ? wheel.currentPrice : 599;
  
  // Generate price points with realistic market patterns
  const pricePoints: PricePoint[] = [];
  const dataPoints = Math.floor(days / pointFrequency);
  
  // Create different patterns based on the wheel
  let pattern: 'spike' | 'gradual_rise' | 'volatile' | 'stable';
  switch(wheelId) {
    case 'w12345': // BBS - Recent spike in demand
      pattern = 'spike';
      break;
    case 'w12346': // Enkei - Gradually increasing popularity
      pattern = 'gradual_rise';
      break;
    case 'w12347': // HRE - Volatile luxury market
      pattern = 'volatile';
      break;
    default: // Others - Relatively stable
      pattern = 'stable';
  }
  
  // Use a deterministic seed based on wheelId and timeRange
  const seed = hashCode(wheelId + timeRange);
  
  for (let i = dataPoints; i >= 0; i--) {
    const date = subDays(today, i * pointFrequency);
    let priceModifier = 1;
    
    // Apply pattern-specific price modifiers
    switch(pattern) {
      case 'spike':
        // Recent spike in demand (last 20% of time range)
        if (i <= dataPoints * 0.2) {
          // Spike up to 30% higher with some volatility
          const progress = 1 - (i / (dataPoints * 0.2)); // 0 to 1 over the spike period
          const volatility = seededRandom(seed + i) * 0.1; // 0-10% volatility
          priceModifier = 1 + (progress * 0.3) + volatility;
        } else {
          // Relatively stable before the spike with minor fluctuations
          priceModifier = 1 + (seededRandom(seed + i) * 0.05) - 0.025; // ±2.5%
        }
        break;
        
      case 'gradual_rise':
        // Gradually increasing popularity
        const riseProgress = 1 - (i / dataPoints); // 0 to 1 over the entire period
        const riseVolatility = seededRandom(seed + i) * 0.08 - 0.04; // ±4%
        priceModifier = 1 + (riseProgress * 0.3) + riseVolatility; // Up to 30% increase
        break;
        
      case 'volatile':
        // Luxury market with larger swings
        const bigSwing = (seededRandom(seed + i * 2) * 0.5) - 0.25; // ±25%
        const smallSwing = (seededRandom(seed + i * 3) * 0.1) - 0.05; // ±5%
        priceModifier = 1 + bigSwing + smallSwing;
        break;
        
      case 'stable':
      default:
        // Stable market with minor fluctuations
        priceModifier = 1 + (seededRandom(seed + i) * 0.1) - 0.05; // ±5%
        break;
    }
    
    // Ensure price doesn't go below 70% of base price
    priceModifier = Math.max(priceModifier, 0.7);
    
    pricePoints.push({
      date: format(date, 'yyyy-MM-dd'),
      price: Math.round(basePrice * priceModifier)
    });
  }
  
  // Calculate statistics
  const prices = pricePoints.map(point => point.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
  
  return {
    wheelId,
    pricePoints,
    lowestPrice,
    highestPrice,
    averagePrice
  };
}

// Helper function to create a deterministic hash from a string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Seeded random number generator (0-1)
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Additional helper to get all wheels including featured ones
export function getAllWheels(): Wheel[] {
  return [bbsE88Wheel, ...wheels];
} 