# Google Analytics Setup Guide for FretPilot Studio

## Quick Setup (5 minutes)

### Step 1: Create GA4 Property
1. Go to: https://analytics.google.com/
2. Click **Admin** (gear icon, bottom left)
3. Under **Account** → Click **Create Account**
   - Account name: `FretPilot Studio`
   - Check data sharing settings (recommended: all)
   - Click **Next**
4. Under **Property** → Create Property:
   - Property name: `FretPilot Studio Web`
   - Time zone: Your location
   - Currency: USD (or your preference)
   - Click **Next**
5. Business details:
   - Industry: `Arts & Entertainment` or `Education`
   - Business size: `Small`
   - Click **Next**
6. Business objectives: Select `Examine user behavior`
7. Click **Create** → Accept Terms of Service

### Step 2: Create Data Stream
1. Choose platform: **Web**
2. Website URL: `https://fretpilotstudio.com`
3. Stream name: `FretPilot Web App`
4. Enhanced measurement: **Enable** (auto-tracks scrolls, clicks, etc.)
5. Click **Create Stream**

### Step 3: Get Measurement ID
1. After stream creation, you'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
2. **COPY THIS ID**
3. Replace `G-FRETPILOT001` in `index.html` with your real ID

```html
<!-- In index.html, replace: -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_REAL_ID"></script>
<script>
  gtag('config', 'G-YOUR_REAL_ID', {
```

### Step 4: Verify Installation (Real-Time Test)
1. Open your deployed site: https://fretpilot-studio-13brwwv8p-charles-franks-projects.vercel.app
2. In GA4, go to **Reports** → **Realtime**
3. Within 30 seconds, you should see 1 active user (you!)
4. Navigate around your app; check events appear (page_view, app_open, etc.)

## Custom Event Tracking

The app includes a helper function for custom events:

```javascript
// In your Vue components, track specific actions:

// Track lesson start
window.trackEvent('lesson_start', {
  lesson_type: 'fretboard_basics',
  difficulty: 'beginner'
});

// Track subscription view
window.trackEvent('view_pricing', {
  source: 'home_button'
});

// Track feature usage
window.trackEvent('feature_used', {
  feature_name: 'metronome',
  bpm: 120
});

// Track errors
window.trackEvent('error', {
  error_type: 'video_load_failed',
  message: error.message
});
```

## Important Events to Track

Add these to your Vue components:

### In SimpleLessons.vue (Canvas Lessons)
```javascript
mounted() {
  window.trackEvent('lesson_view', {
    lesson_id: this.currentLesson,
    view_type: 'canvas'
  });
}
```

### In PricingPage.vue
```javascript
methods: {
  viewPlan(planName) {
    window.trackEvent('view_item', {
      item_name: planName,
      item_category: 'subscription'
    });
  },
  subscribe(planName, price) {
    window.trackEvent('begin_checkout', {
      value: price,
      currency: 'USD',
      items: [{ item_name: planName }]
    });
  }
}
```

### Track Subscription Success (After Play Billing)
```javascript
// After successful subscription
window.trackEvent('purchase', {
  transaction_id: purchase.orderId,
  value: 9.99,
  currency: 'USD',
  items: [{
    item_name: 'Premium Monthly',
    item_id: 'premium_monthly',
    price: 9.99,
    quantity: 1
  }]
});
```

## Key Metrics to Monitor

### Engagement Metrics
- **Active Users**: Daily/Monthly active users
- **Engagement Rate**: % of users interacting meaningfully
- **Average Engagement Time**: How long users stay

### Feature Usage
- **Top Screens**: Most visited pages
- **Lesson Starts**: Canvas lesson engagement
- **Tool Usage**: Metronome, tuner, analyzer clicks

### Conversion Funnel
1. Landing → Home (bounce rate)
2. Home → Lessons (feature discovery)
3. Lessons → Pricing (intent to upgrade)
4. Pricing → Checkout (conversion attempt)
5. Checkout → Purchase (conversion success)

## Dashboards to Create

### 1. User Acquisition Dashboard
- Traffic sources (organic, direct, referral)
- New vs returning users
- Geographic breakdown

### 2. Feature Engagement Dashboard
- Screen views by page
- Custom events by feature
- User flow visualization

### 3. Subscription Funnel
- Pricing page views
- Checkout initiations
- Successful purchases
- Revenue tracking

## Privacy & Compliance

The current setup includes:
- `anonymize_ip: true` (GDPR/CCPA compliance)
- No PII collection (email, names excluded)
- Cookie consent (implement ConsentPrompt.vue)

### Cookie Consent Implementation
Uncomment in App.vue after launch:
```vue
<ConsentPrompt v-if="!consentGiven" @consent="handleConsent" />
```

Then modify gtag config:
```javascript
gtag('consent', 'update', {
  'analytics_storage': consentGiven ? 'granted' : 'denied'
});
```

## Google Ads Integration (Optional)

If you create a Google Ads account later:

1. Create conversion action: Play Console → Conversion tracking
2. Get Conversion ID (format: `AW-XXXXXXXXXX`)
3. Add to index.html:
```javascript
gtag('config', 'AW-YOUR_CONVERSION_ID');

// Track conversions
gtag('event', 'conversion', {
  'send_to': 'AW-YOUR_CONVERSION_ID/YOUR_CONVERSION_LABEL',
  'value': 9.99,
  'currency': 'USD'
});
```

## Testing Checklist

- [ ] GA4 property created
- [ ] Measurement ID replaced in index.html
- [ ] Real-time reporting shows your test visit
- [ ] Custom events firing (check DebugView in GA4)
- [ ] Enhanced measurement tracking scrolls/clicks
- [ ] No console errors related to gtag
- [ ] Privacy policy updated with analytics disclosure

## Resources

- GA4 Documentation: https://support.google.com/analytics/answer/9744165
- Event reference: https://support.google.com/analytics/answer/9267735
- Debug mode: Add `?debug_mode=true` to URL to see event details in console

## Deployment

After updating the Measurement ID:

```powershell
git add index.html
git commit -m "feat: integrate Google Analytics GA4"
git push
vercel --prod
```

Your analytics will start collecting data immediately after deployment!
