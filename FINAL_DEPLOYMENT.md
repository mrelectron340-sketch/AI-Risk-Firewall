# 🚀 Final Deployment Guide - Vercel

## ✅ All Issues Fixed

1. ✅ **process.env error** - Fixed! Changed to `import.meta.env` (Vite standard)
2. ✅ **Replit favicon** - Removed! Added new custom shield favicon
3. ✅ **Replit plugins** - Removed from vite.config.ts

## 📁 Project Structure

```
AI-Risk-Firewall-main/
├── client/          # Frontend (React + Vite) ← Deploy this to Vercel
├── server/          # Backend (Express.js) ← Deploy separately
├── contracts/       # Smart Contracts
└── scripts/         # Deployment scripts
```

## 🎯 Quick Start (Development)

### Start Backend:
```bash
npm run dev
```
Runs on: `http://localhost:3000`

### Start Frontend:
```bash
npm run dev:client
```
Runs on: `http://localhost:5173`

## 🚀 Deploy to Vercel (Production)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Frontend
```bash
cd client
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **ai-risk-firewall** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 4: Set Environment Variables (Optional)

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_RISK_REGISTRY_ADDRESS=0x3370ee55909893aBCBF47792065473Aa497c314b
VITE_SAFETY_NFT_ADDRESS=0x7fE6B061B0d5E206f8Fc9627849D419ACC2E14C1
VITE_SCANNER_ACCESS_ADDRESS=0x6d0F1885331e70fb585386B485a31f8548Ba8F3f
```

**Note:** These are optional since addresses are hardcoded in the code.

### Step 5: Deploy Backend Separately

Vercel is for frontend only. Deploy backend to:

**Option A: Railway (Recommended)**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Add environment variables from `.env`
5. Deploy!

**Option B: Render**
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Build: `npm install`
5. Start: `npm run dev`
6. Add environment variables

### Step 6: Update Frontend API URL

After backend is deployed, update frontend:

1. In Vercel Dashboard → Environment Variables, add:
```
VITE_API_URL=https://your-backend-url.railway.app
```

2. Update `client/src/lib/queryClient.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || '';
const url = endpoint.startsWith('http') ? endpoint : `${API_URL}/api${endpoint}`;
```

### Step 7: Production Deploy
```bash
cd client
vercel --prod
```

## ✅ Your App is Live!

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app` (or Render)

## 🔧 Vercel Configuration

The `client/vercel.json` is already configured:
- Framework: Vite
- Build: `npm run build`
- Output: `dist`
- SPA routing enabled

## 📝 Important Notes

1. **Backend must be deployed separately** - Vercel is frontend-only
2. **CORS**: Update backend to allow your Vercel domain
3. **Environment Variables**: Set in Vercel dashboard
4. **HTTPS**: Vercel provides HTTPS automatically (required for MetaMask)

## 🐛 Troubleshooting

### Build fails?
- Check `client/package.json` has build script
- Verify all dependencies installed
- Check for TypeScript errors

### API calls fail?
- Verify backend is deployed and running
- Check CORS settings in backend
- Verify `VITE_API_URL` is set correctly

### Wallet connection fails?
- Must use HTTPS (Vercel provides this)
- Check browser console for errors
- Verify MetaMask is installed

## 🎉 Done!

Your app is now deployed and ready to use!

