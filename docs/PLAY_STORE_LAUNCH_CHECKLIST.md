# Google Play Store Launch Checklist - FretPilot Studio

## ✅ BUILD COMPLETE
**Android App Bundle**: `android/app/build/outputs/bundle/release/app-release.aab` (5.95 MB)  
**Version**: 1.0.0 (versionCode 5)  
**Signed**: ✅ Release keystore configured

---

## Phase 1: Pre-Upload Checklist

### Technical Requirements
- [x] **AAB built and signed** (app-release.aab ready)
- [x] **targetSdkVersion** set to 34+ (check android/app/build.gradle)
- [x] **minSdkVersion** appropriate for audience (currently set in build.gradle)
- [ ] **No debuggable flag** in AndroidManifest.xml (verify: `android:debuggable="false"` or omitted)
- [ ] **ProGuard rules** configured for minification (already in build.gradle)
- [x] **Play Billing integrated** (PlayBillingPlugin.java created)
- [ ] **Permissions justified** (INTERNET, FOREGROUND_SERVICE if used)

### Store Listing Assets
- [ ] **App Title**: "FretPilot Studio" or "FretPilot - Guitar Learning App" (50 char limit)
- [ ] **Short Description**: Max 80 characters
  - Example: "Master guitar fretboard with AI-powered lessons & smart practice tools"
- [ ] **Full Description**: 3-5 paragraphs (check GOOGLE_PLAY_FULL_DESCRIPTION.txt)
- [ ] **High-res Icon**: 512×512 PNG (use icon.png in root)
- [ ] **Feature Graphic**: 1024×500 PNG (create if not exists)
- [ ] **Screenshots**: Minimum 2, ideally 6-8 (run: `.\scripts\capture-screenshots.ps1`)
  - [ ] 01_home_dashboard.png
  - [ ] 02_canvas_lesson.png
  - [ ] 03_practice_analyzer.png (or mock)
  - [ ] 04_metronome_tuner.png
  - [ ] 05_pricing_page.png
  - [ ] 06_login_onboarding.png
  - [ ] 07_jam_companion.png (optional)
  - [ ] 08_settings_profile.png (optional)
- [ ] **Promotional Video**: Optional YouTube link (skip for now)

### Policy Compliance
- [x] **Privacy Policy URL**: https://fretpilotstudio.com/privacy.html (already created)
- [ ] **Data Safety Form** completed in Play Console:
  - [ ] Data collection types declared (usage stats, device info)
  - [ ] Data usage purposes (app functionality, analytics)
  - [ ] Data sharing (declare if using Crashlytics, GA4)
  - [ ] Encryption in transit: YES (HTTPS)
  - [ ] User can request deletion: YES
- [ ] **Content Rating** questionnaire completed (IARC):
  - Expect: ESRB Everyone, PEGI 3 (no violence, no mature content)
- [ ] **Target Audience**: Age 13+ (if under 13, COPPA compliance required)
- [ ] **Ads Declaration**: NO (unless ad SDK present)
- [ ] **In-App Purchases** declared:
  - [ ] Premium Monthly ($9.99/month)
  - [ ] Premium Yearly ($99.99/year)
  - [ ] Premium Pro ($19.99/month)

### Legal
- [ ] **App Name** not infringing trademark
- [ ] **No copyrighted music/images** without license (check all assets)
- [ ] **Open source licenses** disclosed if using GPL/LGPL code
- [ ] **Google Play Developer Program Policy** compliance:
  - No misleading claims
  - No spam or deceptive behavior
  - Functional app (not placeholder)

---

## Phase 2: Google Play Console Setup

### Account Setup
- [ ] **Developer Account**: $25 one-time fee paid
- [ ] **Identity verified**: Government ID (if required by Google)
- [ ] **Payment profile** set up (for receiving revenue)
- [ ] **Tax information** submitted (W-9 for US, W-8BEN for international)

### Create App
1. Go to: https://play.google.com/console/
2. Click **Create App**
3. Fill details:
   - App name: `FretPilot Studio`
   - Default language: English (US)
   - App or Game: **App**
   - Free or Paid: **Free** (with in-app purchases)
   - Check declarations (agree to policies)
4. Click **Create App**

### Dashboard Setup
- [ ] **App Access**: All functionality available without restrictions (or explain restricted features)
- [ ] **Ads**: Does NOT contain ads (unless you added ad SDK)
- [ ] **Content Rating**: Complete questionnaire
- [ ] **Target Audience**: Select age groups (13+)
- [ ] **News Apps**: Not a news app
- [ ] **COVID-19 Contact Tracing**: No
- [ ] **Data Safety**: Complete form (10-15 min)
- [ ] **Government Apps**: No

