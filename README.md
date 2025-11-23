# FretPilot – Complete AI Guitar Learning & Gear Platform

**AI-Powered Video Lessons • Practice Tracking • Music Store • Live Jam Companion**

FretPilot is a comprehensive guitar learning application featuring AI-powered video lessons with real-time pose detection, personalized practice plans, an integrated music store with **dropshipping** (NEW!), and a tiered subscription model. Built with Vue 3, Capacitor, and Node.js.

> **🎸 NEW: Dropshipping Store Integration!**  
> Sell musical instruments & accessories with zero inventory using Spocket & Printful.  
> **Quick Setup:** See `QUICK_START_DROPSHIPPING.md` | **Full Guide:** See `DROPSHIPPING_SETUP_GUIDE.md`

---

## 🔐 Recovery & Backup (2025-11-20)

Your project state has been safety-snapshotted:

- Backup branch: `backup/2025-11-20-pre-recovery`
- Safety tag: `safety-2025-11-20`

To restore at any time:

```powershell
git fetch --all
git checkout backup/2025-11-20-pre-recovery  # Branch restore
# or
git checkout safety-2025-11-20               # Tag (read‑only snapshot)
```

If you want to create a fresh working branch from the snapshot:

```powershell
git checkout -b recovery-work safety-2025-11-20
```

### What Was Verified
All core source files are still present:
- Vue components under `src/components` (e.g. `AIVideoLessons.vue`, `MusicStore.vue`, `FretPilotTrainer.vue`)
- Android Gradle build files (`android/app/build.gradle`, `android/variables.gradle`)
- Domain routing logic for `thefranksstandard.com` in `index.html` / built `dist/index.html`
- Store components (`MusicStore.vue`) and related marketing docs referencing TheFranksStandard

### Clarification About TheFranksStandard
There is no separate detached repository; the storefront logic is integrated into this mono-repo via conditional host redirect and the `MusicStore` component. If you later decide to split it:

```powershell
mkdir franksstandard-storefront
cd franksstandard-storefront
npm create vite@latest franksstandard-storefront -- --template react-ts
```

Then migrate shared assets (product catalog, branding, pricing rules) into a dedicated module while keeping a Git submodule or a package for shared utilities.

---

---

## ✨ Key Features

### 🎓 AI Video Lessons
- **Real-time pose detection** - Computer vision analyzes hand position
- **Adaptive difficulty** - AI adjusts lesson complexity based on performance
- **Interactive hotspots** - Contextual tips appear at key moments
- **Personalized recommendations** - AI suggests next lessons
- **Custom lesson plans** - AI-generated curriculum (Pro tier)
- **Offline downloads** - Practice anywhere (Premium+)

### 🎯 Practice & Training
- **FretPilot Trainer** - Interactive fretboard learning
- **AI Lesson Generator** - Custom practice routines
- **Practice Analyzer** - Identifies weaknesses
- **Jam Companion** - AI backing tracks
- **Mistake Heatmap** - Visual problem areas

### 🛒 Music Store **[NEW!]**
- **Dropshipping integration** with Spocket & Printful (zero inventory!)
- 54+ products: guitars, accessories, pedals, studio gear
- Integrated e-commerce (FretPilot-fulfilled, dropship, affiliate)
- Stripe + Bitcoin payment processing
- Order tracking and automatic fulfillment
- **40-60% profit margins** on dropship items
- See: `QUICK_START_DROPSHIPPING.md` for setup

### 🎼 Essential Tools
- Metronome, tuner, chord library, scale explorer

---

## 💰 Subscription Tiers

- **Free**: 3 lessons/day, basic features
- **Premium ($9.99/mo)**: Unlimited lessons, AI analysis, pose detection, offline downloads
- **Pro ($19.99/mo)**: Custom lesson plans, 1-on-1 coaching, priority support, certificates

---

## 🚀 Quick Start

### Development
```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Start backend API
cd server
node index.js
```

Visit `http://localhost:5173`

### Production Domain & DNS (fretpilotstudio.com)

Ensure DNS records at your registrar:

| Record | Type | Value |
|--------|------|-------|
| apex (fretpilotstudio.com) | A | 76.76.21.21 |
| www | CNAME | cname.vercel-dns.com |

