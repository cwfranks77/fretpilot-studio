export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }
  
  try {
    const { 
      priceId, 
      mode = 'subscription', 
      amount, 
      productName = 'Purchase',
      cart = [], 
      successUrl = `${req.headers.origin || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`, 
      cancelUrl = `${req.headers.origin || 'http://localhost:5173'}/?checkout_cancel=1` 
    } = req.body || {}

    const secret = process.env.STRIPE_SECRET_KEY
    let stripe = null
    
    if (secret && !secret.includes('your_')) {
      const stripeLib = await import('stripe')
      stripe = new stripeLib.default(secret)
    }

    // Handle subscription checkout
    if (mode === 'subscription' && priceId) {
      if (!stripe) {
        return res.status(200).json({ 
          url: successUrl,
          devMode: true,
          message: 'Stripe not configured - development mode' 
        })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        billing_address_collection: 'auto',
        allow_promotion_codes: true
      })

      return res.status(200).json({ id: session.id, url: session.url })
    }

    // Handle one-time payment
    if (mode === 'payment' && amount) {
      if (!stripe) {
        return res.status(200).json({ 
          url: successUrl,
          devMode: true,
          message: 'Stripe not configured - development mode' 
        })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName
            },
            unit_amount: Math.round(amount * 100) // Convert to cents
          },
          quantity: 1
        }],
        success_url: successUrl,
        cancel_url: cancelUrl
      })

      return res.status(200).json({ id: session.id, url: session.url })
    }

    // Handle marketplace cart checkout (The Franks Standard)
    if (cart && cart.length > 0) {
      // Server-side authoritative catalog
      const PRODUCT_CATALOG = {
        8: { name: 'Ernie Ball Strings (3-Pack)', unit_amount: 1999 },
        10: { name: 'Gator Hardshell Case', unit_amount: 14999 },
        // Add more products as needed
      }

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
        return res.status(200).json({ 
          url: successUrl,
          devMode: true,
          message: 'Development mode or empty cart'
        })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items,
        success_url: successUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA']
        }
      })

      return res.status(200).json({ id: session.id, url: session.url })
    }

    return res.status(400).json({ error: 'invalid_request' })
    
  } catch (e) {
    console.error('[api] stripe create session error', e)
    return res.status(500).json({ error: 'stripe_session_error', message: e.message })
  }
}
