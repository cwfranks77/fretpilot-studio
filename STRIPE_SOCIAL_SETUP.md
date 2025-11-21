# 🚀 STRIPE & SOCIAL MEDIA SETUP GUIDE
## Launch Checklist for FretPilot & The Franks Standard

---

## ⏰ **CRITICAL: Complete These Steps in Next 4 Hours**

### 📋 **PHASE 1: Stripe Setup (60 minutes)**

#### Step 1: Create Stripe Account (10 min)
1. Go to https://dashboard.stripe.com/register
2. Sign up with your business email
3. Complete business verification
4. **IMPORTANT**: Switch to LIVE mode (toggle in top-right)

#### Step 2: Get Your API Keys (5 min)
1. In Stripe Dashboard → Developers → API keys
2. Copy these keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)
3. **SAVE THESE SECURELY** - you'll need them next

#### Step 3: Create Products & Prices (20 min)
1. Go to Stripe Dashboard → Products → Create product

**Create These Products:**

**Product 1: FretPilot Premium Monthly**
- Name: `FretPilot Premium - Monthly`
- Description: `Unlimited AI lessons, full video library, mistake detection`
- Price: `$9.99 USD`
- Billing: `Monthly`
- Copy the **Price ID** (starts with `price_`)

**Product 2: FretPilot Premium Yearly**
- Name: `FretPilot Premium - Yearly`
- Description: `Everything in Premium - Save 17% with annual billing`
- Price: `$99.99 USD`
- Billing: `Yearly`
- Copy the **Price ID**

**Product 3: FretPilot Pro**
- Name: `FretPilot Pro`
- Description: `1-on-1 instructor, custom lessons, advanced features`
- Price: `$19.99 USD`
- Billing: `Monthly`
- Copy the **Price ID**

#### Step 4: Configure Webhooks (10 min)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://fretpilotstudio.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

#### Step 5: Update Environment Variables (15 min)
1. Open `.env` file in your project
2. Replace these values with YOUR keys from above:

```env
# REPLACE THESE WITH YOUR ACTUAL STRIPE KEYS!
VITE_STRIPE_PUBLIC_KEY=pk_live_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# REPLACE THESE WITH YOUR ACTUAL PRICE IDs!
VITE_STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_ID
VITE_STRIPE_PRICE_YEARLY=price_YOUR_YEARLY_ID
VITE_STRIPE_PRICE_PRO=price_YOUR_PRO_ID
```

3. **If deploying to Vercel/Netlify**, add these as Environment Variables in your hosting dashboard

---

### 📱 **PHASE 2: Social Media Setup (90 minutes)**

#### Step 1: Create Social Media Accounts (60 min)

**FretPilot Accounts** (create all of these):
1. **Facebook**: https://facebook.com
   - Create Business Page: "FretPilot Studio"
   - Username: @fretpilotstudio
   - Copy profile URL

2. **Instagram**: https://instagram.com
   - Username: @fretpilotstudio
   - Switch to Business Account
   - Link to Facebook Page
   - Copy profile URL

3. **Twitter/X**: https://twitter.com
   - Username: @fretpilotstudio
   - Copy profile URL

4. **TikTok**: https://tiktok.com
   - Username: @fretpilotstudio
   - Switch to Business Account
   - Copy profile URL

5. **YouTube**: https://youtube.com
   - Create Channel: "FretPilot Studio"
   - Customize URL when available
   - Copy channel URL

6. **Discord**: https://discord.com
   - Create Server: "FretPilot Community"
   - Set up channels: #general, #lessons, #support, #showcase
   - Create invite link (set to never expire)

**The Franks Standard Accounts** (same process):
- Facebook: @thefranksstandard
- Instagram: @thefranksstandard
- Twitter: @thefranksstandard
- TikTok: @thefranksstandard

#### Step 2: Update Social Links in .env (10 min)
Replace these with YOUR actual URLs:

```env
# FretPilot Social Media
VITE_SOCIAL_FACEBOOK=https://facebook.com/fretpilotstudio
VITE_SOCIAL_INSTAGRAM=https://instagram.com/fretpilotstudio
VITE_SOCIAL_TWITTER=https://twitter.com/fretpilotstudio
VITE_SOCIAL_TIKTOK=https://tiktok.com/@fretpilotstudio
VITE_SOCIAL_YOUTUBE=https://youtube.com/@fretpilotstudio
VITE_SOCIAL_DISCORD=https://discord.gg/YOUR_INVITE_CODE

# The Franks Standard Social Media
VITE_FRANKS_FACEBOOK=https://facebook.com/thefranksstandard
VITE_FRANKS_INSTAGRAM=https://instagram.com/thefranksstandard
VITE_FRANKS_TWITTER=https://twitter.com/thefranksstandard
VITE_FRANKS_TIKTOK=https://tiktok.com/@thefranksstandard
```

#### Step 3: Fill Out Social Profiles (20 min)

**For Each Account:**
1. Add profile picture (FretPilot logo or Franks Standard logo)
2. Add cover/banner image
3. Write bio/description:

