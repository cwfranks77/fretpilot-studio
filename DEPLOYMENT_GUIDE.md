# FretPilot - Complete Deployment & Setup Guide

## 🎸 Project Overview
FretPilot is a comprehensive guitar learning app with AI-powered video lessons, practice tracking, music store, and tiered subscriptions.

## 📋 Complete Feature Set

### Core Features
- **AI Video Lessons** with real-time pose detection and feedback
- **FretPilot Trainer** - Interactive fretboard learning
- **AI Lesson Generator** - Personalized practice plans
- **Practice Analyzer** - Track progress and identify weaknesses
- **Jam Companion** - AI-powered backing tracks
- **Music Studio** - Record and share performances
- **Music Store** - E-commerce with multiple fulfillment models
- **Metronome & Tuner** - Essential practice tools
- **Chord Library** - Comprehensive chord reference

### Monetization
- **3-Tier Subscription Model**:
  - Free: 3 lessons/day, basic features
  - Premium ($9.99/mo): Unlimited lessons, AI analysis, pose detection
  - Pro ($19.99/mo): Custom lesson plans, 1-on-1 coaching, priority support
- **E-commerce Store**: FretPilot-fulfilled, dropship, and affiliate products
- **In-app purchases**: Premium features and content

## 🚀 Initial Setup

### Prerequisites
```bash
# Install Node.js (v18+)
# Install Java JDK (for Android builds)
# Install Android Studio
# Install Git
```

### Clone and Install
```bash
# Clone repository
git clone https://github.com/yourusername/fretpilot.git
cd fretpilot

# Install dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

## 🔧 Configuration

### 1. Environment Variables
Create `.env` file in root:
```env
# Stripe (for subscriptions and payments)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key

# Server
PORT=5175
NODE_ENV=development

# Optional: AI Services
OPENAI_API_KEY=your_openai_key
```

### 2. Stripe Setup
```bash
# Create products in Stripe Dashboard:
# 1. Premium Monthly - $9.99
# 2. Pro Monthly - $19.99

# Update price IDs in src/services/subscriptionService.js:
# - Line 19: stripePriceId: 'price_premium_monthly'
# - Line 45: stripePriceId: 'price_pro_monthly'

# Set up webhook endpoint:
# URL: https://yourdomain.com/api/stripe-webhook
# Events: checkout.session.completed, customer.subscription.*, invoice.*
```

### 3. Android Configuration
Update `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.fretpilot.app"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 1
    versionName "1.0.0"
}
```

### 4. Capacitor Configuration
Update `capacitor.config.json`:
```json
{
  "appId": "com.fretpilot.app",
  "appName": "FretPilot",
  "webDir": "dist",
  "server": {
    "url": "https://yourdomain.com",
    "cleartext": true
  }
}
```

## 🏗️ Development Workflow

### Start Development Server
```bash
# Terminal 1: Frontend dev server
npm run dev

# Terminal 2: Backend API server
cd server
node index.js
```

### Access App
- Web: http://localhost:5173
- API: http://localhost:5175

## 📱 Build for Android

### Sync Web Assets
```bash
# Build web app
npm run build

# Sync to Capacitor
npx cap sync android

# Copy assets
npx cap copy android
```

### Build APK
```bash
# Navigate to android folder
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires keystore)
./gradlew assembleRelease

# APK location:
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

### Quick Build Script
```powershell
# Copy this to build-android.ps1
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
cd ..
$dest = "$env:USERPROFILE\Downloads\FretPilot-debug.apk"
Copy-Item "android\app\build\outputs\apk\debug\app-debug.apk" $dest -Force
Write-Host "✅ APK ready: $dest"
explorer.exe /select,$dest
```

## 🌐 Production Deployment

### Backend Deployment (Node.js)

#### Option 1: Deploy to Heroku
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create fretpilot-api

# Set environment variables
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...

# Deploy
git subtree push --prefix server heroku main

