'use client';

import React from 'react';
import { MarketOption } from '@/types';
import { cn } from '@/lib/utils';

interface MarketSelectorProps {
  markets: MarketOption[];
  selectedMarket: string;
  onMarketSelect: (marketKey: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function MarketSelector({
  markets,
  selectedMarket,
  onMarketSelect,
  disabled = false,
  loading = false,
}: MarketSelectorProps) {
  // Group markets by category
  const categorizedMarkets = React.useMemo(() => {
    const categories: Record<string, MarketOption[]> = {
      match: [],
      goals: [],
      player: [],
      specials: [],
    };

    markets.forEach(market => {
      if (categories[market.category]) {
        categories[market.category].push(market);
      }
    });

    return Object.entries(categories).filter(([_, items]) => items.length > 0);
  }, [markets]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const selectedMarketInfo = markets.find(m => m.key === selectedMarket);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Market
      </label>
      <div className="relative">
        <select
          value={selectedMarket}
          onChange={(e) => onMarketSelect(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 pr-10",
            "bg-white border border-gray-300 rounded-lg",
            "text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "appearance-none cursor-pointer",
            "transition-colors duration-200",
            disabled && "opacity-50 cursor-not-allowed bg-gray-50"
          )}
        >
          {categorizedMarkets.map(([category, categoryMarkets]) => (
            <optgroup 
              key={category} 
              label={category.charAt(0).toUpperCase() + category.slice(1) + ' Markets'}
            >
              {categoryMarkets.map(market => (
                <option 
                  key={market.key} 
                  value={market.key}
                  disabled={!market.available}
                >
                  {market.name}
                  {!market.available && ' (Coming Soon)'}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      
      {selectedMarketInfo && (
        <div className="mt-2 text-sm text-gray-600">
          <MarketDescription market={selectedMarketInfo} />
        </div>
      )}
    </div>
  );
}

// Helper component to show market descriptions
function MarketDescription({ market }: { market: MarketOption }) {
  const descriptions: Record<string, string> = {
    h2h: 'Predict the match winner (Home/Draw/Away)',
    totals: 'Will total goals be over or under the line?',
    spreads: 'Asian handicap betting with no draw option',
    btts: 'Will both teams score at least one goal?',
    draw_no_bet: 'If match ends in draw, stake is refunded',
    double_chance: 'Cover two of three possible outcomes',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{descriptions[market.key] || 'Select your preferred betting market'}</span>
      <span className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        market.category === 'match' && "bg-purple-100 text-purple-800",
        market.category === 'goals' && "bg-green-100 text-green-800",
        market.category === 'player' && "bg-orange-100 text-orange-800",
        market.category === 'specials' && "bg-pink-100 text-pink-800"
      )}>
        {market.category}
      </span>
    </div>
  );
}