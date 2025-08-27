# Technical Requirements Document: EPL Odds Comparison Platform

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTS                             │
│                   (Desktop & Mobile Browsers)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                      │
│                  (CDN, Edge Functions, SSL)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                      │
│         (React Frontend + API Routes on Vercel)            │
├─────────────────────────────────────────────────────────────┤
│  • Pages/App Router          │  • API Route Handlers       │
│  • React Components          │  • Data Fetching Logic      │
│  • Client State Management   │  • Caching Layer            │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐   ┌──────────────────┐
        │   VERCEL KV      │   │  THE ODDS API    │
        │  (Redis Cache)   │   │  (External API)  │
        └──────────────────┘   └──────────────────┘
```

### 1.2 Deployment Strategy
- **Platform**: Vercel (Frontend + API Routes)
- **Framework**: Next.js 14+ with App Router
- **Database**: Vercel KV (Redis) for caching
- **Edge Runtime**: Vercel Edge Functions for API routes
- **Environment**: Production, Staging, Development

## 2. Technology Stack

### 2.1 Frontend Technologies
```yaml
Framework:
  - Next.js: 14.2+
  - React: 18.3+
  - TypeScript: 5.3+

Styling:
  - Tailwind CSS: 3.4+
  - tailwind-merge: For conditional classes
  - clsx: For dynamic class names
  - CSS Modules: For component-specific styles

State Management:
  - Zustand: 4.5+ (Client-side state)
  - TanStack Query: 5.0+ (Server state & caching)

UI Components:
  - Radix UI: For accessible primitives
  - shadcn/ui: Component library
  - Lucide React: Icons
  - React Select: For enhanced dropdowns

Data Visualization:
  - Recharts: For odds movement charts (Phase 2)

Development Tools:
  - ESLint: Code linting
  - Prettier: Code formatting
  - Husky: Git hooks
  - lint-staged: Pre-commit linting
```

### 2.2 Backend Technologies
```yaml
Runtime:
  - Node.js: 20+ (Vercel default)
  - Next.js API Routes: Edge Runtime

Data Layer:
  - Vercel KV: Redis-compatible caching
  - Vercel Postgres: For user data (Phase 2)

API Integration:
  - axios: HTTP client
  - zod: Schema validation
  - node-cache: In-memory fallback cache

Security:
  - helmet: Security headers
  - cors: CORS configuration
  - rate-limiter-flexible: Rate limiting

Monitoring:
  - Vercel Analytics: Performance metrics
  - Sentry: Error tracking
  - Axiom: Logging (optional)
```

### 2.3 Testing Stack
```yaml
Unit Testing:
  - Vitest: Test runner
  - React Testing Library: Component testing
  - MSW: API mocking

E2E Testing:
  - Playwright: Browser automation
  - Cypress: Alternative E2E

Performance Testing:
  - Lighthouse CI: Performance audits
  - Web Vitals: Core metrics tracking
