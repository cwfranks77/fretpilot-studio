# iOS App Store Release Guide

## Prerequisites

### System Requirements
- macOS with Xcode 14+ installed
- Apple Developer Program membership ($99/year)
- Valid Apple ID with Two-Factor Authentication

### Developer Account Setup
1. **Enroll in Apple Developer Program:**
   - Visit https://developer.apple.com/programs/
   - Sign in with Apple ID
   - Complete enrollment ($99/year)
   - Wait for approval (24-48 hours)

2. **Create App Store Connect Record:**
   - Visit https://appstoreconnect.apple.com
   - Click "My Apps" → "+" → "New App"
   - Fill in app information:
     - Platform: iOS
     - Name: FretPilot Studio
     - Primary Language: English
     - Bundle ID: com.fretpilot.app
     - SKU: fretpilot-001
     - User Access: Full Access

## Configure Certificates & Provisioning

### 1. Create Certificates

```bash
# On your Mac, run:
cd ~/Fretquest/ios/App

# Open Xcode
open App.xcworkspace
```

In Xcode:
1. Select "App" target → "Signing & Capabilities"
2. Enable "Automatically manage signing"
3. Select your Team
4. Xcode will create:
   - Development certificate
   - Distribution certificate
   - Provisioning profiles

### 2. Configure Capabilities

#### In-App Purchases
1. In Xcode → "Signing & Capabilities" → "+" → Add "In-App Purchase"
2. No additional configuration needed (handled by App Store Connect)

#### Push Notifications (Optional)
1. Add "Push Notifications" capability
2. Create APNs certificate in Apple Developer Portal

## Configure In-App Purchases in App Store Connect

### 1. Set Up Paid Applications Agreement
1. Go to App Store Connect → Agreements, Tax, and Banking
2. Request "Paid Applications" agreement
3. Complete:
   - Contact Information
   - Bank Information (Navy Federal routing/account)
   - Tax Forms (W-9 or equivalent)

### 2. Create Subscription Products

**Monthly Premium Subscription:**
1. App Store Connect → Your App → In-App Purchases → "+"
2. Type: Auto-Renewable Subscription
3. Reference Name: `Premium Monthly`
4. Product ID: `com.fretpilot.app.premium.monthly`
5. Subscription Group: Create "Premium Access"
6. Duration: 1 Month
7. Price: $9.99 (or your price)
8. Localization:
   - Display Name: "Premium Monthly"
   - Description: "Access all premium features, AI lessons, and advanced analytics"

**Yearly Premium Subscription:**
1. Add to same Subscription Group
2. Product ID: `com.fretpilot.app.premium.yearly`
3. Duration: 1 Year
4. Price: $99.99 (or your price)
5. Set up promotional offer (optional):
   - 7-day free trial
   - Or 30% off first year

**Lifetime Premium:**
1. Type: Non-Consumable
2. Product ID: `com.fretpilot.app.premium.lifetime`
3. Price: $299.99 (or your price)

### 3. Update Product IDs in Code

The code is already configured with product IDs. Verify they match:

**File:** `src/services/googlePlayBilling.js`
```javascript
const PRODUCT_IDS = {
  monthly: 'com.fretpilot.app.premium.monthly',
  yearly: 'com.fretpilot.app.premium.yearly',
  lifetime: 'com.fretpilot.app.premium.lifetime'
}
```

### 4. Create Subscription Group Metadata
1. App Store Connect → Subscription Group → Edit
2. Upload:
   - App Name: "FretPilot Studio"
   - Subscription Review Screenshot (1284x2778px)
   - Review Notes

## Build & Archive

### 1. Prepare iOS Project

```bash
# Navigate to project root
cd ~/Fretquest

# Install dependencies
npm install

# Build web assets
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### 2. Configure Build Settings

In Xcode:
1. Select "App" target
2. General:
   - Display Name: `FretPilot Studio`
   - Bundle Identifier: `com.fretpilot.app`
   - Version: `1.0.0`
   - Build: `1` (increment for each upload)
3. Signing & Capabilities:
   - Team: Your Apple Developer Team
   - Signing Certificate: Apple Distribution
   - Provisioning Profile: (Auto-managed)

### 3. Update Info.plist Permissions

**File:** `ios/App/App/Info.plist`

Add required privacy descriptions:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is needed to scan chord diagrams and sheet music</string>
<key>NSMicrophoneUsageDescription</key>
<string>Microphone access is needed for tuning and pitch detection</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Photo library access is needed to save practice progress screenshots</string>
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

### 4. Archive for App Store

In Xcode:
1. Select "Any iOS Device (arm64)" as target
2. Product → Archive
3. Wait for archive to complete (5-10 minutes)
4. Archives window opens automatically

### 5. Upload to App Store Connect

1. In Archives window, select your archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Click "Upload"
5. Select:
   - ✅ Upload symbols
   - ✅ Manage Version and Build Number (auto-increment)
6. Review code signing
7. Click "Upload"
8. Wait for processing (10-30 minutes)

## Configure App Store Listing

### 1. App Information

**App Store Connect → Your App → App Information:**

- Category: Music / Education
- Content Rights: No, it does not contain, show, or access third-party content
- Age Rating:
  - Frequent/Intense: None selected
  - Infrequent/Mild: None selected
  - Result: 4+

### 2. Pricing and Availability

- Price: Free (with in-app purchases)
- Availability: All territories
- Pre-order: No (for initial release)

### 3. App Privacy

**Required privacy disclosures:**

Data Collected:
- Email address (used for account management)
- Purchase history (for premium features)
- Usage data (analytics)

Privacy Policy URL: `https://fretpilotstudio.com/privacy` (you'll need to create this)

