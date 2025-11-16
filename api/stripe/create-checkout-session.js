export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }
  try {
    const { cart = [], successUrl = `${req.headers.origin || 'http://localhost:5173'}/?checkout_success=1`, cancelUrl = `${req.headers.origin || 'http://localhost:5173'}/?checkout_cancel=1` } = req.body || {}

    const secret = process.env.STRIPE_SECRET_KEY
    let stripe = null
    if (secret) {
      // Dynamically import Stripe to avoid bundling if not configured
      const stripeLib = await import('stripe')
      stripe = new stripeLib.default(secret)
    }

    // Server-side authoritative catalog (minimal)
    const PRODUCT_CATALOG = {
      8: { name: 'Ernie Ball Strings (3-Pack)', unit_amount: 1999 },
      10: { name: 'Gator Hardshell Case', unit_amount: 14999 }
      // Add more server-priced items as needed
    }

    // Build line items from server catalog only (ignore client prices)
    const line_items = []
    for (const item of cart) {
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

    if (!stripe || line_items.length === 0) {
      // Dev fallback or empty cart
      return res.status(200).json({ url: 'https://example.com/checkout/dev-success' })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl
    })

    return res.status(200).json({ id: session.id, url: session.url })
  } catch (e) {
    console.error('[api] stripe create session error', e)
    return res.status(500).json({ error: 'stripe_session_error' })
  }
}