```

## 3. Project Structure

### 3.1 Directory Structure
```
betodds/
├── app/                          # Next.js App Router
│   ├── (routes)/                # Route groups
│   │   ├── page.tsx             # Home page
│   │   └── layout.tsx           # Root layout
│   ├── api/                     # API routes
│   │   ├── odds/
│   │   │   └── route.ts         # Odds endpoint
│   │   ├── matches/
│   │   │   └── route.ts         # Matches endpoint
│   │   └── markets/
│   │       └── route.ts         # Markets endpoint
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── dropdown.tsx
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── features/                # Feature components
│   │   ├── match-selector/
│   │   │   ├── index.tsx
│   │   │   └── match-selector.test.tsx
│   │   ├── market-selector/
│   │   ├── odds-grid/
│   │   └── bookmaker-column/
│   └── layout/                  # Layout components
│       ├── header.tsx
│       └── footer.tsx
├── lib/                          # Core libraries
│   ├── api/                     # API utilities
│   │   ├── client.ts            # API client
│   │   ├── odds-api.ts          # Odds API integration
│   │   └── transformers.ts      # Data transformers
│   ├── cache/                   # Caching logic
│   │   ├── redis.ts             # Vercel KV setup
│   │   └── strategies.ts        # Cache strategies
│   ├── utils/                   # Utilities
│   │   ├── formatters.ts        # Data formatters
│   │   ├── constants.ts         # App constants
│   │   └── helpers.ts           # Helper functions
│   └── hooks/                   # Custom hooks
│       ├── use-odds.ts
│       ├── use-matches.ts
│       └── use-auto-refresh.ts
├── types/                        # TypeScript types
│   ├── api.ts                   # API types
│   ├── odds.ts                  # Odds types
│   └── markets.ts               # Market types
├── store/                        # Zustand stores
│   ├── odds-store.ts
│   └── preferences-store.ts
├── config/                       # Configuration
│   ├── bookmakers.ts            # Bookmaker config
│   ├── markets.ts               # Markets config
│   └── env.ts                   # Environment config
├── public/                       # Static assets
│   ├── bookmaker-logos/
│   └── favicon.ico
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local                    # Local environment
├── .env.production              # Production environment
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── vercel.json                  # Vercel config
```

## 4. Core Components Specification

### 4.1 Match Selector Component
```typescript
interface MatchSelectorProps {
  matches: Match[];
  selectedMatchId: string;
  onMatchSelect: (matchId: string) => void;
  loading?: boolean;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  gameweek: number;
  isLive: boolean;
  venue?: string;
}

// Component features:
// - Search/filter functionality
// - Grouped by date
// - Live match indicators
// - Keyboard navigation support
// - Mobile-optimized dropdown
```

### 4.2 Market Selector Component
```typescript
interface MarketSelectorProps {
  markets: Market[];
  selectedMarketKey: string;
  onMarketSelect: (marketKey: string) => void;
  matchId: string;
  disabled?: boolean;
}

interface Market {
  key: string;
  name: string;
  category: 'match' | 'goals' | 'player' | 'specials';
  available: boolean;
  outcomeCount: number;
}

// Component features:
// - Categorized markets
// - Availability indicators
// - Popular markets section
// - Market descriptions on hover
```

### 4.3 Odds Grid Component
```typescript
interface OddsGridProps {
  matchId: string;
  marketKey: string;
  bookmakers: string[];
  autoRefresh: boolean;
  highlightBest: boolean;
}

interface OddsData {
  bookmaker: string;
  outcomes: Outcome[];
  lastUpdate: string;
  suspended: boolean;
}

interface Outcome {
  name: string;
  price: number;
  previousPrice?: number;
  isBest: boolean;
  movement: 'up' | 'down' | 'stable';
}

// Component features:
// - Virtualized rendering for performance
// - Price movement animations
// - Best odds highlighting
// - Click to copy odds
// - Responsive grid layout
// - Skeleton loading states
```

## 5. API Design

### 5.1 API Routes Structure

#### GET /api/matches
```typescript
// Request
interface MatchesRequest {
  days?: number;  // Default: 7
  teamFilter?: string;
}

// Response
interface MatchesResponse {
  matches: Match[];
  metadata: {
    totalCount: number;
    lastUpdate: string;
    cacheHit: boolean;
  };
}

// Headers
{
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'X-Cache-Status': 'HIT' | 'MISS' | 'STALE'
}
```

#### GET /api/odds
```typescript
// Request
interface OddsRequest {
  matchId: string;
  market: string;
  bookmakers?: string[];  // Default: all AU bookmakers
  format?: 'decimal' | 'fractional';  // Default: decimal
}

// Response
interface OddsResponse {
  matchId: string;
  market: string;
  bookmakers: BookmakerOdds[];
  bestOdds: {
    [outcome: string]: {
      bookmaker: string;
      price: number;
    };
  };
  metadata: {
    lastUpdate: string;
    nextUpdate: string;
    cacheHit: boolean;
  };
}
```

#### GET /api/markets
```typescript
// Request
interface MarketsRequest {
  matchId?: string;
  category?: 'match' | 'goals' | 'player' | 'all';
}