# Or use Procfile in server folder:
# web: node index.js
```

#### Option 2: Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy server
cd server
railway up

# Set environment variables in Railway dashboard
```

#### Option 3: Deploy to DigitalOcean/AWS
```bash
# Set up Node.js server
# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start server/index.js --name fretpilot-api

# Set up nginx reverse proxy
# Configure SSL with Let's Encrypt
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-api-url.com
# VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
```

### Database Setup (for production)
```bash
# Option 1: MongoDB Atlas (for user data, subscriptions)
# - Create cluster
# - Get connection string
# - Update server to use MongoDB instead of localStorage

# Option 2: PostgreSQL (for relational data)
# - Set up database on Heroku, Railway, or AWS RDS
# - Install pg: npm install pg
# - Update server with database queries

# Option 3: Supabase (PostgreSQL + Auth + Storage)
# - Create project
# - Set up tables for users, subscriptions, lessons, progress
# - Use Supabase client in frontend
```

## 📦 App Store Deployment

### Google Play Store

#### 1. Generate Release Keystore
```bash
cd android/app
keytool -genkey -v -keystore fretpilot-release.keystore -alias fretpilot -keyalg RSA -keysize 2048 -validity 10000

# Save keystore info in android/keystore/keystore.properties:
# storePassword=your_store_password
# keyPassword=your_key_password
# keyAlias=fretpilot
# storeFile=fretpilot-release.keystore
```

#### 2. Update build.gradle
```gradle
android {
    signingConfigs {
        release {
            def keystorePropertiesFile = rootProject.file("keystore/keystore.properties")
            def keystoreProperties = new Properties()
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
            
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 3. Build Release APK/AAB
```bash
cd android

# For APK
./gradlew assembleRelease

# For Android App Bundle (required for Play Store)
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### 4. Upload to Play Console
1. Go to https://play.google.com/console
2. Create app listing
3. Upload AAB file
4. Fill in store listing (title, description, screenshots)
5. Set content rating
6. Set pricing (free with in-app purchases)
7. Submit for review

### iOS App Store (if building for iOS)

#### 1. Set up Apple Developer Account
- Enroll in Apple Developer Program ($99/year)
- Create App ID in Apple Developer Portal

#### 2. Build iOS App
```bash
# Add iOS platform
npx cap add ios

# Sync
npx cap sync ios

# Open in Xcode
npx cap open ios

# In Xcode:
# - Set signing team
# - Archive app
# - Upload to App Store Connect
```

## 🔐 Security Best Practices

### 1. API Security
```javascript
// Add rate limiting
npm install express-rate-limit

// In server/index.js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 2. Environment Variables
```bash
# NEVER commit .env files
# Add to .gitignore:
.env
.env.local
.env.production

# Use environment-specific configs
```

### 3. CORS Configuration
```javascript
// server/index.js
const cors = require('cors');
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://fretpilot.com' 
    : 'http://localhost:5173'
}));
```

### 4. Input Validation
```bash
npm install express-validator

# Validate all API inputs
# Sanitize user-generated content
```

## 📊 Analytics & Monitoring

### Setup Analytics
```javascript
// Already integrated in src/services/analyticsService.js
// Configure providers:

// Google Analytics
// Add GA_TRACKING_ID to .env

// Mixpanel (recommended for event tracking)
npm install mixpanel-browser

// Sentry (error tracking)
npm install @sentry/vue
```

### Monitoring
```bash
# Backend monitoring with PM2
pm2 install pm2-logrotate
pm2 monitor

# Or use external services:
# - New Relic
# - DataDog
# - LogRocket (for frontend)
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

### Manual Testing Checklist
- [ ] User registration/login
- [ ] Free tier limits (3 lessons/day)
- [ ] Video lesson playback
- [ ] AI feedback display
- [ ] Subscription checkout (Stripe test mode)
- [ ] Subscription upgrade/downgrade
- [ ] Store checkout (all fulfillment types)
- [ ] Order history display
- [ ] Payment processing
- [ ] Email confirmations
- [ ] Mobile responsiveness
- [ ] Offline functionality (PWA)

