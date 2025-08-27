import { useQuery } from '@tanstack/react-query';
import { MarketOption } from '@/types';

interface MarketsResponse {
  all: MarketOption[];
  categorized: Record<string, MarketOption[]>;
}

async function fetchMarkets(): Promise<MarketsResponse> {
  const response = await fetch('/api/markets');
  
  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }
  
  const data = await response.json();
  return data.data;
}

export function useMarkets() {
  return useQuery({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
    staleTime: 60 * 60 * 1000, // Consider data fresh for 1 hour
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
    refetchOnWindowFocus: false,
  });
}