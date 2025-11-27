# 🚀 Deploy to Vercel - Complete Guide

## 📋 Prerequisites

1. Vercel account (free tier works)
2. GitHub repository (optional but recommended)
3. Environment variables ready

## 🎯 Deployment Steps

### Step 1: Prepare for Deployment

1. **Build the frontend:**
   ```bash
   npm run build:client
   ```

2. **Verify build works:**
   ```bash
   cd client
   npm run preview
   ```

### Step 2: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from client directory:**
   ```bash
   cd client
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **ai-risk-firewall** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **No**

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository OR drag & drop the `client` folder
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these variables:
```
VITE_RISK_REGISTRY_ADDRESS=0x3370ee55909893aBCBF47792065473Aa497c314b
VITE_SAFETY_NFT_ADDRESS=0x7fE6B061B0d5E206f8Fc9627849D419ACC2E14C1
VITE_SCANNER_ACCESS_ADDRESS=0x6d0F1885331e70fb585386B485a31f8548Ba8F3f
```

**Note:** These are optional since addresses are hardcoded, but you can override them here.

### Step 4: Deploy Backend (Separate Service)

The backend needs to run on a separate service since Vercel is for frontend.

#### Option A: Deploy Backend to Railway/Render

1. **Railway:**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repo
   - Set root directory to project root
   - Add environment variables
   - Deploy!

2. **Render:**
   - Go to [render.com](https://render.com)
   - New Web Service
   - Connect GitHub repo
   - Build command: `npm install`
   - Start command: `npm run dev`
   - Add environment variables

#### Option B: Use Vercel Serverless Functions

Create `api/` directory in `client` folder and convert backend to serverless functions.

### Step 5: Update Frontend API URL

After backend is deployed, update frontend to point to backend URL:

1. Create `client/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

2. Update `client/src/lib/queryClient.ts` to use `import.meta.env.VITE_API_URL`

### Step 6: Final Deployment

1. **Redeploy frontend:**
   ```bash
   cd client
   vercel --prod
   ```

2. **Get your URL:**
   - Vercel will give you: `https://your-project.vercel.app`

## ✅ Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] Wallet connection works
- [ ] API calls work (check browser console)
- [ ] Scanner works
- [ ] All pages load correctly
- [ ] Environment variables are set

## 🔧 Vercel Configuration File

Create `vercel.json` in `client` directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🎉 Your App is Live!

Your frontend will be available at:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`

## 📝 Important Notes

1. **Backend must be deployed separately** - Vercel is for frontend only
2. **Environment variables** - Set in Vercel dashboard
3. **CORS** - Make sure backend allows your Vercel domain
4. **API URL** - Update frontend to use production backend URL

## 🐛 Common Issues

### Build fails?
- Check `package.json` scripts
- Verify all dependencies are installed
- Check for TypeScript errors

### API calls fail?
- Verify backend is deployed and running
- Check CORS settings in backend
- Verify environment variables

### Wallet connection fails?
- Make sure you're using HTTPS (Vercel provides this)
- Check browser console for errors