// Response
interface MarketsResponse {
  markets: Market[];
  categories: {
    [key: string]: Market[];
  };
}
```

### 5.2 API Rate Limiting Strategy
```typescript
// Vercel Edge Config
export const config = {
  runtime: 'edge',
  regions: ['syd1'],  // Sydney region for AU users
};

// Rate limiting rules
const rateLimits = {
  public: {
    windowMs: 60000,  // 1 minute
    max: 60,  // requests per window
  },
  authenticated: {  // Phase 2
    windowMs: 60000,
    max: 120,
  },
  api: {
    oddsApi: {
      windowMs: 60000,
      max: 10,  // Conservative to preserve credits
    },
  },
};
```

## 6. Caching Strategy

### 6.1 Cache Layers
```typescript
// 1. Browser Cache (SWR/React Query)
const browserCache = {
  staleTime: 60000,  // 1 minute
  cacheTime: 300000,  // 5 minutes
  refetchInterval: 60000,  // Auto-refresh every minute
};

// 2. Edge Cache (Vercel CDN)
const edgeCache = {
  'api/matches': {
    maxAge: 300,  // 5 minutes
    staleWhileRevalidate: 600,  // 10 minutes
  },
  'api/odds': {
    maxAge: 60,  // 1 minute
    staleWhileRevalidate: 120,  // 2 minutes
  },
};

// 3. Redis Cache (Vercel KV)
const redisCache = {
  matches: {
    ttl: 300,  // 5 minutes
    pattern: 'matches:{days}',
  },
  odds: {
    ttl: 60,  // 1 minute
    pattern: 'odds:{matchId}:{market}:{bookmakers}',
  },
  markets: {
    ttl: 3600,  // 1 hour
    pattern: 'markets:{category}',
  },
};
```

### 6.2 Cache Invalidation Strategy
```typescript
class CacheManager {
  async invalidateMatch(matchId: string): Promise<void> {
    // Clear all caches for specific match
    await Promise.all([
      this.clearRedisPattern(`odds:${matchId}:*`),
      this.purgeEdgeCache(`/api/odds?matchId=${matchId}`),
    ]);
  }

  async warmCache(): Promise<void> {
    // Pre-fetch popular matches and markets
    const nextMatches = await this.getUpcomingMatches(3);
    for (const match of nextMatches) {
      await this.fetchAndCacheOdds(match.id, 'h2h');
    }
  }
}
```

## 7. State Management

### 7.1 Zustand Store Structure
```typescript
// stores/odds-store.ts
interface OddsStore {
  // State
  selectedMatch: Match | null;
  selectedMarket: string;
  oddsData: Map<string, OddsData>;
  loading: boolean;
  error: Error | null;
  autoRefresh: boolean;
  
  // Actions
  setSelectedMatch: (match: Match) => void;
  setSelectedMarket: (market: string) => void;
  fetchOdds: (matchId: string, market: string) => Promise<void>;
  toggleAutoRefresh: () => void;
  clearCache: () => void;
}

// stores/preferences-store.ts
interface PreferencesStore {
  // State
  oddsFormat: 'decimal' | 'fractional';
  selectedBookmakers: string[];
  highlightBest: boolean;
  soundEnabled: boolean;
  
  // Actions
  setOddsFormat: (format: OddsFormat) => void;
  toggleBookmaker: (bookmaker: string) => void;
  savePreferences: () => void;
  loadPreferences: () => void;
}
```

### 7.2 React Query Configuration
```typescript
// lib/react-query.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // 1 minute
      cacheTime: 5 * 60 * 1000,  // 5 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

// Custom hooks
export const useMatches = (days = 7) => {
  return useQuery({
    queryKey: ['matches', days],
    queryFn: () => fetchMatches(days),
    staleTime: 5 * 60 * 1000,  // 5 minutes
  });
};

