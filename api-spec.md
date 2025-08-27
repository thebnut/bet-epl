# The Odds API Specification

## Overview
The Odds API provides real-time and historical sports betting odds from global bookmakers. This specification focuses on English Premier League (EPL) matches from Australian bookmakers.

## Base Information

### Base URL
```
https://api.the-odds-api.com
```

### Authentication
- **Method**: API Key via query parameter
- **Parameter**: `apiKey`
- **Example**: `?apiKey=YOUR_API_KEY`

### Rate Limiting & Credits
- API uses a credit-based quota system
- Credits reset monthly based on subscription plan
- Different endpoints consume different amounts of credits:
  - `/sports`: 1 credit
  - `/odds`: 1-2 credits per sport
  - `/scores`: 1 credit per sport
  - `/historical/odds`: 10 credits per region per market
- Remaining credits shown in response headers:
  - `x-requests-remaining`
  - `x-requests-used`

## Pricing Tiers
| Plan | Monthly Cost | Credits | Best For |
|------|-------------|---------|----------|
| Starter | Free | 500 | Testing/Development |
| 20K | $30 | 20,000 | Small applications |
| 100K | $59 | 100,000 | Medium applications |
| 5M | $119 | 5,000,000 | Large applications |
| 15M | $249 | 15,000,000 | Enterprise |

## EPL-Specific Configuration

### Sport Key
```
soccer_epl
```

### Australian Bookmakers
The following Australian bookmakers are available under region `au`:
- `sportsbet` - Sportsbet
- `tab` - TAB
- `neds` - Neds
- `ladbrokes_au` - Ladbrokes Australia
- `betfair` - Betfair
- `unibet` - Unibet

## Endpoints

### 1. List Available Sports
```http
GET /v4/sports/
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apiKey | string | Yes | Your API key |
| all | boolean | No | Include inactive sports |

**Response Example:**
```json
[
  {
    "key": "soccer_epl",
    "group": "Soccer",
    "title": "EPL",
    "description": "English Premier League",
    "active": true,
    "has_outrights": false
  }
]
```

### 2. Get EPL Odds
```http
GET /v4/sports/soccer_epl/odds/
```

**Query Parameters:**
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| apiKey | string | Yes | Your API key | - |
| regions | string | No | Comma-separated regions (use `au` for Australian) | us |
| markets | string | No | Comma-separated markets (see Markets section) | h2h |
| oddsFormat | string | No | `decimal` or `american` | decimal |
| dateFormat | string | No | `iso` or `unix` | iso |
| eventIds | string | No | Filter by specific event IDs | - |
| bookmakers | string | No | Filter specific bookmakers | All in region |

**Example Request for Australian Bookmakers:**
```http
GET https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=YOUR_KEY&regions=au&markets=h2h,totals&oddsFormat=decimal
```

**Response Example:**
```json
[
  {
    "id": "e91a3d6f5c82b4e3f88c8e7b9a2c3d4e",
    "sport_key": "soccer_epl",
    "sport_title": "EPL",
    "commence_time": "2025-01-15T20:00:00Z",
    "home_team": "Manchester United",
    "away_team": "Liverpool",
    "bookmakers": [
      {
        "key": "sportsbet",
        "title": "Sportsbet",
        "last_update": "2025-01-15T19:45:00Z",
        "markets": [
          {
            "key": "h2h",
            "last_update": "2025-01-15T19:45:00Z",
            "outcomes": [
              {
                "name": "Manchester United",
                "price": 3.40
              },
              {
                "name": "Liverpool",
                "price": 2.20
              },
              {
                "name": "Draw",
                "price": 3.25
              }
            ]
          },
          {
            "key": "totals",
            "last_update": "2025-01-15T19:45:00Z",
            "outcomes": [
              {
                "name": "Over",
                "price": 1.90,
                "point": 2.5
              },
              {
                "name": "Under",
                "price": 1.90,
                "point": 2.5
              }
            ]
          }
        ]
      },
      {
        "key": "tab",
        "title": "TAB",
        "last_update": "2025-01-15T19:44:00Z",
        "markets": [
          {
            "key": "h2h",
            "last_update": "2025-01-15T19:44:00Z",
            "outcomes": [
              {
                "name": "Manchester United",
                "price": 3.35
              },
              {
                "name": "Liverpool",
                "price": 2.25
              },
              {
                "name": "Draw",
                "price": 3.20
              }
            ]
          }
        ]
      }
    ]
  }
]
```

### 3. Get Live Scores
```http
GET /v4/sports/soccer_epl/scores/
```

**Query Parameters:**
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| apiKey | string | Yes | Your API key | - |
| daysFrom | integer | No | Days from today (1-3) | 3 |
| dateFormat | string | No | `iso` or `unix` | iso |
| eventIds | string | No | Filter by specific event IDs | - |

**Response Example:**
```json
[
  {
    "id": "e91a3d6f5c82b4e3f88c8e7b9a2c3d4e",
    "sport_key": "soccer_epl",
    "sport_title": "EPL",
    "commence_time": "2025-01-15T20:00:00Z",
    "completed": false,
    "home_team": "Manchester United",
    "away_team": "Liverpool",
    "scores": [
      {
        "name": "Manchester United",
        "score": "1"
      },
      {
        "name": "Liverpool",
        "score": "2"
      }
    ],
    "last_update": "2025-01-15T20:45:00Z"
  }
]
```

### 4. Get Historical Odds
```http
GET /v4/historical/sports/soccer_epl/odds/
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apiKey | string | Yes | Your API key |
| regions | string | Yes | Regions (use `au` for Australian) |
| markets | string | Yes | Markets to retrieve |
| date | string | Yes | ISO date (YYYY-MM-DD) or ISO datetime |
| dateFormat | string | No | `iso` or `unix` |
| oddsFormat | string | No | `decimal` or `american` |
| bookmakers | string | No | Filter specific bookmakers |
| eventIds | string | No | Filter by specific event IDs |

