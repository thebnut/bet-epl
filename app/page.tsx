'use client';

import React from 'react';
import { MatchSelector } from '@/components/match-selector';
import { MarketSelector } from '@/components/market-selector';
import { OddsGrid } from '@/components/odds-grid';
import { useMatches } from '@/hooks/use-matches';
import { useMarkets } from '@/hooks/use-markets';
import { useOdds } from '@/hooks/use-odds';
import { MARKETS } from '@/types';

export default function HomePage() {
  const [selectedMatchId, setSelectedMatchId] = React.useState<string>('');
  const [selectedMarket, setSelectedMarket] = React.useState<string>('h2h');
  const [autoRefresh, setAutoRefresh] = React.useState<boolean>(false);
  const [oddsFormat, setOddsFormat] = React.useState<'decimal' | 'fractional'>('decimal');

  // Fetch data using React Query hooks
  const { data: matches, isLoading: matchesLoading, error: matchesError } = useMatches(7);
  const { data: marketsData, isLoading: marketsLoading } = useMarkets();
  const { 
    data: oddsData, 
    isLoading: oddsLoading, 
    error: oddsError,
    refetch: refetchOdds 
  } = useOdds(selectedMatchId, selectedMarket);

  // Set initial match when matches load
  React.useEffect(() => {
    if (matches && matches.length > 0 && !selectedMatchId) {
      setSelectedMatchId(matches[0].id);
    }
  }, [matches, selectedMatchId]);

  // Use static markets as fallback
  const markets = marketsData?.all || Object.values(MARKETS);

  if (matchesError) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Unable to Load Matches
          </h2>
          <p className="text-red-600">
            {matchesError instanceof Error ? matchesError.message : 'An error occurred'}
          </p>
          <p className="text-sm text-red-500 mt-2">
            Please check your API key configuration and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          EPL Odds Comparison
        </h2>
        <p className="text-gray-600">
          Compare live odds from major Australian bookmakers for English Premier League matches
        </p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatchSelector
            matches={matches || []}
            selectedMatchId={selectedMatchId}
            onMatchSelect={setSelectedMatchId}
            loading={matchesLoading}
          />
          <MarketSelector
            markets={markets}
            selectedMarket={selectedMarket}
            onMarketSelect={setSelectedMarket}
            disabled={!selectedMatchId}
            loading={marketsLoading}
          />
        </div>

        {/* Settings Bar */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Auto Refresh Toggle */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Auto-refresh (60s)</span>
              </label>

              {/* Odds Format Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Format:</span>
                <select
                  value={oddsFormat}
                  onChange={(e) => setOddsFormat(e.target.value as 'decimal' | 'fractional')}
                  className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="decimal">Decimal</option>
                  <option value="fractional">Fractional</option>
                </select>
              </div>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={() => refetchOdds()}
              disabled={!selectedMatchId || oddsLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Refresh Odds
            </button>
          </div>
        </div>
      </div>

      {/* Odds Grid Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <OddsGrid
          data={oddsData || null}
          loading={oddsLoading}
          error={oddsError ? 'Failed to load odds' : null}
          onRefresh={() => refetchOdds()}
          autoRefresh={autoRefresh}
          oddsFormat={oddsFormat}
        />
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3 text-sm text-blue-700">
            <p className="font-medium mb-1">How to use:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Select a match from the dropdown to see available odds</li>
              <li>Choose your preferred market (Match Result, Over/Under, etc.)</li>
              <li>Green highlighted odds show the best available price</li>
              <li>Click any odds to visit the bookmaker&apos;s website</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}