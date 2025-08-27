# Technical Requirements: EPL Odds Comparison (Simplified - No Redis)

## The Cache Question: Do We Really Need It?

### Quick Answer: No! 🎉

For an MVP with <1000 daily users, Next.js 15's built-in caching is sufficient. Adding Redis/Upstash adds complexity without meaningful benefits at this scale.

## 1. Ultra-Simple Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL CDN                               │
│            (Automatic Edge Caching - FREE)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 NEXT.JS 15.5 on VERCEL                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           React Server Components                    │  │
│  │         (Fetch with built-in caching)              │  │
│  └─────────────────────────────────────────────────────┘  │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              API Routes (Edge)                      │  │
│  │         (60-second cache headers)                   │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  THE ODDS API    │
                    │   ($59/month)    │
                    └──────────────────┘
```

## 2. How Caching Works Without Redis

### 2.1 Next.js Built-in Fetch Cache
```typescript
// This automatically caches for 60 seconds!
async function getOdds(matchId: string, market: string) {
  const res = await fetch(
    `https://api.the-odds-api.com/v4/sports/soccer_epl/odds?` +
    `eventIds=${matchId}&markets=${market}&regions=au&apiKey=${API_KEY}`,
    { 
      next: { revalidate: 60 }  // Cache for 60 seconds
    }
  );
  return res.json();
}
```

### 2.2 API Route with CDN Caching
```typescript
// app/api/odds/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');
  const market = searchParams.get('market');

  // Fetch from Odds API
  const data = await getOdds(matchId!, market!);

  // Return with cache headers for CDN
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### 2.3 Client-Side with TanStack Query
```typescript
// No server cache needed - just smart client caching
const { data, isLoading } = useQuery({
  queryKey: ['odds', matchId, market],
  queryFn: () => fetchOdds(matchId, market),
  staleTime: 60 * 1000,      // Consider data fresh for 60s
  gcTime: 5 * 60 * 1000,      // Keep in cache for 5 mins
  refetchInterval: false,     // No auto-refresh (save credits!)
});
```

## 3. Credit Usage Optimization (Without External Cache)

### 3.1 Smart Fetching Strategies
```typescript
// DON'T: Fetch on every render
const OddsGrid = ({ matchId }) => {
  const [odds, setOdds] = useState();
  useEffect(() => {
    fetchOdds(matchId);  // ❌ Fires on every mount
  }, [matchId]);
};

// DO: Use React Query with proper stale time
const OddsGrid = ({ matchId }) => {
  const { data } = useQuery({
    queryKey: ['odds', matchId],
    queryFn: () => fetchOdds(matchId),
    staleTime: 60000,  // ✅ Reuses cached data for 60s
  });
};
```

### 3.2 Disable Auto-Refresh by Default
```typescript
// Only refresh when user explicitly clicks refresh button
const [isAutoRefresh, setIsAutoRefresh] = useState(false);

const { data, refetch } = useQuery({
  queryKey: ['odds', matchId, market],
  queryFn: fetchOdds,
  refetchInterval: isAutoRefresh ? 60000 : false,  // User controls
});
```

## 4. Simplified Tech Stack

### 4.1 What We're Using
```yaml
Frontend:
  - Next.js 15.5 (with Turbopack)
  - React 18.3
  - TypeScript 5.7
  - TailwindCSS 3.4
  - TanStack Query v5 (client-side caching)
  - Zustand (simple state management)

Backend:
  - Next.js API Routes (Edge Runtime)
  - Native fetch() with caching
  - Zod for validation

Infrastructure:
  - Vercel Hobby ($0)
  - The Odds API ($59/month)
  
Total Cost: $59/month
```

### 4.2 What We're NOT Using (Yet)
```yaml
Not Needed for MVP:
  ❌ Redis/Upstash
  ❌ Vercel KV  
  ❌ External databases
  ❌ Complex monitoring
  ❌ Session management
  ❌ User accounts
```

## 5. File Structure (Simplified)

