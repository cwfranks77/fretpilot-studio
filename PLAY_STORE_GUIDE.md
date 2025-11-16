# FretPilot - Complete Google Play Store Setup Guide

## 📱 Overview
This guide will walk you through deploying FretPilot to the Google Play Store, from initial setup to publishing.

---

## 🔐 Prerequisites

### 1. Google Play Developer Account
- **Cost**: $25 one-time registration fee
- **Required**: Credit card for payment
- **Time**: Account approval takes 24-48 hours
- **Link**: https://play.google.com/console/signup

### 2. Required Accounts
- [x] Google account (for Play Console)
- [ ] AdMob account (for ads monetization)
- [ ] Google Merchant account (optional, for paid apps)

---

## 📝 STEP 1: Create Release Keystore

A keystore is required to sign your app for release. **KEEP THIS FILE SAFE** - losing it means you can never update your app again!

### Generate Keystore:
```powershell
cd C:\Users\ninja\FretPilot\android\app

# Generate release keystore
keytool -genkey -v -keystore fretpilot-release.keystore -alias fretpilot -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# 1. Keystore password (create a strong password, save it!)
# 2. Key password (can be same as keystore password)
# 3. Your name, organization, location (this info appears in the certificate)
```

### Store Your Passwords Safely:
```powershell
# Create keystore.properties file
cd C:\Users\ninja\FretPilot\android\keystore

# Create/edit keystore.properties
@"
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=fretpilot
storeFile=../app/fretpilot-release.keystore
"@ | Out-File keystore.properties -Encoding UTF8
```

**⚠️ CRITICAL**: Back up your keystore file and passwords to:
- Secure password manager (LastPass, 1Password, etc.)
- Encrypted USB drive
- Secure cloud storage (Google Drive, Dropbox)

---

## 🏗️ STEP 2: Configure Release Build

### Update android/app/build.gradle:

```gradle
android {
    // ... existing config ...
    
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
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Update Version Info (android/app/build.gradle):
```gradle
defaultConfig {
    applicationId "com.fretpilot.app"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 1          // Increment for each release
    versionName "1.0.0"    // User-visible version
}
```

---

## 📦 STEP 3: Build Release AAB (Android App Bundle)

AAB is required for Play Store (not APK).

### Build Command:
```powershell
# Navigate to android folder
cd C:\Users\ninja\Fretquest\android

# Clean previous builds
.\gradlew clean

# Build release AAB
.\gradlew bundleRelease

# Output location:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Quick Build Script:
```powershell
# Save as build-release.ps1
cd C:\Users\ninja\Fretquest

# Ensure latest web build
npm run build

# Sync to Capacitor
npx cap sync android

# Build AAB
cd android
.\gradlew clean bundleRelease

$aab = "app\build\outputs\bundle\release\app-release.aab"
if (Test-Path $aab) {
    $file = Get-Item $aab
    Write-Host "`n✅ RELEASE AAB BUILT SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "   File: $($file.Name)" -ForegroundColor Cyan
    Write-Host "   Size: $([math]::Round($file.Length/1MB,2)) MB" -ForegroundColor Cyan
    Write-Host "   Path: $($file.FullName)" -ForegroundColor Cyan
    Write-Host "`n📤 Ready to upload to Play Console!" -ForegroundColor Yellow
    explorer.exe /select,$file.FullName
} else {
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
}
```

---

## 🎨 STEP 4: Prepare Store Listing Assets

### Required Graphics:

#### App Icon
- **Size**: 512 x 512 px
- **Format**: PNG (32-bit)
- **Location**: Already created at `resources/android/icon/drawable-playstore-512-icon.png`

#### Feature Graphic
- **Size**: 1024 x 500 px
- **Format**: PNG or JPEG
- **Purpose**: Shown at top of store listing
- **Create**: Design showcasing FretPilot features

#### Screenshots (minimum 2, maximum 8)
- **Size**: 
  - Phone: 1080 x 1920 px (portrait) or 1920 x 1080 px (landscape)
  - Tablet: 1536 x 2048 px or 2048 x 1536 px
- **Format**: PNG or JPEG
- **Recommendations**:
  1. Home screen with features
  2. AI Video Lessons in action
  3. Practice analyzer
  4. Music store
  5. Subscription tiers
  6. Jam companion
  7. Progress tracking
  8. FretPilot trainer

#### Promotional Graphics (optional but recommended)
- **Promo Graphic**: 180 x 120 px
- **TV Banner**: 1280 x 720 px (if supporting Android TV)

### Content Descriptions:

#### Short Description (80 characters max)
```
Learn guitar with AI-powered video lessons, practice tracking & music store
```

#### Full Description (4000 characters max)
```
🎸 FretPilot - Your Complete Guitar Learning Companion

