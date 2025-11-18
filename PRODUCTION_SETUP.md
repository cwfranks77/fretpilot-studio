# Production Setup Guide

## 🚀 Making Your Sites Live for Real Customers

This guide will help you transition from development/test mode to production mode for both **fretpilotstudio.com** and **thefranksstandard.com**.

---

## 1️⃣ Enable Live Stripe Payments (FretPilot Studio)

### Current State
- Stripe is in **TEST MODE** - no real money is being processed
- Using test keys: `pk_test_...` and `sk_test_...`

### Steps to Go Live

#### A. Get Your Live Stripe Keys
1. Go to https://dashboard.stripe.com/test/dashboard
2. Toggle from "Test mode" to "Live mode" (top-right corner)
3. Navigate to: **Developers → API Keys**
4. Copy your:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

#### B. Set Live Keys in Vercel
1. Go to https://vercel.com/dashboard
2. Select your project: **fretpilot-studio**
3. Go to **Settings → Environment Variables**
4. Add/Update these variables:
   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_LIVE_KEY
   VITE_STRIPE_PUBLIC_KEY=pk_live_YOUR_ACTUAL_LIVE_KEY
   ```
5. **IMPORTANT**: Set these for "Production" environment only
6. Redeploy your site after saving

#### C. Set Up Stripe Webhook (for subscription/payment notifications)
1. In Stripe Dashboard → **Developers → Webhooks**
2. Click "Add endpoint"
3. URL: `https://fretpilotstudio.com/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

#### D. Test with Real Card
1. Use a **real credit card** (NOT the test card 4242...)
2. Try subscribing to Monthly plan ($9.99)
3. Verify charge appears in Stripe Dashboard → **Payments**
4. Verify you get Premium access in the app

---

## 2️⃣ Enable Live Store (The Franks Standard)

### Current State
- Store shows products with **affiliate links** to Sweetwater/Amazon
- No direct checkout - just redirects to other sites

### Option A: Start Selling with Dropshipping (Recommended)

This lets you sell products without holding inventory. The supplier ships directly to your customer.

#### Suppliers to Use:
1. **Printful** - Custom merchandise (t-shirts, mugs, posters)
   - Sign up: https://www.printful.com
   - Get API key from: Dashboard → Settings → API
   
2. **Spocket** - Music gear dropshipping
   - Sign up: https://www.spocket.co
   - Get API key from: Settings → Integrations → API

3. **Inventory Source** - Musical instruments
   - Sign up: https://www.inventorysource.com
   - Need approval (1-2 weeks)

#### Setup Steps:
1. Sign up with suppliers above
2. Get approved for their programs
3. Add API keys to Vercel environment variables:
   ```
   PRINTFUL_API_KEY=your_printful_key
   SPOCKET_API_KEY=your_spocket_key
   ```
4. Import products using the dropshipping service
5. Products will auto-fulfill when orders come in

### Option B: Sell Your Own Inventory

If you have physical products to ship yourself:

1. Update products in `src/components/MusicStore.vue`
2. Change `fulfillment: 'affiliate'` to `fulfillment: 'fretpilot'`
3. Remove `affiliateUrl` fields
4. Set up shipping/fulfillment process for when orders come in

### Option C: Keep Affiliate Links (Earn Commissions)

If you want to earn commissions from other stores:

1. Join affiliate programs:
   - Sweetwater: https://www.sweetwater.com/dealerzone/
   - Amazon Associates: https://affiliate-program.amazon.com
   - Guitar Center: https://www.guitarcenter.com/Affiliates-Program.gc
   
2. Replace the placeholder URLs in products with your real affiliate links

3. You earn 3-8% commission on sales

---

## 3️⃣ Bitcoin Payments (Optional)

### If You Want to Accept Bitcoin:

1. Set up BTCPay Server (self-hosted) or use a service like:
   - BTCPay Server: https://btcpayserver.org
   - Coinbase Commerce: https://commerce.coinbase.com
   - OpenNode: https://www.opennode.com

2. Add your keys to Vercel:
   ```
   BTCPAY_SERVER_URL=https://your-btcpay-instance.com
   BTCPAY_STORE_ID=your_store_id
   BTCPAY_API_KEY=your_api_key
   ```

---

## 4️⃣ Verify Everything Works

### Pre-Launch Checklist:

#### FretPilot Studio (fretpilotstudio.com)
- [ ] Stripe set to LIVE mode
- [ ] Test a real subscription purchase
- [ ] Verify webhook receives events
- [ ] Premium features unlock after payment
- [ ] User can cancel subscription
- [ ] Receipt email sent (if configured)

#### The Franks Standard (thefranksstandard.com)
- [ ] Products load correctly
- [ ] Can add to cart
- [ ] Checkout works with real payment
- [ ] Order confirmation shows up
- [ ] If dropshipping: Order sent to supplier
- [ ] If self-fulfillment: You receive order notification

---

## 5️⃣ Legal Requirements

Before accepting real money:

### Required Pages (Already in your site):
- [x] Privacy Policy - `/privacy.html`
- [x] Terms of Service - `/terms.html`
- [ ] Refund Policy - **ADD THIS**
- [ ] Shipping Policy - **ADD THIS** (for store)

### Tax Compliance:
- **US Sales Tax**: You may need to collect sales tax depending on your state
  - Enable in Stripe Dashboard → Settings → Tax
- **International Sales**: Consider VAT for EU customers

### Business Requirements:
- **Business License**: Check your local requirements
- **EIN/Tax ID**: Get from IRS if you don't have one
- **Bank Account**: Set up in Stripe for payouts

---

## 6️⃣ Going Live Day

### Final Steps:

1. **Backup Everything**
   ```powershell
   git add -A
   git commit -m "Pre-launch backup"
   git push
   ```

2. **Switch Stripe to Live Mode** (follow steps in section 1)

3. **Update Products** (follow steps in section 2)

4. **Test Everything**
   - Make a real $1 test purchase
   - Verify it works end-to-end
   - Refund the test purchase

5. **Monitor**
   - Watch Stripe Dashboard for payments
   - Check Vercel logs for errors
   - Test on mobile devices

6. **Announce Launch**
   - Share on social media
   - Email your list
   - Submit to directories

---

## 🆘 Troubleshooting

### "Payment failed" errors:
- Check Stripe Dashboard → Logs for details
- Verify live keys are set correctly
- Check webhook is receiving events

### "Store not loading":
- Clear browser cache
- Check Vercel deployment succeeded
- View browser console for errors

### "No products showing":
- Verify API keys are set
- Check product fulfillment type is set correctly
- View network tab for API errors

---

## 📊 After Launch

### Monitor These Metrics:

1. **Stripe Dashboard**
   - Total revenue
   - Failed payments
   - Churn rate

2. **Vercel Analytics**
   - Page views
   - Conversion rate
   - Load times

3. **Support Email**
   - Customer questions
   - Bug reports
   - Feature requests

---

## 🎉 You're Ready!

Once you complete the steps above, your sites will be:
- ✅ Accepting real payments
- ✅ Selling real products
- ✅ Making real money

**Need help?** Open an issue on GitHub or email support@fretpilotstudio.com

---

*Last updated: November 17, 2025*
