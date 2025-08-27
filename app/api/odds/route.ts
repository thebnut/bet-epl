import { NextRequest, NextResponse } from 'next/server';
import { getOddsAPIClient } from '@/lib/odds-api';
import { BookmakerData, Market, Outcome } from '@/types';

export const runtime = 'edge'; // Use Edge Runtime

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const matchId = searchParams.get('matchId');
    const market = searchParams.get('market') || 'h2h';
    const bookmakers = searchParams.get('bookmakers')?.split(',').filter(Boolean);

    if (!matchId) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }

    const client = getOddsAPIClient();
    const matches = await client.getOdds(matchId, market, bookmakers);
    
    // Find the specific match
    const match = matches.find(m => m.id === matchId);
    
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // Process and structure the odds data
    const oddsData = processOddsData(match.bookmakers || [], market);

    return NextResponse.json(
      {
        success: true,
        data: {
          matchId: match.id,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          commenceTime: match.commence_time,
          market,
          odds: oddsData,
        },
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // 1 min cache, 2 min stale
        },
      }
    );
  } catch (error) {
    console.error('Error in odds API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch odds',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}

function processOddsData(bookmakers: BookmakerData[], marketKey: string) {
  // Collect all unique outcomes
  const outcomesMap = new Map<string, any[]>();

  bookmakers.forEach(bookmaker => {
    const market = bookmaker.markets.find(m => m.key === marketKey);
    if (!market) return;

    market.outcomes.forEach(outcome => {
      if (!outcomesMap.has(outcome.name)) {
        outcomesMap.set(outcome.name, []);
      }
      
      outcomesMap.get(outcome.name)?.push({
        bookmaker: bookmaker.key,
        bookmakerName: bookmaker.title,
        price: outcome.price,
        point: outcome.point,
        lastUpdate: market.last_update,
      });
    });
  });

  // Find best odds for each outcome
  const processedOutcomes: any[] = [];
  
  outcomesMap.forEach((bookmakerOdds, outcomeName) => {
    const bestOdds = Math.max(...bookmakerOdds.map(b => b.price));
    
    const outcomeData = {
      name: outcomeName,
      bookmakers: {} as any,
      bestOdds: {
        price: bestOdds,
        bookmakers: bookmakerOdds
          .filter(b => b.price === bestOdds)
          .map(b => b.bookmaker),
      },
    };

    // Add each bookmaker's odds
    bookmakerOdds.forEach(odds => {
      outcomeData.bookmakers[odds.bookmaker] = {
        name: odds.bookmakerName,
        price: odds.price,
        point: odds.point,
        isBest: odds.price === bestOdds,
        lastUpdate: odds.lastUpdate,
      };
    });

    processedOutcomes.push(outcomeData);
  });

  // Sort outcomes in a logical order (Home, Draw, Away for h2h)
  if (marketKey === 'h2h') {
    processedOutcomes.sort((a, b) => {
      const order = ['Home', 'Draw', 'Away'];
      const aIndex = order.findIndex(o => a.name.includes(o)) || 999;
      const bIndex = order.findIndex(o => b.name.includes(o)) || 999;
      
      if (aIndex !== 999 || bIndex !== 999) {
        return aIndex - bIndex;
      }
      
      return a.name.localeCompare(b.name);
    });
  }

  return processedOutcomes;
}