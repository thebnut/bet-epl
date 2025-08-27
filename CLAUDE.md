# Claude Code Instructions - BetOdds EPL Project

## Project Overview
This is an EPL (English Premier League) odds comparison web application that compares betting odds across major Australian bookmakers (Sportsbet, TAB, Neds, Ladbrokes, etc.).

## Tech Stack
- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand + TanStack Query v5
- **Deployment**: Vercel (Free Hobby tier)
- **API**: The Odds API ($59/month for 100K credits)
- **Version Control**: Git + GitHub

## Key Architecture Decisions
1. **No External Cache**: Uses Next.js built-in caching instead of Redis/Upstash
2. **Edge Runtime**: All API routes use Vercel Edge Runtime for optimal performance
3. **Sydney Region**: Deployed to syd1 for Australian users
4. **Client Caching**: TanStack Query handles client-side caching with 60s stale time

## API Integration
- **Base URL**: https://api.the-odds-api.com/v4
- **Sport Key**: `soccer_epl`
- **Region**: `au` (Australian bookmakers)
- **Markets**: h2h, totals, spreads, btts, etc.
- **Caching**: 60s for odds, 5min for matches

## Environment Variables
```bash
# Required in .env.local and Vercel dashboard
ODDS_API_KEY=your_api_key_here  # From https://the-odds-api.com/
ODDS_API_BASE_URL=https://api.the-odds-api.com/v4
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or production URL
```

## Deployment Pipeline

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

### Git Workflow
```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```

### CI/CD Pipeline (Automated)
1. **Push to GitHub** → `https://github.com/thebnut/bet-epl`
2. **Vercel Detects** → Automatically triggers build
3. **Build & Deploy** → ~45-60 seconds
4. **Live at** → `https://bet-epl.vercel.app`

## Production URLs
- **Main**: https://bet-epl.vercel.app
- **GitHub**: https://github.com/thebnut/bet-epl
- **Vercel Dashboard**: https://vercel.com/brett-thebaults-projects/bet-epl

## API Credit Management
- **Plan**: 100K credits/month ($59)
- **Usage**: ~600 credits/day for 100 users
- **Monitoring**: Check headers `x-requests-remaining` in API responses
- **Conservation**: 
  - No auto-refresh by default
  - 60s cache on odds
  - 5min cache on matches
  - Disabled refetch on window focus

## Important Commands
```bash
# Test API connection
ODDS_API_KEY=your_key node test-api.js

# Deploy manually to Vercel
npx vercel --prod

# Check deployment status
npx vercel ls bet-epl

# View logs
npx vercel logs bet-epl

# Add/update environment variables
npx vercel env add ODDS_API_KEY production
```

## Project Structure
```
/app              # Next.js App Router
  /api           # Edge API routes
    /matches     # Get EPL matches
    /odds        # Get odds for specific match
    /markets     # Get available betting markets
  layout.tsx     # Root layout with providers
  page.tsx       # Main page with odds comparison
/components      # React components
  match-selector.tsx   # Dropdown for match selection
  market-selector.tsx  # Dropdown for market selection
  odds-grid.tsx       # Grid displaying odds comparison
/lib            # Utilities
  odds-api.ts   # The Odds API client
  utils.ts      # Helper functions
/hooks          # Custom React hooks
  use-odds.ts   # Fetch odds with TanStack Query
  use-matches.ts # Fetch matches
```

## Performance Optimizations
1. **Edge Runtime**: All API routes use Edge for faster responses
2. **Built-in Caching**: Next.js fetch with `revalidate`
3. **CDN Caching**: Vercel Edge Network caches responses
4. **Client Caching**: TanStack Query prevents unnecessary refetches
5. **No External Dependencies**: No Redis/database needed

## Common Tasks

### Adding New Markets
1. Add to `MARKETS` constant in `/types/index.ts`
2. Update market selector if needed
3. Test with API to ensure data availability

### Updating Bookmakers
1. Edit `BOOKMAKERS` array in `/types/index.ts`
2. Add bookmaker logo if available
3. Update odds grid display logic

### Debugging API Issues
1. Check API key in Vercel dashboard
2. Monitor credits: `node test-api.js`
3. View logs: `npx vercel logs bet-epl`
4. Check response headers for rate limits

## Cost Breakdown
- **Hosting**: $0/month (Vercel Hobby)
- **API**: $59/month (The Odds API 100K plan)
- **Total**: $59/month

## Scaling Considerations
When reaching 500+ daily users:
1. Upgrade to Odds API 5M plan ($119/month)
2. Consider adding Upstash Redis (free tier: 500K commands)
3. Upgrade to Vercel Pro ($20/month)
4. Add monitoring with Sentry

## Security Notes
- API key is server-side only (never exposed to client)
- Environment variables set in Vercel dashboard
- `.env.local` is gitignored
- Edge Runtime provides additional security

## Troubleshooting

### "Unable to Load Matches" Error
- Check API key is set in Vercel dashboard
- Verify API credits available
- Check Vercel logs for errors

### Build Failures
- Run `npm run build` locally first
- Check for TypeScript errors: `npm run type-check`
- Review ESLint warnings: `npm run lint`

### Deployment Issues
- Ensure GitHub repo is connected in Vercel
- Check build logs in Vercel dashboard
- Verify environment variables are set

---

**Last Updated**: August 2025
**Maintained by**: Claude Code + Human Developer
**License**: Educational Use