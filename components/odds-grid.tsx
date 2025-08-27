'use client';

import React from 'react';
import { cn, formatOdds } from '@/lib/utils';
import { BOOKMAKERS, BookmakerInfo } from '@/types';

interface OddsData {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  odds: OutcomeOdds[];
}

interface OutcomeOdds {
  name: string;
  bookmakers: {
    [bookmakerKey: string]: {
      name: string;
      price: number;
      isBest: boolean;
      lastUpdate?: string;
    };
  };
  bestOdds: {
    price: number;
    bookmakers: string[];
  };
}

interface OddsGridProps {
  data: OddsData | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  autoRefresh?: boolean;
  oddsFormat?: 'decimal' | 'fractional';
}

export function OddsGrid({
  data,
  loading = false,
  error = null,
  onRefresh,
  autoRefresh = false,
  oddsFormat = 'decimal',
}: OddsGridProps) {
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    if (!autoRefresh || !onRefresh) return;
    
    const interval = setInterval(() => {
      onRefresh();
      setLastUpdate(new Date());
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  if (loading && !data) {
    return <OddsGridSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-700 mb-2">{error}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!data || !data.odds || data.odds.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        <p>No odds available for this market</p>
      </div>
    );
  }

  // Get all bookmakers that have odds for this match
  const activeBookmakers = BOOKMAKERS.filter(bookmaker => {
    return data.odds.some(outcome => bookmaker.key in outcome.bookmakers);
  });

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Last updated: {lastUpdate.toLocaleTimeString('en-AU')}
        </div>
        <div className="flex items-center gap-2">
          {autoRefresh && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="animate-pulse mr-1">●</span>
              Auto-refresh ON
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className={cn(
                "px-3 py-1 text-sm rounded-lg transition-colors",
                "bg-primary-100 text-primary-700 hover:bg-primary-200",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outcome
              </th>
              {activeBookmakers.map(bookmaker => (
                <th 
                  key={bookmaker.key}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {bookmaker.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.odds.map((outcome, index) => (
              <tr key={outcome.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {formatOutcomeName(outcome.name, data.market, data.homeTeam, data.awayTeam)}
                </td>
                {activeBookmakers.map(bookmaker => {
                  const odds = outcome.bookmakers[bookmaker.key];
                  
                  if (!odds) {
                    return (
                      <td key={bookmaker.key} className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-400">-</span>
                      </td>
                    );
                  }

                  return (
                    <td key={bookmaker.key} className="px-4 py-3 text-center">
                      <button
                        onClick={() => openBookmaker(bookmaker.key, data.homeTeam, data.awayTeam)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200",
                          "hover:transform hover:scale-105",
                          odds.isBest 
                            ? "bg-green-100 text-green-800 ring-2 ring-green-300" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {formatOdds(odds.price, oddsFormat)}
                        {odds.isBest && (
                          <span className="ml-1 text-xs">★</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>★ Best available odds • Click any odds to visit bookmaker</p>
      </div>
    </div>
  );
}

// Skeleton loader component
function OddsGridSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-4 h-8 bg-gray-200 rounded w-48"></div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to format outcome names
function formatOutcomeName(
  name: string, 
  market: string, 
  homeTeam: string, 
  awayTeam: string
): string {
  // For h2h market, replace team names with shorter labels if needed
  if (market === 'h2h') {
    if (name === homeTeam) return `${homeTeam} (Home)`;
    if (name === awayTeam) return `${awayTeam} (Away)`;
    if (name === 'Draw') return 'Draw';
  }
  
  // For totals market
  if (market === 'totals' && name.includes('Over')) {
    return `Over ${name.split(' ')[1] || ''}`;
  }
  if (market === 'totals' && name.includes('Under')) {
    return `Under ${name.split(' ')[1] || ''}`;
  }
  
  return name;
}

// Helper function to open bookmaker website
function openBookmaker(bookmakerKey: string, homeTeam: string, awayTeam: string) {
  // Map bookmaker keys to their websites
  const bookmakerUrls: Record<string, string> = {
    sportsbet: 'https://www.sportsbet.com.au',
    tab: 'https://www.tab.com.au',
    neds: 'https://www.neds.com.au',
    ladbrokes_au: 'https://www.ladbrokes.com.au',
    unibet: 'https://www.unibet.com.au',
    betfair: 'https://www.betfair.com.au',
  };
  
  const url = bookmakerUrls[bookmakerKey] || '#';
  window.open(url, '_blank', 'noopener,noreferrer');
}