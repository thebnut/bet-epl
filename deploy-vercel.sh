#!/bin/bash

echo "🚀 Deploying bet-epl to Vercel"
echo "=============================="
echo ""

# Deploy to production
echo "📦 Deploying to production..."
npx vercel --prod

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "⚠️  IMPORTANT: After deployment completes:"
echo ""
echo "1. Go to your Vercel dashboard: https://vercel.com/dashboard"
echo "2. Click on the 'bet-epl' project"
echo "3. Go to 'Settings' → 'Environment Variables'"
echo "4. Add the following variable:"
echo "   Name: ODDS_API_KEY"
echo "   Value: [Your API key from https://the-odds-api.com/]"
echo "   Environment: Production, Preview, Development"
echo ""
echo "5. After adding the environment variable, redeploy:"
echo "   npx vercel --prod"
echo ""
echo "Your app will be available at the URL shown above!"