**Note:** Historical data available from June 6, 2020. Costs 10 credits per region per market.

## Available Markets for EPL

### Standard Markets
| Market Key | Description | Support |
|------------|-------------|---------|
| `h2h` | Head to Head (1X2) | All bookmakers |
| `totals` | Over/Under goals | Most bookmakers |
| `spreads` | Asian Handicap | Most bookmakers |
| `h2h_lay` | Lay betting | Betfair only |
| `totals_lay` | Lay totals | Betfair only |
| `btts` | Both teams to score | Selected bookmakers |
| `draw_no_bet` | Draw no bet | Selected bookmakers |
| `double_chance` | Double chance | Selected bookmakers |

### Player Props Markets
Currently limited to US bookmakers, but expanding:
- `player_goal_scorer_anytime` - Anytime goal scorer
- `player_goal_scorer_first` - First goal scorer
- `player_goal_scorer_last` - Last goal scorer
- `player_shots` - Player shots O/U
- `player_shots_on_target` - Player shots on target O/U
- `player_assists` - Player assists O/U
- `player_cards` - Player to receive card

### Team/Match Props
- `team_totals` - Team total goals O/U
- `totals_corners` - Total corners O/U
- `totals_cards` - Total cards O/U
- `alternate_totals` - Alternative goal totals
- `alternate_spreads` - Alternative handicaps

## Error Responses

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 401 | Unauthorized (invalid API key) |
| 429 | Too many requests (rate limited) |
| 500 | Internal server error |

### Error Response Format
```json
{
  "message": "Error description"
}
```

## Best Practices

### 1. Efficient API Usage
- Cache responses when appropriate (odds update every 5-10 minutes)
- Use specific bookmaker filters to reduce response size
- Monitor credit usage via response headers
- Batch requests where possible

### 2. Market Selection for EPL
For comprehensive EPL coverage from Australian bookmakers:
```
markets=h2h,totals,spreads
```

### 3. Bookmaker Filtering
To get only specific Australian bookmakers:
```
bookmakers=sportsbet,tab,neds,ladbrokes_au
```

### 4. Response Handling
- Always check `last_update` timestamps for odds freshness
- Handle missing markets gracefully (not all bookmakers offer all markets)
- Account for Draw outcome in `h2h` market for soccer

### 5. Rate Limit Management
```python
# Example: Check remaining credits in response
response = requests.get(url)
remaining_credits = response.headers.get('x-requests-remaining')
if int(remaining_credits) < 100:
    # Alert or pause requests
    pass
```

## Implementation Examples

