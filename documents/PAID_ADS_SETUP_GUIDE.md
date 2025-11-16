# FretPilot Paid Advertising - Complete Setup Guide

## 🎯 Advertising Overview

**Goal:** Drive app downloads and store sales through paid social media ads

**Monthly Budget:** $1,500-2,500 (scale up based on ROAS)

**Platforms:** Meta (Instagram + Facebook), TikTok, YouTube

**Expected Results Month 1:**
- 400-600 app installs (CPI: $3-5)
- 15-25 store purchases (CPA: $80-120)
- 3-5x ROAS once optimized

---

## 📱 Platform 1: Meta Ads (Instagram + Facebook)

### Setup Business Manager

**Step 1: Create Business Manager**
1. Go to business.facebook.com
2. Click "Create Account"
3. **Business Name:** FretPilot Inc. or The Franks Standard LLC
4. **Your Name:** [Your legal name]
5. **Business Email:** admin@fretpilotstudio.com

**Step 2: Add Assets**
1. **Add Instagram Account:**
   - Settings → Instagram accounts → Add
   - Connect @fretpilot

2. **Add Facebook Page:**
   - Settings → Pages → Add
   - Connect FretPilot page

3. **Add Ad Account:**
   - Settings → Ad Accounts → Add → Create new ad account
   - **Ad Account Name:** FretPilot Ads
   - **Time Zone:** Your local time zone
   - **Currency:** USD
   - **Payment Method:** Add credit card

