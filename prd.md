# Product Requirements Document: EPL Odds Comparison Platform

## 1. Executive Summary

### 1.1 Product Name
**OddsComp EPL** - Australian EPL Betting Odds Comparison Platform

### 1.2 Vision Statement
Create a streamlined web application that empowers Australian sports bettors to quickly compare EPL betting odds across multiple local bookmakers, enabling informed betting decisions through transparent price comparison.

### 1.3 Problem Statement
Australian EPL bettors currently need to manually check multiple bookmaker websites to find the best odds for their desired markets, resulting in:
- Time-consuming price comparison process
- Missed opportunities for better odds
- Difficulty tracking price movements
- Suboptimal betting returns due to not finding best available prices

### 1.4 Solution Overview
A focused web application that aggregates and displays real-time EPL betting odds from major Australian bookmakers, allowing users to instantly compare prices across different markets and identify the best available odds.

## 2. Product Goals & Objectives

### 2.1 Primary Goals
1. **Simplify Odds Comparison**: Reduce time to compare odds from 10+ minutes to under 30 seconds
2. **Maximize Value**: Help users consistently find the best available odds
3. **Market Coverage**: Support all major EPL betting markets offered by Australian bookmakers
4. **Real-time Data**: Provide odds updates within 5-10 minutes of bookmaker changes

### 2.2 Success Metrics
- **User Engagement**: 70% of users return within 7 days
- **Comparison Efficiency**: Average time to find best odds < 30 seconds
- **Data Freshness**: 95% of odds displayed are within 10 minutes of actual
- **Market Coverage**: Support for 15+ betting markets
- **Bookmaker Coverage**: Include 6+ major Australian bookmakers

## 3. User Personas

### 3.1 Primary Persona: "Smart Punter Sam"
- **Age**: 25-45
- **Behavior**: Bets on EPL weekly, uses 2-3 bookmaker accounts
- **Goals**: Find best odds quickly, maximize returns
- **Pain Points**: Time-consuming to check multiple sites, often misses best prices
- **Tech Savvy**: Comfortable with web apps, uses mobile and desktop

### 3.2 Secondary Persona: "Casual Charlie"
- **Age**: 20-35
- **Behavior**: Bets occasionally on big matches
- **Goals**: Quick odds check before placing bet
- **Pain Points**: Overwhelmed by complex betting sites
- **Tech Savvy**: Prefers simple, intuitive interfaces

## 4. Functional Requirements

### 4.1 Core Features (MVP)

#### 4.1.1 Match Selection
- **Dropdown Menu**: Display EPL matches for next 7 days
- **Match Information**:
  - Team names (Home vs Away)
  - Match date and time (AEDT/AEST)
  - Competition round/gameweek
  - Venue (optional)
- **Default Selection**: Next upcoming match
- **Sorting**: Chronological order (soonest first)
- **Visual Indicators**: 
  - "LIVE" badge for in-play matches
  - "TODAY" badge for same-day matches

#### 4.1.2 Market Selection
- **Primary Markets** (MVP):
  - Head to Head (Match Result/1X2)
  - Total Goals (Over/Under 2.5)
  - Both Teams to Score (Yes/No)
  - First Goalscorer
  - Anytime Goalscorer
  - Asian Handicap
  - Draw No Bet
  - Double Chance
- **Market Categorization**:
  - Match Markets
  - Goal Markets
  - Player Markets
- **Default Selection**: Head to Head

#### 4.1.3 Odds Comparison Display
- **Grid Layout**:
  - Rows: Betting outcomes (e.g., Home/Draw/Away)
  - Columns: Bookmakers
- **Bookmaker Information**:
  - Logo/Name
  - Current odds (decimal format default)
  - Last update timestamp
- **Visual Highlights**:
  - Best odds highlighted in green
  - Price movement indicators (↑↓)
  - Odds format toggle (Decimal/Fractional)
- **Supported Bookmakers** (MVP):
  - Sportsbet
  - TAB
  - Neds
  - Ladbrokes
  - Unibet
  - Betfair

#### 4.1.4 Additional MVP Features
- **Auto-refresh**: Toggle for automatic odds updates (every 60 seconds)
- **Timestamp Display**: "Last updated: X minutes ago"
- **Responsive Design**: Mobile and desktop compatibility
- **Loading States**: Skeleton screens while fetching data
- **Error Handling**: Clear error messages for API failures

### 4.2 Phase 2 Features

#### 4.2.1 Enhanced Markets
- Correct Score
- Half-Time/Full-Time
- Team Total Goals
- Player Cards
- Corners markets
- Player Shots/Assists

