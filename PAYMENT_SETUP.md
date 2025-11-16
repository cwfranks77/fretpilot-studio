# FretPilot Payment Integration Setup

## Payment Platforms Integrated

✅ **Stripe** - Credit/Debit Cards  
✅ **PayPal** - PayPal balance & cards  
✅ **Google Pay** - Quick checkout  
✅ **Apple Pay** - One-touch payment  

## Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 AI lessons/day, basic features, ads |
| **Monthly** | $9.99/mo | Unlimited AI lessons, full video access, no ads |
| **Yearly** | $99.99/yr | Everything + 2 months free (17% off) |
| **Lifetime** | $299.99 | One-time payment, lifetime access |

## Setup Instructions

### 1. Stripe Setup (Required)

1. **Create Account**: https://dashboard.stripe.com/register
2. **Get API Keys**:
   - Go to Developers → API Keys
   - Copy **Publishable Key** (starts with `pk_test_`)
   - Copy **Secret Key** (starts with `sk_test_`)
3. **Create Products**:
   ```bash
   # Monthly subscription
   stripe prices create \
     --unit-amount 999 \
     --currency usd \
     --recurring interval=month \
     --product-data name="Premium Monthly"
   
   # Yearly subscription
   stripe prices create \
     --unit-amount 9999 \
     --currency usd \
     --recurring interval=year \
     --product-data name="Premium Yearly"
   
   # Lifetime (one-time payment)
   stripe prices create \
     --unit-amount 29999 \
     --currency usd \
     --product-data name="Lifetime Access"
   ```
4. **Setup Webhook**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy **Webhook Secret**

### 2. PayPal Setup (Optional)

1. **Create Business Account**: https://www.paypal.com/business
2. **Get Credentials**:
   - Go to https://developer.paypal.com/dashboard
   - Create App
   - Copy **Client ID**
3. **Create Subscription Plans**:
   - Go to Products → Subscriptions
   - Create plans for monthly/yearly billing
   - Copy plan IDs

### 3. Google Pay Setup (Optional)

1. **Merchant Account**: https://pay.google.com/business/console
2. **Get Merchant ID**: From console dashboard
3. **Integration**:
   - Uses Stripe as payment processor
   - No additional API keys needed

### 4. Apple Pay Setup (Optional, iOS only)

1. **Requirements**:
   - Apple Developer Account ($99/year)
   - HTTPS domain
   - iOS device for testing
2. **Setup**:
   - Create Merchant ID in Apple Developer portal
   - Configure domain verification
   - Implement merchant validation endpoint

### 5. Environment Variables

Create `.env` file:

```bash
# Frontend (.env in root)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_GOOGLE_PAY_MERCHANT_ID=your_merchant_id
VITE_APPLE_PAY_MERCHANT_ID=merchant.com.yourcompany.fretpilot

# Backend (server/.env)
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYPAL_CLIENT_SECRET=your_paypal_secret
DATABASE_URL=your_database_connection_string
```

### 6. Backend Implementation

Install dependencies:
```bash
cd server
npm install stripe @paypal/checkout-server-sdk express
```

Update `server/index.js`:
```javascript
const paymentRoutes = require('./payment-routes')
app.use('/api', paymentRoutes)
```

### 7. Database Schema

Add to your user table:
```sql
ALTER TABLE users ADD COLUMN premium BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN plan VARCHAR(20) DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN payment_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN subscription_start_date TIMESTAMP;
ALTER TABLE users ADD COLUMN subscription_end_date TIMESTAMP;
```

### 8. Testing

1. **Test Cards** (Stripe):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

2. **PayPal Sandbox**:
   - Use sandbox accounts from PayPal dashboard

3. **Local Testing**:
   ```bash
   # Start backend
   cd server
   npm start
   
   # Start frontend (separate terminal)
   npm run dev
   ```

4. **Access Payment Page**:
   - http://localhost:5173
   - Click **💳 Upgrade** button
   - Select plan and test payment

### 9. Going Live

**Stripe:**
1. Switch to live API keys (starts with `pk_live_`)
2. Update webhook URL to production
3. Complete business verification

**PayPal:**
1. Switch from sandbox to live credentials
2. Update client ID in environment variables

**Environment:**
```bash
VITE_PAYMENT_ENV=production
```

### 10. Security Checklist

- [ ] Never expose secret keys in frontend
- [ ] Validate webhooks with signatures
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on payment endpoints
- [ ] Store sensitive data encrypted
- [ ] PCI compliance if handling cards directly
- [ ] Implement proper authentication middleware
- [ ] Log all payment transactions
- [ ] Set up fraud detection rules
- [ ] Test refund/cancellation flows

## Payment Flow

```
User clicks "Select Plan" 
  → Frontend calls payment service
  → Backend creates checkout session
  → User redirected to payment processor
  → User completes payment
  → Webhook confirms payment
  → Database updated (premium = true)
  → User redirected to success page
  → Premium features unlocked
```

## Support

- **Stripe Docs**: https://stripe.com/docs
- **PayPal Docs**: https://developer.paypal.com/docs
- **Google Pay**: https://developers.google.com/pay
- **Apple Pay**: https://developer.apple.com/apple-pay

## Notes

- All prices in USD (can be changed in `paymentService.js`)
- Subscriptions auto-renew unless cancelled
- 30-day money-back guarantee (implement refund logic)
- Email receipts sent automatically by Stripe/PayPal
- Test mode uses sandbox accounts (no real charges)