export const useOdds = (matchId: string, market: string) => {
  return useQuery({
    queryKey: ['odds', matchId, market],
    queryFn: () => fetchOdds(matchId, market),
    enabled: !!matchId && !!market,
    refetchInterval: 60 * 1000,  // Auto-refresh every minute
  });
};
```

## 8. Performance Optimization

### 8.1 Bundle Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['cdn.bookmakers.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@sentry/node': '@sentry/browser',
      };
    }
    return config;
  },
};
```

### 8.2 Component Optimization
```typescript
// Lazy loading
const OddsGrid = dynamic(() => import('@/components/odds-grid'), {
  loading: () => <OddsGridSkeleton />,
  ssr: false,
});

// Memoization
const MemoizedBookmakerColumn = memo(BookmakerColumn, (prev, next) => {
  return prev.odds === next.odds && prev.highlighted === next.highlighted;
});

// Virtualization for large lists
import { VariableSizeList } from 'react-window';

const VirtualizedMatchList = ({ matches }) => (
  <VariableSizeList
    height={400}
    itemCount={matches.length}
    itemSize={getItemSize}
    width="100%"
  >
    {MatchRow}
  </VariableSizeList>
);
```

### 8.3 Image Optimization
```typescript
// Bookmaker logos with Next.js Image
import Image from 'next/image';

const BookmakerLogo = ({ bookmaker }: { bookmaker: string }) => (
  <Image
    src={`/bookmaker-logos/${bookmaker}.svg`}
    alt={`${bookmaker} logo`}
    width={120}
    height={40}
    loading="lazy"
    placeholder="blur"
    blurDataURL={generateBlurDataURL()}
  />
);
```

## 9. Security Implementation

### 9.1 API Security
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline';"
  );
  
  // Rate limiting check
  const ip = request.ip ?? '127.0.0.1';
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 9.2 Environment Variables
```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  ODDS_API_KEY: z.string().min(1),
  KV_URL: z.string().url(),
  KV_REST_API_URL: z.string().url(),
  KV_REST_API_TOKEN: z.string().min(1),
  KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// .env.local
ODDS_API_KEY=your_api_key_here
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

## 10. Vercel Deployment Configuration

### 10.1 vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["syd1"],
  "functions": {
    "app/api/odds/route.ts": {
      "maxDuration": 10,
      "memory": 512
    },
    "app/api/matches/route.ts": {
      "maxDuration": 10,
      "memory": 512
    }
  },
  "crons": [
    {
      "path": "/api/cron/warm-cache",
      "schedule": "*/5 * * * *"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=60, stale-while-revalidate=120"
        }
      ]
    }
  ],
  "redirects": [],
  "rewrites": []
}
```

### 10.2 Build Configuration
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "analyze": "ANALYZE=true next build",
    "postinstall": "prisma generate",
    "vercel-build": "next build && npm run test"
  }
}
```

### 10.3 Environment Configuration
```bash
# Vercel CLI commands
vercel env pull .env.local
vercel env add ODDS_API_KEY production
vercel env add KV_URL production
vercel env add KV_REST_API_URL production
vercel env add KV_REST_API_TOKEN production

# Deployment commands
vercel --prod  # Production deployment
vercel  # Preview deployment
```

## 11. Monitoring & Observability

### 11.1 Vercel Analytics Setup
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 11.2 Error Tracking with Sentry
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

### 11.3 Custom Metrics
```typescript
// lib/metrics.ts
export class MetricsCollector {
  trackOddsRequest(market: string, responseTime: number) {
    // Track API performance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'odds_api_request',
        value: responseTime,
        event_category: 'API',
        event_label: market,
      });
    }
  }

  trackCacheHit(cacheType: 'redis' | 'edge' | 'browser') {
    // Track cache effectiveness
    this.sendMetric('cache_hit', { type: cacheType });
  }

  trackUserAction(action: string, metadata?: Record<string, any>) {
    // Track user interactions
    this.sendMetric('user_action', { action, ...metadata });
  }
}
```

## 12. Testing Strategy

### 12.1 Unit Testing
```typescript
// components/odds-grid/odds-grid.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { OddsGrid } from './odds-grid';

