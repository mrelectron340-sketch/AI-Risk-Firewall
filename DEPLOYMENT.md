# AI Risk Firewall - Deployment Guide

## 🚀 Quick Start

This guide will help you deploy the AI Risk Firewall to Polygon Amoy testnet.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MetaMask** or compatible wallet
3. **Polygon Amoy Testnet MATIC** - Get free testnet tokens from [Polygon Faucet](https://faucet.polygon.technology/)
4. **OpenAI API Key** (for AI analysis)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Polygon Amoy Testnet Configuration
PRIVATE_KEY=your_private_key_here
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Backend API
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

**⚠️ Important:** Never commit your `.env` file to version control!

## Step 3: Compile Smart Contracts

```bash
npm run compile
```

This will compile all Solidity contracts using Hardhat.

## Step 4: Deploy Smart Contracts to Polygon Amoy

```bash
npm run deploy:amoy
```

This will:
1. Deploy `RiskRegistry.sol`
2. Deploy `SafetyNFT.sol`
3. Deploy `ScannerAccess.sol`
4. Link the contracts together
5. Save deployment addresses to `deployment-addresses.json`

**Expected Output:**
```
Deploying contracts with account: 0x...
Account balance: 1000000000000000000

1. Deploying RiskRegistry...
RiskRegistry deployed to: 0x...

2. Deploying SafetyNFT...
SafetyNFT deployed to: 0x...

3. Linking contracts...
SafetyNFT linked to RiskRegistry

4. Deploying ScannerAccess...
ScannerAccess deployed to: 0x...

=== Deployment Summary ===
Network: Polygon Amoy Testnet
...
```

## Step 5: Update Frontend Configuration

After deployment, update the contract addresses in your frontend:

1. Copy the addresses from `deployment-addresses.json`
2. Create a `.env` file in the `client` directory (or update root `.env`):

```env
VITE_RISK_REGISTRY_ADDRESS=0x...
VITE_SAFETY_NFT_ADDRESS=0x...
VITE_SCANNER_ACCESS_ADDRESS=0x...
```

## Step 6: Verify Contracts (Optional)

To verify contracts on Polygonscan:

```bash
npm run verify -- --network polygonAmoy <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Step 7: Start Development Servers

### Backend Server
```bash
npm run dev
```

### Frontend Client
```bash
npm run dev:client
```

The app will be available at:
- Frontend: `http://localhost:5173` (or the port shown)
- Backend API: `http://localhost:3000`

## Step 8: Connect to Polygon Amoy Testnet

1. Open MetaMask
2. Go to Settings → Networks → Add Network
3. Add Polygon Amoy:
   - Network Name: Polygon Amoy
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://amoy.polygonscan.com`
4. Get testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

## Step 9: Test the Application

1. **Connect Wallet**: Click "Connect Wallet" in the app
2. **Switch to Polygon Amoy**: Ensure MetaMask is on Amoy testnet
3. **Mint Safety NFT**: Go to Trust NFT page and mint your Safety NFT
4. **Test Scanner**: Try scanning a website or contract
5. **Check Pricing**: Visit the Pricing page to see subscription options

## Contract Functions

### RiskRegistry
- `reportRisk(address, uint8, string)` - Report a risky contract
- `getRiskLogs(address)` - Get all risk reports for a contract
- `getRiskStats(address)` - Get risk statistics
- `isVerifiedScam(address)` - Check if address is verified scam

### SafetyNFT
- `mintSafetyNFT(address)` - Mint a Safety NFT (one per wallet)
- `getSafetyProfile(address)` - Get safety profile
- `updateSafetyProfile(address, uint8, uint256, uint256)` - Update profile

### ScannerAccess
- `canScan(address)` - Check if user can scan
- `useScan(address)` - Use a scan (deducts from quota)
- `subscribePremium()` - Subscribe to premium (pay 0.01 MATIC)
- `payPerScan()` - Pay for single scan (0.001 MATIC)
- `getUserSubscription(address)` - Get subscription info

## Troubleshooting

### "Insufficient funds"
- Get more testnet MATIC from the faucet

### "Contract not found"
- Ensure contract addresses are correctly set in `.env`
- Verify contracts are deployed on the correct network

### "Transaction failed"
- Check you're on Polygon Amoy testnet
- Ensure you have enough MATIC for gas

### "OpenAI API Error"
- Verify your OpenAI API key is correct
- Check you have API credits

## Production Deployment

For production deployment:

1. Update `hardhat.config.js` to use Polygon Mainnet
2. Update RPC URLs to mainnet endpoints
3. Use mainnet contract addresses
4. Update environment variables
5. Deploy with: `npm run deploy:amoy` (update network name)

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review contract code in `contracts/` directory
- Check deployment logs in `deployment-addresses.json`

## Security Notes

- Never share your private key
- Always test on testnet first
- Review all contract code before deployment
- Use a hardware wallet for production deployments