**Step 3: Install Meta Pixel**
1. Events Manager → Pixels → Create Pixel
2. **Pixel Name:** FretPilot Pixel
3. Copy pixel code
4. Add to both `index.html` and `store.html` before `</head>`:

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
```

5. Test with Meta Pixel Helper Chrome extension

**Step 4: Set Up Conversion Events**
1. Events Manager → Data Sources → Your Pixel → Settings
2. Add Standard Events:
   - **ViewContent** (when someone visits store product page)
   - **AddToCart** (when someone adds product to cart)
   - **InitiateCheckout** (when someone clicks checkout)
   - **Purchase** (when order confirmed) - MOST IMPORTANT
   - **Lead** (when someone signs up for email)

3. Add Custom Events (for app):
   - **AppDownloadClick** (when someone clicks "Download App")
   - **PremiumUpgradeClick** (when someone clicks upgrade button)

---

### Campaign 1: App Installs (iOS + Android)

**Campaign Structure:**
- **Campaign Objective:** App Installs
- **Campaign Name:** FretPilot - App Installs - Cold
- **Budget:** $300/month ($10/day)

**Ad Set 1: iOS Installs**
- **Ad Set Name:** iOS - US - Broad Interest
- **Mobile App:** Select FretPilot app from App Store
- **Placement:** Automatic placements (Instagram Feed, Reels, Stories, Facebook Feed, Stories)
- **Location:** United States (or your primary market)
- **Age:** 16-55
- **Gender:** All
- **Detailed Targeting:**
  - **Interests:** Guitar, Fender, Gibson, Music lessons, Online learning, Yousician
  - **Behaviors:** Frequent travelers (indicates higher income)
- **Daily Budget:** $5
- **Optimization:** App Installs
- **Bid Strategy:** Lowest cost

**Ad Set 2: Android Installs**
- Same settings as iOS but select Google Play app link
- **Daily Budget:** $5

**Creative:** Video Ad #2 (AI Heatmap Demo - 15 seconds)
- **Format:** Single video
- **Aspect Ratios:** 1:1 (Instagram Feed), 9:16 (Reels/Stories), 4:5 (optimized feed)
- **Primary Text:** 
  ```
  Your guitar knows where you're messing up 🎸

  FretPilot's AI heatmap lights up problem areas in real-time so you can fix them FAST.

  No more guessing. No more wasted practice.

  Download free and start improving today ⚡
  ```
- **Headline:** "AI Guitar Training"
- **CTA Button:** Install Now
- **Destination:** App Store / Google Play

---

### Campaign 2: Store Sales (The Franks Standard)

**Campaign Structure:**
- **Campaign Objective:** Sales (formerly Conversions)
- **Campaign Name:** The Franks Standard - Store Sales - Cold
- **Budget:** $600/month ($20/day)

**Ad Set 1: Premium Guitars**
- **Ad Set Name:** Premium Guitars - US - Affluent
- **Conversion Event:** Purchase
- **Website:** fretpilotstudio.com/store
- **Placement:** Automatic (but exclude Audience Network for quality)
- **Location:** United States
- **Age:** 25-65
- **Gender:** All
- **Detailed Targeting:**
  - **Interests:** Premium guitars, Vintage guitars, PRS Guitars, Taylor Guitars, Martin Guitars, Guitar Center, Sweetwater
  - **Income:** Top 10% of ZIP codes
  - **Behaviors:** Online purchasers (high value)
- **Daily Budget:** $10
- **Optimization:** Conversions (Purchase)
- **Bid Strategy:** Lowest cost

**Ad Set 2: Pro Audio Gear**
- Same settings but target audio/studio interests
- **Interests:** Audio production, Recording studio, PreSonus, Focusrite, Universal Audio
- **Daily Budget:** $10

**Creative:** Video Ad #3 (Unboxing Premium - 30 seconds)
- **Format:** Single video
- **Aspect Ratio:** 1:1 and 4:5
- **Primary Text:**
  ```
  Not all gear is created equal.

  The Franks Standard Custom Shop: Hand-selected tonewoods. Premium hardware. American craftsmanship.

  Built for players who refuse to compromise.

  Custom guitars from $1,899. Free shipping. Made in USA 🇺🇸

  Shop now 👇
  ```
- **Headline:** "Premium Guitars | Free Shipping"
- **CTA Button:** Shop Now
- **Destination:** fretpilotstudio.com/store

---

### Campaign 3: Retargeting (Warm Audience)

**Campaign Structure:**
- **Campaign Objective:** Sales
- **Campaign Name:** FretPilot - Retargeting - Warm
- **Budget:** $300/month ($10/day)

**Ad Set 1: Website Visitors (No Purchase)**
- **Ad Set Name:** Website Visitors - 30 Days
- **Custom Audience:**
  - Create Audience → Website → All website visitors (Last 30 days)
  - EXCLUDE: People who purchased
- **Placement:** Automatic
- **No additional targeting** (audience is already defined)
- **Daily Budget:** $5
- **Optimization:** Conversions (Purchase or App Install)

**Ad Set 2: Engaged Social Audience**
- **Ad Set Name:** Social Engagers - 30 Days
- **Custom Audience:**
  - Create Audience → Instagram/Facebook → People who engaged with any post (Last 30 days)
- **Daily Budget:** $5

**Creative:** Carousel Ad (5 slides)
- **Slide 1:** "Still thinking it over?"
- **Slide 2:** "See what you're missing" (app feature screenshot)
- **Slide 3:** User testimonial quote
- **Slide 4:** "Limited time: 10% off" (create urgency)
- **Slide 5:** "Download free | Shop now"
- **Primary Text:**
  ```
  You checked us out. Ready to take the next step?

  🎸 FretPilot: Train smarter with AI
  🛒 The Franks Standard: Premium gear

  First-time customers: Use code WELCOME10 for 10% off

  Download the app free or shop our collection now.
  ```
- **CTA Button:** Download / Shop Now

---

### Meta Ads Optimization Checklist

**Week 1: Launch & Monitor**
- [ ] Launch all 3 campaigns
- [ ] Wait 24 hours for ad approval
- [ ] Check for policy violations (fix immediately)
- [ ] Verify pixel is firing (use Meta Pixel Helper)
- [ ] Let run for 3-5 days before making changes (learning phase)

**Week 2: Analyze & Adjust**
- [ ] Check CTR (Click-Through Rate) - Target: >2%
- [ ] Check CPC (Cost Per Click) - Target: <$0.50
- [ ] Check CPI (Cost Per Install) - Target: <$5
- [ ] Check CPA (Cost Per Acquisition) - Target: <$100 for store
- [ ] Pause ad sets with CTR <1% after 1,000 impressions
- [ ] Increase budget 20% on ad sets with ROAS >2x

**Ongoing:**
- [ ] Create 3 new ad variations per week
- [ ] A/B test creatives (video vs. carousel vs. image)
- [ ] Test new audiences (lookalike audiences after 50 conversions)
- [ ] Refresh creative monthly (ad fatigue sets in after 2-4 weeks)

---

## 🎵 Platform 2: TikTok Ads

### Setup TikTok Ads Manager

**Step 1: Create Account**
1. Go to ads.tiktok.com
2. Sign up with business email (admin@fretpilotstudio.com)
3. **Business Name:** FretPilot
4. **Industry:** Apps or Music
5. **Business Type:** Small business

**Step 2: Add Payment Method**
1. Billing & Payments → Add payment method
2. Enter credit card info

**Step 3: Install TikTok Pixel**
1. Assets → Events → Web Events → Create Pixel
2. **Pixel Name:** FretPilot Pixel
3. Copy pixel code
4. Add to `index.html` and `store.html` before `</head>`:

```html
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('YOUR_PIXEL_ID');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->
```

5. Set up events: ViewContent, AddToCart, CompletePayment

---

### Campaign 1: App Installs (TikTok)

**Campaign Structure:**
- **Campaign Objective:** App Install
- **Campaign Name:** FretPilot - App Installs - TikTok Cold
- **Budget:** $300/month ($10/day)

**Ad Group 1: US - GuitarTok Audience**
- **Ad Group Name:** US - GuitarTok - 18-34
- **Placement:** TikTok only (not partner apps for better quality)
- **Location:** United States
- **Age:** 18-34 (TikTok's sweet spot)
- **Gender:** All
- **Interests:** Music, Guitar, Rock Music, Learning
- **Budget:** $10/day
- **Optimization Goal:** Install
- **Bidding:** Lowest cost

**Creative:** Video Ad #2 (AI Heatmap - 9:16 vertical)
- **Format:** Single video (9:16 aspect ratio)
- **Video:** 15-second heatmap demo
- **Caption Text:**
  ```
  POV: Your guitar is tired of you messing up 😂

  This AI shows you EXACTLY what to fix. No more guessing.

  Download free (link in bio) 🎸⚡

  #GuitarTok #LearnGuitar #AIMusic
  ```
- **Display Name:** FretPilot 🎸
- **Profile Image:** FretPilot logo
- **CTA:** Download Now
- **Destination:** App Store / Google Play

**Important TikTok Tips:**
- Use trending sounds when possible (check TikTok Creative Center)
- Keep branding subtle (TikTok users skip obvious ads)
- Add subtitles (85% watch without sound)
- First 3 seconds MUST hook (use pattern interrupt)
- Use in-feed native format (looks like organic post)

---

### Campaign 2: Traffic to Store (TikTok)

**Campaign Structure:**
- **Campaign Objective:** Traffic
- **Campaign Name:** The Franks Standard - Store Traffic - TikTok
- **Budget:** $300/month ($10/day)

**Ad Group 1: Premium Gear Audience**
- **Ad Group Name:** US - Music Gear - 25-54
- **Placement:** TikTok
- **Location:** United States
- **Age:** 25-54 (older, more affluent)
- **Interests:** Music production, Guitars, Premium brands, Luxury goods
- **Budget:** $10/day
- **Optimization Goal:** Clicks
- **Bidding:** Lowest cost

**Creative:** Video Ad #3 (Unboxing - 9:16 vertical, 30 seconds)
- Same unboxing video but formatted for TikTok
- **Caption:**
  ```
  Unboxing $1,899 of pure craftsmanship 🎸

  The Franks Standard Custom Shop. Hand-built in America.

  Not for everyone. But maybe for you.

  Shop: fretpilotstudio.com/store

  #GuitarGear #PremiumGuitars #CustomShop
  ```
- **CTA:** Shop Now

---

### TikTok Optimization Tips

**Spark Ads (Boost Organic Posts):**
1. Post video organically from @fretpilot account
2. If it performs well (10k+ views, high engagement), boost it as Spark Ad
3. Appears more authentic than traditional ads
4. Users can follow your account directly from ad

**Creative Best Practices:**
- Mobile-first (shot on phone is fine, even preferred)
- Fast-paced editing (cut every 2-3 seconds)
- Bold text overlays (easy to read)
- No talking heads (show, don't tell)
- End with clear CTA

---

## 📺 Platform 3: Google Ads (YouTube)

### Setup Google Ads Account

**Step 1: Create Account**
1. Go to ads.google.com
2. Sign in with Google account (fretpilot.official@gmail.com)
3. Switch to Expert Mode (not Smart campaign)
4. **Business Name:** FretPilot
5. **Billing Country:** United States
6. Add credit card

**Step 2: Link YouTube Channel**
1. Tools & Settings → Linked accounts → YouTube
2. Link @FretPilotOfficial channel

**Step 3: Set Up Conversion Tracking**
1. Tools & Settings → Conversions → Create Conversion Action
2. **Website:** Track actions on fretpilotstudio.com
3. Install Google tag (gtag.js) on website:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

4. Set up conversion actions:
   - App download clicks
   - Store purchases
   - Form submissions

---

### Campaign 1: YouTube In-Stream Ads (Skippable)

**Campaign Structure:**
- **Campaign Type:** Video
- **Campaign Goal:** Drive conversions (App installs or website sales)
- **Campaign Name:** FretPilot - YouTube In-Stream - Cold
- **Budget:** $450/month ($15/day)

**Ad Group 1: Guitar Tutorial Audience**
- **Ad Group Name:** Guitar Tutorial Viewers - US
- **Targeting:**
  - **Location:** United States
  - **Age:** 18-54
  - **Keywords:** "how to play guitar", "guitar lessons", "learn guitar online", "guitar tutorial", "beginner guitar"
  - **Topics:** Music & Audio, Musical Instruments
  - **YouTube Channels:** Place on channels like JustinGuitar, Marty Music, etc.
- **Bid Strategy:** Maximize conversions
- **Daily Budget:** $15

**Video Creative:** Video Ad #1 (The Difference - 30 seconds)
- **Format:** Skippable in-stream ad
- **Video:** Upload to YouTube (can be unlisted)
- **Companion Banner:** 300x60px static image with CTA
- **Final URL:** fretpilotstudio.com
- **Display URL:** fretpilotstudio.com/download
- **CTA:** Download Free

**YouTube Ad Best Practices:**
- Hook in first 5 seconds (before skip button appears)
- Clear branding early (logo visible at 3 seconds)
- Strong CTA at end
- Keep under 30 seconds (or expect high skip rate)

---

### Campaign 2: YouTube Discovery Ads (In Search/Recommendations)

**Campaign Structure:**
- **Campaign Type:** Video
- **Campaign Subtype:** Video discovery
- **Campaign Name:** FretPilot - YouTube Discovery - Cold
- **Budget:** $300/month ($10/day)

**Ad Group 1: Search & Browse**
- **Ad Group Name:** Guitar Searches - US
- **Targeting:**
  - **Keywords:** "best guitar app", "learn guitar app", "guitar training app", "online guitar lessons"
  - **YouTube Search:** Where ad appears when users search
  - **Placements:** YouTube homepage, watch page recommendations
- **Bid:** $0.10-0.30 per view

**Creative:** Thumbnail + Headline
- **Thumbnail:** Custom-designed (1280x720px)
  - Eye-catching (bright colors, text overlay)
  - Shows app in use (phone screen with heatmap)
  - FretPilot logo visible
- **Headline:** "AI Guitar Training - Download Free"
- **Description:**
  ```
  FretPilot shows you exactly where you're messing up with AI-powered heatmaps. Train smarter. Play better. Get started free.
  ```
- **Destination:** When clicked, plays Video Ad #1 on watch page

---

### YouTube Ads Optimization

**Key Metrics:**
- **View Rate:** % who watch (target: >30% for skippable)
- **Click-Through Rate (CTR):** % who click CTA (target: >1%)
- **Cost Per View (CPV):** Target: <$0.10
- **Cost Per Acquisition (CPA):** Target: <$50 for app, <$120 for store

**Optimization Tactics:**
- Exclude irrelevant placements (kids channels, music videos)
- Exclude mobile apps (lower quality traffic)
- Add negative keywords ("free guitar", "guitar tabs" - freebie seekers)
- Test 3 video variations (different hooks, different CTAs)
- Adjust bids based on device (mobile often cheaper but lower conversion)

---

## 📊 Cross-Platform Analytics Dashboard

### Set Up Google Analytics 4 (Central Hub)

**Why:** Unified view of all traffic sources (organic, paid, influencer)

**Setup:**
1. Create GA4 property at analytics.google.com
2. Install gtag on all pages (index.html, store.html, etc.)
3. Link to Google Ads, YouTube, Search Console

**Key Reports:**
1. **Acquisition → Traffic Acquisition**
   - See which platforms drive most traffic
   - Compare: Meta vs. TikTok vs. YouTube vs. Organic vs. Influencer

2. **Engagement → Conversions**
   - Track app downloads, store purchases, email signups
   - See conversion path (what touchpoints led to conversion)

3. **User → Demographics**
   - Age, gender, interests of visitors
   - Refine ad targeting based on data

4. **Tech → Overview**
   - Device type (mobile vs. desktop)
   - Browser, OS
   - Optimize creative for most-used devices

---

### Custom Dashboard (Google Data Studio or Sheets)

**Create Weekly Report with:**
- **Spend by Platform:** Meta $X, TikTok $X, YouTube $X
- **Installs by Platform:** Meta: 50, TikTok: 30, YouTube: 20
- **CPI by Platform:** Meta: $5, TikTok: $4, YouTube: $8
- **Store Purchases:** 10 from Meta, 3 from TikTok, 2 from YouTube
- **Revenue:** Total $6,000
- **ROAS:** $6,000 / $1,500 spent = 4x

**Share with stakeholders (investors, team) every Monday**

---

## 💰 Monthly Budget Allocation & Scaling Plan

### Month 1: Testing Phase ($1,500 total)
- Meta Ads: $600 (Instagram + Facebook)
- TikTok Ads: $450
- YouTube Ads: $450
- **Goal:** Identify which platform performs best

### Month 2: Optimization ($2,000 total)
- Cut worst-performing platform
- Increase budget 50% on best platform
- A/B test 10 new creatives
- **Goal:** Improve ROAS from 2x to 3x

### Month 3: Scaling ($3,500 total)
- Double budget on winning campaigns
- Launch retargeting across all platforms
- Add influencer collaborations (boost their organic posts)
- **Goal:** 4x ROAS, 1,000+ installs/month

### Month 4-6: Aggressive Growth ($5,000-10,000/month)
- Scale winning campaigns to $100+/day
- Launch new platforms (Pinterest, Reddit, Twitter ads)
- Test new creative formats (longer videos, UGC, testimonials)
- **Goal:** 5x ROAS, 2,000+ installs/month

---

## 🚨 Common Mistakes to Avoid

### Mistake 1: Making Changes Too Soon
**Problem:** Tweaking ads after 1 day (doesn't allow learning phase)
**Solution:** Wait 3-7 days, 1,000+ impressions before judging

### Mistake 2: Broad Targeting
**Problem:** Targeting "everyone interested in music" (too broad)
**Solution:** Narrow to "guitar players who bought gear in last 30 days"

### Mistake 3: Bad Creative
**Problem:** Low-quality video, no hook, unclear CTA
**Solution:** Invest in professional editing, test 10 variations

### Mistake 4: Ignoring Mobile
**Problem:** Ads optimized for desktop (most traffic is mobile)
**Solution:** Mobile-first creative (vertical video, large text)

### Mistake 5: No Retargeting
**Problem:** Only targeting cold traffic (expensive)
**Solution:** Retarget website visitors, video viewers (cheaper, higher conversion)

### Mistake 6: Not Tracking Properly
**Problem:** Can't see which ad drove which sale
**Solution:** UTM parameters, unique discount codes, pixel events

### Mistake 7: Ad Fatigue
**Problem:** Same ad running for months (performance drops)
**Solution:** Refresh creative every 2-4 weeks

### Mistake 8: No Testing
**Problem:** Running one ad forever
**Solution:** A/B test everything (audience, creative, copy, CTA)

---

## 🎯 Launch Checklist (Before Spending $1)

### Tracking Setup
- [ ] Meta Pixel installed and verified
- [ ] TikTok Pixel installed and verified
- [ ] Google Analytics 4 installed
- [ ] Conversion events configured (Purchase, AppInstall)
- [ ] UTM parameters added to all ad links

### Creative Ready
- [ ] Video Ad #1 (The Difference - 30s)
- [ ] Video Ad #2 (AI Heatmap - 15s)
- [ ] Video Ad #3 (Unboxing - 30s)
- [ ] All exported in multiple aspect ratios (16:9, 1:1, 9:16, 4:5)
- [ ] Subtitles added to all videos

### Campaigns Built
- [ ] Meta: 3 campaigns (App Installs, Store Sales, Retargeting)
- [ ] TikTok: 2 campaigns (App Installs, Store Traffic)
- [ ] YouTube: 2 campaigns (In-Stream, Discovery)
- [ ] All ad sets configured with proper targeting
- [ ] Budgets set correctly ($10-20/day per ad set)

### Website Ready
- [ ] All pages load fast (<3 seconds)
- [ ] Mobile-optimized (test on phone)
- [ ] App download buttons work (redirect to App Store/Play Store)
- [ ] Store checkout process tested (no bugs)
- [ ] Thank you pages set up (post-purchase confirmation)

### Payment & Billing
- [ ] Credit card added to all ad accounts
- [ ] Billing threshold set (auto-reload)
- [ ] Tax info provided (if required)

### Team Ready
- [ ] Someone checking ads daily (you or team member)
- [ ] Response process for increased traffic (customer support)
- [ ] Budget to scale if ads perform well

---

## 📅 First Week Schedule

### Day 1 (Monday): Launch
- [ ] 9am: Launch all campaigns
- [ ] 10am: Check for approval (Meta takes 1-24 hours)
- [ ] 12pm: Verify pixels firing (test purchase on store)
- [ ] 5pm: Check initial impressions (should see activity)

### Day 2 (Tuesday): Monitor
- [ ] Morning: Check for policy violations (fix immediately)
- [ ] Afternoon: Review first 24-hour metrics (CTR, CPC)
- [ ] Evening: Adjust budgets if one platform is crushing it

### Day 3-5 (Wed-Fri): Learning Phase
- [ ] Don't touch anything (let algorithms learn)
- [ ] Just monitor metrics daily
- [ ] Respond to any ad comments/DMs

### Day 6 (Saturday): Week 1 Analysis
- [ ] Pull all metrics (spend, impressions, clicks, conversions)
- [ ] Calculate: CTR, CPC, CPI, CPA, ROAS
- [ ] Identify: Best platform, best creative, best audience

### Day 7 (Sunday): Week 2 Planning
- [ ] Pause worst ad sets (CTR <1%, no conversions)
- [ ] Increase budget 20% on best ad sets
- [ ] Plan 3 new creative variations to test

---

## 🏆 Success Benchmarks (Know If You're Winning)

### Good Performance:
- **CTR:** >2% (people interested in clicking)
- **CPC:** <$0.50 (cheap clicks)
- **CPI:** <$5 (affordable app installs)
- **CPA (Store):** <$100 (profitable store sales at $400 AOV)
- **ROAS:** >3x (making $3 for every $1 spent)

### Needs Improvement:
- **CTR:** 1-2% (okay, could be better)
- **CPC:** $0.50-1.00 (getting pricey)
- **CPI:** $5-10 (manageable if LTV is high)
- **CPA (Store):** $100-150 (break-even territory)
- **ROAS:** 1-2x (not losing money but not scaling)

### Poor Performance (Pause or Pivot):
- **CTR:** <1% (boring ad or wrong audience)
- **CPC:** >$1.00 (too expensive)
- **CPI:** >$10 (unsustainable unless high LTV)
- **CPA (Store):** >$150 (losing money at $400 AOV with margins)
- **ROAS:** <1x (losing money, stop immediately)

---

## 🚀 READY TO LAUNCH?

**Final Pre-Flight:**
1. Logos designed and uploaded ✅
2. Videos edited and exported ✅
3. Website pixel-tracked ✅
4. Ad accounts funded ✅
5. Campaigns built ✅

**Launch Sequence:**
- **Today:** Set up Business Manager accounts (Meta, TikTok, Google)
- **Tomorrow:** Install pixels, test tracking
- **Day 3:** Build campaigns (2-3 hours)
- **Day 4:** Launch ads (click "Publish")
- **Day 5-7:** Monitor learning phase
- **Day 8+:** Optimize and scale

**Expected Timeline to Profitability:**
- Week 1-2: Learning (might lose money, that's okay)
- Week 3-4: Break-even (2x ROAS)
- Week 5-8: Profitable (3-4x ROAS)
- Month 3+: Scale aggressively (5x+ ROAS)

---

**LET'S MAKE SOME SALES** 💰🎸
