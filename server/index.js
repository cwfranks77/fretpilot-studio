// Minimal backend placeholder for FretPilot
// NOTE: This is a stub; replace with real implementations and authentication.

const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { handleVendorPO } = require('./vendor')
const dropshipWebhooks = require('./dropship-webhooks')
const { sendContactEmail, sanitizeField } = require('./contact')
const app = express()
const PORT = process.env.PORT || 5175
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
// Limited invite code management (self-destruct after N unique claims)
const LIMITED_INVITE_CODE = process.env.INVITE_LIMITED_CODE || ''
const LIMITED_INVITE_MAX = parseInt(process.env.INVITE_LIMITED_MAX || '10', 10)
const inviteDataFile = path.join(__dirname, 'data', 'inviteCodes.json')
function loadInviteData() {
  try {
    if (!fs.existsSync(inviteDataFile)) {
      const dir = path.dirname(inviteDataFile)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(inviteDataFile, JSON.stringify({ codes: {} }, null, 2))
    }
    return JSON.parse(fs.readFileSync(inviteDataFile, 'utf8'))
  } catch (e) { return { codes: {} } }
}
function saveInviteData(data) {
  try { fs.writeFileSync(inviteDataFile, JSON.stringify(data, null, 2)) } catch (_) {}
}
function initLimitedCode(data) {
  if (!LIMITED_INVITE_CODE) return
  if (!data.codes[LIMITED_INVITE_CODE]) {
    data.codes[LIMITED_INVITE_CODE] = { max: LIMITED_INVITE_MAX, used: [], active: true }
  }
}
// Initialize file structure on boot
const _bootData = loadInviteData(); initLimitedCode(_bootData); saveInviteData(_bootData)

let stripe = null
if (STRIPE_SECRET_KEY) {
  try { stripe = require('stripe')(STRIPE_SECRET_KEY) } catch (e) { stripe = null }
}

app.use(express.json({ limit: '10mb' }))
app.use(cors())

// Mount dropshipping webhook routes
app.use(dropshipWebhooks)

app.get('/api/health', (req, res) => res.json({ ok: true }))

// ============================================
// BETA TESTER SIGNUP & EARLY ACCESS
// ============================================
const betaSignupsFile = path.join(__dirname, 'data', 'beta-signups.jsonl')

// Simple rate limiting for beta signup (prevent spam)
const betaRateStore = new Map() // email -> timestamp
const BETA_RATE_WINDOW = 5 * 60 * 1000 // 5 minutes

app.post('/api/beta/signup', (req, res) => {
  try {
    const { email, name, instrument, experience, referral } = req.body || {}
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email || '')) {
      return res.status(400).json({ ok: false, error: 'invalid_email' })
    }
    
    // Rate limit by email
    const now = Date.now()
    const lastSignup = betaRateStore.get(email.toLowerCase())
    if (lastSignup && (now - lastSignup) < BETA_RATE_WINDOW) {
      return res.status(429).json({ ok: false, error: 'rate_limited', retryAfter: Math.ceil((BETA_RATE_WINDOW - (now - lastSignup)) / 1000) })
    }
    
    betaRateStore.set(email.toLowerCase(), now)
    
    // Persist signup
    const entry = {
      email: email.toLowerCase(),
      name: sanitizeField(name || '').slice(0, 100),
      instrument: sanitizeField(instrument || '').slice(0, 50),
      experience: sanitizeField(experience || 'beginner').slice(0, 20),
      referral: sanitizeField(referral || 'organic').slice(0, 50),
      signedUpAt: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    }
    
    const dir = path.dirname(betaSignupsFile)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.appendFileSync(betaSignupsFile, JSON.stringify(entry) + '\n')
    
    console.log('[beta] signup:', email)
    
    return res.json({ 
      ok: true, 
      message: 'Thanks for signing up! Check your email for beta access details.',
      waitlist: true 
    })
  } catch (e) {
    console.error('[beta] signup error', e)
    return res.status(500).json({ ok: false, error: 'signup_failed' })
  }
})

// Get beta signup count (public metric)
app.get('/api/beta/count', (req, res) => {
  try {
    if (!fs.existsSync(betaSignupsFile)) {
      return res.json({ count: 0 })
    }
    const lines = fs.readFileSync(betaSignupsFile, 'utf8').split('\n').filter(l => l.trim())
    return res.json({ count: lines.length })
  } catch (e) {
    return res.json({ count: 0 })
  }
})

// Limited invite status endpoint
app.get('/api/invite/status', (req, res) => {
  try {
    const { code } = req.query
    if (!code || code !== LIMITED_INVITE_CODE) return res.status(404).json({ ok: false, error: 'unknown_code' })
    const data = loadInviteData(); initLimitedCode(data)
    const entry = data.codes[code]
    return res.json({ ok: true, code, remaining: Math.max(0, entry.max - entry.used.length), used: entry.used.length, active: entry.active })
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'status_failed' })
  }
})