---

## Phase 3: Upload & Testing

### Internal Testing Track (Recommended First)
1. Go to **Testing** → **Internal Testing**
2. Click **Create New Release**
3. Upload: `android/app/build/outputs/bundle/release/app-release.aab`
4. **Release Name**: "1.0.0 - Initial Launch"
5. **Release Notes**:
   ```
   Initial release of FretPilot Studio
   • AI-powered fretboard lessons with interactive canvas
   • Smart metronome and tuner tools
   • Practice session tracking
   • Premium subscription tiers
   ```
6. Click **Save** → **Review Release**
7. Add testers:
   - Create email list (just yourself for now)
   - Or use **Share link** to send to anyone
8. Click **Start Rollout to Internal Testing**

### Wait for Pre-Launch Report (15-30 min)
- Google automatically tests on ~20 devices
- Check for:
  - Crashes on launch
  - Security vulnerabilities
  - Accessibility issues
- **Fix any critical issues** before Production

### Internal Test Verification
- [ ] Install via internal test link
- [ ] App launches without crash
- [ ] Main screens accessible (Home, Lessons, Pricing)
- [ ] Canvas lessons render (no BigBuckBunny video!)
- [ ] Metronome/tuner functional
- [ ] Premium gate shows correctly
- [ ] No ANRs (app not responding) during navigation
- [ ] Back button works properly
- [ ] App survives orientation change
- [ ] Offline mode graceful (no crash when airplane mode on)

---

## Phase 4: Production Release

### Promote to Production (or create new release)
1. Go to **Production** track
2. **Create New Release**
3. Upload same AAB (or reuse from internal test)
4. **Countries**: Select "All countries" or specific regions
5. **Staged Rollout**:
   - Start at **10%** (recommended for safety)
   - Monitor for 2-4 hours
   - Increase to 50% if stable
   - Increase to 100% after 24 hours
6. Click **Save** → **Review Release**
7. Review checklist (Google shows any missing items)
8. Click **Start Rollout to Production**

### Review Process
- **Timeline**: 1-7 days (typically 24-48 hours)
- **Status**: Check under Production → Status
- **Possible Outcomes**:
  - ✅ Approved: App goes live
  - 🔄 Under Review: Wait
  - ❌ Rejected: Fix issues and resubmit

### Common Rejection Reasons & Fixes
| Reason | Fix |
|--------|-----|
| Missing privacy policy | Add live URL in App Content |
| Data Safety incomplete | Fill all sections accurately |
| Icon/screenshot quality | Use high-res PNG, no pixelation |
| Misleading description | Remove "best", "top", superlatives |
| Permissions not explained | Add uses-permission explanation |
| Broken functionality | Fix crashes, test thoroughly |
| Play Billing misconfigured | Verify subscription products set up |

---

## Phase 5: Post-Launch Monitoring

### First 24 Hours
- [ ] **Install rate**: Check Console → Statistics
- [ ] **Crash rate**: Target < 1% (Console → Vitals → Crashes)
- [ ] **ANR rate**: Target < 0.5% (Console → Vitals → ANRs)
- [ ] **Rating**: Monitor reviews (respond to negative feedback fast)
- [ ] **Uninstall rate**: If high, investigate onboarding friction

### Week 1 Actions
- [ ] Respond to ALL user reviews (builds trust)
- [ ] Monitor Crashlytics for patterns
- [ ] Check Pre-launch report for device-specific issues
- [ ] Increase staged rollout to 100% if stable
- [ ] Submit hotfix if critical bugs found (bump versionCode)

### Optimization (Ongoing)
- [ ] **A/B test screenshots**: Try different angles, captions
- [ ] **Localize**: Add Spanish, French descriptions (if audience demands)
- [ ] **ASO (App Store Optimization)**: Refine keywords in description
- [ ] **Seasonal updates**: Add holiday themes, challenges
- [ ] **Feature releases**: Version 1.1, 1.2 with new tools

---

## Phase 6: Subscription Setup in Play Console

### Create Subscription Products
1. Go to **Monetize** → **Subscriptions**
2. Click **Create Subscription**
3. For each tier:

#### Premium Monthly
- **Product ID**: `premium_monthly`
- **Name**: Premium Monthly
- **Description**: Unlock all lessons, tools, and practice analytics
- **Billing Period**: 1 month (recurring)
- **Price**: $9.99 USD (set per country)
- **Free Trial**: Optional 7 days
- **Grace Period**: 3 days (retain access if payment fails)
- **Status**: **Active**

