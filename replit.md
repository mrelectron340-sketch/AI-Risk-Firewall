# AI Risk Firewall - Crypto Security on Polygon

## Overview
AI Risk Firewall is a comprehensive security application that protects crypto users from phishing, scams, malicious smart contracts, and rug pulls. Built on the Polygon blockchain, it provides real-time threat detection using OpenAI's GPT-5 model and stores protection logs on-chain for transparency.

## Project State
- **Current Phase**: MVP Development Complete
- **Status**: Fully functional with AI-powered threat detection
- **Network**: Polygon (Mumbai testnet for development)

## Key Features
1. **Website Scanner** - AI-powered phishing and malware detection
2. **Smart Contract Analyzer** - Detects honeypots, rug pulls, and malicious patterns
3. **Token Safety Checker** - Analyzes liquidity locks, taxes, ownership, and honeypot risks
4. **Trust NFT** - Dynamic SoulBound Token representing user's security reputation
5. **Contract Registry** - On-chain database of verified safe/dangerous contracts
6. **Daily Protection Reports** - Statistics on blocked threats and safety score

## Tech Stack
- **Frontend**: React 18, Wouter (routing), TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **AI**: OpenAI GPT-5 for threat analysis
- **Blockchain**: Polygon, ethers.js v6
- **State**: In-memory storage (MemStorage)

## Project Structure
```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── app-sidebar.tsx    # Navigation sidebar
│   │   ├── activity-feed.tsx  # Protection activity log
│   │   ├── risk-score.tsx     # Risk visualization components
│   │   ├── stats-card.tsx     # Dashboard stat cards
│   │   ├── theme-provider.tsx # Dark/light theme
│   │   ├── trust-nft-display.tsx
│   │   └── wallet-connection.tsx
│   ├── pages/            # Route pages
│   │   ├── dashboard.tsx     # Main dashboard
│   │   ├── scanner.tsx       # Website scanner
│   │   ├── contracts.tsx     # Contract analyzer
│   │   ├── tokens.tsx        # Token checker
│   │   ├── trust-nft.tsx     # Trust NFT page
│   │   ├── registry.tsx      # Contract registry
│   │   └── settings.tsx      # Settings page
│   └── App.tsx
server/
├── routes.ts             # API endpoints
├── storage.ts            # In-memory data storage
└── openai.ts             # AI analysis functions
shared/
└── schema.ts             # TypeScript types and Zod schemas
```

## API Endpoints
- `POST /api/scan-website` - Scan URL for threats
- `POST /api/analyze-contract` - Analyze smart contract
- `POST /api/analyze-token` - Check token safety
- `POST /api/check-wallet` - Check wallet reputation
- `GET /api/trust-nft/:address` - Get Trust NFT data
- `POST /api/mint-trust-nft` - Mint Trust NFT
- `GET /api/activities/:address` - Get protection logs
- `GET /api/stats/:address` - Get daily statistics
- `GET /api/registry` - Get contract registry

## Environment Variables
- `OPENAI_API_KEY` - Required for AI threat analysis

## Design System
- **Colors**: Security-focused with success (green), warning (amber), danger (red)
- **Theme**: Dark mode by default, light mode available
- **Typography**: Inter for UI, JetBrains Mono for addresses
- **Risk Levels**: 71-100 = Safe, 41-70 = Warning, 0-40 = Danger

## User Preferences
- Dark mode preferred for security applications
- Monospace fonts for blockchain addresses
- Clear risk indicators with color coding
