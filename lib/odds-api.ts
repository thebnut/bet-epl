import { Match, BookmakerData } from '@/types';

const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = process.env.ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';

if (!API_KEY) {
  console.warn('Warning: ODDS_API_KEY is not set. API calls will fail.');
}

export class OddsAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = API_KEY || '', baseUrl: string = BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async fetchWithCache(url: string, cacheTime: number = 60) {
    const response = await fetch(url, {
      next: { revalidate: cacheTime }, // Next.js built-in caching
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Log remaining credits for monitoring
    const remainingCredits = response.headers.get('x-requests-remaining');
    const usedCredits = response.headers.get('x-requests-used');
    
    if (remainingCredits) {
      console.log(`API Credits - Remaining: ${remainingCredits}, Used: ${usedCredits}`);
    }

    return response.json();
  }

  async getMatches(days: number = 7): Promise<Match[]> {
    const url = `${this.baseUrl}/sports/soccer_epl/events?apiKey=${this.apiKey}&daysFrom=${days}`;
    
    try {
      const data = await this.fetchWithCache(url, 300); // Cache for 5 minutes
      return data || [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }

  async getOdds(
    matchId?: string,
    markets: string = 'h2h',
    bookmakers?: string[]
  ): Promise<Match[]> {
    let url = `${this.baseUrl}/sports/soccer_epl/odds/?apiKey=${this.apiKey}`;
    url += `&regions=au`; // Australian bookmakers
    url += `&markets=${markets}`;
    url += `&oddsFormat=decimal`;
    
    if (matchId) {
      url += `&eventIds=${matchId}`;
    }
    
    if (bookmakers && bookmakers.length > 0) {
      url += `&bookmakers=${bookmakers.join(',')}`;
    }

    try {
      const data = await this.fetchWithCache(url, 60); // Cache for 1 minute
      return data || [];
    } catch (error) {
      console.error('Error fetching odds:', error);
      return [];
    }
  }

  async getScores(daysFrom: number = 3): Promise<any[]> {
    const url = `${this.baseUrl}/sports/soccer_epl/scores/?apiKey=${this.apiKey}&daysFrom=${daysFrom}`;
    
    try {
      const data = await this.fetchWithCache(url, 60); // Cache for 1 minute
      return data || [];
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  }

  // Get upcoming matches with odds in a single call (more efficient)
  async getMatchesWithOdds(
    markets: string = 'h2h,totals',
    days: number = 7
  ): Promise<Match[]> {
    // The odds endpoint also returns match information
    let url = `${this.baseUrl}/sports/soccer_epl/odds/?apiKey=${this.apiKey}`;
    url += `&regions=au`;
    url += `&markets=${markets}`;
    url += `&oddsFormat=decimal`;
    url += `&dateFormat=iso`;

    try {
      const data = await this.fetchWithCache(url, 60); // Cache for 1 minute
      
      // Filter to only show matches in the next N days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + days);
      
      return (data || []).filter((match: Match) => {
        const matchDate = new Date(match.commence_time);
        return matchDate <= cutoffDate && matchDate >= new Date();
      });
    } catch (error) {
      console.error('Error fetching matches with odds:', error);
      return [];
    }
  }
}

// Singleton instance for server-side usage
let apiClient: OddsAPIClient | null = null;

export function getOddsAPIClient(): OddsAPIClient {
  if (!apiClient) {
    apiClient = new OddsAPIClient();
  }
  return apiClient;
}