import { useQuery } from '@tanstack/react-query';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  hasOdds?: boolean;
}

async function fetchMatches(days: number = 7): Promise<Match[]> {
  const response = await fetch(`/api/matches?days=${days}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  
  const data = await response.json();
  return data.data || [];
}

export function useMatches(days: number = 7) {
  return useQuery({
    queryKey: ['matches', days],
    queryFn: () => fetchMatches(days),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on window focus to save API credits
  });
}