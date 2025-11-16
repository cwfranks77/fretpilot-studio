# FretPilot Studio - Quick Start Guide

Welcome! This guide will get you from zero to production in under 30 minutes.

## Prerequisites

- Node.js 20+ installed
- Git installed
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

## 1. Clone and Install (2 minutes)

```powershell
# Clone repository
git clone https://github.com/cwfranks77/fretpilot-studio.git
cd fretpilot-studio

# Install dependencies
npm install

# Install Android dependencies
cd android
./gradlew --version  # Verify Gradle works
cd ..
```

## 2. Configure Environment (5 minutes)

```powershell
# Copy environment template
Copy-Item .env.example .env.local

# Edit .env.local with your keys
notepad .env.local
```

**Minimum required for testing:**
```env
VITE_API_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLIC_KEY=pk_test_your_test_key
```

## 3. Start Development Server (1 minute)

```powershell
# Terminal 1: Start backend
cd server
npm install
node index.js

# Terminal 2: Start frontend
npm run dev
```

Open: http://localhost:5173

## 4. Build for Production

### Android APK/AAB (5 minutes)

```powershell
# Build web assets
npm run build

# Sync with Android
npx cap sync android

# Build APK
cd android
./gradlew assembleRelease

# Build AAB (Play Store)
./gradlew bundleRelease

# Outputs:
# - android/app/build/outputs/apk/release/app-release.apk
# - android/app/build/outputs/bundle/release/app-release.aab
```

### Windows Installer (3 minutes)

```powershell
npm run electron:build

# Output: dist-electron/FretPilot Setup 1.0.0.exe
```

### iOS (on Mac, 10 minutes)

```bash
npm run build
npx cap sync ios
npx cap open ios

# In Xcode:
# 1. Select "Any iOS Device"
# 2. Product → Archive
# 3. Distribute → App Store Connect
```

## 5. Deploy Backend to Vercel (3 minutes)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd server
vercel --prod

# Note the deployment URL, add to .env.local:
# VITE_API_URL=https://your-project.vercel.app
```

## 6. Configure Payment Services

### Stripe (Test Mode - 5 minutes)

1. Sign up: https://dashboard.stripe.com/register
2. Get test keys: Dashboard → Developers → API Keys
3. Copy to `.env.local`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_PUBLIC_KEY=pk_test_...`
4. Test card: `4242 4242 4242 4242` (any future date, any CVC)

### BTCPay Server (Optional - 15 minutes)

**Quick Option - Use BTCPay Jungle (Free):**

1. Visit: https://btcpayjungle.com
2. Create account
3. Create store
4. Get API key: Account → API Keys
5. Add to `.env.local`:
   ```env
   BTCPAY_SERVER_URL=https://btcpayjungle.com
   BTCPAY_STORE_ID=your_store_id
   BTCPAY_API_KEY=your_api_key
   ```

**Full Guide:** See `docs/BTCPAY_SERVER_SETUP.md`

## 7. Test Locally

```powershell
# Start both servers
npm run dev        # Frontend: http://localhost:5173
node server/index.js   # Backend: http://localhost:3000

# Test flow:
# 1. Open app in browser
# 2. Click "Premium" → Choose plan
# 3. Android: Uses Google Play Billing (requires device)
# 4. Web: Uses Stripe test checkout
# 5. Bitcoin: Shows BTCPay invoice (testnet)
```

## 8. Release to Stores

### Google Play Store (Full guide: `docs/PLAY_CONSOLE_SETUP_GUIDE.md`)

```powershell
# 1. Upload AAB to Play Console
# https://play.google.com/console

# 2. Configure in-app products:
# - com.fretpilot.app.premium.monthly
# - com.fretpilot.app.premium.yearly
# - com.fretpilot.app.premium.lifetime

# 3. Submit for review
```

### Apple App Store (Full guide: `docs/IOS_APP_STORE_GUIDE.md`)

```bash
# Requires macOS + Xcode
# 1. Archive in Xcode
# 2. Upload to App Store Connect
# 3. Configure in-app purchases
# 4. Submit for review
```

## Common Commands

```powershell
# Development
npm run dev              # Start dev server
npm run build            # Build web assets
npm run preview          # Preview production build

# Mobile
npm run android          # Open Android Studio
npm run ios              # Open Xcode (macOS only)
npx cap sync             # Sync web assets to mobile

# Building
npm run electron:build   # Build Windows installer
cd android && ./gradlew assembleRelease  # Build Android APK

# Server
node server/index.js     # Start backend API
npm run server           # Alternative command
```

## Project Structure

```
fretpilot-studio/
├── src/                    # Vue 3 frontend
│   ├── components/         # UI components
│   ├── services/           # API clients
│   └── main.js            # Entry point
├── server/                 # Express backend
│   ├── index.js           # API endpoints
│   ├── vendor.js          # Shipping integration
│   └── dropship-webhooks.js
├── android/                # Android Capacitor app
│   ├── app/
│   │   ├── build.gradle   # Build config
│   │   └── keystore/      # Signing keys
├── ios/                    # iOS Capacitor app
├── electron-app/           # Windows Electron wrapper
├── docs/                   # Guides and documentation
└── .github/workflows/      # CI/CD automation
```

## Troubleshooting

### Build fails on Android
```powershell
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

### Port already in use
```powershell
# Kill process on port 3000
npx kill-port 3000

# Or use different port
$env:PORT = "3001"; node server/index.js
```

### Module not found errors
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Capacitor sync fails
```powershell
# Reinstall Capacitor
npm install @capacitor/cli @capacitor/core --save
npx cap sync
```

## Next Steps

1. **Production Setup:**
   - Switch Stripe to live keys
   - Deploy BTCPay Server (Voltage/LunaNode)
   - Configure dropshipping (Printful/Spocket)
   - Set up CI/CD (GitHub Actions)

2. **Store Submissions:**
   - Complete Play Console setup
   - Configure App Store Connect
   - Prepare marketing assets
   - Submit for review

3. **Monitoring:**
   - Set up error tracking (Sentry)
   - Configure analytics (Google Analytics)
   - Monitor backend metrics (Vercel)
   - Track payment success rates

## Documentation

- **Windows Code Signing:** `docs/WINDOWS_CODE_SIGNING_GUIDE.md`
- **iOS App Store:** `docs/IOS_APP_STORE_GUIDE.md`
- **BTCPay Server:** `docs/BTCPAY_SERVER_SETUP.md`
- **CI/CD Setup:** `docs/CICD_SETUP_GUIDE.md`
- **Play Console:** `docs/PLAY_CONSOLE_SETUP_GUIDE.md`
- **Production Summary:** `PRODUCTION_RELEASE_SUMMARY.md`

## Support

- **Issues:** https://github.com/cwfranks77/fretpilot-studio/issues
- **Discussions:** https://github.com/cwfranks77/fretpilot-studio/discussions
- **Email:** support@fretpilotstudio.com

---

**Time to Production:** ~30 minutes (development) + 2-3 days (store reviews)

**Status:** ✅ All systems production-ready

**Good luck with your launch! 🚀🎸**
