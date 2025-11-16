# Payment Setup Guide - Receive Money from Customers

## Google Play Billing (Android In-App Purchases)

**Where to set up:** Google Play Console → Payments Profile

### Steps:
1. Go to https://play.google.com/console
2. Select your app (com.fretpilot.app)
3. Navigate to **Setup → Payments profile**
4. Click **Create payments profile**
5. Enter business details:
   - Business name: FretPilot Studio
   - Business address
   - Tax information
6. **Add bank account (Navy Federal):**
   - Click "Add bank account"
   - Select "United States"
   - Account holder name
   - Routing number (Navy Federal)
   - Account number
   - Account type (Checking/Savings)
7. Verify account (Google will send 2 small deposits)
8. Set payment threshold (minimum $100)

**Payment schedule:** Monthly (around 15th of each month)

**Google's cut:** 15% (first $1M/year), 30% after

**Your earnings arrive:** Direct deposit to Navy Federal checking

---

## Stripe (Web/Card Payments)

**Where to set up:** Stripe Dashboard

### Steps:
1. Go to https://dashboard.stripe.com
2. Create account with business email
3. **Complete business verification:**
   - Business type (Individual/LLC/Corp)
   - Tax ID (SSN or EIN)
   - Business description: "Music education software and merchandise"
4. **Add bank account (Navy Federal):**
   - Dashboard → Settings → Bank accounts and scheduling
   - Click "Add bank account"
   - Routing number
   - Account number
   - Verify with micro-deposits (2 small amounts)
5. **Set payout schedule:**
   - Daily, weekly, or monthly
   - Recommended: Daily automatic payouts
6. **Test mode → Live mode:**
   - Get your **Live Publishable Key** and **Live Secret Key**
   - Add these to your backend environment variables

**Stripe's cut:** 2.9% + $0.30 per transaction

**Your earnings arrive:** Next business day (with daily payouts) to Navy Federal

**Keys needed for your app:**
- `STRIPE_SECRET_KEY` (backend)
- `STRIPE_PUBLISHABLE_KEY` (frontend)

---

## BTCPay Server (Bitcoin Payments)

**Where to set up:** Your BTCPay Server instance or hosted provider

### Option 1: Self-Hosted (Free, Full Control)
1. Install BTCPay Server: https://docs.btcpayserver.org
2. Connect your Bitcoin wallet
3. Generate API keys for your backend
4. 100% of payments go to your wallet

### Option 2: Hosted Provider (Easier)
1. Use provider like https://lunanode.com or https://voltage.cloud
2. Create account and BTCPay instance
3. Connect wallet
4. Generate API key

**Your earnings:** Direct to your Bitcoin wallet, then convert to USD and deposit to Navy Federal via:
- Coinbase → Link Navy Federal account → Sell BTC → Transfer USD
- Cash App → Sell Bitcoin → Transfer to Navy Federal
- Strike → Link bank → Instant conversion and transfer

**No middleman fees** (except network transaction fees, usually <$1)

**Keys needed:**
- `BTCPAY_SERVER_URL`
- `BTCPAY_API_KEY`
- `BTCPAY_STORE_ID`

---

## Printful (Dropshipping Print-on-Demand)

**Where to set up:** Printful Dashboard

### Steps:
1. Go to https://www.printful.com
2. Sign up for account
3. **Connect payment method:**
   - Settings → Billing
   - Add credit/debit card (for wholesale costs)
4. **Set up products:**
   - Create designs (t-shirts, hoodies, etc.)
   - Set retail prices (you keep the markup)
5. **Get API credentials:**
   - Settings → API
   - Generate API key
   - Add to backend: `PRINTFUL_API_KEY`

**How payment works:**
- Customer pays YOU via Stripe/Google Pay
- Printful charges your card for wholesale cost
- You keep the profit margin

**Example:**
- Hoodie retail: $89.99 (customer pays you)
- Printful wholesale: $35.00 (you pay them)
- Your profit: $54.99

---

## Spocket (Dropshipping Wholesale)

**Where to set up:** Spocket Dashboard

### Steps:
1. Go to https://www.spocket.co
2. Sign up for account
3. **Choose plan:**
   - Free trial, then paid plan ($24-$99/month)
4. **Browse and add products:**
   - Search for guitar accessories, audio equipment
   - Add to "Import List"
5. **Connect Stripe/PayPal:**
   - When order placed, Spocket charges you
   - Customer already paid you
   - You keep profit margin
6. **Get API key:**
   - Settings → API
   - Generate key: `SPOCKET_API_KEY`

**Payment flow:** Same as Printful (customer → you → supplier → profit)

---

## Summary: Where Money Goes

### Android In-App Purchases
**Flow:** Customer → Google Play → Your Navy Federal Account  
**Setup:** Play Console → Payments Profile → Add Navy Federal  
**Timing:** Monthly deposits (15th of month)  
**Fee:** 15-30%

### Web/Store Card Payments
**Flow:** Customer → Stripe → Your Navy Federal Account  
**Setup:** Stripe Dashboard → Bank Accounts → Add Navy Federal  
**Timing:** Daily automatic payouts  
**Fee:** 2.9% + $0.30

### Bitcoin Payments
**Flow:** Customer → Your BTC Wallet → Convert → Navy Federal  
**Setup:** BTCPay Server + Coinbase/Cash App/Strike  
**Timing:** Instant to wallet, manual conversion/transfer  
**Fee:** Minimal network fees

### Merchandise (Dropshipping)
**Flow:** Customer pays you → You pay supplier → Keep profit  
**Setup:** Printful/Spocket → Add payment card  
**Timing:** Immediate (markup is your profit)  
**Fee:** Your margin (typically 30-60% markup)

---

## Quick Start Checklist

### Immediate (To Receive Payments):
- [ ] Google Play Console → Payments Profile → Link Navy Federal
- [ ] Stripe Dashboard → Bank Accounts → Link Navy Federal
- [ ] Set up Bitcoin wallet (Coinbase/Cash App recommended)
- [ ] Verify bank accounts (wait for micro-deposits)

### Within 1 Week:
- [ ] Sign up for Printful → Design custom products
- [ ] Sign up for Spocket → Add guitar accessories
- [ ] Generate all API keys
- [ ] Add keys to backend environment variables
- [ ] Test a purchase end-to-end

### Ongoing:
- [ ] Check Stripe dashboard daily for payouts
- [ ] Check Play Console monthly for Android earnings
- [ ] Convert Bitcoin to USD regularly (if using)
- [ ] Monitor dropship orders and fulfillment

---

## Support Contacts

**Google Play:** https://support.google.com/googleplay/android-developer  
**Stripe:** https://support.stripe.com (24/7 chat)  
**Printful:** support@printful.com  
**Spocket:** support@spocket.co  
**Navy Federal:** 1-888-842-6328

---

**Ready to accept payments!** Complete the Google Play and Stripe setups first—those are your primary revenue sources.