**FretPilot Bio Example:**
```
🎸 AI-Powered Music Learning Platform
🤖 Real-time mistake detection & correction
🎬 Custom AI video lessons
🎯 Master guitar, bass, piano, drums & more
🚀 Join 10,000+ musicians improving daily
🔗 fretpilotstudio.com
```

**The Franks Standard Bio Example:**
```
🎸 Premium Guitars & Pro Audio Equipment
🏆 Quality is Our Standard
📦 Curated gear for serious musicians
🚚 Fast shipping • Expert support
🔗 thefranksstandard.com
```

4. Link all accounts together (cross-promote)
5. Post your FIRST content:
   - Announcement post: "We're live! 🚀"
   - Screenshot of the app
   - Link to website

---

### 🌐 **PHASE 3: Deploy & Test (60 minutes)**

#### Step 1: Build Production Version (10 min)
```bash
cd C:\Users\ninja\Fretquest
npm run build
```

#### Step 2: Test Stripe Integration (20 min)

**Test Subscription Flow:**
1. Open app in browser
2. Click "Upgrade to Premium"
3. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Date: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
4. Complete checkout
5. Verify redirect to success page
6. Check Stripe Dashboard for payment

**Test Marketplace Checkout (The Franks Standard):**
1. Go to thefranksstandard.com
2. Add product to cart
3. Checkout with test card
4. Verify order in Stripe Dashboard

#### Step 3: Deploy to Production (20 min)

**Option A: Vercel (Recommended)**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Set Environment Variables in Hosting Dashboard!**

#### Step 4: Final Checks (10 min)
- [ ] All social icons link correctly
- [ ] Stripe checkout works in production
- [ ] Subscription confirmation emails sent
- [ ] Webhooks receiving events
- [ ] Discord invite link works
- [ ] All pages load correctly

---

### 🎯 **PHASE 4: Launch Announcement (30 minutes)**

#### Post Launch Announcement on ALL Platforms:

**Post Text:**
```
🎸 WE'RE LIVE! 🚀

FretPilot Studio is officially here!

🤖 AI-Powered Music Learning
🎬 Custom Video Lessons
🎯 Real-time Mistake Detection
🎸 Master Any Instrument

Special Launch Offer:
🔥 First 100 signups get 50% OFF Premium
💎 Use code: LAUNCH50

Try FREE today:
👉 https://fretpilotstudio.com

Tag a musician who needs this! 🎵

#FretPilot #MusicEducation #GuitarLessons #AIMusic #LearnGuitar
```

**Post on:**
- [ ] Facebook (FretPilot & Franks Standard pages)
- [ ] Instagram (photo + story)
- [ ] Twitter (thread)
- [ ] TikTok (short demo video)
- [ ] YouTube (announcement video)
- [ ] Discord (announcement channel)
- [ ] Reddit (r/guitarlessons, r/learnmusic, r/musicproduction)
- [ ] LinkedIn (personal + company page)

---

## ✅ **VERIFICATION CHECKLIST**

### Stripe
- [ ] Live mode activated in Stripe Dashboard
- [ ] 3 products created (Monthly, Yearly, Pro)
- [ ] Webhooks configured
- [ ] Environment variables updated
- [ ] Test purchases successful
- [ ] Payment confirmations working

### Social Media
- [ ] All 6 FretPilot accounts created
- [ ] All 4 Franks Standard accounts created
- [ ] Profile pictures uploaded
- [ ] Bios written
- [ ] Links in .env file updated
- [ ] Icons showing on website
- [ ] Cross-promotion setup

### Website
- [ ] FretPilot app deployed
- [ ] thefranksstandard.com deployed
- [ ] SSL certificate active (HTTPS)
- [ ] All pages load correctly
- [ ] Social icons clickable
- [ ] Stripe checkout functional

### Launch
- [ ] Launch announcement posted
- [ ] First customers can purchase
- [ ] Support email monitored
- [ ] Discord community active

---

## 🆘 **TROUBLESHOOTING**

### Stripe Issues
**"Payment system not ready"**
- Check VITE_STRIPE_PUBLIC_KEY in .env
- Ensure key starts with `pk_live_` (not `pk_test_`)
- Rebuild app: `npm run build`

**"Checkout session failed"**
- Verify STRIPE_SECRET_KEY on server
- Check webhook endpoint is accessible
- Review Stripe Dashboard logs

### Social Media Links Not Working
- Verify URLs start with `https://`
- Check .env file saved
- Restart dev server
- Clear browser cache

### Deployment Fails
- Check all environment variables set in hosting dashboard
- Verify build command: `npm run build`
- Check Node version compatibility
- Review build logs for errors

---

## 📞 **SUPPORT & RESOURCES**

- **Stripe Support**: https://support.stripe.com
- **Stripe Docs**: https://stripe.com/docs
- **Vercel Support**: https://vercel.com/support
- **Discord for Questions**: Create support channel in your Discord

---

## 🎉 **YOU'RE READY TO LAUNCH!**

Once all checkboxes are checked, you're ready to:
1. Announce on all social media
2. Start accepting customers
3. Begin growing your business

**Remember**: 
- Monitor Stripe Dashboard for payments
- Respond to social media comments
- Check support email regularly
- Engage with Discord community

**LAUNCH TIME: 4 HOURS FROM NOW! 🚀**

Good luck! 🎸