Master guitar with the power of AI! FretPilot combines professional video lessons, intelligent practice tracking, and a full-featured music store in one comprehensive app.

✨ AI VIDEO LESSONS
• Real-time pose detection analyzes your hand position
• Adaptive difficulty adjusts to your skill level
• Interactive hotspots provide contextual tips
• Personalized recommendations based on your progress
• Download lessons for offline practice (Premium)

🎯 INTELLIGENT PRACTICE TOOLS
• FretPilot Trainer: Interactive fretboard learning
• Practice Analyzer: Identify weaknesses and track improvement
• AI Lesson Generator: Custom routines tailored to your goals
• Mistake Heatmap: Visual representation of problem areas
• Progress tracking with detailed analytics

🎵 JAM & CREATE
• AI-powered backing tracks in any key and style
• Built-in metronome with visual beat indicator
• Chromatic tuner for perfect pitch
• Music studio for recording and sharing
• Comprehensive chord library and scale explorer

🛒 MUSIC STORE
• Shop guitars, amps, pedals, and accessories
• Compare prices and read reviews
• Fast, secure checkout
• Track your orders
• Exclusive deals for members

💎 FLEXIBLE PRICING
• FREE: 3 video lessons per day, basic features
• PREMIUM ($9.99/mo): Unlimited lessons, AI analysis, offline downloads
• PRO ($19.99/mo): Custom lesson plans, 1-on-1 coaching, priority support

🏆 UNIQUE FEATURES
✓ Real-time technique feedback
✓ Pose detection with accuracy scores
✓ AI-generated custom curriculum
✓ Adaptive learning technology
✓ Community features and challenges
✓ Certificate of completion
✓ Works offline (Premium+)

Whether you're a complete beginner or advancing your skills, FretPilot adapts to your level and helps you reach your musical goals faster.

Download FretPilot today and start your guitar journey! 🎸

---
Questions? Contact us at support@fretpilot.com
Privacy Policy: https://fretpilot.com/privacy
Terms of Service: https://fretpilot.com/terms
```

#### What's New (500 characters - for updates)
```
🎉 Welcome to FretPilot v1.0!

• AI-powered video lessons with pose detection
• 3-tier subscription model
• Integrated music store
• Practice tracking and analytics
• Jam companion with backing tracks
• Music recording studio
• Metronome, tuner, and chord library

Start learning guitar the smart way!
```

---

## 🏪 STEP 5: Create Play Console Listing

### Access Play Console:
1. Go to: https://play.google.com/console
2. Sign in with your Google account
3. Select "Create app"

### Basic Information:
- **App name**: FretPilot - Guitar Learning Platform
- **Default language**: English (United States)
- **App or game**: App
- **Free or paid**: Free (with in-app purchases)
- **Declarations**: 
  - [x] I acknowledge that this app will need to comply with US export laws
  - [x] I confirm this app meets Android's content policy guidelines

### Store Presence:

#### Main Store Listing:
1. **App name**: FretPilot
2. **Short description**: (Use text from above)
3. **Full description**: (Use text from above)
4. **App icon**: Upload 512x512 icon
5. **Feature graphic**: Upload 1024x500 graphic
6. **Phone screenshots**: Upload 2-8 screenshots
7. **Tablet screenshots**: (Optional but recommended)

#### Categorization:
- **App category**: Music & Audio
- **Tags**: (Optional) guitar, learning, lessons, music education, practice

#### Contact Details:
- **Email**: support@fretpilot.com
- **Phone**: (Optional)
- **Website**: https://fretpilot.com
- **Privacy Policy**: https://fretpilot.com/privacy (required!)

### Content Rating:
1. Click "Start questionnaire"
2. Select category: **Music, Audio & Radio**
3. Answer questions honestly:
   - Violence: No
   - Sexual content: No
   - Profanity: No
   - Controlled substances: No
   - User-generated content: No (unless you add forums)
   - User interaction features: No (unless you add chat)
   - Shares user location: No
   - Shares personal info: Yes (if collecting email/data)
4. Get rating (likely: PEGI 3, ESRB Everyone)

### Target Audience:
- **Age groups**: 13 and over (recommended for guitar learning)
- **Appeals to children**: No

### Privacy Policy:
**⚠️ REQUIRED** - You must have a privacy policy URL. Create a simple one:

```markdown
# FretPilot Privacy Policy

