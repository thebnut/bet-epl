import { useQuery } from '@tanstack/react-query';

interface OddsData {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  market: string;
  odds: any[];
}

async function fetchOdds(
  matchId: string,
  market: string,
  bookmakers?: string[]
): Promise<OddsData> {
  let url = `/api/odds?matchId=${matchId}&market=${market}`;
  
  if (bookmakers && bookmakers.length > 0) {
    url += `&bookmakers=${bookmakers.join(',')}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch odds');
  }
  
  const data = await response.json();
  return data.data;
}

export function useOdds(
  matchId: string | null,
  market: string = 'h2h',
  bookmakers?: string[]
) {
  return useQuery({
    queryKey: ['odds', matchId, market, bookmakers],
    queryFn: () => fetchOdds(matchId!, market, bookmakers),
    enabled: !!matchId, // Only fetch when matchId is available
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // No auto-refresh by default (user controls this)
  });
}