#### 4.2.2 Advanced Filtering
- Filter bookmakers
- Minimum odds threshold
- Arbitrage opportunity detection
- Sure bet calculator

#### 4.2.3 User Accounts
- Save favorite teams
- Odds movement alerts
- Betting history tracking
- Custom bookmaker selection

#### 4.2.4 Historical Data
- Odds movement charts
- Historical best prices
- Market liquidity indicators

### 4.3 Phase 3 Features
- Multi-sport expansion
- Betting calculator tools
- Social features (tips sharing)
- API access for developers
- White-label solution

## 5. User Interface Design

### 5.1 Layout Structure

```
┌─────────────────────────────────────────────┐
│                  HEADER                      │
│           OddsComp EPL | Refresh ⟳          │
├─────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Match Dropdown  │  │ Market Dropdown │  │
│  └─────────────────┘  └─────────────────┘  │
│                                              │
│  Last Updated: 2 mins ago   [Auto-refresh ✓]│
│                                              │
├─────────────────────────────────────────────┤
│                ODDS GRID                     │
│  ┌────────┬────────┬────────┬────────┬────┐│
│  │Outcome │SportsBet│  TAB  │ Neds  │ ... ││
│  ├────────┼────────┼────────┼────────┼────┤│
│  │Man Utd │  3.40  │ 3.35* │  3.30 │ ... ││
│  │  Draw  │  3.25  │ 3.20  │ 3.25* │ ... ││
│  │Liverpool│  2.20* │ 2.25  │  2.22 │ ... ││
│  └────────┴────────┴────────┴────────┴────┘│
│              * Best available odds           │
└─────────────────────────────────────────────┘
```

### 5.2 Visual Design Principles
- **Clean & Minimal**: Focus on data clarity
- **High Contrast**: Easy readability of odds
- **Color Coding**: 
  - Green: Best odds
  - Red: Odds decreased
  - Blue: Odds increased
  - Gray: Unavailable/Suspended
- **Responsive Grid**: Adapts to screen size
- **Mobile-First**: Optimized for mobile betting

### 5.3 Interaction Design
- **Dropdown Behavior**: Search/filter capability for 10+ items
- **Click Actions**: Click odds to open bookmaker (new tab)
- **Hover States**: Show additional info (margin, last update)
- **Loading States**: Progressive data loading
- **Error States**: Inline error messages with retry options

## 6. Technical Requirements

### 6.1 Technology Stack

#### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand or Redux Toolkit
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

#### Backend
- **Runtime**: Node.js 20+ 
- **Framework**: Express.js or Fastify
- **Caching**: Redis for odds caching
- **Database**: PostgreSQL for historical data
- **API Integration**: The Odds API

#### Infrastructure
- **Hosting**: Vercel/Netlify (Frontend), AWS/Railway (Backend)
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: Google Analytics 4

### 6.2 API Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│ The Odds API │
│    React     │     │   Express    │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Redis     │
                     │    Cache     │
                     └──────────────┘
```

### 6.3 Data Flow
1. Frontend requests match/odds data
2. Backend checks Redis cache (TTL: 5 minutes)
3. If cache miss, fetch from The Odds API
4. Transform and normalize data
5. Store in cache and return to frontend
6. Frontend displays with real-time updates

### 6.4 Performance Requirements
- **Page Load**: < 2 seconds (FCP)
- **Data Refresh**: < 1 second
- **Mobile Performance**: Lighthouse score > 90
- **Uptime**: 99.9% availability
- **Concurrent Users**: Support 1000+ concurrent

### 6.5 Security Requirements
- **API Key Management**: Server-side only
- **Rate Limiting**: Protect against abuse
- **HTTPS**: All connections encrypted
- **CORS**: Properly configured
- **Input Validation**: Sanitize all inputs
- **Error Handling**: No sensitive data in errors

## 7. Data Schema

### 7.1 Match Object
```typescript
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: Date;
  gameweek: number;
  venue?: string;
  isLive: boolean;
}
```

### 7.2 Market Object
```typescript
interface Market {
  key: string;
  name: string;
  category: 'match' | 'goals' | 'player';
  outcomes: Outcome[];
}
```

### 7.3 Odds Object
```typescript
interface OddsComparison {
  matchId: string;
  market: string;
  bookmakers: BookmakerOdds[];
  lastUpdate: Date;
}