// Claim limited invite. Expects POST with JSON { code, email }
app.post('/api/invite/claim', (req, res) => {
  try {
    const { code, email } = req.body || {}
    if (!code || code !== LIMITED_INVITE_CODE) return res.status(404).json({ ok: false, error: 'unknown_code' })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email || '')) return res.status(400).json({ ok: false, error: 'invalid_email' })
    const data = loadInviteData(); initLimitedCode(data)
    const entry = data.codes[code]
    if (!entry.active) return res.status(410).json({ ok: false, error: 'code_inactive' })
    if (entry.used.includes(email.toLowerCase())) {
      return res.json({ ok: true, granted: true, remaining: Math.max(0, entry.max - entry.used.length) })
    }
    if (entry.used.length >= entry.max) {
      entry.active = false; saveInviteData(data)
      return res.status(409).json({ ok: false, error: 'limit_reached' })
    }
    entry.used.push(email.toLowerCase())
    if (entry.used.length >= entry.max) entry.active = false
    saveInviteData(data)
    return res.json({ ok: true, granted: true, remaining: Math.max(0, entry.max - entry.used.length), exhausted: !entry.active })
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'claim_failed' })
  }
})

// Admin deactivate limited code (simple shared secret)
app.post('/api/invite/deactivate', (req, res) => {
  const token = process.env.INVITE_ADMIN_TOKEN || ''
  const { code, auth } = req.body || {}
  if (!token || !auth || auth !== token) return res.status(403).json({ ok: false, error: 'forbidden' })
  if (code !== LIMITED_INVITE_CODE) return res.status(404).json({ ok: false, error: 'unknown_code' })
  const data = loadInviteData(); initLimitedCode(data)
  data.codes[code].active = false
  saveInviteData(data)
  return res.json({ ok: true, deactivated: true })
})

app.post('/api/lessons/generate', (req, res) => {
  const { goal, level, style } = req.body || {}
  return res.json({
    title: `Lesson: ${goal} (${level}, ${style})`,
    steps: [
      `Warm-up for ${style}`,
      'Break riff into parts',
      'Metronome escalation',
      'Record and compare timing',
    ],
    videoUrl: '',
  })
})

app.post('/api/practice/analyze', (req, res) => {
  // Expect audio blob, here we just return a fake result
  return res.json({ tempo: 95, stability: 82, focus: 'Speed up gradually', drills: ['Metronome 80 BPM', 'Accent on 2&4'] })
})

app.post('/api/jam/generate', (req, res) => {
  const { key = 'C', tempo = 100, style = 'Rock' } = req.body || {}
  return res.json({ audioUrl: '', progression: ['C', 'G', 'Am', 'F'], key, tempo, style })
})

app.post('/api/payments/checkout', (req, res) => {
  // Return a placeholder URL
  return res.json({ url: 'https://example.com/checkout/session' })
})

// Basic product catalog (server authority) - keep price integrity
// In real production, replace with DB fetch.
const PRODUCT_CATALOG = {
  1: { name: 'Fender Stratocaster', unit_amount: 129999 },
  2: { name: 'Gibson Les Paul', unit_amount: 249999 },
  3: { name: 'Taylor 214ce Acoustic', unit_amount: 89999 },
  4: { name: 'Fender Blues Junior IV', unit_amount: 59999 },
  5: { name: 'Marshall DSL40CR', unit_amount: 79999 },
  8: { name: 'Ernie Ball Strings (3-Pack)', unit_amount: 1999 },
  10:{ name: 'Gator Hardshell Case', unit_amount: 14999 },
  11:{ name: 'Yamaha P-125 Digital Piano', unit_amount: 69999 },
  12:{ name: 'Pearl Export Drum Kit', unit_amount: 84999 },
  13:{ name: 'Pioneer DDJ-400 Controller', unit_amount: 24999 },
  14:{ name: 'KRK Rokit 5 G4 Monitors (Pair)', unit_amount: 39999 },
  15:{ name: 'Shure SM58 Vocal Microphone', unit_amount: 10999 },
  16:{ name: 'Hohner Panther Diatonic Accordion', unit_amount: 59999 },
  17:{ name: 'Focusrite Scarlett 2i2 Audio Interface', unit_amount: 17999 },
  18:{ name: 'Audio-Technica AT2020 Condenser', unit_amount: 9999 },
  19:{ name: 'Akai MPK Mini Plus MIDI Controller', unit_amount: 16999 },
  20:{ name: 'Native Instruments Traktor Kontrol S2', unit_amount: 33999 }
}