```
betodds/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (Server Component)
│   ├── api/
│   │   ├── matches/route.ts   # Get matches endpoint
│   │   └── odds/route.ts       # Get odds endpoint
│   └── globals.css
├── components/
│   ├── match-selector.tsx      # Client Component
│   ├── market-selector.tsx     # Client Component
│   └── odds-grid.tsx           # Client Component
├── lib/
│   ├── odds-api.ts            # API client
│   └── utils.ts                # Helpers
├── hooks/
│   └── use-odds.ts            # Custom hook with React Query
├── types/
│   └── index.ts               # TypeScript types
├── .env.local                  # API keys
├── next.config.mjs
├── package.json
└── tailwind.config.ts
```

## 6. Implementation Examples

### 6.1 Server Component (Cached Automatically)
```tsx
// app/page.tsx
async function getMatches() {
  // This is cached by Next.js for 5 minutes
  const res = await fetch(
    `https://api.the-odds-api.com/v4/sports/soccer_epl/events?` +
    `apiKey=${process.env.ODDS_API_KEY}`,
    { next: { revalidate: 300 } }
  );
  return res.json();
}

export default async function HomePage() {
  const matches = await getMatches();
  
  return (
    <main className="container mx-auto p-4">
      <h1>EPL Odds Comparison</h1>
      <MatchSelector matches={matches} />
      <OddsDisplay />
    </main>
  );
}
```

### 6.2 Client Component with TanStack Query
```tsx
// components/odds-grid.tsx
'use client';

import { useQuery } from '@tanstack/react-query';

