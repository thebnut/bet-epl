import { NextRequest, NextResponse } from 'next/server';
import { MARKETS } from '@/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // For now, return static market definitions
    // In the future, we could check which markets are actually available for a specific match
    const markets = Object.values(MARKETS);
    
    // Group by category
    const categorized = markets.reduce((acc: any, market) => {
      if (!acc[market.category]) {
        acc[market.category] = [];
      }
      acc[market.category].push(market);
      return acc;
    }, {});

    return NextResponse.json(
      {
        success: true,
        data: {
          all: markets,
          categorized,
        },
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200', // 1 hour cache
        },
      }
    );
  } catch (error) {
    console.error('Error in markets API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch markets',
      },
      { status: 500 }
    );
  }
}