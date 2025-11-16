/**
 * Backend API Endpoints for Payment Processing
 * Implement these endpoints in your server (Node.js/Express example)
 */

const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const router = express.Router()

// Create Stripe Checkout Session
router.post('/payments/create-checkout-session', async (req, res) => {
  const { priceId, planId, successUrl, cancelUrl } = req.body
  const userId = req.user.id // from auth middleware
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      mode: priceId.includes('lifetime') ? 'payment' : 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        planId: planId,
        userId: userId
      }
    })
    
    res.json({ id: session.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Stripe Webhook (verify payment completion)
router.post('/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  
  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      // Activate user's subscription
      await activateSubscription(session.client_reference_id, session.metadata.planId)
      break
      
    case 'customer.subscription.deleted':
      // Handle cancellation
      await deactivateSubscription(event.data.object.id)
      break
  }
  
  res.json({ received: true })
})

// PayPal Create Subscription
router.post('/payments/paypal-create-subscription', async (req, res) => {
  const { planId } = req.body
  
  // Map your plan IDs to PayPal plan IDs
  const paypalPlanIds = {
    monthly: 'P-XXXXXXXXXXXXX',
    yearly: 'P-YYYYYYYYYYYYY'
  }
  
  res.json({ 
    paypalPlanId: paypalPlanIds[planId] 
  })
})

// Google Pay Payment Processing
router.post('/payments/process-google-pay', async (req, res) => {
  const { paymentToken, planId } = req.body
  const userId = req.user.id
  
  try {
    // Use Stripe to process Google Pay token
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: paymentToken
      }
    })
    
    // Create payment intent or subscription
    const plan = getPlanDetails(planId)
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.price * 100,
      currency: 'usd',
      payment_method: paymentMethod.id,
      confirm: true,
      metadata: {
        userId: userId,
        planId: planId
      }
    })
    
    if (paymentIntent.status === 'succeeded') {
      await activateSubscription(userId, planId)
      res.json({ 
        success: true, 
        transactionId: paymentIntent.id 
      })
    } else {
      res.json({ success: false })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Apple Pay Merchant Validation
router.post('/payments/apple-pay-validate', async (req, res) => {
  const { validationURL } = req.body
  
  // You need Apple merchant certificate
  const merchantSession = await validateAppleMerchant(validationURL)
  res.json(merchantSession)
})

// Apple Pay Payment Processing
router.post('/payments/process-apple-pay', async (req, res) => {
  const { paymentToken, planId } = req.body
  const userId = req.user.id
  
  // Similar to Google Pay processing
  // Use Stripe or your payment processor to handle Apple Pay token
  
  res.json({ 
    success: true, 
    transactionId: 'AP-' + Date.now() 
  })
})

// Confirm Payment (after successful payment)
router.post('/payments/confirm-payment', async (req, res) => {
  const { provider, planId, subscriptionId, transactionId } = req.body
  const userId = req.user.id
  
  try {
    // Update database
    await db.users.update({
      where: { id: userId },
      data: {
        premium: true,
        plan: planId,
        subscriptionId: subscriptionId || transactionId,
        paymentProvider: provider,
        subscriptionStartDate: new Date()
      }
    })
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Cancel Subscription
router.post('/payments/cancel-subscription', async (req, res) => {
  const { subscriptionId } = req.body
  const userId = req.user.id
  
  try {
    // Cancel with Stripe
    await stripe.subscriptions.cancel(subscriptionId)
    
    // Update database
    await db.users.update({
      where: { id: userId },
      data: {
        premium: false,
        plan: 'free',
        subscriptionId: null,
        subscriptionEndDate: new Date()
      }
    })
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Subscription Status
router.get('/payments/subscription-status', async (req, res) => {
  const userId = req.user.id
  
  const user = await db.users.findUnique({
    where: { id: userId },
    select: {
      premium: true,
      plan: true,
      subscriptionId: true,
      subscriptionStartDate: true,
      subscriptionEndDate: true
    }
  })
  
  res.json(user)
})

// Verify Session (for success page)
router.get('/payments/verify-session/:sessionId', async (req, res) => {
  const { sessionId } = req.params
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    res.json({
      success: true,
      planName: session.metadata.planId,
      amount: (session.amount_total / 100).toFixed(2),
      transactionId: session.payment_intent
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Helper functions
async function activateSubscription(userId, planId) {
  await db.users.update({
    where: { id: userId },
    data: {
      premium: true,
      plan: planId,
      subscriptionStartDate: new Date()
    }
  })
}

async function deactivateSubscription(subscriptionId) {
  await db.users.update({
    where: { subscriptionId: subscriptionId },
    data: {
      premium: false,
      plan: 'free',
      subscriptionEndDate: new Date()
    }
  })
}

function getPlanDetails(planId) {
  const plans = {
    monthly: { price: 9.99, interval: 'month' },
    yearly: { price: 99.99, interval: 'year' },
    lifetime: { price: 299.99, interval: 'once' }
  }
  return plans[planId]
}

module.exports = router