// Create Stripe Checkout Session (secure server-side price resolution)
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { cart = [], successUrl = 'http://localhost:5173/?checkout_success=1', cancelUrl = 'http://localhost:5173/?checkout_cancel=1' } = req.body || {}
    if (!stripe) {
      return res.json({ url: 'https://example.com/checkout/dev-success' })
    }
    // Build line items from server catalog only (ignore client amounts)
    const line_items = []
    for (const item of cart) {
      // skip affiliate items (no direct checkout)
      if (item.fulfillment === 'affiliate') continue
      const catalog = PRODUCT_CATALOG[item.id]
      if (!catalog) continue
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1)
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: catalog.name },
          unit_amount: catalog.unit_amount
        },
        quantity
      })
    }
    if (line_items.length === 0) {
      return res.status(400).json({ error: 'empty_checkout' })
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl
    })
    return res.json({ id: session.id, url: session.url })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[stripe] session error', e)
    return res.status(500).json({ error: 'stripe_session_error' })
  }
})

// Unified subscription checkout endpoint used by front-end StripeCheckout component.
// Supports both subscription and one-time payment modes. Expects a priceId that maps
// to a Stripe Price object configured in the Stripe dashboard. Unlike the catalog
// purchase endpoint above, this does not derive prices from the client except for
// the provided priceId; it validates against allowed environment-configured IDs.
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const {
      priceId = '',
      mode = 'subscription',
      successUrl = `${req.headers.origin || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl = `${req.headers.origin || 'http://localhost:5173'}/pricing?cancelled=1`
    } = req.body || {}

    if (!stripe) {
      return res.status(500).json({ error: 'stripe_not_configured' })
    }
    if (!priceId) {
      return res.status(400).json({ error: 'missing_priceId' })
    }

    // Optional allow-list validation (prevents arbitrary priceIds being used)
    const allowed = [
      process.env.VITE_STRIPE_PRICE_MONTHLY,
      process.env.VITE_STRIPE_PRICE_YEARLY,
      process.env.VITE_STRIPE_PRICE_PRO,
      process.env.STRIPE_PRICE_MONTHLY,
      process.env.STRIPE_PRICE_YEARLY,
      process.env.STRIPE_PRICE_PRO
    ].filter(Boolean)
    if (allowed.length && !allowed.includes(priceId)) {
      return res.status(400).json({ error: 'price_not_allowed' })
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      allow_promotion_codes: true,
      subscription_data: mode === 'subscription' ? { trial_period_days: 0 } : undefined,
      success_url: successUrl,
      cancel_url: cancelUrl
    })

    return res.json({ id: session.id })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[stripe] unified checkout error', e)
    return res.status(500).json({ error: 'stripe_session_error' })
  }
})

// =====================================================
// Stripe Checkout Session Verification (client polling)
// PaymentSuccess.vue calls this to display receipt data.
// =====================================================
app.get('/api/payments/verify-session/:id', async (req, res) => {
  const sessionId = req.params.id
  if (!stripe) return res.status(500).json({ success: false, error: 'stripe_not_configured' })
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    // Retrieve line items (first item determines plan) – avoid expensive calls if unnecessary
    let priceId = ''
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 })
      if (lineItems && lineItems.data && lineItems.data.length > 0) {
        priceId = lineItems.data[0].price && lineItems.data[0].price.id || ''
      }
    } catch (_) {}

    const priceMap = {
      [process.env.VITE_STRIPE_PRICE_MONTHLY]: { planName: 'Premium Monthly', amount: '9.99' },
      [process.env.VITE_STRIPE_PRICE_YEARLY]: { planName: 'Premium Yearly', amount: '99.99' },
      [process.env.VITE_STRIPE_PRICE_PRO]: { planName: 'Pro Monthly', amount: '19.99' },
      [process.env.STRIPE_PRICE_MONTHLY]: { planName: 'Premium Monthly', amount: '9.99' },
      [process.env.STRIPE_PRICE_YEARLY]: { planName: 'Premium Yearly', amount: '99.99' },
      [process.env.STRIPE_PRICE_PRO]: { planName: 'Pro Monthly', amount: '19.99' }
    }
    const planInfo = priceMap[priceId] || { planName: 'Unknown', amount: (session.amount_total ? (session.amount_total/100).toFixed(2) : '0.00') }
    return res.json({ success: true, planName: planInfo.planName, amount: planInfo.amount, transactionId: sessionId })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[stripe] verify-session error', e)
    return res.status(500).json({ success: false, error: 'session_lookup_failed' })
  }
})

// =====================================================
// Stripe Webhook Endpoint
// Configure in Stripe Dashboard pointing to /api/stripe/webhook
// Uses raw body for signature verification.
// =====================================================
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe || !webhookSecret) {
    return res.status(200).json({ received: true, skipped: 'stripe_or_secret_missing' })
  }
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[stripe] webhook signature failed', err.message)
    return res.status(400).json({ error: 'invalid_signature' })
  }

  // Handle completed checkout sessions – mark upgrades (stateless example)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    // NOTE: In production you would persist session.customer or metadata to a DB
    // and flag user as premium. Here we just log.
    // eslint-disable-next-line no-console
    console.log('[stripe] checkout.session.completed', session.id, session.customer)
  }

  res.json({ received: true })
})

// Basic email send stub
app.post('/api/email/send', (req, res) => {
  // eslint-disable-next-line no-console
  console.log('[email] send', req.body)
  res.json({ ok: true })
})

// ============================================
// CONTACT / OPEN DOOR ENDPOINT
// ============================================
// Provides testers & customers a simple way to reach support/dev directly.
// In dev (no SMTP configured) messages are appended to server/logs/contact.log
// Environment vars (optional for email):
// CONTACT_SMTP_HOST, CONTACT_SMTP_PORT, CONTACT_SMTP_SECURE, CONTACT_SMTP_USER, CONTACT_SMTP_PASS, CONTACT_TO

const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const CONTACT_RATE_LIMIT_MAX = 8 // max messages per IP per window
const contactRateStore = new Map() // ip -> { count, resetAt }

function rateLimited(ip) {
  const now = Date.now()
  let entry = contactRateStore.get(ip)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS }
    contactRateStore.set(ip, entry)
  }
  entry.count += 1
  return entry.count > CONTACT_RATE_LIMIT_MAX
}

app.post('/api/contact', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    if (rateLimited(ip)) {
      return res.status(429).json({ ok: false, error: 'rate_limited' })
    }

    const { name = '', email = '', subject = '', message = '', _hp = '' } = req.body || {}

    // Honeypot (bots will usually fill hidden field)
    if (_hp) {
      return res.status(400).json({ ok: false, error: 'bot_detected' })
    }

    // Basic validation
    const cleanName = sanitizeField(name).slice(0, 80)
    const cleanEmail = sanitizeField(email).slice(0, 120)
    const cleanSubject = sanitizeField(subject).slice(0, 120)
    const cleanMessage = sanitizeField(message).slice(0, 5000)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({ ok: false, error: 'missing_fields' })
    }
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ ok: false, error: 'invalid_email' })
    }
    if (cleanMessage.length < 5) {
      return res.status(400).json({ ok: false, error: 'message_too_short' })
    }

    const payload = {
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject || 'Contact Message',
      message: cleanMessage,
      ip,
      ts: new Date().toISOString()
    }

    // Attempt email send if configured, else log to file
    const emailResult = await sendContactEmail(payload)

    // Always append to local log as audit trail
    try {
      const logDir = path.join(__dirname, 'logs')
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
      const logLine = JSON.stringify(payload) + '\n'
      fs.appendFile(path.join(logDir, 'contact.log'), logLine, () => {})
    } catch (e) {
      console.error('[contact] log write failed', e)
    }

    return res.json({ ok: true, delivered: emailResult.sent, mode: emailResult.mode })
  } catch (e) {
    console.error('[contact] endpoint error', e)
    return res.status(500).json({ ok: false, error: 'contact_failed' })
  }
})

// Vendor purchase order stub
app.post('/api/vendor/po', async (req, res) => {
  try {
    const result = await handleVendorPO(req.body)
    return res.json(result)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[vendor] PO error', e)
    return res.status(500).json({ ok: false, error: 'vendor_po_failed' })
  }
})

app.get('/api/user/progress', (req, res) => {
  return res.json({ lessons: [], jams: [], stats: {} })
})

app.post('/api/analytics', (req, res) => {
  // Log and accept
  // eslint-disable-next-line no-console
  console.log('[analytics]', req.body)
  res.json({ ok: true })
})

// ============================================
// SUBSCRIPTION ENDPOINTS
// ============================================

// Create subscription checkout session
app.post('/api/create-subscription-checkout', async (req, res) => {
  try {
    const { priceId, tier, successUrl, cancelUrl } = req.body || {}
    
    if (!stripe) {
      // Development fallback - simulate success
      console.log('[subscription] dev mode - simulating checkout for tier:', tier)
      return res.json({ 
        sessionId: 'dev_session_' + Date.now(),
        url: successUrl + '&dev=true'
      })
    }
    
    // Create Stripe subscription checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tier: tier
      }
    })
    
    return res.json({ 
      sessionId: session.id, 
      url: session.url 
    })
  } catch (error) {
    console.error('[subscription] checkout error:', error)
    return res.status(500).json({ error: 'checkout_failed' })
  }
})

// Webhook to handle Stripe subscription events
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!stripe || !webhookSecret) {
    return res.status(400).json({ error: 'webhook_not_configured' })
  }
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    
    console.log('[webhook] received:', event.type)
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        // Distinguish subscription vs one-time physical goods checkout
        if (session.mode === 'subscription') {
          console.log('[webhook] subscription created:', {
            customerId: session.customer,
            subscriptionId: session.subscription,
            tier: session.metadata.tier
          })
          // TODO: Persist subscription activation
        } else {
          // Physical goods order (Stripe Checkout payment)
          try {
            // Expand line items to derive products
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
            const processed = []
            for (const li of lineItems.data) {
              // Match by product name to catalog (simple heuristic)
              const productEntry = Object.entries(PRODUCT_CATALOG).find(([, v]) => v.name === li.description)
              if (!productEntry) continue
              const [pid, meta] = productEntry
              processed.push({
                id: Number(pid),
                name: meta.name,
                unit_amount: meta.unit_amount,
                quantity: li.quantity,
                fulfillment: inferFulfillment(Number(pid)),
              })
            }
            // Group by fulfillment model
            const groups = groupByFulfillment(processed)
            // Trigger vendor fulfillment stubs
            const vendorResult = await autoFulfillGroups(groups, {
              orderSource: 'stripe',
              stripeSessionId: session.id,
              total: session.amount_total,
              currency: session.currency
            })
            persistOrder({
              orderId: session.id,
              createdAt: new Date().toISOString(),
              customer: session.customer_details || {},
              items: processed,
              fulfillmentGroups: groups,
              vendorResult
            })
            console.log('[webhook] physical goods fulfilled', { count: processed.length, groups: Object.keys(groups) })
          } catch (err) {
            console.error('[webhook] physical fulfillment error', err)
          }
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('[webhook] subscription updated:', subscription.id)
        // TODO: Update subscription status in database
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('[webhook] subscription cancelled:', subscription.id)
        // TODO: Update subscription status to cancelled
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        console.log('[webhook] payment succeeded:', invoice.id)
        // TODO: Extend subscription period
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        console.log('[webhook] payment failed:', invoice.id)
        // TODO: Notify user, suspend access
        break
      }
    }
    
    res.json({ received: true })
  } catch (error) {
    console.error('[webhook] error:', error)
    return res.status(400).json({ error: 'webhook_error' })
  }
})

// Get subscription status (validate subscription)
app.post('/api/subscription/validate', async (req, res) => {
  try {
    const { stripeSubscriptionId } = req.body || {}
    
    if (!stripeSubscriptionId) {
      return res.json({ valid: false, reason: 'no_subscription_id' })
    }
    
    if (!stripe) {
      // Development mode - return mock validation
      return res.json({ 
        valid: true, 
        tier: 'premium',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    }
    
    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
    
    const isActive = subscription.status === 'active' || subscription.status === 'trialing'
    
    return res.json({
      valid: isActive,
      tier: subscription.metadata.tier || 'premium',
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    })
  } catch (error) {
    console.error('[subscription] validate error:', error)
    return res.json({ valid: false, reason: 'validation_error' })
  }
})

// Cancel subscription
app.post('/api/subscription/cancel', async (req, res) => {
  try {
    const { stripeSubscriptionId } = req.body || {}
    
    if (!stripeSubscriptionId) {
      return res.status(400).json({ error: 'no_subscription_id' })
    }
    
    if (!stripe) {
      return res.json({ ok: true, message: 'dev_mode_cancel' })
    }
    
    // Cancel at period end (don't cancel immediately)
    const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true
    })
    
    return res.json({ 
      ok: true, 
      cancelAt: new Date(subscription.cancel_at * 1000).toISOString()
    })
  } catch (error) {
    console.error('[subscription] cancel error:', error)
    return res.status(500).json({ error: 'cancel_failed' })
  }
})

// Update subscription (upgrade/downgrade)
app.post('/api/subscription/update', async (req, res) => {
  try {
    const { stripeSubscriptionId, newPriceId, newTier } = req.body || {}
    
    if (!stripeSubscriptionId || !newPriceId) {
      return res.status(400).json({ error: 'missing_parameters' })
    }
    
    if (!stripe) {
      return res.json({ 
        ok: true, 
        message: 'dev_mode_update',
        tier: newTier
      })
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
    
    // Update to new price
    const updated = await stripe.subscriptions.update(stripeSubscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId
      }],
      metadata: {
        tier: newTier
      },
      proration_behavior: 'always_invoice'
    })
    
    return res.json({ 
      ok: true,
      tier: newTier,
      currentPeriodEnd: new Date(updated.current_period_end * 1000).toISOString()
    })
  } catch (error) {
    console.error('[subscription] update error:', error)
    return res.status(500).json({ error: 'update_failed' })
  }
})

// Customer portal (for managing payment methods, invoices, etc.)
app.post('/api/subscription/portal', async (req, res) => {
  try {
    const { stripeCustomerId, returnUrl } = req.body || {}
    
    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'no_customer_id' })
    }
    
    if (!stripe) {
      return res.json({ url: returnUrl || 'http://localhost:5173' })
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl || 'http://localhost:5173'
    })
    
    return res.json({ url: session.url })
  } catch (error) {
    console.error('[subscription] portal error:', error)
    return res.status(500).json({ error: 'portal_failed' })
  }
})

app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`))