Last updated: [Date]

## Information We Collect
- Email address (for account creation)
- Practice data (lesson progress, statistics)
- Purchase history (for subscriptions)
- Usage analytics (anonymous)

## How We Use Information
- Provide and improve our services
- Process payments and subscriptions
- Send important updates
- Personalize your experience

## Data Sharing
We do not sell your personal information. We share data with:
- Payment processors (Stripe)
- Analytics services (anonymous data only)
- Cloud hosting (secure storage)

## Your Rights
- Access your data
- Delete your account
- Opt out of emails

## Contact
Email: privacy@fretpilot.com

## Changes
We may update this policy. Continued use means acceptance.
```

Host this at: `https://fretpilot.com/privacy`

---

## 💰 STEP 6: Set Up In-App Purchases

### Configure Products:
1. In Play Console, go to **Monetize** → **Products** → **Subscriptions**
2. Create subscription products:

#### Premium Subscription:
- **Product ID**: `premium_monthly`
- **Name**: Premium Membership
- **Description**: Unlimited AI video lessons, pose detection, downloads, and more
- **Status**: Active
- **Price**: $9.99 USD
- **Billing period**: 1 month
- **Free trial**: 7 days (recommended)
- **Grace period**: 3 days

#### Pro Subscription:
- **Product ID**: `pro_monthly`
- **Name**: Pro Membership
- **Description**: Everything in Premium plus custom lesson plans, 1-on-1 coaching, and priority support
- **Status**: Active
- **Price**: $19.99 USD
- **Billing period**: 1 month
- **Free trial**: 7 days
- **Grace period**: 3 days

### Update App Code:
In `src/services/subscriptionService.js`, update the price IDs:
```javascript
PREMIUM: {
  stripePriceId: 'premium_monthly', // Google Play product ID
  // ...
},
PRO: {
  stripePriceId: 'pro_monthly', // Google Play product ID
  // ...
}
```

---

## 🎯 STEP 7: Upload AAB & Submit

### Production Release:
1. In Play Console, go to **Release** → **Production**
2. Click **Create new release**
3. Upload your AAB file (`app-release.aab`)
4. Play Console will analyze it (wait 5-10 minutes)
5. **Release name**: `1.0.0` (first release)
6. **Release notes**: (Use "What's New" text from above)
7. Review and **roll out to production**

### Internal Testing (Recommended First):
Before production, test with internal testers:
1. Go to **Release** → **Testing** → **Internal testing**
2. Create release and upload AAB
3. Add testers (email addresses)
4. Share testing link with testers
5. Gather feedback and fix issues
6. Then promote to production

---

## 📱 STEP 8: AdMob Integration (Monetization)

### Create AdMob Account:
1. Go to: https://admob.google.com
2. Sign in with same Google account
3. Click "Get Started"

### Register App:
1. Click **Apps** → **Add App**
2. Select **Android**
3. **App name**: FretPilot
4. **Package name**: com.fretpilot.app
5. Click **Add**
6. Copy your **App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### Create Ad Units:
1. In your app, click **Ad units** → **Add ad unit**
2. Create three ad units:

**Banner Ad:**
- Type: Banner
- Name: FretPilot Banner
- Copy **Ad unit ID**: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`

**Interstitial Ad:**
- Type: Interstitial
- Name: FretPilot Interstitial
- Copy **Ad unit ID**

**Rewarded Ad:**
- Type: Rewarded
- Name: FretPilot Reward
- Copy **Ad unit ID**

### Update Code with Production IDs:

**android/app/src/main/AndroidManifest.xml** (line ~40):
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-YOUR_ACTUAL_ID~YOUR_ACTUAL_ID"/>
```

