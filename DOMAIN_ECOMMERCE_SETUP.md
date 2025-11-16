# Using fretpilotstudio.com for E-Commerce

## Current Setup
✅ Domain: **fretpilotstudio.com** (purchased via Vercel)
✅ Deployed: Vercel production environment
✅ SSL: Automatic HTTPS enabled

## E-Commerce Integration Options

### Option 1: Web-Based Store (Recommended)
**Use your Vercel deployment as the primary store:**

**Pros:**
- Already live and deployed
- No app store approval needed for updates
- Better SEO for product discovery
- Easy to share product links on social media
- Works on all devices (desktop, mobile web, tablet)

**Setup:**
1. Your web app at https://fretpilotstudio.com already has the store
2. Customers browse products in browser
3. Checkout happens on your domain with Stripe
4. Orders processed through dropshipping service

**Mobile App Integration:**
- Add in-app browser that opens https://fretpilotstudio.com/store
- Or use WebView component in React Native/Capacitor
- Or deep link from app to website for purchases

### Option 2: API Backend for App
**Use your domain as the API server:**

**Setup:**
1. Host backend at https://api.fretpilotstudio.com (subdomain)
2. Mobile app calls API endpoints for product catalog
3. Checkout happens in-app but processes through your API
4. API handles Stripe + dropshipping integration

**Vercel Configuration:**
```json
// vercel.json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 3: Hybrid Approach (Best of Both)
**Recommended for FretPilot:**

1. **Web Store**: Full-featured at https://fretpilotstudio.com/store
   - Better for browsing large catalog
   - Desktop shopping experience
   - Social media links land here

2. **In-App Store**: Native shopping in mobile app
   - Quick access for students
   - Integrated with lessons ("Need a capo? Buy now")
   - Uses same API backend

3. **API**: Hosted on Vercel at /api/* endpoints
   - Both web and mobile use same backend
   - Single source of truth for inventory
   - Unified order processing

## Payment Processing on Your Domain

### Stripe Checkout (Current Implementation)
```javascript
// In your app, redirect to Stripe hosted checkout
const session = await stripe.checkout.sessions.create({
  success_url: 'https://fretpilotstudio.com/order-success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://fretpilotstudio.com/store',
  line_items: cartItems,
  mode: 'payment'
})

// Redirect to Stripe
window.location.href = session.url
```

**Customer Journey:**
1. Browse products on fretpilotstudio.com
2. Click "Checkout" → Redirects to checkout.stripe.com
3. Enter payment info on Stripe's secure page
4. Redirects back to fretpilotstudio.com/order-success
5. Order confirmation displayed

### Stripe Elements (Advanced)
Keep customers on your domain during checkout:

```javascript
// Embed payment form directly on fretpilotstudio.com
const elements = stripe.elements()
const cardElement = elements.create('card')
cardElement.mount('#card-element')

// Process payment without leaving your site
const {paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
  payment_method: { card: cardElement }
})
```

**Benefits:**
- Customer never leaves fretpilotstudio.com
- Better brand experience
- More control over checkout flow

## Domain Security for E-Commerce

### SSL Certificate
✅ Already enabled via Vercel (automatic HTTPS)

### PCI Compliance
✅ Using Stripe means you don't handle card data
✅ Stripe is PCI Level 1 compliant
✅ You only store order details, not payment info

### Additional Security Headers
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' js.stripe.com; frame-src js.stripe.com checkout.stripe.com;"
        }
      ]
    }
  ]
}
```

## Recommended Setup for FretPilot

### Architecture:
```
fretpilotstudio.com           → Main web app (Vue.js)
├── /store                    → Product catalog
├── /checkout                 → Shopping cart & checkout
├── /order-success            → Order confirmation
├── /api/products             → Product catalog API
├── /api/checkout             → Create Stripe session
├── /api/webhooks/stripe      → Payment confirmations
└── /api/webhooks/dropship    → Supplier order updates

Mobile App (FretPilot.apk)    → Native Android/iOS
├── Opens in-app browser      → Points to fretpilotstudio.com/store
└── Or native store UI        → Calls fretpilotstudio.com/api/*
```

### Benefits:
1. **Single codebase** - Web and mobile use same backend
2. **Fast updates** - Update web store without app store approval
3. **Better SEO** - Google indexes fretpilotstudio.com/store
4. **Shareable links** - "Check out this guitar at fretpilotstudio.com/product/123"
5. **Consistent experience** - Same store on web, iOS, Android

## Next Steps

1. ✅ Domain already configured (fretpilotstudio.com)
2. ✅ Vercel deployment active
3. ✅ MusicStore component exists in app
4. ⏳ Deploy backend API to Vercel
5. ⏳ Configure Stripe webhook to fretpilotstudio.com/api/webhooks/stripe
6. ⏳ Test checkout flow on production domain
7. ⏳ Set up dropshipping supplier webhooks

## Testing on Your Domain

```powershell
# 1. Build production version
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Test live store
# Open: https://fretpilotstudio.com
# Click: 🛒 Store
# Add item to cart
# Checkout with test card: 4242 4242 4242 4242
```

## Custom Email Domain (Optional)

Set up professional emails:
- orders@fretpilotstudio.com (order confirmations)
- support@fretpilotstudio.com (customer service)
- info@fretpilotstudio.com (general inquiries)

**Setup via Vercel:**
1. Go to Vercel Dashboard → fretpilotstudio.com → Email
2. Or use Google Workspace, Zoho Mail, etc.

---

**Your domain is ready for e-commerce! 🎸💳**