// ============================================
// ORDER FULFILLMENT HELPERS (ZERO CAPITAL FLOW)
// ============================================

// Infer fulfillment type by product id (placeholder logic until unified catalog)
function inferFulfillment(productId) {
  // Affiliate items: skip (IDs 1-7 etc. originally guitars/bass) - adjust as needed
  const affiliateIds = new Set([1,2,3,4,5,6,7,57,58,59,60,61,62,63,64,65,66])
  if (affiliateIds.has(productId)) return 'affiliate'
  // Dropship placeholder set (DIY kits & accessories etc.)
  const dropshipIds = new Set([50,51,52,53,54,55,56,67,68,69,70,71,72])
  if (dropshipIds.has(productId)) return 'dropship'
  return 'fretpilot' // default internal / manual
}

// Group items by fulfillment
function groupByFulfillment(items) {
  const groups = {}
  for (const it of items) {
    const key = it.fulfillment
    if (!groups[key]) groups[key] = []
    groups[key].push(it)
  }
  return groups
}

// Persist order to JSON file (simple append model)
const ordersFile = path.join(__dirname, 'data', 'orders.log.jsonl')
function persistOrder(order) {
  try {
    const line = JSON.stringify(order) + '\n'
    const dir = path.dirname(ordersFile)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.appendFileSync(ordersFile, line)
  } catch (e) {
    console.error('[orders] persist failed', e)
  }
}

