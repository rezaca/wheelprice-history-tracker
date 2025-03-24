import { NextResponse } from 'next/server';
import { scrapeAuctionData } from '@/lib/scraper';

// This endpoint is designed to be called by a scheduler like Vercel Cron
export async function GET() {
  try {
    console.log('Starting scheduled scraping job...');
    
    // Scrape data for BBS E88
    const e88Results = await scrapeAuctionData('BBS E88');
    console.log(`Scraped ${e88Results.length} results for BBS E88`);
    
    // Scrape data for BBS RS
    const rsResults = await scrapeAuctionData('BBS RS');
    console.log(`Scraped ${rsResults.length} results for BBS RS`);
    
    // Here you would typically store the results in a database
    // For the prototype, we're just returning them in the response
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scraping completed successfully',
      stats: {
        bbsE88Count: e88Results.length,
        bbsRSCount: rsResults.length
      }
    });
  } catch (error) {
    console.error('Error in scheduled scraping job:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Set the revalidation to 0 to ensure this route is not cached
export const dynamic = 'force-dynamic'; 