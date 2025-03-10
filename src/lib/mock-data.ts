import { format, subDays } from 'date-fns';

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

// Mock wheels data
export const wheels: Wheel[] = [
  {
    id: 'w12345',
    name: 'BBS CH-R 19"',
    brand: 'BBS',
    model: 'CH-R',
    size: '19"',
    finish: '',
    currentPrice: 599,
    retailPrice: 699,
    description: 'The BBS CH-R is a lightweight, high-strength wheel designed for performance vehicles. Its iconic Y-spoke design makes it a popular choice among enthusiasts.'
  },
  {
    id: 'w12346',
    name: 'Enkei RPF1 17"',
    brand: 'Enkei',
    model: 'RPF1',
    size: '17"',
    finish: '',
    currentPrice: 385,
    retailPrice: 425,
    description: 'The Enkei RPF1 is a legendary lightweight wheel popular in motorsports. Its simple spoke design and impressive strength-to-weight ratio make it ideal for track and street use.'
  },
  {
    id: 'w12347',
    name: 'HRE P101 20"',
    brand: 'HRE',
    model: 'P101',
    size: '20"',
    finish: '',
    currentPrice: 1475,
    retailPrice: 1650,
    description: 'The HRE P101 is a premium forged wheel with a classic five-spoke design. Each wheel is custom-made to order with precision engineering and exceptional attention to detail.'
  },
  {
    id: 'w12348',
    name: 'Volk TE37 18"',
    brand: 'Volk Racing',
    model: 'TE37',
    size: '18"',
    finish: '',
    currentPrice: 850,
    retailPrice: 950,
    description: 'The Volk TE37 is an iconic six-spoke wheel known for its rigidity and lightweight design. Popular in motorsports and street applications.'
  },
  {
    id: 'w12349',
    name: 'Rotiform BLQ 19"',
    brand: 'Rotiform',
    model: 'BLQ',
    size: '19"',
    finish: '',
    currentPrice: 429,
    retailPrice: 469,
    description: 'The Rotiform BLQ features a clean block design with a contemporary twist. Its mesh-like appearance offers a bold statement for European and luxury vehicles.'
  }
];

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
  
  for (let i = dataPoints; i >= 0; i--) {
    const date = subDays(today, i * pointFrequency);
    let priceModifier = 1;
    
    switch(pattern) {
      case 'spike':
        // Create a recent price spike
        if (i < dataPoints * 0.2) { // Last 20% of the time range
          priceModifier = 1.3 + (Math.sin(i / 5) * 0.2); // 30% increase with some volatility
        } else {
          priceModifier = 0.95 + (Math.random() * 0.1); // Normal range before spike
        }
        break;
      case 'gradual_rise':
        // Steady increase in price
        priceModifier = 0.9 + ((dataPoints - i) / dataPoints * 0.3) + (Math.random() * 0.1);
        break;
      case 'volatile':
        // High-end market volatility
        priceModifier = 1 + (Math.sin(i / 10) * 0.25) + (Math.random() * 0.15);
        break;
      case 'stable':
        // Stable prices with minor fluctuations
        priceModifier = 0.95 + (Math.random() * 0.1);
        break;
    }
    
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