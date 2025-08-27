# Technical Requirements Document: EPL Odds Comparison Platform (Validated & Cost-Optimized)

## ⚠️ Stack Validation Summary

### ✅ Updated to Latest Stable Versions (January 2025)
- **Next.js**: 15.5 (not 14.x) - Latest stable with Turbopack support
- **React**: 18.3 - Current stable
- **TypeScript**: 5.7+ - Latest stable
- **TanStack Query**: v5.85+ (not 5.0) - Latest stable with Next.js 15 support
- **Node.js**: 20 LTS - Vercel default

### 💰 Cost Optimization for Ramp-Up Phase
- **Vercel KV**: ❌ Costs money even on Hobby plan
- **Alternative**: ✅ Upstash Redis (500K commands/month free)
- **Edge Config**: ✅ 100K reads free on Hobby plan
- **Total MVP Cost**: $0 (Hobby) + $59 (Odds API) = $59/month

## 1. System Architecture Overview (Cost-Optimized)

### 1.1 High-Level Architecture - Ramp-Up Phase

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTS                             │
│                   (Desktop & Mobile Browsers)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                      │
│           (CDN, Edge Functions, SSL) - FREE TIER           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               NEXT.JS 15.5 APPLICATION                      │
│         (React Frontend + API Routes on Vercel)            │
├─────────────────────────────────────────────────────────────┤
│  • App Router                │  • API Route Handlers       │
│  • React Server Components   │  • Built-in Fetch Cache    │
│  • Client Components         │  • Edge Runtime            │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌──────────┬────────┴────────┬──────────┐
          ▼          ▼                 ▼          ▼
   ┌─────────┐ ┌─────────────┐ ┌─────────┐ ┌─────────────┐
   │ UPSTASH │ │VERCEL EDGE  │ │  LOCAL  │ │THE ODDS API │
   │  REDIS  │ │   CONFIG    │ │ STORAGE │ │  (External) │
   │  (Free) │ │   (Free)    │ │ (Prefs) │ │    ($59)    │
   └─────────┘ └─────────────┘ └─────────┘ └─────────────┘
```

### 1.2 Deployment Strategy - Phased Approach

#### Phase 1: Ramp-Up (Month 1-3) - $59/month
- **Platform**: Vercel Hobby (Free)
- **Framework**: Next.js 15.5 with App Router
- **Cache**: Upstash Redis (Free tier - 500K commands/month)
- **Config**: Vercel Edge Config (Free tier - 100K reads)
- **API**: The Odds API 100K plan ($59/month)

#### Phase 2: Growth (Month 4-6) - $105/month
- **Platform**: Vercel Pro ($20/month)
- **Cache**: Upstash Pay-as-you-go or Vercel KV
- **Database**: Vercel Postgres for user accounts
- **API**: The Odds API 100K plan ($59/month)

#### Phase 3: Scale (Month 6+) - $300+/month
- **Platform**: Vercel Pro/Enterprise
- **Cache**: Vercel KV or dedicated Redis
- **Database**: Vercel Postgres with read replicas
- **API**: The Odds API 5M plan ($119/month)

## 2. Technology Stack (Validated January 2025)

### 2.1 Frontend Technologies
```yaml
Framework:
  - Next.js: 15.5 (Latest stable with Turbopack)
  - React: 18.3 (Current stable)
  - TypeScript: 5.7+ (Latest stable)

Styling:
  - Tailwind CSS: 3.4+
  - tailwind-merge: 2.5+ (Conditional classes)
  - clsx: 2.1+ (Dynamic class names)

State Management:
  - Zustand: 5.0+ (Client-side state)
  - TanStack Query: 5.85+ (Server state & caching)

UI Components:
  - Radix UI: Latest (Accessible primitives)
  - shadcn/ui: Latest (Component library)
  - Lucide React: 0.4+ (Icons)

Development Tools:
  - ESLint: 9+ (Next.js 15 compatible)
  - Prettier: 3.3+
  - Turbopack: Built into Next.js 15.5
```

### 2.2 Backend Technologies (Cost-Optimized)
```yaml
Runtime:
  - Node.js: 20 LTS (Vercel default)
  - Next.js API Routes: Edge Runtime

Data Layer (Ramp-Up Phase):
  - Upstash Redis: HTTP-based (Free: 500K commands/month)
  - Vercel Edge Config: Static data (Free: 100K reads)
  - localStorage: User preferences (Free)
  - Next.js Cache: Built-in caching (Free)

Data Layer (Growth Phase):
  - Vercel KV: Redis-compatible
  - Vercel Postgres: User data
  - Vercel Blob: File storage

API Integration:
  - Native fetch: Built into Next.js 15
  - zod: 3.23+ (Schema validation)
  - @upstash/redis: 1.34+ (Redis client)
  - @vercel/edge-config: Latest

