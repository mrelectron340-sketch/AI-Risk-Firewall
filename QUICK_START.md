# 🚀 Quick Start Guide

Get your AI Risk Firewall up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment

Create a `.env` file:

```env
PRIVATE_KEY=your_wallet_private_key
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_key
OPENAI_API_KEY=your_openai_key
PORT=3000
```

## Step 3: Get Testnet MATIC

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Polygon Amoy Testnet"
3. Enter your wallet address
4. Request testnet MATIC

## Step 4: Compile Contracts

```bash
npm run compile
```

## Step 5: Deploy Contracts

```bash
npm run deploy:amoy
```

This will:
- Deploy all 3 contracts to Polygon Amoy
- Save addresses to `deployment-addresses.json`
- Link contracts together

## Step 6: Update Frontend Config

After deployment, add to your `.env`:

```env
VITE_RISK_REGISTRY_ADDRESS=0x...
VITE_SAFETY_NFT_ADDRESS=0x...
VITE_SCANNER_ACCESS_ADDRESS=0x...
```

## Step 7: Start the App

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
npm run dev:client
```

## Step 8: Connect Wallet

1. Open `http://localhost:5173`
2. Click "Connect Wallet"
3. Switch to Polygon Amoy in MetaMask
4. Start using the app!

## 🎉 You're Ready!

- **Dashboard**: View your security stats
- **Scanner**: Check websites for phishing
- **Contracts**: Analyze smart contracts
- **Tokens**: Check token safety
- **Trust NFT**: Mint your Safety NFT
- **Pricing**: Subscribe to premium features

## Need Help?

Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