// Auto-fulfill groups (calls existing vendor PO route internally for dropship)
async function autoFulfillGroups(groups, meta) {
  const result = { meta, affiliate: [], dropship: null, manual: [] }
  // Record affiliate items (no charge here, revenue via external cookie)
  if (groups.affiliate) {
    result.affiliate = groups.affiliate.map(i => ({ id: i.id, name: i.name, qty: i.quantity }))
  }
  // Dropship: forward as vendor PO (using handleVendorPO directly)
  if (groups.dropship) {
    try {
      const poPayload = {
        orderId: meta.stripeSessionId,
        shipping: {}, // Expand with real shipping details when collected
        vendors: [ { name: 'dropship', items: groups.dropship.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.unit_amount/100 })) } ]
      }
      result.dropship = await handleVendorPO(poPayload)
    } catch (e) {
      result.dropship = { ok: false, error: e?.message }
    }
  }
  // Manual/internal fulfillment queue
  if (groups.fretpilot) {
    result.manual = groups.fretpilot.map(i => ({ id: i.id, name: i.name, qty: i.quantity }))
  }
  return result
}

// ============================================
// BITCOIN / BTCPAY SERVER ENDPOINTS
// ============================================

const BTCPAY_SERVER_URL = process.env.BTCPAY_SERVER_URL || ''
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID || ''
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY || ''

