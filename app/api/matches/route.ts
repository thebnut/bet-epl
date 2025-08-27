import { NextRequest, NextResponse } from 'next/server';
import { getOddsAPIClient } from '@/lib/odds-api';

export const runtime = 'edge'; // Use Edge Runtime for better performance

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const days = parseInt(searchParams.get('days') || '7', 10);

    const client = getOddsAPIClient();
    const matches = await client.getMatchesWithOdds('h2h', days);

    // Transform the data for frontend consumption
    const transformedMatches = matches.map(match => ({
      id: match.id,
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      commenceTime: match.commence_time,
      hasOdds: Boolean(match.bookmakers && match.bookmakers.length > 0),
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedMatches,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
        },
      }
    );
  } catch (error) {
    console.error('Error in matches API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch matches',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store', // Don't cache errors
        },
      }
    );
  }
}