### 4. Prepare Screenshots

**Required sizes:**
- 6.5" Display (1284 x 2778): iPhone 14 Pro Max, iPhone 13 Pro Max
- 5.5" Display (1242 x 2208): iPhone 8 Plus

**Recommended content:**
1. Main interface with chord library
2. AI lesson generator in action
3. Practice analytics dashboard
4. Metronome/tuner features
5. Premium features showcase

**Generate screenshots:**
```bash
# Use iOS Simulator
open -a Simulator

# In Simulator:
# 1. Open your app
# 2. Cmd+S to save screenshot
# 3. Repeat for different features
```

### 5. App Preview Video (Optional but Recommended)

- Length: 15-30 seconds
- Orientation: Portrait
- Format: .mov or .m4v
- Showcase key features: chord trainer, AI lessons, analytics

### 6. Metadata

**App Name:** FretPilot Studio

**Subtitle (30 chars):** Interactive Guitar Learning

**Promotional Text (170 chars):**
Master guitar chords with AI-powered lessons, real-time feedback, and personalized practice analytics. Start your musical journey today!

**Description:**
```
FretPilot Studio is your comprehensive guitar learning companion, combining cutting-edge AI technology with proven teaching methods.

KEY FEATURES:

🎸 Interactive Chord Trainer
• Visual fretboard with real-time feedback
• 500+ chord variations
• Progressive difficulty levels
• Mistake heatmap analysis

🤖 AI Lesson Generator
• Personalized curriculum based on skill level
• Adaptive difficulty adjustment
• Genre-specific lesson plans
• Practice recommendations

📊 Practice Analytics
• Track progress over time
• Identify weak areas
• Session history and statistics
• Achievement system

🎵 Essential Tools
• Chromatic tuner
• Adjustable metronome
• Jam companion with backing tracks
• Chord library with audio playback

💎 PREMIUM FEATURES:

Unlock unlimited potential with Premium:
• Unlimited AI-generated lessons
• Advanced analytics dashboard
• Custom practice schedules
• Offline mode
• Priority support
• Early access to new features

SUBSCRIPTION OPTIONS:
• Monthly: $9.99/month
• Yearly: $99.99/year (save 17%)
• Lifetime: $299.99 one-time

FREE FEATURES INCLUDED:
✓ Basic chord trainer
✓ Essential tuner & metronome
✓ Limited AI lessons
✓ Core analytics

Perfect for beginners and advanced players alike. Join thousands of guitarists improving their skills with FretPilot Studio!

SUPPORT:
Visit https://fretpilotstudio.com/support
Email: support@fretpilotstudio.com
```

**Keywords (100 chars):**
`guitar,chords,lessons,learn,music,tuner,metronome,practice,AI,training`

**Support URL:** `https://fretpilotstudio.com/support`

**Marketing URL:** `https://fretpilotstudio.com`

### 7. Review Information

- Sign-in Required: No (or provide test account if signup is mandatory)
- Contact Information:
  - First Name: [Your Name]
  - Last Name: [Your Name]
  - Phone: [Your Phone]
  - Email: [Your Email]
- Demo Account (if needed):
  - Username: review@fretpilotstudio.com
  - Password: [Create a test account]
- Notes:
  ```
  Premium features require subscription.
  Test subscription credentials:
  Sandbox Apple ID: [Create in App Store Connect → Users and Access → Sandbox]
  
  Test in-app purchases in sandbox environment.
  ```

## Submit for Review

### 1. Pre-Submission Checklist

- ✅ Build uploaded and processed
- ✅ All screenshots uploaded (at least 2 required sizes)
- ✅ App description completed
- ✅ Privacy policy URL live
- ✅ Support URL live
- ✅ In-app purchases configured and approved
- ✅ Paid applications agreement signed
- ✅ Banking information entered
- ✅ Test account created (if needed)

### 2. Submit

1. App Store Connect → Your App → Version
2. Select uploaded build
3. Add "What's New in This Version" text:
   ```
   Welcome to FretPilot Studio 1.0!
   
   • Interactive chord trainer with 500+ chords
   • AI-powered personalized lessons
   • Practice analytics and progress tracking
   • Professional tuner and metronome
   • Jam companion with backing tracks
   
   Start your guitar learning journey today!
   ```
4. Click "Submit for Review"

### 3. Review Timeline

- Initial Review: 24-48 hours
- If Rejected: Address issues and resubmit
- Approval: App goes live automatically (or on scheduled date)

