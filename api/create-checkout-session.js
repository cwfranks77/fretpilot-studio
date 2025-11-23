// Vercel Serverless Function: Stripe Checkout Session
// Creates a subscription or payment session based on provided priceId.
// Expects env STRIPE_SECRET_KEY and the relevant price IDs already configured.

const stripeSecret = process.env.STRIPE_SECRET_KEY || ''
let stripe = null
if (stripeSecret) {
  try { stripe = require('stripe')(stripeSecret) } catch (_) { stripe = null }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }
  try {
    if (!stripe) {
      res.status(500).json({ error: 'stripe_not_configured' })
      return
    }
    const { priceId = '', mode = 'subscription', successUrl, cancelUrl } = req.body || {}
    if (!priceId) {
      res.status(400).json({ error: 'missing_priceId' })
      return
    }
    const allowed = [
      process.env.VITE_STRIPE_PRICE_MONTHLY,
      process.env.VITE_STRIPE_PRICE_YEARLY,
      process.env.VITE_STRIPE_PRICE_PRO,
      process.env.STRIPE_PRICE_MONTHLY,
      process.env.STRIPE_PRICE_YEARLY,
      process.env.STRIPE_PRICE_PRO
    ].filter(Boolean)
    if (allowed.length && !allowed.includes(priceId)) {
      res.status(400).json({ error: 'price_not_allowed' })
      return
    }
    const origin = req.headers.origin || `https://${req.headers.host}`
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: mode === 'subscription' ? { trial_period_days: 0 } : undefined,
      success_url: successUrl || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/pricing?cancelled=1`
    })
    res.json({ id: session.id })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[api/create-checkout-session] error', e)
    res.status(500).json({ error: 'stripe_session_error' })
  }
}