export function OddsGrid({ matchId, market }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['odds', matchId, market],
    queryFn: async () => {
      const res = await fetch(`/api/odds?matchId=${matchId}&market=${market}`);
      return res.json();
    },
    staleTime: 60 * 1000,  // Data is fresh for 60 seconds
    enabled: !!matchId,    // Only fetch when matchId exists
  });

  if (isLoading) return <div>Loading odds...</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh Odds</button>
      {/* Render odds grid */}
    </div>
  );
}
```

### 6.3 API Route with Caching Headers
```typescript
// app/api/odds/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';  // Use Edge Runtime

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const matchId = searchParams.get('matchId');
  const market = searchParams.get('market') || 'h2h';

  try {
    // Fetch from The Odds API
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer_epl/odds?` +
      `apiKey=${process.env.ODDS_API_KEY}&` +
      `regions=au&markets=${market}&eventIds=${matchId}`,
      { next: { revalidate: 60 } }  // Server-side cache
    );

    const data = await response.json();

    // Return with CDN cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch odds' },
      { status: 500 }
    );
  }
}
```

## 7. Development Workflow

### 7.1 Quick Start
```bash
# Create Next.js app
npx create-next-app@latest betodds --typescript --tailwind --app

# Install minimal dependencies
npm install @tanstack/react-query zustand zod clsx tailwind-merge

# Add your API key to .env.local
echo "ODDS_API_KEY=your_key_here" > .env.local

# Start development
npm run dev
```

### 7.2 Deployment
```bash
# Deploy to Vercel (one command!)
npx vercel

# Set environment variable in Vercel
vercel env add ODDS_API_KEY production
```

## 8. When to Add Caching

### 8.1 You DON'T Need Redis Cache If:
- < 1000 daily active users ✅
- < 50 concurrent users ✅
- Odds refresh every 60+ seconds ✅
- Users manually refresh ✅
- MVP/proof of concept ✅

### 8.2 Consider Adding Cache When:
- > 5000 daily users
- Auto-refresh < 30 seconds
- Multiple sports/leagues
- Historical data tracking
- API credits running low

### 8.3 Migration Path (When Needed)
```typescript
// Start with simple fetch
const getOdds = async (matchId) => {
  return fetch(`/api/odds?matchId=${matchId}`);
};

// Later, add caching layer
const getOdds = async (matchId) => {
  // Check cache first
  const cached = await redis.get(`odds:${matchId}`);
  if (cached) return cached;
  
  // Fetch and cache
  const data = await fetch(`/api/odds?matchId=${matchId}`);
  await redis.setex(`odds:${matchId}`, 60, data);
  return data;
};
```

## 9. Performance Without External Cache

### 9.1 Expected Performance
```yaml
First Load (Cache Miss):
  - API call to Odds API: ~500ms
  - Next.js processing: ~100ms
  - Total: ~600ms ✅

Subsequent Loads (Cache Hit):
  - Served from CDN: ~50ms ✅
  - No API credits used ✅

Client Navigation:
  - TanStack Query cache: ~0ms ✅
  - Instant UI updates ✅
```

### 9.2 Credit Usage Projection
```yaml
Week 1 (10 users/day):
  - ~300 credits/day
  - ~2,100 credits/week
  - Well under 100K limit ✅

Month 1 (100 users/day):
  - ~600 credits/day  
  - ~18,000 credits/month
  - 82% credits remaining ✅

Month 3 (500 users/day):
  - ~3,000 credits/day
  - ~90,000 credits/month
  - Time to consider caching 🤔
```

## 10. Monitoring (Simple)

### 10.1 Track API Usage
```typescript
// Simple credit tracker
let dailyCredits = 0;
const MAX_DAILY = 3000;  // Conservative limit

async function fetchWithTracking(url: string) {
  if (dailyCredits > MAX_DAILY) {
    console.warn('Approaching daily credit limit!');
    // Return cached or show warning
  }
  
  dailyCredits++;
  return fetch(url);
}
```

### 10.2 Basic Analytics
```typescript
// Use Vercel Analytics (free tier)
import { Analytics } from '@vercel/analytics/react';

// Track important events
function trackOddsView(market: string) {
  if (window.gtag) {
    window.gtag('event', 'view_odds', { market });
  }
}
```

## 11. Common Mistakes to Avoid

### 11.1 Don't Over-Engineer
```typescript
// ❌ Too complex for MVP
class OddsService {
  private cache: RedisCache;
  private fallbackCache: MemoryCache;
  private queue: BullQueue;
  private rateLimiter: RateLimiter;
  // ... 500 lines of code
}

// ✅ Simple and works
async function getOdds(matchId: string) {
  const res = await fetch(`/api/odds?matchId=${matchId}`);
  return res.json();
}
```

### 11.2 Don't Fetch Unnecessarily
```typescript
// ❌ Fetches on every tab focus
useQuery({
  queryKey: ['odds'],
  refetchOnWindowFocus: true,  // Wastes credits!
});

// ✅ Smart refetching
useQuery({
  queryKey: ['odds'],
  refetchOnWindowFocus: false,
  staleTime: 60000,  // Reuse data for 1 minute
});
```

## 12. The Bottom Line

### Start Simple, Scale Smart

**Phase 1 (Now)**: 
- No Redis needed
- Use Next.js built-in caching
- Manual refresh only
- $59/month total cost

**Phase 2 (When you have users)**:
- Add auto-refresh
- Monitor credit usage
- Consider Upstash if needed
- ~$65/month

**Phase 3 (When you're growing)**:
- Add Redis cache
- User accounts
- Multiple sports
- ~$150/month

### Why This Approach Works

1. **Faster to build**: No cache setup/debugging
2. **Cheaper to run**: $59 vs $105/month
3. **Easier to maintain**: Less moving parts
4. **Good enough performance**: CDN + React Query = fast
5. **Easy to scale later**: Add cache when actually needed

### One-Week MVP Checklist

- [ ] Day 1: Setup Next.js, add Tailwind
- [ ] Day 2: Create match selector, market dropdown
- [ ] Day 3: Build odds grid component
- [ ] Day 4: Integrate Odds API
- [ ] Day 5: Add TanStack Query for client caching
- [ ] Day 6: Deploy to Vercel
- [ ] Day 7: Test and refine

**Total complexity: Low**  
**Total cost: $59/month**  
**Time to market: 1 week**

---

*Remember: You can always add complexity later. Start simple, ship fast, iterate based on real usage.*