Security:
  - Next.js middleware: Built-in security
  - @upstash/ratelimit: Rate limiting
  - jose: 5.9+ (JWT handling)

Monitoring (Free Tier):
  - Vercel Web Analytics: Free on Hobby
  - Vercel Speed Insights: Limited free tier
  - Console logging: Development
```

### 2.3 Testing Stack
```yaml
Unit Testing:
  - Vitest: 2.1+ (Fast, Next.js 15 compatible)
  - @testing-library/react: 16+
  - @testing-library/jest-dom: 6.6+

E2E Testing:
  - Playwright: 1.49+ (Recommended)
  - @playwright/test: Latest

Performance:
  - Lighthouse CI: Latest
  - Web Vitals: Built into Next.js
```

## 3. Project Structure (Next.js 15.5 App Router)

```
betodds/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── loading.tsx              # Loading UI
│   ├── error.tsx                # Error boundary
│   ├── api/                     # API routes (Edge Runtime)
│   │   ├── odds/
│   │   │   └── route.ts         # Edge function
│   │   ├── matches/
│   │   │   └── route.ts         # Edge function
│   │   └── cron/
│   │       └── warm-cache/
│   │           └── route.ts     # Cron job
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── features/                # Feature components
│   └── providers/               # Context providers
├── lib/                          # Core utilities
│   ├── upstash.ts               # Upstash Redis setup
│   ├── edge-config.ts           # Edge Config client
│   ├── odds-api.ts              # Odds API client
│   └── utils.ts                 # Helpers
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript definitions
├── config/                       # App configuration
├── public/                       # Static assets
├── .env.local                    # Local environment
├── next.config.mjs              # Next.js 15 config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## 4. Caching Strategy (Cost-Optimized)

### 4.1 Multi-Layer Cache Architecture

```typescript
// 1. Next.js 15 Built-in Fetch Cache (Free)
const fetchOdds = cache(async (matchId: string) => {
  const response = await fetch(url, {
    next: { 
      revalidate: 60,  // Revalidate every 60 seconds
      tags: [`match-${matchId}`]  // Cache tags for invalidation
    }
  });
  return response.json();
});

// 2. Upstash Redis Cache (Free Tier: 500K commands/month)
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache strategy
const cacheConfig = {
  matches: { ttl: 300 },      // 5 minutes
  odds: { ttl: 60 },          // 1 minute
  markets: { ttl: 3600 },     // 1 hour
};

// 3. Vercel Edge Config (Free: 100K reads/month)
import { get } from '@vercel/edge-config';

// Store static/semi-static data
const bookmakerConfig = await get('bookmakers');
const marketDefinitions = await get('markets');

// 4. Client-side Cache (TanStack Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,      // 1 minute
      gcTime: 5 * 60 * 1000,      // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,  // Save API calls
    },
  },
});

// 5. Browser Storage (localStorage)
const preferences = {
  oddsFormat: localStorage.getItem('oddsFormat') || 'decimal',
  selectedBookmakers: JSON.parse(localStorage.getItem('bookmakers') || '[]'),
};
```

### 4.2 Cache Optimization for Free Tier

```typescript
// Intelligent cache key management to maximize free tier
class CacheManager {
  private requestCount = 0;
  private dailyLimit = 16000; // Conservative limit for 500K/month

  async get(key: string): Promise<any> {
    // Check if we're approaching limits
    if (this.requestCount > this.dailyLimit * 0.8) {
      // Fallback to in-memory cache
      return this.getFromMemory(key);
    }
    
    try {
      const cached = await redis.get(key);
      this.requestCount++;
      return cached;
    } catch (error) {
      // Fallback to Edge Config for static data
      return await this.getFromEdgeConfig(key);
    }
  }

  // Use Edge Config for rarely changing data
  async getStaticData(key: string) {
    return await get(key); // Edge Config read
  }
}
```

## 5. API Design (Next.js 15 Edge Functions)

### 5.1 Edge Runtime Configuration

```typescript
// app/api/odds/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'edge';  // Use Edge Runtime
export const dynamic = 'force-dynamic';
export const revalidate = 60;  // Cache for 60 seconds

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');
  const market = searchParams.get('market');

  // Check Upstash Redis first
  const cacheKey = `odds:${matchId}:${market}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return Response.json(cached, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache': 'HIT',
      },
    });
  }

  // Fetch from Odds API
  const data = await fetchOddsFromAPI(matchId, market);
  
  // Store in cache
  await redis.setex(cacheKey, 60, JSON.stringify(data));

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'X-Cache': 'MISS',
    },
  });
}
```

### 5.2 Rate Limiting with Upstash

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  return { success, limit, reset, remaining };
}
```