// Create BTCPay Server invoice
app.post('/api/bitcoin/create-invoice', async (req, res) => {
  try {
    const { paymentId, plan, amount, currency = 'USD' } = req.body || {}
    
    if (!BTCPAY_SERVER_URL || !BTCPAY_STORE_ID || !BTCPAY_API_KEY) {
      console.log('[btcpay] not configured, returning demo response')
      // Return demo response for development
      return res.json({
        invoiceId: 'demo_' + paymentId,
        address: 'bc1q' + Math.random().toString(36).substring(2, 34),
        btcAmount: amount * 0.000015, // Rough BTC estimate
        invoiceUrl: null,
        expiresAt: Date.now() + (15 * 60 * 1000)
      })
    }
    
    // Create invoice via BTCPay Server API
    const invoiceData = {
      amount: amount,
      currency: currency,
      orderId: paymentId,
      metadata: {
        plan: plan,
        paymentId: paymentId
      },
      checkout: {
        speedPolicy: 'MediumSpeed', // 0-conf for small amounts
        paymentMethods: ['BTC'],
        expirationMinutes: 15,
        redirectURL: `${process.env.APP_URL || 'http://localhost:5173'}?payment_id=${paymentId}`,
        defaultLanguage: 'en'
      }
    }
    
    const response = await fetch(
      `${BTCPAY_SERVER_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${BTCPAY_API_KEY}`
        },
        body: JSON.stringify(invoiceData)
      }
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`BTCPay API error: ${response.status} ${errorText}`)
    }
    
    const invoice = await response.json()
    
    // Extract payment info from invoice
    return res.json({
      invoiceId: invoice.id,
      address: invoice.cryptoInfo?.[0]?.address || invoice.addresses?.BTC,
      btcAmount: invoice.cryptoInfo?.[0]?.due || 0,
      invoiceUrl: invoice.checkoutLink,
      expiresAt: new Date(invoice.expirationTime).getTime()
    })
  } catch (error) {
    console.error('[btcpay] invoice creation error:', error)
    return res.status(500).json({ error: 'btcpay_invoice_failed', message: error.message })
  }
})