**src/services/adService.js**:
```javascript
// Replace test IDs with your production IDs
adId: 'ca-app-pub-YOUR_ID/YOUR_BANNER_ID'  // Line ~31
adId: 'ca-app-pub-YOUR_ID/YOUR_INTERSTITIAL_ID'  // Line ~46
adId: 'ca-app-pub-YOUR_ID/YOUR_REWARDED_ID'  // Line ~59
```

### Rebuild & Update:
```powershell
cd C:\Users\ninja\Fretquest\android
.\gradlew clean bundleRelease
# Upload new AAB to Play Console as update
```

---

## ✅ STEP 9: Pre-Launch Checklist

Before submitting, verify:

### Technical:
- [ ] App builds without errors
- [ ] All features work on real Android device
- [ ] Test all 3 subscription tiers
- [ ] Test music store checkout
- [ ] Test video lesson playback
- [ ] Test offline functionality (Premium)
- [ ] App doesn't crash on various devices
- [ ] AdMob ads display correctly
- [ ] Permissions are properly requested

### Content:
- [ ] Privacy policy URL is live
- [ ] Terms of service URL is live
- [ ] Support email responds to queries
- [ ] All store listing images uploaded
- [ ] Descriptions are accurate
- [ ] Screenshots show latest UI
- [ ] Content rating completed

### Legal:
- [ ] App complies with Play Store policies
- [ ] Music/audio content is properly licensed
- [ ] Third-party libraries properly attributed
- [ ] Export compliance confirmed
- [ ] Data handling is transparent

---

## 🚀 STEP 10: Submit for Review

1. Complete all sections in Play Console
2. Go to **Dashboard** → **App bundle explorer**
3. Verify AAB uploaded successfully
4. Go to **Publishing overview**
5. Check all items are green ✓
6. Click **Send X items for review** (X = number of pending items)
7. Review summary and click **Start rollout to production**

### Review Timeline:
- **Initial review**: 3-7 days (first app)
- **Updates**: 24-48 hours
- **Rejected?**: Read feedback carefully and resubmit

---

## 📈 STEP 11: Post-Launch

### After Approval:

#### Monitor Performance:
- Check crash reports daily
- Review user ratings and respond
- Track download numbers
- Monitor subscription conversions

#### Update Regularly:
- Fix bugs quickly
- Add new features
- Improve based on feedback
- Update screenshots and descriptions

#### Marketing:
- Share Play Store link
- Create social media posts
- Reach out to music/guitar communities
- Consider paid ads (Google, Facebook)
- Create demo videos for YouTube

#### Version Management:
- Increment `versionCode` for each update
- Update `versionName` for user-visible changes
- Keep changelog in release notes

---

## 🔧 Quick Reference Commands

```powershell
# Build Release AAB
cd C:\Users\ninja\Fretquest\android
.\gradlew clean bundleRelease

# Build Debug APK (for testing)
.\gradlew assembleDebug

# Check Signing
.\gradlew signingReport

# Clean Build
.\gradlew clean

# Sync Capacitor
cd ..
npx cap sync android

# Full Release Build
npm run build
npx cap sync android
cd android
.\gradlew bundleRelease
```

---

## 🆘 Troubleshooting

### "Unable to find signing config"
- Check `android/keystore/keystore.properties` exists
- Verify paths in properties file
- Ensure keystore file is in correct location

### "Minimum SDK version"
- Update `minSdkVersion` in `build.gradle` to 24 or higher

### "Release build failed"
- Run `.\gradlew clean`
- Delete `android/app/build` folder
- Rebuild

### "AdMob not showing ads"
- Ads don't show immediately after creation (wait 24hrs)
- Verify app is approved in AdMob
- Check for ad blocker on test device
- Review AdMob account status

### "In-app purchases not working"
- Ensure app is published (at least in internal testing)
- Product IDs must match exactly
- Test with license test accounts
- Verify Play Console billing is set up

---

## 📞 Support Resources

- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **AdMob Support**: https://support.google.com/admob
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/google-play
- **Android Developers**: https://developer.android.com

---

## 🎉 Congratulations!

Once approved, your app will be live on the Google Play Store! 🚀

**Play Store URL**: `https://play.google.com/store/apps/details?id=com.fretpilot.app`

Share it with the world and start getting users! 🎸