## 📱 Progressive Web App (PWA)

### Enable PWA Features
```bash
# Already configured in vite.config.js
# Test PWA:
npm run build
npm run preview

# Install as app on mobile
```

### Service Worker
- Caches assets for offline use
- Enables "Add to Home Screen"
- Background sync for analytics

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy FretPilot

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
        VITE_STRIPE_PUBLIC_KEY: ${{ secrets.STRIPE_PUBLIC_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Android build issues
cd android
./gradlew clean
cd ..
npx cap sync android
```

#### API Connection Issues
```javascript
// Check CORS settings in server/index.js
// Verify API_URL in frontend config
// Check network requests in browser DevTools
```

#### Stripe Webhook Issues
```bash
# Test webhooks locally with Stripe CLI
stripe listen --forward-to localhost:5175/api/stripe-webhook

# Trigger test events
stripe trigger checkout.session.completed
```

## 📝 Maintenance

### Regular Updates
```bash
# Update dependencies
npm update
npm audit fix

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest
npx cap sync
```

### Backup Strategy
- Database: Daily automated backups
- User-generated content: Cloud storage (AWS S3, Google Cloud Storage)
- Code: Git repository

### Monitoring Checklist
- [ ] Server uptime (use UptimeRobot or similar)
- [ ] API response times
- [ ] Error rates (Sentry alerts)
- [ ] Subscription renewals
- [ ] Payment failures
- [ ] User engagement metrics
- [ ] App Store reviews

## 🎯 Launch Checklist

### Pre-Launch
- [ ] Test all features thoroughly
- [ ] Set up production Stripe account
- [ ] Configure production API endpoints
- [ ] Set up analytics
- [ ] Set up error tracking
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Set up customer support email
- [ ] Prepare marketing materials
- [ ] Set up social media accounts

### Launch Day
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Submit to Google Play Store
- [ ] Submit to Apple App Store (if applicable)
- [ ] Enable Stripe live mode
- [ ] Announce on social media
- [ ] Send email to beta testers
- [ ] Monitor error logs closely

### Post-Launch
- [ ] Gather user feedback
- [ ] Monitor analytics daily
- [ ] Respond to support requests
- [ ] Fix critical bugs immediately
- [ ] Plan feature updates
- [ ] Optimize based on usage data

## 🚀 Scaling Considerations

### When to Scale
- Server CPU/memory usage > 80%
- Response times > 500ms
- More than 10,000 active users
- Database queries slowing down

### Scaling Strategies
1. **Horizontal scaling**: Add more server instances
2. **Database optimization**: Add indexes, use read replicas
3. **CDN**: Serve static assets from CDN (Cloudflare, AWS CloudFront)
4. **Caching**: Redis for session management and API caching
5. **Load balancing**: Distribute traffic across servers
6. **Video hosting**: Use dedicated video platform (Vimeo, Wistia, AWS S3 + CloudFront)

## 📞 Support

### For Developers
- Documentation: This guide
- Issues: GitHub Issues
- Contact: developer@fretpilot.com

### For Users
- Help Center: https://fretpilot.com/help
- Support Email: support@fretpilot.com
- Community Forum: https://community.fretpilot.com

---

## 🎸 Quick Reference Commands

```bash
# Development
npm run dev                          # Start dev server
cd server && node index.js          # Start API server

# Build
npm run build                        # Build web app
npx cap sync android                 # Sync to Android
cd android && ./gradlew assembleDebug # Build APK

# Deploy
vercel                              # Deploy frontend
git push heroku main                # Deploy backend

# Maintenance
npm update                          # Update dependencies
npm audit fix                       # Fix security issues
git push origin main                # Push to GitHub
```

## 🎉 You're Ready!

FretPilot is now ready for deployment. Follow this guide step-by-step for a successful launch!

**Good luck with your app! 🎸🚀**