## 6. Next.js 15.5 Specific Optimizations

### 6.1 Turbopack Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for development (stable in 15.5)
  experimental: {
    // Turbopack is now stable for dev, beta for production builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.bookmakers.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Optimize for Edge Runtime
  experimental: {
    serverComponentsExternalPackages: ['@upstash/redis'],
  },
};

export default nextConfig;
```

### 6.2 React Server Components Strategy

```tsx
// app/page.tsx - Server Component
import { Suspense } from 'react';
import { MatchSelector } from '@/components/match-selector';
import { OddsGrid } from '@/components/odds-grid';

// This runs on the server
async function getMatches() {
  const cached = await redis.get('matches:7days');
  if (cached) return cached;

  const matches = await fetchMatchesFromAPI();
  await redis.setex('matches:7days', 300, JSON.stringify(matches));
  return matches;
}

export default async function HomePage() {
  const matches = await getMatches();

  return (
    <main>
      {/* Server Component with data */}
      <MatchSelector matches={matches} />
      
      {/* Client Component wrapped in Suspense */}
      <Suspense fallback={<OddsGridSkeleton />}>
        <OddsGrid />
      </Suspense>
    </main>
  );
}
```

### 6.3 Partial Prerendering (PPR)

```tsx
// app/layout.tsx
export const experimental_ppr = true; // Enable PPR

// Components can mix static and dynamic
export default function Layout({ children }) {
  return (
    <html>
      <body>
        {/* Static shell */}
        <Header />
        
        {/* Dynamic content */}
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
        
        {/* Static footer */}
        <Footer />
      </body>
    </html>
  );
}
```

## 7. Environment Configuration

### 7.1 Environment Variables (Free Tier Setup)

```bash
# .env.local (Development)

# Odds API
ODDS_API_KEY=your_api_key_here
ODDS_API_BASE_URL=https://api.the-odds-api.com/v4

# Upstash Redis (Free Tier)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Vercel Edge Config (Free Tier)
EDGE_CONFIG=https://edge-config.vercel.com/your_config_id

# Public Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=optional_for_ramp_up
```

### 7.2 Edge Config Setup (Static Data)

```json
// Edge Config Contents (via Vercel Dashboard)
{
  "bookmakers": {
    "au": [
      { "key": "sportsbet", "name": "Sportsbet", "logo": "/logos/sportsbet.svg" },
      { "key": "tab", "name": "TAB", "logo": "/logos/tab.svg" },
      { "key": "neds", "name": "Neds", "logo": "/logos/neds.svg" },
      { "key": "ladbrokes_au", "name": "Ladbrokes", "logo": "/logos/ladbrokes.svg" }
    ]
  },
  "markets": {
    "h2h": { "name": "Match Result", "category": "match" },
    "totals": { "name": "Total Goals O/U", "category": "goals" },
    "btts": { "name": "Both Teams to Score", "category": "goals" }
  },
  "features": {
    "autoRefresh": true,
    "defaultMarket": "h2h",
    "refreshInterval": 60000
  }
}
```

## 8. Performance Optimization

### 8.1 Core Web Vitals Targets
```yaml
LCP: < 2.5s (Largest Contentful Paint)
INP: < 200ms (Interaction to Next Paint - replaces FID)
CLS: < 0.1 (Cumulative Layout Shift)
TTFB: < 600ms (Time to First Byte)
FCP: < 1.8s (First Contentful Paint)
```

### 8.2 Bundle Size Optimization

```javascript
// next.config.mjs
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize packages
  transpilePackages: ['@upstash/redis', '@vercel/edge-config'],
  
  // Bundle analyzer (dev only)
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('@next/bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          enabled: true,
        })
      );
    }
    return config;
  },
};
```

### 8.3 Dynamic Imports for Code Splitting

```typescript
// Lazy load heavy components
const OddsChart = dynamic(
  () => import('@/components/odds-chart'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false  // Client-side only
  }
);

// Route-based code splitting (automatic in App Router)
// Each route gets its own bundle
```

## 9. Monitoring & Analytics (Free Tier)

### 9.1 Vercel Analytics (Free on Hobby)

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />  {/* Free on Hobby plan */}
        <SpeedInsights /> {/* Limited free tier */}
      </body>
    </html>
  );
}
```

### 9.2 Custom Metrics (Console-based for MVP)

```typescript
// lib/metrics.ts
class MetricsCollector {
  trackEvent(event: string, properties?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Metrics]', event, properties);
    }
    
    // Send to free analytics service in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
  }

  trackApiCall(endpoint: string, duration: number, cached: boolean) {
    this.trackEvent('api_call', {
      endpoint,
      duration,
      cached,
      timestamp: Date.now(),
    });
  }
}

export const metrics = new MetricsCollector();
```