// Check BTCPay invoice status
app.get('/api/bitcoin/check-invoice/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params
    
    if (!BTCPAY_SERVER_URL || !BTCPAY_STORE_ID || !BTCPAY_API_KEY) {
      // Demo mode - simulate random confirmation
      const demoStatuses = ['New', 'New', 'New', 'Processing', 'Settled']
      return res.json({
        status: demoStatuses[Math.floor(Math.random() * demoStatuses.length)],
        confirmations: Math.floor(Math.random() * 3)
      })
    }
    
    const response = await fetch(
      `${BTCPAY_SERVER_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices/${invoiceId}`,
      {
        headers: {
          'Authorization': `token ${BTCPAY_API_KEY}`
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`BTCPay API error: ${response.status}`)
    }
    
    const invoice = await response.json()
    
    // Map BTCPay status to our status
    // BTCPay statuses: New, Processing, Settled, Invalid, Expired
    return res.json({
      status: invoice.status,
      confirmations: invoice.cryptoInfo?.[0]?.confirmations || 0,
      amountPaid: invoice.cryptoInfo?.[0]?.paid || 0,
      transactionId: invoice.cryptoInfo?.[0]?.txId || null
    })
  } catch (error) {
    console.error('[btcpay] check invoice error:', error)
    return res.status(500).json({ error: 'btcpay_check_failed', message: error.message })
  }
})

// Webhook endpoint for BTCPay invoice events
app.post('/api/bitcoin/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify webhook signature if configured
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = req.headers['btcpay-sig']
      // TODO: Implement signature verification
      // const hmac = crypto.createHmac('sha256', webhookSecret)
      // hmac.update(req.body)
      // const digest = hmac.digest('hex')
      // if (signature !== digest) return res.status(401).json({ error: 'invalid_signature' })
    }
    
    const event = JSON.parse(req.body.toString())
    console.log('[btcpay] webhook event:', event.type, event.invoiceId)
    
    // Handle invoice events
    switch (event.type) {
      case 'InvoiceCreated':
        console.log('[btcpay] invoice created:', event.invoiceId)
        break
        
      case 'InvoiceReceivedPayment':
        console.log('[btcpay] payment received:', event.invoiceId)
        // TODO: Update payment status in database
        break
        
      case 'InvoiceProcessing':
        console.log('[btcpay] invoice processing:', event.invoiceId)
        break
        
      case 'InvoiceSettled':
        console.log('[btcpay] invoice settled:', event.invoiceId)
        // TODO: Grant premium access to user
        // Find user by invoice metadata, update subscription status
        break
        
      case 'InvoiceExpired':
        console.log('[btcpay] invoice expired:', event.invoiceId)
        // TODO: Mark payment as expired
        break
        
      case 'InvoiceInvalid':
        console.log('[btcpay] invoice invalid:', event.invoiceId)
        break
    }
    
    res.json({ received: true })
  } catch (error) {
    console.error('[btcpay] webhook error:', error)
    return res.status(400).json({ error: 'webhook_error' })
  }
})

// ============================================
// DROPSHIPPING API ENDPOINTS
// ============================================

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || ''
const SPOCKET_API_KEY = process.env.SPOCKET_API_KEY || ''

