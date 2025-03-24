export interface AuctionResult {
  date: string;
  title: string;
  price: number;
  link?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface BbsE88ApiData {
  results: AuctionResult[];
  stats: {
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
    latestPrice: number;
  };
} 