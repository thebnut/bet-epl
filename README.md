# BetOdds EPL - Australian Bookmaker Odds Comparison

A simple, fast web application to compare EPL betting odds across major Australian bookmakers including Sportsbet, TAB, Neds, Ladbrokes, and more.

## Features

- 📊 Real-time odds comparison across 6+ Australian bookmakers
- ⚽ EPL match coverage for the next 7 days
- 📈 Multiple betting markets (Match Result, Over/Under, Asian Handicap, etc.)
- ✨ Best odds highlighting
- 🔄 Manual and auto-refresh options
- 📱 Mobile-responsive design
- ⚡ Built with Next.js 15 and Edge Runtime for maximum performance
- 💰 Cost-optimized (only $59/month for API)

## Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand + TanStack Query v5
- **Deployment**: Vercel (Hobby plan compatible)
- **API**: The Odds API

## Getting Started

### Prerequisites

- Node.js 20+ installed
- An API key from [The Odds API](https://the-odds-api.com/)
- A Vercel account (free Hobby plan is sufficient)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/betodds.git
   cd betodds
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   
   # Edit .env.local and add your Odds API key
   # Get your key from: https://the-odds-api.com/
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set environment variables**
   ```bash
   vercel env add ODDS_API_KEY production
   # Enter your API key when prompted
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variable `ODDS_API_KEY` in project settings
4. Deploy automatically on every push to main branch

## API Credits Usage

With The Odds API 100K plan ($59/month):
- **Expected usage**: ~600 credits/day for 100 daily users
- **Monthly total**: ~18,000 credits (82% remaining)
- **Caching**: Next.js built-in caching reduces API calls by ~80%

## Key Features Explained

### No External Cache Required
- Uses Next.js 15's built-in fetch caching
- Vercel CDN edge caching
- TanStack Query for client-side caching
- No Redis/database needed for MVP

### Smart Credit Optimization
- 60-second cache for odds data
- 5-minute cache for match lists
- No auto-refresh by default (user controlled)
- Disabled refetch on window focus

## Project Structure

```
betodds/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Edge Runtime)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and API client
├── types/                 # TypeScript definitions
└── public/               # Static assets
```

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Cost Breakdown

**Total Monthly Cost: $59**
- Vercel Hosting: $0 (Hobby plan)
- The Odds API: $59 (100K credits)
- No database or cache costs

## Scaling Considerations

When you reach 500+ daily users:
1. Upgrade to The Odds API 5M plan ($119/month)
2. Consider adding Upstash Redis (free tier: 500K commands)
3. Upgrade to Vercel Pro ($20/month) for better performance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes. Please gamble responsibly.

## Support

For issues or questions, please open an issue in the GitHub repository.

## Responsible Gambling

- 18+ Only
- Gamble Responsibly
- Set limits and stick to them
- Never chase losses
- Seek help if needed: [Gambling Help Online](https://www.gamblinghelponline.org.au/)

---

Built with ❤️ using Next.js 15 and The Odds API