// Get product catalog from dropshipping suppliers
app.get('/api/dropship/products', async (req, res) => {
  try {
    const products = []
    
    // Fetch from Printful
    if (PRINTFUL_API_KEY) {
      try {
        const printfulResponse = await fetch('https://api.printful.com/store/products', {
          headers: {
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`
          }
        })
        if (printfulResponse.ok) {
          const printfulData = await printfulResponse.json()
          products.push(...(printfulData.result || []).map(p => ({
            id: `printful_${p.id}`,
            supplier: 'Printful',
            ...p
          })))
        }
      } catch (e) {
        console.error('[dropship] Printful fetch error:', e)
      }
    }
    
    // Fetch from Spocket
    if (SPOCKET_API_KEY) {
      try {
        const spocketResponse = await fetch('https://api.spocket.co/api/v2/products', {
          headers: {
            'Authorization': `Bearer ${SPOCKET_API_KEY}`
          }
        })
        if (spocketResponse.ok) {
          const spocketData = await spocketResponse.json()
          products.push(...(spocketData.products || []).map(p => ({
            id: `spocket_${p.id}`,
            supplier: 'Spocket',
            ...p
          })))
        }
      } catch (e) {
        console.error('[dropship] Spocket fetch error:', e)
      }
    }
    
    // Return curated fallback if no suppliers configured
    if (products.length === 0) {
      return res.json({ products: [], message: 'No dropship suppliers configured' })
    }
    
    res.json({ products })
  } catch (error) {
    console.error('[dropship] products error:', error)
    res.status(500).json({ error: 'fetch_products_failed' })
  }
})

// Create dropshipping order
app.post('/api/dropship/create-order', async (req, res) => {
  try {
    const { items, customer, shippingAddress } = req.body || {}
    
    if (!items || !customer || !shippingAddress) {
      return res.status(400).json({ error: 'missing_required_fields' })
    }
    
    // Group items by supplier
    const supplierOrders = {}
    items.forEach(item => {
      if (!supplierOrders[item.supplier]) {
        supplierOrders[item.supplier] = []
      }
      supplierOrders[item.supplier].push(item)
    })
    
    const orderResults = []
    
    // Create Printful orders
    if (supplierOrders.Printful && PRINTFUL_API_KEY) {
      const printfulOrderData = {
        recipient: {
          name: `${customer.firstName} ${customer.lastName}`,
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          state_code: shippingAddress.state,
          country_code: shippingAddress.country,
          zip: shippingAddress.zip,
          phone: customer.phone,
          email: customer.email
        },
        items: supplierOrders.Printful.map(item => ({
          variant_id: item.variantId,
          quantity: item.quantity
        }))
      }
      
      const printfulResponse = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(printfulOrderData)
      })
      
      const printfulResult = await printfulResponse.json()
      orderResults.push({
        supplier: 'Printful',
        success: printfulResponse.ok,
        orderId: printfulResult.result?.id,
        data: printfulResult
      })
    }
    
    // Create Spocket orders
    if (supplierOrders.Spocket && SPOCKET_API_KEY) {
      const spocketOrderData = {
        order: {
          customer_email: customer.email,
          customer_name: `${customer.firstName} ${customer.lastName}`,
          shipping_address: {
            address1: shippingAddress.address1,
            city: shippingAddress.city,
            province: shippingAddress.state,
            country: shippingAddress.country,
            zip: shippingAddress.zip,
            phone: customer.phone
          },
          line_items: supplierOrders.Spocket.map(item => ({
            product_id: item.productId,
            variant_id: item.variantId,
            quantity: item.quantity
          }))
        }
      }
      
      const spocketResponse = await fetch('https://api.spocket.co/api/v2/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SPOCKET_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(spocketOrderData)
      })
      
      const spocketResult = await spocketResponse.json()
      orderResults.push({
        supplier: 'Spocket',
        success: spocketResponse.ok,
        orderId: spocketResult.order?.id,
        data: spocketResult
      })
    }
    
    const allSuccessful = orderResults.every(r => r.success)
    
    res.json({
      success: allSuccessful,
      orders: orderResults,
      totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })
  } catch (error) {
    console.error('[dropship] create order error:', error)
    res.status(500).json({ error: 'create_order_failed', message: error.message })
  }
})

// Track dropshipping order
app.get('/api/dropship/track-order/:supplier/:orderId', async (req, res) => {
  try {
    const { supplier, orderId } = req.params
    
    if (supplier === 'Printful' && PRINTFUL_API_KEY) {
      const response = await fetch(`https://api.printful.com/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`
        }
      })
      const data = await response.json()
      return res.json(data)
    }
    
    if (supplier === 'Spocket' && SPOCKET_API_KEY) {
      const response = await fetch(`https://api.spocket.co/api/v2/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${SPOCKET_API_KEY}`
        }
      })
      const data = await response.json()
      return res.json(data)
    }
    
    res.status(400).json({ error: 'invalid_supplier_or_not_configured' })
  } catch (error) {
    console.error('[dropship] track order error:', error)
    res.status(500).json({ error: 'track_order_failed' })
  }
})
