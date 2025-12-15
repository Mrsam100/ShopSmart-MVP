# 🚀 Vercel Deployment Guide - ShopSmart MVP

## Complete Step-by-Step Deployment Instructions

---

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ A Vercel account (free tier works fine) - [Sign up here](https://vercel.com/signup)
- ✅ Your Gemini API key ready - [Get it here](https://aistudio.google.com/app/apikey)
- ✅ Git installed on your machine
- ✅ A GitHub/GitLab/Bitbucket account (recommended but optional)

---

## 🎯 Quick Deploy (5 Minutes)

### Option 1: Deploy via GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
# Navigate to your project
cd c:\Users\Lenovo\shopsmart_mvp\ShopSmart-MVP

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ShopSmart MVP ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/shopsmart-mvp.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your **shopsmart-mvp** repository
5. Vercel will auto-detect it's a Vite project ✅
6. Click **"Deploy"** (don't configure anything yet)

#### Step 3: Add Environment Variable

1. After deployment, go to your project settings
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** Your Gemini API key
   - **Environment:** Select **All** (Production, Preview, Development)
4. Click **"Save"**

#### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait ~30 seconds for build to complete

✅ **Done! Your app is live!**

---

### Option 2: Deploy via Vercel CLI (Advanced)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd c:\Users\Lenovo\shopsmart_mvp\ShopSmart-MVP

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? shopsmart-mvp (or your choice)
# - Directory? ./ (just press Enter)
# - Want to override settings? No

# Add environment variable
vercel env add VITE_GEMINI_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development (all)

# Deploy to production
vercel --prod
```

---

## 🔧 Configuration Files Explained

### 1. `vercel.json`

This file configures how Vercel builds and serves your app:

```json
{
  "buildCommand": "npm run build",      // Build command
  "outputDirectory": "dist",            // Where built files are
  "framework": "vite",                  // Auto-detects Vite optimizations
  "rewrites": [...],                    // SPA routing (all routes → index.html)
  "headers": [...],                     // Security headers
  "regions": ["iad1"]                   // Deploy region (US East)
}
```

**Key Features:**
- ✅ **SPA Routing:** All routes redirect to index.html (fixes 404 on refresh)
- ✅ **Security Headers:** XSS protection, clickjacking prevention
- ✅ **Cache Optimization:** Static assets cached for 1 year
- ✅ **Fast Region:** Deployed to US East (fastest for US users)

### 2. `.vercelignore`

Tells Vercel what NOT to upload:

```
node_modules      # Dependencies (rebuilt on Vercel)
.env.local        # Local secrets (use Vercel env vars instead)
.git              # Git history
README.md         # Documentation
```

**Benefits:**
- Faster uploads (smaller payload)
- No sensitive data leakage
- Cleaner deployments

### 3. Updated `vite.config.ts`

Optimized for production builds:

```typescript
build: {
  minify: 'terser',                    // Better minification
  sourcemap: false,                    // No source maps (smaller size)
  chunkSizeWarningLimit: 1000,         // Suppress warnings
  manualChunks: {
    'react-vendor': ['react', 'react-dom'],
    'genai-vendor': ['@google/genai']
  }
}
```

**Benefits:**
- Smaller bundle sizes (~30% reduction)
- Better caching (vendor chunks separate)
- Faster page loads

---

## 🔐 Environment Variables Setup

### Local Development (.env.local)
```env
VITE_GEMINI_API_KEY=your_local_api_key
```

### Vercel Production
Set via Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add `VITE_GEMINI_API_KEY`
3. Select environments: Production + Preview + Development

**Important:**
- ⚠️ Never commit `.env.local` to git (already in `.gitignore`)
- ⚠️ Use different API keys for local vs production (optional but recommended)
- ✅ Vercel automatically injects env vars during build

---

## 📊 Deployment Checklist

### Before First Deploy:
- [ ] All manual security fixes applied (from QUICK_FIX_GUIDE.md)
- [ ] App tested locally (`npm run dev`)
- [ ] Production build works (`npm run build && npm run preview`)
- [ ] No console errors in browser DevTools
- [ ] Gemini API key obtained
- [ ] `.env.local` NOT committed to git

### During Deploy:
- [ ] Repository connected to Vercel
- [ ] Build command is `npm run build` (auto-set)
- [ ] Output directory is `dist` (auto-set)
- [ ] Framework detected as Vite (auto-detected)
- [ ] Environment variable `VITE_GEMINI_API_KEY` added

### After Deploy:
- [ ] Deployment succeeded (green checkmark)
- [ ] Visit production URL
- [ ] Test all features work
- [ ] AI Assistant works (API key configured correctly)
- [ ] No 404 errors when refreshing pages
- [ ] Check browser console for errors

---

## 🚨 Troubleshooting

### Build Fails with "Module not found"

**Cause:** Missing dependencies or wrong paths

**Fix:**
```bash
# Ensure all dependencies are in package.json
npm install

# Try building locally first
npm run build

# If local build works, commit and push again
git add .
git commit -m "Fix dependencies"
git push
```

---

### "API key not configured" Error

**Cause:** Environment variable not set on Vercel

**Fix:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Ensure `VITE_GEMINI_API_KEY` exists
4. Value should be your actual API key (not `your_api_key_here`)
5. Environment should include **Production**
6. Redeploy from Deployments tab

**Verify:**
```bash
# Check if env var is set (via Vercel CLI)
vercel env ls
```

---

### 404 Error When Refreshing Page

**Cause:** SPA routing not configured

**Fix:**
Ensure `vercel.json` has this rewrite rule:
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

If missing, add it and redeploy.

---

### Build Takes Too Long / Timeout

**Cause:** Large dependencies or slow build process

**Fix:**
1. Check build logs in Vercel dashboard
2. Reduce bundle size:
   ```bash
   # Analyze bundle
   npm run build

   # Remove unused dependencies
   npm prune
   ```
3. Upgrade Vercel plan (if free tier limits reached)

---

### TypeScript Errors During Build

**Cause:** Strict type checking on Vercel

**Fix Option 1 (Quick):**
Add to `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    onwarn(warning, warn) {
      // Suppress certain warnings
      if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
      warn(warning);
    }
  }
}
```

**Fix Option 2 (Proper):**
Fix all TypeScript errors shown in build logs.

---

### Images or Assets Not Loading

**Cause:** Wrong public path or missing files

**Fix:**
1. Ensure all images are in `/public` folder or imported in components
2. Use correct paths:
   ```typescript
   // ✅ Correct (from public folder)
   <img src="/logo.png" />

   // ✅ Correct (imported)
   import logo from './assets/logo.png'
   <img src={logo} />

   // ❌ Wrong
   <img src="./logo.png" />
   ```

---

## ⚙️ Advanced Configuration

### Custom Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `shopsmart.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (auto-generated, ~5 minutes)

### Analytics

Enable Vercel Analytics:
1. Project Settings → Analytics
2. Enable Web Analytics (free)
3. Redeploy
4. View analytics in Dashboard

### Performance Monitoring

```bash
# Install Vercel Speed Insights
npm install @vercel/speed-insights

# Add to main component
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <>
      <SpeedInsights />
      {/* Your app */}
    </>
  )
}
```

### Multiple Environments

```bash
# Preview (staging) deployment
git checkout -b staging
git push origin staging
# Auto-deploys to preview URL

# Production deployment
git checkout main
git push origin main
# Deploys to production URL
```

---

## 🎯 Post-Deployment Optimizations

### 1. Enable Compression

Vercel auto-enables Brotli/Gzip, but verify:
1. Open deployed site
2. Open DevTools → Network
3. Check Response Headers for `content-encoding: br` or `gzip`

### 2. Set Up Caching

Already configured in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

This caches static assets for 1 year.

### 3. Enable Edge Caching

For API routes (if you add them later):
```typescript
export const config = {
  runtime: 'edge',
}
```

### 4. Monitor Performance

Use Vercel Analytics and Speed Insights:
- **Core Web Vitals:** LCP, FID, CLS
- **Page Load Times**
- **Geographic Performance**

---

## 📱 Testing Your Deployment

### Functional Tests:
```
1. Visit your Vercel URL
2. Complete onboarding (set shop name)
3. Add a product
4. Make a sale
5. Add a customer
6. Check reports
7. Test AI Assistant
8. Refresh page on different routes (should not 404)
9. Test on mobile device
10. Check all security fixes work
```

### Performance Tests:
```
1. Run Lighthouse (DevTools → Lighthouse)
   - Performance: Should be 90+
   - Accessibility: Should be 90+
   - Best Practices: Should be 90+
   - SEO: Should be 80+

2. Check bundle size
   - Main bundle: < 500KB
   - Total transfer: < 1MB (first load)

3. Test offline functionality
   - Works offline for localStorage features
```

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically redeploys when you push to connected branches:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Sends notification
```

### Branch Previews

Each branch gets its own preview URL:
```bash
git checkout -b feature/new-reports
git push origin feature/new-reports
# Vercel creates preview: shopsmart-mvp-git-feature-new-reports.vercel.app
```

---

## 🎉 Success Metrics

After successful deployment, you should see:

### Build Metrics:
- ✅ Build time: < 2 minutes
- ✅ Bundle size: ~400-600KB (compressed)
- ✅ Build status: ✓ Ready
- ✅ Lighthouse score: 90+

### Runtime Metrics:
- ✅ First load: < 2 seconds
- ✅ Time to Interactive: < 3 seconds
- ✅ No console errors
- ✅ All features working

### Security:
- ✅ HTTPS enabled (auto)
- ✅ Security headers present
- ✅ No exposed secrets
- ✅ API key working

---

## 📞 Support & Resources

### Official Vercel Docs:
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deployment Configuration](https://vercel.com/docs/project-configuration)

### ShopSmart Specific:
- `START_HERE.md` - Security fixes overview
- `QUICK_FIX_GUIDE.md` - Manual patches
- `SECURITY_FIXES.md` - Technical details

### Common Commands:
```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel remove [deployment-url]

# List environment variables
vercel env ls

# Pull env vars locally
vercel env pull
```

---

## 🚀 Your Deployment URL

After deployment, you'll get URLs like:

- **Production:** `https://shopsmart-mvp.vercel.app`
- **Preview:** `https://shopsmart-mvp-git-branch.vercel.app`
- **Custom:** `https://yourdomain.com` (if configured)

---

## ✅ Final Checklist

Before going live:

### Security:
- [ ] All fixes from QUICK_FIX_GUIDE.md applied
- [ ] API key in Vercel env vars (not hardcoded)
- [ ] .env.local not committed to git
- [ ] Security headers configured (in vercel.json)

### Functionality:
- [ ] All features tested on production URL
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Offline features work

### Performance:
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Caching configured

### Documentation:
- [ ] README.md updated with production URL
- [ ] Deployment instructions documented
- [ ] API key setup documented

---

**Congratulations! Your ShopSmart MVP is now live on Vercel!** 🎉

**Your next steps:**
1. Test thoroughly on production URL
2. Share with beta users
3. Monitor analytics and performance
4. Iterate based on feedback

---

*Last Updated: December 15, 2025*
*Deployment Platform: Vercel*
*Framework: Vite + React 19.2*