### Python Example
```python
import requests
import json

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.the-odds-api.com/v4'

def get_epl_odds_au():
    """Get EPL odds from Australian bookmakers"""
    url = f"{BASE_URL}/sports/soccer_epl/odds/"
    params = {
        'apiKey': API_KEY,
        'regions': 'au',
        'markets': 'h2h,totals',
        'oddsFormat': 'decimal'
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

def compare_odds(match_data):
    """Compare odds across Australian bookmakers"""
    for match in match_data:
        print(f"\n{match['home_team']} vs {match['away_team']}")
        print(f"Start time: {match['commence_time']}")
        
        h2h_odds = {}
        for bookmaker in match['bookmakers']:
            if bookmaker['key'] in ['sportsbet', 'tab', 'neds', 'ladbrokes_au']:
                for market in bookmaker['markets']:
                    if market['key'] == 'h2h':
                        for outcome in market['outcomes']:
                            key = f"{bookmaker['key']}_{outcome['name']}"
                            h2h_odds[key] = outcome['price']
        
        # Find best odds for each outcome
        outcomes = set(k.split('_', 1)[1] for k in h2h_odds.keys())
        for outcome in outcomes:
            best_odds = 0
            best_bookie = ''
            for bookie in ['sportsbet', 'tab', 'neds', 'ladbrokes_au']:
                key = f"{bookie}_{outcome}"
                if key in h2h_odds and h2h_odds[key] > best_odds:
                    best_odds = h2h_odds[key]
                    best_bookie = bookie
            print(f"  {outcome}: Best odds {best_odds} @ {best_bookie}")

# Usage
odds_data = get_epl_odds_au()
if odds_data:
    compare_odds(odds_data)
```

### JavaScript/Node.js Example
```javascript
const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.the-odds-api.com/v4';

async function getEPLOddsAU() {
    try {
        const response = await axios.get(`${BASE_URL}/sports/soccer_epl/odds/`, {
            params: {
                apiKey: API_KEY,
                regions: 'au',
                markets: 'h2h,totals',
                oddsFormat: 'decimal'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching odds:', error.message);
        return null;
    }
}

async function compareOdds() {
    const matches = await getEPLOddsAU();
    
    if (!matches) return;
    
    matches.forEach(match => {
        console.log(`\n${match.home_team} vs ${match.away_team}`);
        console.log(`Start: ${match.commence_time}`);
        
        const oddsComparison = {};
        
        match.bookmakers.forEach(bookmaker => {
            if (['sportsbet', 'tab', 'neds', 'ladbrokes_au'].includes(bookmaker.key)) {
                const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
                if (h2hMarket) {
                    h2hMarket.outcomes.forEach(outcome => {
                        if (!oddsComparison[outcome.name]) {
                            oddsComparison[outcome.name] = [];
                        }
                        oddsComparison[outcome.name].push({
                            bookmaker: bookmaker.title,
                            odds: outcome.price
                        });
                    });
                }
            }
        });
        
        // Display best odds for each outcome
        Object.keys(oddsComparison).forEach(outcome => {
            const best = oddsComparison[outcome].reduce((prev, curr) => 
                curr.odds > prev.odds ? curr : prev
            );
            console.log(`  ${outcome}: ${best.odds} @ ${best.bookmaker}`);
        });
    });
}

compareOdds();
```

## Notes & Limitations

1. **Historical Data**: Available from June 6, 2020, but coverage may vary by bookmaker and market
2. **Update Frequency**: Odds typically update every 5-10 minutes
3. **Market Availability**: Not all bookmakers offer all markets
4. **Regional Restrictions**: Some bookmakers may not be available in all regions
5. **Credit Costs**: Historical data requests are more expensive (10 credits per region per market)
6. **Player Props**: Currently limited primarily to US bookmakers, expanding to other regions

## Support & Resources

- **Documentation**: https://the-odds-api.com/liveapi/guides/v4/
- **Code Samples**: https://the-odds-api.com/liveapi/guides/v4/samples.html
- **Contact**: support@the-odds-api.com
- **Status Page**: Monitor API availability and performance

## Changelog

- **v4**: Current version with expanded market coverage and improved response structure
- **Historical Data**: Continuously expanding coverage
- **Player Props**: Gradually adding support for more regions beyond US