## TestFlight (Beta Testing)

Before public release, test with beta users:

### 1. Enable TestFlight

1. App Store Connect → TestFlight tab
2. Select your build
3. Add beta testers:
   - Internal (up to 100): Your Apple Developer team
   - External (up to 10,000): Public beta

### 2. Distribute Beta

1. Create external test group
2. Add testers via email or public link
3. Testers receive TestFlight invitation
4. Collect feedback via TestFlight

### 3. Beta Testing Best Practices

- Test for 1-2 weeks before public release
- Focus testers on:
  - In-app purchase flow
  - Premium feature access
  - Performance across devices
  - Crash reports
- Address critical issues before App Store submission

## Post-Launch Monitoring

### 1. Monitor App Analytics

App Store Connect → Analytics:
- Downloads
- In-app purchases
- Crashes
- User engagement

### 2. Respond to Reviews

- Reply to user reviews within 24-48 hours
- Address bugs and feature requests
- Thank positive reviewers

### 3. Update Schedule

- Bug fixes: As needed (expedited review: 1-2 days)
- Features: Monthly or quarterly
- Critical security: Immediate

## Revenue & Payouts

### Bank Account Setup (Navy Federal)

Funds from in-app purchases go to your Navy Federal account:

1. App Store Connect → Agreements, Tax, and Banking
2. Banking Information:
   - Account Holder Name: [Your Legal Name]
   - Bank Name: Navy Federal Credit Union
   - Account Number: [Your Account]
   - Routing Number: 256074974
   - Account Type: Checking/Savings
   - Bank Address: 820 Follin Lane, Vienna, VA 22180

### Payment Schedule

- Apple pays monthly (45 days after end of fiscal month)
- Apple takes 30% (15% after year 1 subscriber retention)
- Example: January sales paid by mid-March

### Financial Reporting

Available in App Store Connect:
- Sales and Trends
- Payments and Financial Reports
- Subscription analytics

## Support Infrastructure

### Required Pages

Create these on your website:

**Privacy Policy** (`https://fretpilotstudio.com/privacy`)
```
[Include standard privacy policy covering:]
- Data collection (email, usage analytics)
- Third-party services (analytics, payment processors)
- User rights (access, deletion)
- Contact information
```

**Terms of Service** (`https://fretpilotstudio.com/terms`)
```
[Include standard terms covering:]
- Service description
- User obligations
- Subscription terms
- Refund policy (follow Apple's)
- Liability limitations
```

**Support Page** (`https://fretpilotstudio.com/support`)
```
- FAQ section
- Contact form
- Troubleshooting guides
- Feature documentation
```

## Build Commands Reference

```bash
# Full iOS release workflow
cd ~/Fretquest

# 1. Clean and install
npm install
npx cap sync ios

# 2. Build web assets
npm run build

# 3. Open in Xcode
npx cap open ios

# In Xcode:
# - Select "Any iOS Device" target
# - Product → Archive
# - Distribute → App Store Connect
# - Upload

# Alternative: Update build number automatically
npm version patch  # Increments version 1.0.0 → 1.0.1
npx cap sync ios
```

## Troubleshooting

### Common Issues

**Build fails with "Signing certificate expired":**
- Go to developer.apple.com → Certificates
- Revoke expired certificate
- Xcode → Preferences → Accounts → Download Manual Profiles

**Upload fails with "Invalid Binary":**
- Check Info.plist for required keys (camera, microphone descriptions)
- Verify bundle ID matches App Store Connect
- Ensure version/build number is incremented

**In-app purchases not working:**
- Verify products are approved in App Store Connect
- Check product IDs match code exactly
- Test with sandbox Apple ID (not production ID)
- Clear app data and reinstall

**App rejected for missing functionality:**
- Ensure core features work without signup
- Provide test account credentials
- Include detailed review notes

## Current Project Status

✅ Capacitor iOS project configured
✅ In-app purchase capability ready (uses Google Play Billing API, needs iOS-specific implementation)
⚠️ Info.plist needs privacy descriptions (see section 3.3)
⚠️ Product IDs in code need verification against App Store Connect
⚠️ Screenshots and app preview not yet created

## Next Steps

1. **macOS Required:** Transfer project to Mac for Xcode build
2. **Update billing service:** Create iOS-specific billing implementation (currently uses Google Play API)
3. **Configure certificates:** Run Xcode signing workflow
4. **Create App Store Connect record:** Set up app listing
5. **Configure in-app purchases:** Match product IDs
6. **Archive and upload:** Use Xcode to build and submit
7. **Prepare marketing assets:** Screenshots, videos, descriptions
8. **Submit for review:** Complete metadata and submit

## Estimated Timeline

- Developer account approval: 1-2 days
- Certificate/provisioning setup: 1-2 hours
- In-app purchase configuration: 2-3 hours
- Marketing assets creation: 1-2 days
- Initial app review: 24-48 hours
- **Total to launch:** 5-7 days (if no rejections)

---

**Support Contact:**
For help with iOS deployment, contact Apple Developer Support:
https://developer.apple.com/support/
