// Test script to verify The Odds API connection
// Run with: node test-api.js

const API_KEY = process.env.ODDS_API_KEY || 'your_api_key_here';
const BASE_URL = 'https://api.the-odds-api.com/v4';

async function testAPI() {
  console.log('🧪 Testing The Odds API Connection...\n');
  
  if (API_KEY === 'your_api_key_here') {
    console.error('❌ Please set your API key in .env.local first!');
    console.log('   Get your key from: https://the-odds-api.com/');
    process.exit(1);
  }

  try {
    // Test 1: Check sports endpoint
    console.log('1. Testing /sports endpoint...');
    const sportsResponse = await fetch(`${BASE_URL}/sports?apiKey=${API_KEY}`);
    
    if (!sportsResponse.ok) {
      throw new Error(`API returned ${sportsResponse.status}: ${sportsResponse.statusText}`);
    }
    
    const sports = await sportsResponse.json();
    const epl = sports.find(s => s.key === 'soccer_epl');
    
    if (epl) {
      console.log(`   ✅ EPL found: ${epl.title}`);
    } else {
      console.log('   ⚠️  EPL not found in sports list');
    }
    
    // Check remaining credits
    const remainingCredits = sportsResponse.headers.get('x-requests-remaining');
    const usedCredits = sportsResponse.headers.get('x-requests-used');
    console.log(`   📊 API Credits - Used: ${usedCredits}, Remaining: ${remainingCredits}\n`);
    
    // Test 2: Check EPL odds
    console.log('2. Testing EPL odds endpoint...');
    const oddsResponse = await fetch(
      `${BASE_URL}/sports/soccer_epl/odds?apiKey=${API_KEY}&regions=au&markets=h2h`
    );
    
    if (!oddsResponse.ok) {
      throw new Error(`Odds API returned ${oddsResponse.status}`);
    }
    
    const matches = await oddsResponse.json();
    console.log(`   ✅ Found ${matches.length} upcoming EPL matches`);
    
    if (matches.length > 0) {
      const match = matches[0];
      console.log(`   📅 Next match: ${match.home_team} vs ${match.away_team}`);
      console.log(`   🕐 Starts: ${new Date(match.commence_time).toLocaleString('en-AU')}`);
      
      const bookmakers = match.bookmakers ? match.bookmakers.length : 0;
      console.log(`   📚 Available bookmakers: ${bookmakers}`);
    }
    
    console.log('\n✅ API connection successful!');
    console.log('   You can now run: npm run dev');
    
  } catch (error) {
    console.error('\n❌ API Test Failed:');
    console.error(`   ${error.message}`);
    console.log('\n   Please check:');
    console.log('   1. Your API key is correct');
    console.log('   2. You have remaining credits');
    console.log('   3. Your internet connection');
    process.exit(1);
  }
}

// Load .env.local if it exists
try {
  require('fs').readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
} catch (e) {
  console.log('ℹ️  No .env.local file found, using environment variables');
}

testAPI();