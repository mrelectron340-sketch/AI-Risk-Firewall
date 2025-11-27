# 🛡️ AI Risk Firewall

AI-powered Web3 safety layer for wallets, DApps & transactions on Polygon.

## ✨ Features

- **🔍 Smart Contract Analysis** - AI-powered analysis of smart contracts for security risks
- **🌐 Website Scanner** - Detect phishing sites and fake DApp clones
- **🪙 Token Checker** - Analyze tokens for honeypots, rug pulls, and scams
- **💼 Wallet Reputation** - Track wallet safety scores and reputation
- **🎫 Safety NFT** - Soulbound NFT representing your security reputation
- **📊 Risk Registry** - On-chain database of reported scams and risks
- **💳 Flexible Pricing** - Free tier with 10 scans/month, premium subscriptions available

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Backend API (Express + FastAPI)
    ↓
AI Analysis Engine (OpenAI GPT-4)
    ↓
Smart Contracts (Polygon Amoy)
    ├── RiskRegistry.sol
    ├── SafetyNFT.sol
    └── ScannerAccess.sol
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Polygon Amoy testnet MATIC
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd AI-Risk-Firewall

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys
```

### Deploy Contracts

```bash
# Compile contracts
npm run compile

# Deploy to Polygon Amoy
npm run deploy:amoy
```

### Run Development Servers

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run dev:client
```

Visit `http://localhost:5173` to see the app!

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Smart Contracts](./contracts/) - Solidity contract source code
- [API Documentation](./server/routes.ts) - Backend API endpoints

## 🧪 Testing

```bash
# Run tests
npm test

# Test contracts
npx hardhat test
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion (animations)
- Wagmi/Ethers.js (blockchain)

### Backend
- Express.js
- OpenAI API (GPT-4)
- TypeScript

### Blockchain
- Solidity 0.8.20
- Hardhat
- Polygon Amoy Testnet
- OpenZeppelin Contracts

## 📝 Smart Contracts (Deployed on Polygon Amoy)

### RiskRegistry
**Address:** `0x3370ee55909893aBCBF47792065473Aa497c314b`  
On-chain registry for logging detected scams and risks. Stores risk reports with scores, timestamps, and threat types.

### SafetyNFT
**Address:** `0x7fE6B061B0d5E206f8Fc9627849D419ACC2E14C1`  
Soulbound Token (SBT) representing user's safety reputation. Non-transferable NFT that tracks security scores, scams avoided, and safe transactions.

### ScannerAccess
**Address:** `0x6d0F1885331e70fb585386B485a31f8548Ba8F3f`  
Manages access control and pricing for scanner features. Handles free scans, premium subscriptions, and pay-per-scan options.

**Network:** Polygon Amoy Testnet (Chain ID: 80002)  
**Deployer:** `0x10ac9924a78051BdD770978740C5084205cdB628`  
**Deployed:** November 27, 2025

## 🎨 UI Features

- **Splash Screen** - Beautiful animated loading screen
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion animations throughout
- **Real-time Updates** - Live blockchain data

## 🔒 Security

- All contract interactions are verified
- Private keys never leave your wallet
- AI analysis uses secure API endpoints
- On-chain risk registry for transparency

## 📊 Pricing

- **Free**: 10 scans/month
- **Premium**: 0.01 MATIC/month (unlimited scans)
- **Pay Per Scan**: 0.001 MATIC/scan

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- Polygon for testnet infrastructure
- OpenAI for AI analysis capabilities

## 📞 Support

For support, email support@airiskfirewall.com or open an issue on GitHub.

---

**⚠️ Disclaimer**: This is a security tool. Always verify contracts and websites yourself. This tool is not a guarantee of safety.
