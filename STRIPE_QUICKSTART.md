# 🎯 Stripe Payment Integration - QUICK START

## ✅ What's Done

I've built the complete Stripe integration for FretPilot Studio:

### Code Changes:
1. **stripeService.js** - Handles all Stripe operations (checkout, verification)
2. **PremiumGate.vue** - Updated to redirect to Stripe checkout for card payments
3. **PaymentSuccess.vue** - New component to handle post-payment success
4. **App.vue** - Auto-detects payment success URL params
5. **.env.example** files - Templates for both server and client

### Payment Flow:
```
User clicks "Start Monthly" 
→ PremiumGate calls stripeService.redirectToCheckout()
→ Stripe hosted checkout page
→ User pays with card
→ Redirects to /?payment_success=1&session_id=XXX
→ PaymentSuccess.vue verifies & activates premium
→ User gets full access 🎉
```

## 🚀 What You Need To Do (15 minutes)

### Step 1: Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Sign up (takes 2 minutes)

### Step 2: Create Products & Get Price IDs

**Monthly Plan:**
- Products → Add Product
- Name: `FretPilot Premium Monthly`
- Price: `$9.99/month` (recurring)
- Click Save → **Copy the Price ID** (starts with `price_`)

**Yearly Plan:**
- Name: `FretPilot Premium Yearly`
- Price: `$99.99/year` (recurring)
- **Copy the Price ID**

**Lifetime Plan:**
- Name: `FretPilot Lifetime Access`
- Price: `$49.99` (one-time payment, NOT recurring)
- **Copy the Price ID**

### Step 3: Get API Keys
1. Developers → API keys
2. Copy **Publishable key** (pk_test_...)
3. Copy **Secret key** (sk_test_...)

### Step 4: Create Environment Files

**Create `server/.env`:**
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_ID
STRIPE_PRICE_YEARLY=price_YOUR_YEARLY_ID
STRIPE_PRICE_LIFETIME=price_YOUR_LIFETIME_ID
PORT=5175
```

**Create `.env` in root:**
```env
VITE_API_BASE=http://localhost:5175
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_ID
VITE_STRIPE_PRICE_YEARLY=price_YOUR_YEARLY_ID
VITE_STRIPE_PRICE_LIFETIME=price_YOUR_LIFETIME_ID
```

### Step 5: Test Locally

**Terminal 1 - Start Server:**
```powershell
cd server
node index.js
```

**Terminal 2 - Start App:**
```powershell
npm run dev
```

**Test Payment:**
1. Open app (http://localhost:5173)
2. Login → Click "💳 Pricing"
3. Choose a plan
4. Use test card: `4242 4242 4242 4242`
5. Any future date + any CVC
6. Complete checkout → Should redirect back with success!

## 📊 Expected Results

- Checkout opens in Stripe hosted page
- Payment completes → redirects to app
- Premium badge shows ✅
- All premium features unlock
- No ads show

## 🐛 If Something Goes Wrong

**"Failed to start checkout"**
- Check `.env` files exist in correct locations
- Verify price IDs are correct (no typos)
- Check server console for errors

**"Payment verification failed"**
- Check server is running on port 5175
- Verify VITE_API_BASE matches server port
- Look at browser console for errors

**Server won't start**
- Make sure no other app is using port 5175
- Run: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5175).OwningProcess | Stop-Process`

## 💰 Pricing Strategy

**Monthly** ($9.99/mo): Low barrier, recurring revenue
**Yearly** ($99.99/yr): Best retention (2 months free)  
**Lifetime** ($49.99): Cash flow, early adopter appeal

## ✉️ When Ready

Once you have your Stripe keys, **just paste them here** and I'll:
1. Create the .env files for you
2. Start the servers
3. Run a test payment
4. Verify everything works

**Ready to get your Stripe keys?** Takes ~5 minutes!
