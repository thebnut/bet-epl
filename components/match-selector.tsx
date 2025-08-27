'use client';

import React, { useMemo } from 'react';
import { formatDate, isToday, isLive, getTimeUntilMatch } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  hasOdds?: boolean;
}

interface MatchSelectorProps {
  matches: Match[];
  selectedMatchId: string;
  onMatchSelect: (matchId: string) => void;
  loading?: boolean;
}

export function MatchSelector({
  matches,
  selectedMatchId,
  onMatchSelect,
  loading = false,
}: MatchSelectorProps) {
  const groupedMatches = useMemo(() => {
    const groups: { [key: string]: Match[] } = {};
    
    matches.forEach(match => {
      const date = new Date(match.commenceTime);
      const dateKey = isToday(date) 
        ? 'Today' 
        : date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(match);
    });
    
    return groups;
  }, [matches]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No matches available
      </div>
    );
  }

  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Match
      </label>
      <div className="relative">
        <select
          value={selectedMatchId}
          onChange={(e) => onMatchSelect(e.target.value)}
          className={cn(
            "w-full px-4 py-3 pr-10",
            "bg-white border border-gray-300 rounded-lg",
            "text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "appearance-none cursor-pointer",
            "transition-colors duration-200"
          )}
        >
          {Object.entries(groupedMatches).map(([date, dateMatches]) => (
            <optgroup key={date} label={date}>
              {dateMatches.map(match => {
                const matchTime = new Date(match.commenceTime);
                const isMatchLive = isLive(matchTime);
                const timeUntil = getTimeUntilMatch(matchTime);
                
                return (
                  <option key={match.id} value={match.id}>
                    {match.homeTeam} vs {match.awayTeam}
                    {isMatchLive && ' 🔴 LIVE'}
                    {!isMatchLive && ` (${timeUntil})`}
                  </option>
                );
              })}
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
      
      {selectedMatch && (
        <div className="mt-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>{formatDate(selectedMatch.commenceTime)}</span>
            {isLive(selectedMatch.commenceTime) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <span className="animate-pulse mr-1">●</span>
                LIVE
              </span>
            )}
            {isToday(selectedMatch.commenceTime) && !isLive(selectedMatch.commenceTime) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                TODAY
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}