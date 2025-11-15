// Minimal backend placeholder for FretPilot
// NOTE: This is a stub; replace with real implementations and authentication.

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5175
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
let stripe = null
if (STRIPE_SECRET_KEY) {
  try { stripe = require('stripe')(STRIPE_SECRET_KEY) } catch (e) { stripe = null }
}

app.use(express.json({ limit: '10mb' }))
app.use(cors())

app.get('/api/health', (req, res) => res.json({ ok: true }))

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

// Create Stripe Checkout Session (test mode if key present)
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { lineItems = [], successUrl = 'http://localhost:5173/?checkout_success=1', cancelUrl = 'http://localhost:5173/?checkout_cancel=1' } = req.body || {}
    if (!stripe) {
      return res.json({ url: 'https://example.com/checkout/dev-success' })
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
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

// Basic email send stub
app.post('/api/email/send', (req, res) => {
  // eslint-disable-next-line no-console
  console.log('[email] send', req.body)
  res.json({ ok: true })
})

// Vendor purchase order stub
app.post('/api/vendor/po', (req, res) => {
  // eslint-disable-next-line no-console
  console.log('[vendor] PO', req.body)
  res.json({ ok: true })
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
        // Store subscription info in database
        console.log('[webhook] subscription created:', {
          customerId: session.customer,
          subscriptionId: session.subscription,
          tier: session.metadata.tier
        })
        // TODO: Save to database, send welcome email
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