#### Premium Yearly
- **Product ID**: `premium_yearly`
- **Name**: Premium Yearly (Save 17%)
- **Description**: Full access with annual billing discount
- **Billing Period**: 1 year
- **Price**: $99.99 USD
- **Free Trial**: Optional 7 days
- **Status**: **Active**

#### Premium Pro
- **Product ID**: `premium_pro`
- **Name**: Premium Pro
- **Description**: Advanced features + priority support
- **Billing Period**: 1 month
- **Price**: $19.99 USD
- **Status**: **Active**

4. Click **Save**
5. Wait for subscriptions to activate (5-15 min)
6. Test purchases in Internal Test (use test payment method)

### Test Payment Methods
- Use Google's test cards: https://developers.google.com/android-publisher/test-purchases
- Or add test accounts: Console → Settings → License Testing

---

## Phase 7: Marketing & Discovery

### App Store Optimization (ASO)
- [ ] **Keywords in description**: guitar, fretboard, music, lessons, practice, metronome
- [ ] **Compelling first sentence**: Hook users in description opening
- [ ] **Social proof**: Add "Join 1000+ guitarists" after reaching users
- [ ] **Feature bullets**: Use • for readability

### External Promotion
- [ ] **Website link**: Add "Download on Google Play" badge to fretpilotstudio.com
- [ ] **Social media**: Announce launch on Instagram, Reddit (r/guitarlessons, r/Guitar)
- [ ] **Email signature**: Include Play Store link
- [ ] **YouTubers**: Reach out to guitar tutorial channels for review
- [ ] **Music forums**: Post on TalkBass, TheGearPage, etc.

### Google Play Features (Apply After Launch)
- [ ] **Editor's Choice**: Apply after 1000+ installs + 4.5★ rating
- [ ] **Top Charts**: Optimize for "Music & Audio" category ranking
- [ ] **Collections**: Submit for themed collections (e.g., "Best Music Learning Apps")

---

## Final Pre-Flight Checklist

**Before clicking "Start Rollout to Production":**

- [ ] AAB uploaded and signed
- [ ] All store listing assets complete (icon, screenshots, descriptions)
- [ ] Privacy policy live and linked
- [ ] Data Safety form accurate
- [ ] Content rating obtained
- [ ] Subscriptions created in Play Console
- [ ] Internal testing completed without major issues
- [ ] Pre-launch report reviewed (no critical crashes)
- [ ] Staged rollout set to 10%
- [ ] Crashlytics integrated and tested
- [ ] Google Analytics (GA4) configured
- [ ] No placeholder/"XXXXXXXXXX" IDs in code
- [ ] Version bump ready for next hotfix (versionCode 6 prepared)

---

## Emergency Rollback Plan

If critical bug discovered post-launch:
1. **Halt rollout**: Production → Releases → Halt
2. **Fix bug locally**: Code fix + version bump
3. **Build new AAB**: `.\android\gradlew bundleRelease`
4. **Internal test** new AAB first
5. **Create hotfix release**: Version 1.0.1 (versionCode 6)
6. **Resume rollout** with fixed build

---

## Resources & Documentation

- **Play Console**: https://play.google.com/console/
- **Developer Policies**: https://play.google.com/about/developer-content-policy/
- **Launch Checklist (Official)**: https://developer.android.com/distribute/best-practices/launch/launch-checklist
- **Subscription Docs**: https://developer.android.com/google/play/billing/integrate
- **Pre-Launch Report**: https://support.google.com/googleplay/android-developer/answer/7002270

---

## Success Metrics (30 Days Post-Launch)

Target:
- [ ] 100+ installs
- [ ] 4.0+ star rating
- [ ] < 1% crash rate
- [ ] < 2% uninstall rate (day 1)
- [ ] 5+ reviews with responses
- [ ] 1-3 paying subscribers (validation of premium model)

If metrics exceed these, consider scaling marketing spend!

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Asset preparation (screenshots, descriptions) | 2-4 hours |
| Play Console account + app creation | 1 hour |
| Policy forms (Data Safety, Content Rating) | 30-60 min |
| AAB upload + Internal Test | 15 min |
| Pre-launch report wait | 30 min |
| Internal testing validation | 1-2 hours |
| Production submission | 15 min |
| Google review | 1-7 days |
| **Total to live** | **2-3 days (hands-on: 6-8 hours)** |

Most developers go live within 48 hours of first submission!

---

**Ready to launch? Start with Phase 1 asset preparation, then follow steps sequentially. Good luck! 🚀**