Remove conflicting legacy A/CNAME records. Wait for propagation (usually minutes; up to 2 hours). Then run verification scripts:

```powershell
npm run dns:verify    # Quick one-off check
npm run dns:wait      # Poll until valid configuration
```

Once Vercel shows "Valid Configuration", redeploy the latest commit (Dashboard → Deployments → Redeploy) to ensure fresh CDN cache.

Health & version checks once live:

```powershell
Invoke-WebRequest https://fretpilotstudio.com -UseBasicParsing | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest https://fretpilotstudio.com/version.json -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Stripe Test Checkout Flow
1. Go to Pricing page
2. Click a Premium button
3. Test card: `4242 4242 4242 4242` (future expiry, any CVC, any ZIP)
4. Land on `/payment-success?session_id=...`
5. Refresh; Premium badge should appear if upgrade logic triggers

### Troubleshooting
| Symptom | Fix |
|---------|-----|
| White page | Redeploy; ensure DNS valid; add `?bust=1` to URL |
| Pricing button inert | Check `.env` `VITE_STRIPE_PUBLIC_KEY` not placeholder |
| Checkout error overlay | Confirm Price ID exists & allowed; verify secret key configured |
| Stale assets | Redeploy or increment build version banner |


### Build for Android
```powershell
# Build web app
npm run build

# Sync to Capacitor
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Backend Dev Server

Run the minimal Express server (Stripe/dev stubs, analytics, vendor PO):

```powershell
npm run server
```

### Vendor Integration (optional)

To forward dropship purchase orders to a real vendor system, the server supports:

- `SHIPSTATION_API_KEY` and `SHIPSTATION_API_SECRET`: Creates orders via ShipStation API.
- `VENDOR_PO_WEBHOOK_URL`: Posts the order payload to a custom webhook (Zapier/Make/vendor endpoint).

Set the desired variables, then start the server:

```powershell
$env:SHIPSTATION_API_KEY = "<your_key>"; $env:SHIPSTATION_API_SECRET = "<your_secret>"; npm run server
# or
$env:VENDOR_PO_WEBHOOK_URL = "https://your-webhook.example.com"; npm run server
```

When an order is placed (card dev flow or BTC), the app calls `POST /api/vendor/po` with a vendor-summarized payload. The server will:

- Try ShipStation first (if configured) to create an `awaiting_shipment` order.
- Otherwise POST to the configured webhook URL.
- Otherwise log and acknowledge (no-op).

---

## 📂 Project Structure

```
fretpilot/
├── src/
│   ├── components/          # Vue components
│   │   ├── AIVideoLessons.vue
│   │   ├── FretPilotTrainer.vue
│   │   ├── MusicStore.vue
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── subscriptionService.js
│   │   ├── orderService.js
│   │   └── ...
│   └── App.vue
├── server/
│   └── index.js            # Express API
├── android/                # Android native
└── DEPLOYMENT_GUIDE.md     # Complete deployment docs
```

---

## 🛠️ Tech Stack

- **Vue 3** - Frontend framework
- **Vite** - Build tool
- **Capacitor** - Mobile wrapper
- **Node.js + Express** - Backend API
- **Stripe** - Payments
- **TensorFlow.js** (planned) - AI pose detection

---

## 🔐 Environment Setup

Create `.env` file:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Server
PORT=5175
NODE_ENV=development