describe('OddsGrid', () => {
  it('highlights best odds', () => {
    const mockData = generateMockOdds();
    render(<OddsGrid data={mockData} highlightBest />);
    
    const bestOdds = screen.getAllByTestId('best-odds');
    expect(bestOdds).toHaveLength(3);  // For each outcome
    expect(bestOdds[0]).toHaveClass('bg-green-100');
  });

  it('shows price movement indicators', () => {
    const mockData = generateMockOddsWithMovement();
    render(<OddsGrid data={mockData} />);
    
    expect(screen.getByTestId('price-up')).toBeInTheDocument();
    expect(screen.getByTestId('price-down')).toBeInTheDocument();
  });
});
```

### 12.2 Integration Testing
```typescript
// tests/api/odds.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/odds/route';

describe('/api/odds', () => {
  it('returns cached data when available', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { matchId: '123', market: 'h2h' },
    });

    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['x-cache-status']).toBe('HIT');
  });
});
```

### 12.3 E2E Testing
```typescript
// tests/e2e/odds-comparison.spec.ts
import { test, expect } from '@playwright/test';

test('complete odds comparison flow', async ({ page }) => {
  await page.goto('/');
  
  // Select match
  await page.selectOption('[data-testid="match-selector"]', 'match-123');
  
  // Select market
  await page.selectOption('[data-testid="market-selector"]', 'totals');
  
  // Verify odds grid loads
  await expect(page.locator('[data-testid="odds-grid"]')).toBeVisible();
  
  // Check best odds are highlighted
  const bestOdds = page.locator('.bg-green-100');
  await expect(bestOdds).toHaveCount(2);  // Over/Under
  
  // Click on odds to open bookmaker
  await page.click('[data-testid="odds-cell-sportsbet-over"]');
  
  // Verify new tab opened (mock in test)
  const newPage = await page.waitForEvent('popup');
  expect(newPage.url()).toContain('sportsbet.com.au');
});
```

## 13. Development Workflow

### 13.1 Git Branch Strategy
```bash
main            # Production branch
├── staging     # Staging environment
├── develop     # Development branch
└── feature/*   # Feature branches
    └── feature/odds-grid
    └── feature/market-selector
```

### 13.2 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linter
        run: npm run lint
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

### 13.3 Development Guidelines
```markdown
## Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write tests for new features
- Document complex logic

## Component Guidelines
- Use functional components
- Implement proper TypeScript types
- Follow atomic design principles
- Ensure accessibility (WCAG 2.1 AA)
- Optimize for performance

## API Guidelines
- Use Edge Runtime when possible
- Implement proper error handling
- Add request validation with Zod
- Include cache headers
- Document endpoints with comments
```

## 14. Performance Requirements

### 14.1 Core Web Vitals Targets
```yaml
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
TTFB (Time to First Byte): < 600ms
FCP (First Contentful Paint): < 1.8s
```

### 14.2 Lighthouse Score Targets
```yaml
Performance: > 90
Accessibility: > 95
Best Practices: > 95
SEO: > 90
```

### 14.3 API Performance Targets
```yaml
Response Times:
  - /api/matches: < 500ms
  - /api/odds: < 1000ms
  - /api/markets: < 300ms

Availability: 99.9%
Error Rate: < 1%
Cache Hit Ratio: > 80%
```

## 15. Scaling Considerations

### 15.1 Traffic Projections
```yaml
Month 1:
  - Daily Active Users: 100-500
  - API Requests/day: 5,000
  - Bandwidth: 10GB/month

Month 3:
  - Daily Active Users: 1,000-5,000
  - API Requests/day: 50,000
  - Bandwidth: 100GB/month

Month 6:
  - Daily Active Users: 10,000+
  - API Requests/day: 500,000
  - Bandwidth: 1TB/month
```

### 15.2 Scaling Strategy
```yaml
Phase 1 (MVP):
  - Single Vercel deployment
  - Vercel KV for caching
  - Basic monitoring

Phase 2 (Growth):
  - Add Vercel Edge Config
  - Implement database sharding
  - Enhanced caching strategies
  - Add CDN for static assets

Phase 3 (Scale):
  - Multi-region deployment
  - Dedicated Redis cluster
  - Implement queue system
  - Add read replicas
```

## 16. Disaster Recovery

### 16.1 Backup Strategy
```yaml
Data Backup:
  - Daily cache snapshots
  - Continuous replication for user data
  - Configuration backups in Git

Recovery Targets:
  - RPO (Recovery Point Objective): 1 hour
  - RTO (Recovery Time Objective): 30 minutes
```

### 16.2 Fallback Mechanisms
```typescript
// API fallback strategy
async function fetchOddsWithFallback(matchId: string, market: string) {
  try {
    // Try primary API
    return await fetchFromOddsAPI(matchId, market);
  } catch (error) {
    // Try cache
    const cached = await getFromCache(matchId, market);
    if (cached && isRecentEnough(cached)) {
      return cached;
    }
    
    // Return stale data with warning
    return {
      ...cached,
      stale: true,
      message: 'Showing cached odds from ' + cached.timestamp,
    };
  }
}
```

## 17. Migration Plan

### 17.1 Phase 1: MVP Launch (Week 1-4)
```markdown
Week 1-2:
- [ ] Setup Next.js project with TypeScript
- [ ] Configure Vercel deployment
- [ ] Implement basic API routes
- [ ] Setup Vercel KV

Week 3:
- [ ] Build core components
- [ ] Integrate Odds API
- [ ] Implement caching layer
- [ ] Add basic styling

Week 4:
- [ ] Testing and bug fixes
- [ ] Performance optimization
- [ ] Deploy to production
- [ ] Setup monitoring
```

### 17.2 Phase 2: Enhancement (Week 5-8)
```markdown
- [ ] Add more markets
- [ ] Implement user preferences
- [ ] Add historical data
- [ ] Enhance mobile experience
- [ ] A/B testing framework
```

## 18. Documentation Requirements

### 18.1 Technical Documentation
- API endpoint documentation
- Component storybook
- Architecture diagrams
- Deployment guide
- Troubleshooting guide

### 18.2 Code Documentation
```typescript
/**
 * Fetches odds data for a specific match and market
 * @param matchId - The unique identifier of the match
 * @param market - The betting market key (e.g., 'h2h', 'totals')
 * @param options - Optional configuration for the request
 * @returns Promise<OddsData> - The odds data from all bookmakers
 * @throws ApiError if the request fails
 * @example
 * const odds = await fetchOdds('match-123', 'h2h', { 
 *   bookmakers: ['sportsbet', 'tab'] 
 * });
 */
