// API Types
export interface Match {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: BookmakerData[];
}

export interface BookmakerData {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
  point?: number; // For totals/spreads markets
}

// Application Types
export interface MatchDisplay {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: Date;
  displayTime: string;
  isToday: boolean;
  isLive: boolean;
}

export interface MarketOption {
  key: string;
  name: string;
  category: 'match' | 'goals' | 'player' | 'specials';
  available: boolean;
}

export interface OddsComparison {
  outcome: string;
  bookmakers: {
    [bookmakerKey: string]: {
      name: string;
      price: number;
      isBest: boolean;
      movement?: 'up' | 'down' | 'stable';
    };
  };
}

export interface BookmakerInfo {
  key: string;
  name: string;
  logo?: string;
}

// Market definitions
export const MARKETS: Record<string, MarketOption> = {
  h2h: { key: 'h2h', name: 'Match Result (1X2)', category: 'match', available: true },
  totals: { key: 'totals', name: 'Total Goals O/U', category: 'goals', available: true },
  spreads: { key: 'spreads', name: 'Asian Handicap', category: 'match', available: true },
  btts: { key: 'btts', name: 'Both Teams to Score', category: 'goals', available: true },
  draw_no_bet: { key: 'draw_no_bet', name: 'Draw No Bet', category: 'match', available: true },
  double_chance: { key: 'double_chance', name: 'Double Chance', category: 'match', available: true },
};

// Australian Bookmakers
export const BOOKMAKERS: BookmakerInfo[] = [
  { key: 'sportsbet', name: 'Sportsbet' },
  { key: 'tab', name: 'TAB' },
  { key: 'neds', name: 'Neds' },
  { key: 'ladbrokes_au', name: 'Ladbrokes' },
  { key: 'unibet', name: 'Unibet' },
  { key: 'betfair', name: 'Betfair' },
];

// API Response Types
export interface OddsAPIResponse {
  data: Match[];
  success: boolean;
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}