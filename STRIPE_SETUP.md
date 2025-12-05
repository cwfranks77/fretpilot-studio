# Stripe Integration Setup for FretPilot Studio

## Step 1: Create Stripe Account (5 minutes)

1. Go to https://dashboard.stripe.com/register
2. Sign up with your email
3. Complete business verification

## Step 2: Get Your API Keys

1. In Stripe Dashboard, go to **Developers → API keys**
2. Copy both keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## Step 3: Create Products & Prices

### Create Monthly Subscription:
1. Go to **Products → Add product**
2. Name: `FretPilot Premium Monthly`
3. Price: `$9.99 USD`
4. Billing period: `Monthly`
5. Click **Save product**
6. **Copy the Price ID** (starts with `price_`)

### Create Yearly Subscription:
1. Add another product
2. Name: `FretPilot Premium Yearly`
3. Price: `$99.99 USD` 
4. Billing period: `Yearly`
5. **Copy the Price ID**

### Create Lifetime Access:
1. Add product
2. Name: `FretPilot Lifetime Access`
3. Price: `$49.99 USD`
4. Type: **One-time payment** (not recurring)
5. **Copy the Price ID**

## Step 4: Set Environment Variables

Create/update `.env` file in your `server/` directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_PRICE_ID
STRIPE_PRICE_YEARLY=price_YOUR_YEARLY_PRICE_ID
STRIPE_PRICE_LIFETIME=price_YOUR_LIFETIME_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Server Config
PORT=5175
NODE_ENV=development
```

Create/update `.env` file in your **root fretPilot Studio directory** for the Vue app:

```env
VITE_API_BASE=http://localhost:5175
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
VITE_STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_PRICE_ID
VITE_STRIPE_PRICE_YEARLY=price_YOUR_YEARLY_PRICE_ID
VITE_STRIPE_PRICE_LIFETIME=price_YOUR_LIFETIME_PRICE_ID
```

## Step 5: Test Locally

### Start the server:
```bash
cd server
npm install stripe
node index.js
```

### Start the app:
```bash
npm run dev
```

### Test checkout:
- Use test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC

## Step 6: Set Up Webhooks (for production)

1. In Stripe Dashboard → **Developers → Webhooks**
2. Click **Add endpoint**
3. URL: `https://your-api-domain.com/api/stripe-webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. **Copy the Webhook signing secret** (starts with `whsec_`)

## Pricing Strategy

**Monthly**: $9.99/month
- Low barrier to entry
- Recurring revenue
- Target: Casual learners

**Yearly**: $99.99/year (save $19.89)
- 2 months free
- Better retention
- Target: Committed students

**Lifetime**: $49.99 one-time
- Best value proposition
- Immediate cash flow
- Target: Early adopters, beta testers

## Next Steps

Once you have your Stripe keys:
1. Paste them into .env files
2. I'll update the code to use the correct price IDs
3. We'll test a payment locally
4. Deploy to production

---

**Ready?** Get your Stripe account set up and give me the API keys when you have them!