## 10. Development Workflow

### 10.1 Local Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/betodds.git
cd betodds

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server with Turbopack
npm run dev

# Open http://localhost:3000
```

### 10.2 Scripts

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbo",           // Turbopack dev server
    "build": "next build",                // Production build
    "start": "next start",                // Production server
    "lint": "next lint",                  // ESLint
    "type-check": "tsc --noEmit",        // TypeScript check
    "test": "vitest",                     // Unit tests
    "test:e2e": "playwright test",       // E2E tests
    "analyze": "ANALYZE=true next build" // Bundle analysis
  }
}
```

### 10.3 Git Workflow

```bash
# Feature branch workflow
main                  # Production
├── develop          # Development
└── feature/*        # Feature branches
    
# Example workflow
git checkout -b feature/odds-comparison
# Make changes
git add .
git commit -m "feat: add odds comparison grid"
git push origin feature/odds-comparison
# Create PR to develop
```

## 11. Deployment Configuration

### 11.1 Vercel Configuration (vercel.json)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "regions": ["syd1"],
  "functions": {
    "app/api/*/route.ts": {
      "runtime": "edge",
      "maxDuration": 10
    }
  },
  "crons": [
    {
      "path": "/api/cron/warm-cache",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

### 11.2 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token=$VERCEL_TOKEN
```

## 12. Cost Analysis (Updated)

### 12.1 Ramp-Up Phase (Month 1-3)
```yaml
Infrastructure:
  Vercel Hobby: $0
  Upstash Redis: $0 (500K commands free)
  Edge Config: $0 (100K reads free)
  
API:
  The Odds API (100K): $59/month
  
Total: $59/month
```

### 12.2 Growth Phase (Month 4-6)
```yaml
Infrastructure:
  Vercel Pro: $20/month
  Upstash Redis: ~$5/month (pay-as-you-go)
  Vercel Postgres: $20/month
  
API:
  The Odds API (100K): $59/month
  
Monitoring:
  Sentry (optional): $26/month
  
Total: $104-130/month
```

### 12.3 Scale Phase (Month 6+)
```yaml
Infrastructure:
  Vercel Pro: $20/month
  Vercel KV: ~$50/month
  Vercel Postgres: $45/month
  
API:
  The Odds API (5M): $119/month
  
Monitoring:
  Sentry: $26/month
  
Total: ~$260/month
```

## 13. Migration Path

### 13.1 From Free to Paid Services

```typescript
// Abstract cache layer for easy migration
interface CacheProvider {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

// Start with Upstash
class UpstashCache implements CacheProvider {
  async get(key: string) {
    return await upstashRedis.get(key);
  }
  // ...
}

// Migrate to Vercel KV later
class VercelKVCache implements CacheProvider {
  async get(key: string) {
    return await vercelKV.get(key);
  }
  // ...
}

// Easy switch via environment variable
const cache = process.env.USE_VERCEL_KV 
  ? new VercelKVCache() 
  : new UpstashCache();
```

## 14. Common Pitfalls to Avoid

### 14.1 Free Tier Gotchas
```markdown
❌ DON'T:
- Use Vercel KV on Hobby (costs money immediately)
- Exceed Upstash's 500K commands (charges apply)
- Store large objects in Edge Config (8KB limit)
- Make unnecessary API calls (preserve credits)

✅ DO:
- Cache aggressively but intelligently
- Use Edge Config for static data only
- Monitor Upstash usage dashboard
- Batch API requests when possible
- Use localStorage for user preferences
```

### 14.2 Performance Pitfalls
```markdown
❌ DON'T:
- Import large libraries client-side
- Fetch data in client components unnecessarily
- Use 'use client' directive everywhere
- Disable Next.js caching without reason

✅ DO:
- Use Server Components by default
- Implement proper Suspense boundaries
- Leverage Next.js 15's built-in optimizations
- Use dynamic imports for heavy components
- Enable Turbopack for faster development
```

## 15. Success Metrics

### 15.1 Technical KPIs
```yaml
Week 1 Goals:
  - Deploy to Vercel Hobby: ✓
  - < 2s page load time: Target
  - 0 critical errors: Target
  - Basic odds display: MVP

Month 1 Goals:
  - 99% uptime: Monitor
  - < 100MB monthly bandwidth: Track
  - < 100K Upstash commands: Monitor
  - < 10K API credits used: Track

Month 3 Goals:
  - 1000+ users: Analytics
  - < 1% error rate: Monitoring
  - 80% cache hit rate: Metrics
  - Ready for Pro upgrade: Evaluate
```

---

*Document Version: 2.0 (Validated & Cost-Optimized)*  
*Last Updated: January 2025*  
*Status: Ready for Implementation*  
*Validated Against: Latest stable releases as of January 2025*