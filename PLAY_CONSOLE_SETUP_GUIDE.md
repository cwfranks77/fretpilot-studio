# Google Play Console Setup Guide for FretPilot Studio

## ✅ What's Already Done

- ✓ Google Play Billing library integrated
- ✓ cordova-plugin-purchase installed
- ✓ Billing service created with proper product IDs
- ✓ Premium purchase flow uses Google Play Billing on Android
- ✓ Signed APK and AAB built and ready for upload

## 📋 Steps to Complete (Required Before App Launch)

### Step 1: Configure Subscription Products in Play Console

1. **Go to Google Play Console**: https://play.google.com/console
2. **Select your app**: FretPilot Studio
3. **Navigate to**: Monetize → Subscriptions
4. **Create 3 subscription products** with these EXACT IDs:

#### Product 1: Monthly Subscription
- **Product ID**: `fretpilot_premium_monthly` (MUST match exactly)
- **Name**: FretPilot Premium Monthly
- **Description**: Unlimited AI lessons, full video library, no ads
- **Billing period**: 1 month
- **Price**: $9.99 USD
- **Free trial** (optional): 7 days
- **Grace period**: 3 days (recommended)
- **Account hold**: Enable (recommended)

#### Product 2: Yearly Subscription
- **Product ID**: `fretpilot_premium_yearly` (MUST match exactly)
- **Name**: FretPilot Premium Yearly
- **Description**: Best value - 2 months free! Annual subscription.
- **Billing period**: 1 year
- **Price**: $99.99 USD (17% savings vs monthly)
- **Free trial** (optional): 7 days
- **Grace period**: 3 days (recommended)
- **Account hold**: Enable (recommended)

#### Product 3: Lifetime Access
- **Product ID**: `fretpilot_premium_lifetime` (MUST match exactly)
- **Name**: FretPilot Lifetime Access
- **Description**: Pay once, own forever. All premium features unlocked permanently.
- **Billing period**: Choose "Prepaid" plan type
- **Price**: $299.99 USD (one-time payment)

> **CRITICAL**: The Product IDs MUST match exactly what's in the code. If you change them, the app won't work.

### Step 2: Set Up Payment Profile (Required to Receive Money)

1. **Go to**: Play Console → Payments & reports → Setup payment profile
2. **Select**: Individual or Business account
3. **Add bank details**:
   - Bank name: Navy Federal Credit Union
   - Routing number: Your Navy Federal routing number
   - Account number: Your Navy Federal account number
   - Account type: Checking or Savings
4. **Verify identity**: Google may require ID verification
5. **Tax information**: Complete W-9 form (US) or equivalent

**Payment Schedule**:
- Google pays monthly (around 15th of each month)
- Payments arrive ~2-3 days after Google processes
- Google takes 15% commission (first $1M/year), then 30%
- You receive 85% of each subscription payment to Navy Federal

**Example**:
- User pays $9.99/month → You receive $8.49/month
- User pays $99.99/year → You receive $84.99/year
- User pays $299.99 lifetime → You receive $254.99 one-time

### Step 3: Configure License Testing (Before Upload)

1. **Go to**: Play Console → Setup → License testing
2. **Add test users**: Add email addresses that can test purchases without being charged
3. **Add your own email**: So you can test the purchase flow
4. **Grant testers access**: They need to be added to "Internal testing" track