export async function fetchOdds(
  matchId: string,
  market: string,
  options?: FetchOddsOptions
): Promise<OddsData> {
  // Implementation
}
```

## 19. Compliance & Legal

### 19.1 Technical Requirements
- Age verification banner
- Responsible gambling links
- Terms of service page
- Privacy policy page
- Cookie consent (if needed)
- Geo-blocking (if required)

### 19.2 Implementation
```typescript
// middleware.ts - Geo-blocking example
export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'AU';
  
  // Block restricted countries
  if (RESTRICTED_COUNTRIES.includes(country)) {
    return NextResponse.redirect(new URL('/restricted', request.url));
  }
  
  return NextResponse.next();
}
```

## 20. Cost Analysis

### 20.1 Infrastructure Costs (Monthly)
```yaml
Vercel:
  - Hobby: $0 (Development)
  - Pro: $20 (Production MVP)
  - Enterprise: Custom (Scale)

Vercel KV:
  - Free tier: 30MB, 10k requests/day
  - Pay-as-you-go: $0.2/GB storage, $0.15/100k requests

The Odds API:
  - 100K Plan: $59/month
  - 5M Plan: $119/month (when scaling)

Monitoring:
  - Sentry: $26/month (Team plan)
  - Vercel Analytics: Included

Total MVP: ~$105/month
Total Scale: ~$300-500/month
```

---

*Document Version: 1.0*  
*Last Updated: January 2025*  
*Status: Ready for Implementation*  
*Technical Lead: Engineering Team*