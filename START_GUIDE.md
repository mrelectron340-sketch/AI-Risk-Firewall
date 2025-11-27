# 🚀 How to Start the Application

## 📁 Project Structure

```
AI-Risk-Firewall-main/
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express.js)
├── contracts/       # Smart Contracts (Solidity)
└── scripts/         # Deployment scripts
```

## 🎯 Starting the Application

### Option 1: Start Both Together (Recommended)

**Terminal 1 - Backend:**
```bash
cd C:\Users\parth\Downloads\AI-Risk-Firewall-main\AI-Risk-Firewall-main
npm run dev
```
Backend will run on: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd C:\Users\parth\Downloads\AI-Risk-Firewall-main\AI-Risk-Firewall-main
npm run dev:client
```
Frontend will run on: `http://localhost:5173` (or the port shown)

### Option 2: Start Separately

**Backend Only:**
```bash
cd C:\Users\parth\Downloads\AI-Risk-Firewall-main\AI-Risk-Firewall-main
npm run dev
```

**Frontend Only:**
```bash
cd C:\Users\parth\Downloads\AI-Risk-Firewall-main\AI-Risk-Firewall-main
npm run dev:client
```

## 🔗 Connecting Frontend to Backend

The frontend automatically connects to the backend API at:
- Development: `http://localhost:3000`
- The frontend makes API calls to `/api/*` endpoints

## ✅ Verify It's Working

1. **Backend**: Check `http://localhost:3000` - should show API is running
2. **Frontend**: Open `http://localhost:5173` - should show the app
3. **Connect Wallet**: Click "Connect Wallet" button
4. **Test Scanner**: Go to Website Scanner and try scanning a URL

## 🐛 Troubleshooting

### Backend not starting?
- Check if port 3000 is already in use
- Make sure `.env` file exists with required variables
- Run `npm install` if dependencies are missing

### Frontend not starting?
- Check if port 5173 is already in use
- Make sure you're in the root directory
- Run `npm install` if dependencies are missing

### Frontend can't connect to backend?
- Make sure backend is running on port 3000
- Check browser console for CORS errors
- Verify API endpoints in `server/routes.ts`

## 📝 Environment Variables

Make sure `.env` file exists in root directory:
```env
PRIVATE_KEY=your_private_key
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
OPENAI_API_KEY=your_openai_key
PORT=3000
```

## 🎉 Ready to Use!

Once both are running:
1. Open `http://localhost:5173` in your browser
2. Connect your MetaMask wallet
3. Switch to Polygon Amoy testnet
4. Start using the app!