**How to Test**:
1. Upload AAB to Internal testing track
2. Add testers
3. Install app from Play Store (testers only)
4. Purchase subscriptions (won't be charged)
5. Verify premium features unlock
6. Test restore purchases (uninstall/reinstall)

### Step 4: Upload AAB to Play Store

**File Location**: `C:\Users\ninja\Downloads\FretPilotStudio.aab`

**Upload Steps**:
1. **Go to**: Play Console → Your App → Production
2. **Create new release**:
   - Click "Create new release"
   - Upload `FretPilotStudio.aab`
3. **Release name**: 1.0.0 (or your version)
4. **Release notes**:
   ```
   Initial release of FretPilot Studio
   
   Features:
   - AI-powered guitar lesson generation
   - Interactive chord library with 500+ chords
   - Jam companion with backing tracks
   - Practice analyzer with mistake heatmap
   - Premium subscriptions: Monthly ($9.99), Yearly ($99.99), Lifetime ($299.99)
   - Payments via Google Play - funds deposited directly to your bank account
   ```
5. **Review and roll out**: Click "Start rollout to Production"

### Step 5: Submit for Review

1. **Content rating**: Complete questionnaire (Music/Educational app)
2. **Target audience**: Select appropriate age ranges
3. **Privacy policy**: Add privacy policy URL (required)
4. **App access**: Add test account if app requires login
5. **Submit for review**: Google reviews in 3-7 days

## 🔄 Payment Flow Overview

```
User opens app on Android
  ↓
User taps "Upgrade to Premium"
  ↓
App calls Google Play Billing
  ↓
Google Play Store shows payment sheet
  ↓
User confirms purchase (Google account payment method)
  ↓
Google processes payment
  ↓
App receives purchase confirmation
  ↓
Premium features unlocked immediately
  ↓
Google deposits payment to Navy Federal (monthly, minus 15% commission)
```

## 🌐 Web vs Android Payment Methods

**On Android** (Google Play Billing):
- Subscriptions: Google Play → Navy Federal (15% commission)
- Users managed via Play Store subscriptions
- Automatic billing, easy cancellation
- Restores on any Android device

**On Web** (Stripe):
- Physical products (Music Store): Stripe → Navy Federal
- Credit card payments
- Users create Stripe checkout session
- Separate from Android subscriptions

**Bitcoin** (Both platforms):
- BTCPay Server or Coinbase Commerce
- Optional payment method
- No middleman fees (just network fees)

## 📊 Revenue Estimates

**Monthly Subscription** ($9.99):
- Your revenue: $8.49 per user per month
- 10 subscribers = $84.90/month
- 100 subscribers = $849/month
- 1,000 subscribers = $8,490/month

**Yearly Subscription** ($99.99):
- Your revenue: $84.99 per user per year
- 10 subscribers = $849.90/year
- 100 subscribers = $8,499/year
- 1,000 subscribers = $84,990/year

**Lifetime Purchase** ($299.99):
- Your revenue: $254.99 one-time
- 10 purchases = $2,549.90
- 100 purchases = $25,499
- 1,000 purchases = $254,990

## ⚠️ Important Notes

1. **Product IDs Cannot Change**: Once you create products with these IDs, don't change them. The app code expects these exact IDs.

2. **Testing First**: Always test with licensed testers before going to production. This ensures purchases work correctly.

3. **Play Store Policies**: Make sure your app complies with Google Play policies:
   - No deceptive practices
   - Clear pricing information
   - Easy cancellation
   - Privacy policy required

4. **Subscription Management**: Users can cancel subscriptions anytime via Play Store → Subscriptions. Google handles refunds according to your refund policy.

5. **Analytics**: Play Console shows subscription metrics:
   - Active subscribers
   - Churn rate
   - Revenue
   - Retention

## 🆘 Troubleshooting

**"Product not found" error**:
- Check that product IDs in Play Console match exactly
- Wait up to 24 hours for products to propagate
- Ensure app is published (at least to internal testing)

**Purchases not working in production**:
- Ensure app is signed with the same keystore used in Play Console
- Verify billing library is properly integrated (already done)
- Check that user's account can make purchases

**Payments not arriving**:
- Verify payment profile is complete in Play Console
- Check that bank details are correct (Navy Federal)
- Google pays monthly - wait until next payment cycle
- Contact Google Play support if >30 days

## 📞 Support

**Google Play Console Support**:
- Help Center: https://support.google.com/googleplay/android-developer
- Contact form: Available in Play Console → Help & feedback

**App Issues**:
- Check logs in Android Studio or via `adb logcat`
- Look for billing errors in device logs
- Test with licensed testers first

---

## ✅ Checklist Before Launch

- [ ] Create 3 subscription products in Play Console (monthly, yearly, lifetime)
- [ ] Set up payment profile with Navy Federal account
- [ ] Add licensed testers and test purchases
- [ ] Upload AAB to Internal testing first
- [ ] Test premium features unlock after purchase
- [ ] Test subscription cancellation and restore
- [ ] Complete content rating
- [ ] Add privacy policy URL
- [ ] Submit for production review
- [ ] Monitor first week for issues

**Once all items are checked**, your app will be live on Google Play Store with working subscriptions that deposit payments directly to your Navy Federal account!

---

**Current Status**: App is built and ready. You just need to configure products in Play Console and upload the AAB file.