# Optional
OPENAI_API_KEY=...
```

---

## 💳 Enabling Real Payments & Bank Payouts

### 1. Create / Configure Stripe Account
1. Sign up at https://stripe.com (or log in).
2. Complete the onboarding (business details + identity verification).
3. Add and verify your bank account (Settings → Payouts → External accounts).
4. Switch to "Live" mode after successful test transactions.

### 2. Define Products / Prices (Optional)
For hosted Checkout you can either:
- Use server-side ad‑hoc price_data (current implementation) for physical goods.
- Or create Products + Prices in Stripe Dashboard for subscriptions or recurring items.

### 3. Set Environment Variables (Server)
Use test keys first:
```powershell
$env:STRIPE_SECRET_KEY="sk_test_xxx"; $env:STRIPE_WEBHOOK_SECRET="whsec_test_xxx"; npm run server
```
Then live keys once ready:
```powershell
$env:STRIPE_SECRET_KEY="sk_live_xxx"; $env:STRIPE_WEBHOOK_SECRET="whsec_live_xxx"; npm run server
```

### 4. Secure Webhook Endpoint
Expose your server over HTTPS (Railway, Render, Fly.io, etc.). Set webhook in Stripe Dashboard pointing to `/api/stripe-webhook`. Use the generated signing secret (`STRIPE_WEBHOOK_SECRET`).

### 5. Mobile App API Base
During production build:
```powershell
$env:VITE_API_BASE="https://api.yourdomain.com"; npm run build
```
You can override at runtime with `localStorage.setItem('fretpilot-api','https://api.yourdomain.com')` if needed.

### 6. Distinguish Physical vs Digital Requirements
- Physical products (instruments, accessories): Stripe Checkout allowed outside Play Billing.
- Digital subscriptions (Premium/Pro tiers): Google Play policy generally requires Google Play Billing for in‑app purchase of digital goods. Consider migrating subscription flow to Play Billing on Android while keeping Stripe for web.

### 7. Test Flow Before Live
1. Use Stripe test card `4242 4242 4242 4242` (any future expiry, any CVC, any US ZIP).
2. Confirm successful test checkout redirects.
3. Verify webhook events (checkout.session.completed).
4. Ensure order creation & vendor PO forwarding are correct.

### 8. Go Live Checklist
- Replace all `sk_test` keys with `sk_live`.
- Set `NODE_ENV=production`.
- Ensure HTTPS for API_BASE and privacy policy URL.
- Update Play Store listing payment description (clarify external payments for physical goods only). For digital tiers, implement or plan Play Billing.
- Monitor Stripe Dashboard for first live payouts.

### 9. Payouts
Stripe automatically batches payouts to your bank on a schedule (default ~2 business days after charge in many regions). You can view upcoming payouts in Stripe Dashboard → Balances → Payouts.

### 10. Fraud & Security Essentials
- Never trust client prices (server now uses catalog).
- Consider adding basic rate limiting (e.g., express-rate-limit) and logging.
- Enable Stripe Radar rules for additional fraud prevention.

### 11. Future Improvements
- Persist orders to a database (Postgres) instead of localStorage.
- Add authenticated user accounts for order history syncing across devices.
- Implement Play Billing for subscription tiers on Android.

---

## 🔄 Zero-Capital Order Auto-Fulfillment (Hybrid Model)

The platform now supports a hybrid fulfillment strategy designed for near-zero upfront capital:

| Fulfillment Type | Example Items | Payment Flow | Revenue Capture | Action at Checkout |
|------------------|---------------|--------------|-----------------|--------------------|
| Affiliate        | Fender / Gibson instruments & branded parts | External (Sweetwater / Amazon) | Affiliate commission (delayed) | User is deep-linked; not in Stripe cart |
| Dropship         | Printful apparel / Spocket accessories / DIY kits | Stripe physical goods checkout | Margin (sale price - vendor cost - shipping) | Auto vendor PO dispatch (ShipStation/webhook) |
| Internal / Manual| FretPilot-branded specialty items | Stripe checkout | Full product margin | Queued for manual pick/pack or future internal vendor integration |
| Digital / Subscription | Premium / Pro tiers, AI lessons | Stripe subscription or future Play Billing on Android | Recurring MRR | Webhook grants access |

### Flow: Stripe Physical Goods Checkout
1. User completes card payment (mode=payment) via `/api/stripe/create-checkout-session`.
2. Stripe sends `checkout.session.completed` webhook.
3. Server expands line items, maps names → internal catalog IDs, infers fulfillment types.
4. Items are grouped by fulfillment:
	- `affiliate`: logged (no charge, user purchased externally).
	- `dropship`: converted to a Purchase Order payload forwarded via `handleVendorPO()` → ShipStation or generic webhook.
	- `fretpilot` (internal/manual): appended to manual queue in order log.
5. Order persisted append-only to `server/data/orders.log.jsonl`.
6. Future: Background worker polls vendor statuses & updates order state.

### Environment Variables (Fulfillment / Vendor)
```env
PRINTFUL_API_KEY=your_printful_key          # Enables live product pulls & order creation
SPOCKET_API_KEY=your_spocket_key            # Enables live Spocket catalog & orders
SHIPSTATION_API_KEY=your_shipstation_key    # ShipStation PO creation (preferred if both set)
SHIPSTATION_API_SECRET=your_shipstation_secret
VENDOR_PO_WEBHOOK_URL=https://zapier-or-make-endpoint.example.com  # Fallback webhook for PO forwarding
```

If neither ShipStation nor `VENDOR_PO_WEBHOOK_URL` is configured, orders are logged only (safe dev mode).

### Cash Timing
- Card payment clears instantly; Stripe holds funds until payout (region-dependent, ~2 business days typical).
- Dropship vendor charges occur immediately when API order is created (your Stripe balance covers this since you already captured customer funds).
- Affiliate commissions post on the partner platform’s schedule (often net-30). They are NOT part of Stripe checkout.

### Risk Safeguards & Next Steps
- Add order status & reconciliation: create `orders.db.json` with structured states (pending → vendor_submitted → shipped → complete).
- Implement idempotency: store processed Stripe session IDs to prevent double fulfillment if webhook retries.
- Add signature verification & body retention for Stripe (`stripe.webhooks.constructEvent`).
- Build margin analytics: (gross_sale - vendor_cost - shipping) per order group.
- Introduce rate limiting for `/api/stripe/create-checkout-session`.

### Manual Fulfillment Queue
Internal items (currently labeled `fretpilot`) are collected under `manual` group in the stored order entry. You can later connect these to an internal WMS or ShipStation with SKU-level mapping.

---

## 📱 Google Play Store Asset Checklist

Create or update the following assets before next release:

| Asset | Specs | Notes |
|-------|-------|-------|
| App Icon | 512×512 PNG | Match architectural brand motif (The Franks Standard) |
| Feature Graphic | 1024×500 PNG | Bold gradient + tagline + instrument montage |
| Screenshots (Phone) | 1080×1920 (min 6) | Highlight: AI Lessons, Trainer, Store, Jam Companion, Bitcoin payment, Premium tiers |
| Short Description | ≤80 chars | Already drafted; confirm no emojis beyond policy |
| Full Description | 4000 chars max | Include new dropshipping + AI features |
| Promo Video (Optional) | YouTube link | Future: recorded walkthrough |

### Suggested Screenshot Set (Order)

1. Dashboard & Navigation (branding + multi-instrument icons)
2. AI Video Lesson (pose detection overlay / lesson steps)
3. Jam Companion (backing track generator)
4. Music Store (fulfillment badges: Affiliate / Dropship / Digital)
5. Payment & Subscription (Stripe + Bitcoin option)
6. Practice Analyzer (heatmap or stats)
7. Premium Tier Features (comparison overlay) – optional

### Icon & Graphic Design Notes

- Icon: Architectural skyline silhouette + subtle fretboard gradient, retain dark background for contrast in Play search.
- Feature Graphic: Left: tagline “AI Lessons • Jam • Gear” / Right: instrument collage with radial glow.
- Avoid dense text; keep primary brand mark centered.

### Compliance Reminders

- Remove pricing claims like “40–60% margins” from description (avoid financial promises).
- Ensure subscription wording clarifies auto-renew & cancellation path.
- Digital goods (subscriptions) should not claim external payment avoidance on Android; plan Play Billing migration.

### Asset Source Control

Create `PLAY_ASSETS/` directory:

```text
PLAY_ASSETS/
  icon-512.png
  feature-graphic-1024x500.png
  screenshot-01-dashboard.png
  screenshot-02-ai-lesson.png
  screenshot-03-jam-companion.png
  screenshot-04-store.png
  screenshot-05-payment.png
  screenshot-06-practice-analyzer.png
  screenshot-07-premium-comparison.png (optional)
```

Add a README in that folder tracking generation date & tool (e.g. Figma export commit hash).

Consider a separate `PLAY_ASSETS.md` to store versioned asset references and design guidelines.

---

---

---

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete setup, deployment, and scaling guide
- **[LAUNCH_GUIDE.md](./LAUNCH_GUIDE.md)** - Feature walkthrough and launch checklist

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Copyright © 2025 FretPilot. All rights reserved.

---

## 📞 Support

- **Users**: support@fretpilot.com
- **Developers**: developer@fretpilot.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/fretpilot/issues)

---

**Made with ❤️ by musicians, for musicians**

🎸 Start your guitar journey today with FretPilot! 🎸