interface BookmakerOdds {
  key: string;
  name: string;
  outcomes: {
    name: string;
    price: number;
    previousPrice?: number;
    isBest: boolean;
  }[];
  lastUpdate: Date;
}
```

## 8. User Flow

### 8.1 Primary User Journey
1. User lands on homepage
2. Views next EPL match pre-selected
3. Sees H2H odds comparison by default
4. Identifies best odds (highlighted)
5. Clicks odds to visit bookmaker
6. OR selects different match/market
7. Compares new odds
8. Repeats selection process

### 8.2 Edge Cases
- No matches in next 7 days → Show "Season break" message
- Market unavailable → Show "Market not offered"
- API failure → Show cached data with warning
- Bookmaker odds suspended → Gray out with "Suspended"

## 9. Development Phases

### Phase 1: MVP (Weeks 1-4)
**Week 1-2**:
- Project setup and architecture
- API integration with The Odds API
- Basic backend with caching

**Week 3**:
- Frontend components (dropdowns, grid)
- Responsive design implementation
- Core odds comparison logic

**Week 4**:
- Testing and bug fixes
- Performance optimization
- Deployment setup

### Phase 2: Enhancement (Weeks 5-8)
- Additional markets
- Historical odds tracking
- Advanced filtering
- User preferences (localStorage)
- Performance monitoring

### Phase 3: Scale (Weeks 9-12)
- User accounts system
- Alerts and notifications
- Mobile app consideration
- API rate limit optimization
- A/B testing framework

## 10. Success Criteria

### 10.1 Launch Criteria (MVP)
- [ ] Display next 7 days of EPL matches
- [ ] Support 8+ betting markets
- [ ] Include 5+ Australian bookmakers
- [ ] Mobile responsive design
- [ ] Sub-2 second load time
- [ ] 99% uptime
- [ ] Odds refresh within 10 minutes

### 10.2 Post-Launch Metrics (Month 1)
- 1,000+ unique users
- 5,000+ odds comparisons
- < 3% error rate
- 4+ average session duration (minutes)
- 50%+ mobile usage

### 10.3 Growth Metrics (Month 3)
- 10,000+ monthly active users
- 70% user retention (weekly)
- 3.5+ user satisfaction score
- 100,000+ odds comparisons
- Positive ROI on infrastructure costs

## 11. Risks & Mitigation

### 11.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits | High | Implement aggressive caching, request batching |
| API downtime | High | Failover to cached data, status page |
| Data accuracy | Medium | Validation checks, user reporting |
| Performance issues | Medium | CDN, lazy loading, code splitting |

### 11.2 Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Legal/regulatory | High | Legal review, terms of service |
| Bookmaker blocking | Medium | Respect robots.txt, rate limiting |
| Competition | Medium | Focus on UX, quick iterations |
| User adoption | Medium | SEO, social media, partnerships |

## 12. Future Considerations

### 12.1 Expansion Opportunities
- **Additional Leagues**: Championship, Champions League, Europa League
- **Other Sports**: NRL, AFL, Cricket, Tennis
- **Betting Tools**: Calculators, bankroll management
- **Educational Content**: Betting guides, statistics
- **Mobile Apps**: iOS and Android native apps

### 12.2 Revenue Models
- **Affiliate Commission**: Bookmaker partnerships
- **Premium Features**: Advanced alerts, API access
- **White Label**: B2B licensing
- **Advertising**: Targeted ads (responsible gambling)

## 13. Compliance & Legal

### 13.1 Requirements
- Age verification notice (18+)
- Responsible gambling messaging
- Terms of service and privacy policy
- GDPR compliance (if applicable)
- Australian gambling advertising standards

### 13.2 Disclaimers
- Odds for information only
- No guarantee of accuracy
- Gamble responsibly messaging
- Links to gambling help services

## 14. Appendix

### 14.1 Competitor Analysis
| Competitor | Strengths | Weaknesses | Opportunity |
|------------|-----------|------------|-------------|
| Odds Portal | Comprehensive | Complex UI | Simpler UX |
| OddsChecker | Well-known brand | Cluttered | Focus on EPL |
| PuntingForm | Australian focus | Limited markets | Better coverage |

### 14.2 Technical Dependencies
- The Odds API subscription (100K plan recommended)
- Redis Cloud or AWS ElastiCache
- Vercel Pro or AWS hosting
- Cloudflare CDN
- Sentry error tracking

### 14.3 Team Requirements
- **Frontend Developer**: React/TypeScript expert
- **Backend Developer**: Node.js/API integration
- **UI/UX Designer**: Mobile-first design
- **DevOps**: Cloud infrastructure
- **Product Manager**: Feature prioritization

## 15. Acceptance Criteria

### 15.1 Definition of Done
- [ ] Code reviewed and approved
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Deployed to production

### 15.2 Sign-off Requirements
- Product Manager approval
- Technical lead approval
- Legal/compliance review
- Stakeholder demonstration
- User acceptance testing

---

*Document Version: 1.0*  
*Last Updated: January 2025*  
*Status: Draft*  
*Owner: Product Team*