#!/bin/bash

echo "🚀 BetOdds EPL Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Odds API key"
    echo "   Get your API key from: https://the-odds-api.com/"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your ODDS_API_KEY"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "To deploy to Vercel:"
echo "  npx vercel"
echo ""