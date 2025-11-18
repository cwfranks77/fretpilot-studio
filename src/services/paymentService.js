/**
 * Payment Service - Multi-platform payment integration
 * Supports: Stripe, PayPal, Google Pay, Apple Pay
 */

// Payment configuration
const PAYMENT_CONFIG = {
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key',
    enabled: true
  },
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'your_paypal_client_id',
    enabled: true
  },
  googlePay: {
    merchantId: import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID || 'your_merchant_id',
    enabled: true
  },
  applePay: {
    merchantId: import.meta.env.VITE_APPLE_PAY_MERCHANT_ID || 'your_merchant_id',
    enabled: true
  }
}

// Pricing plans
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    features: [
      '5 AI lessons per day',
      'Basic chord library',
      'Metronome & tuner',
      'Limited video lessons',
      'Ads supported'
    ],
    limits: {
      aiLessons: 5,
      videoLessons: 10,
      practiceHistory: 7 // days
    }
  },
  monthly: {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'price_monthly_premium',
    features: [
      'Unlimited AI lessons',
      'Full video library access',
      'Interactive practice mode',
      'Multiplayer jam sessions',
      'Progress analytics',
      'No ads',
      'Priority support'
    ],
    limits: {
      aiLessons: -1, // unlimited
      videoLessons: -1,
      practiceHistory: -1
    }
  },
  yearly: {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 99.99,
    interval: 'year',
    stripePriceId: 'price_yearly_premium',
    savings: '17% off',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Exclusive masterclasses',
      'Guitar gear discounts',
      'Early access to features'
    ],
    limits: {
      aiLessons: -1,
      videoLessons: -1,
      practiceHistory: -1
    }
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: 299.99,
    interval: 'once',
    stripePriceId: 'price_lifetime_premium',
    badge: 'Best Value',
    features: [
      'All Premium features forever',
      'Lifetime updates',
      'VIP community access',
      'Personalized coaching sessions',
      'Certificate courses',
      'Hardware bundle discount (50%)'
    ],
    limits: {
      aiLessons: -1,
      videoLessons: -1,
      practiceHistory: -1
    }
  }
}

// Stripe integration
let stripeInstance = null

export async function initStripe() {
  if (!PAYMENT_CONFIG.stripe.enabled) return null
  
  try {
    if (!window.Stripe) {
      // Load Stripe.js dynamically
      await loadScript('https://js.stripe.com/v3/')
    }
    
    stripeInstance = window.Stripe(PAYMENT_CONFIG.stripe.publicKey)
    return stripeInstance
  } catch (error) {
    console.error('Failed to initialize Stripe:', error)
    return null
  }
}

export async function createStripeCheckout(planId) {
  const stripe = await initStripe()
  if (!stripe) throw new Error('Stripe not available')
  
  const plan = PRICING_PLANS[planId]
  if (!plan || !plan.stripePriceId) throw new Error('Invalid plan')
  
  try {
    // Call your backend to create checkout session
    // Use server endpoint that creates a secure Stripe Checkout Session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        cart: [{ id: planId, quantity: 1 }],
        // success/cancel URLs handled server-side with fallbacks
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-cancelled`
      })
    })
    
    const session = await response.json()
    if (session && session.url) {
      // Server may return a direct URL (dev fallback or Stripe session URL)
      window.location.href = session.url
      return
    }
    if (session && session.id) {
      // Redirect to Stripe Checkout via JS
      const result = await stripe.redirectToCheckout({ sessionId: session.id })
      if (result.error) throw new Error(result.error.message)
      return
    }
    throw new Error('Invalid checkout session response')
  } catch (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}

// PayPal integration
let paypalLoaded = false

export async function initPayPal() {
  if (!PAYMENT_CONFIG.paypal.enabled) return false
  
  try {
    if (!paypalLoaded) {
      await loadScript(
        `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.paypal.clientId}&currency=USD&intent=subscription`
      )
      paypalLoaded = true
    }
    return true
  } catch (error) {
    console.error('Failed to initialize PayPal:', error)
    return false
  }
}

export function renderPayPalButton(elementId, planId) {
  const plan = PRICING_PLANS[planId]
  if (!plan) throw new Error('Invalid plan')
  
  return initPayPal().then(() => {
    if (!window.paypal) throw new Error('PayPal SDK not loaded')
    
    const buttons = window.paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe'
      },
      
      createSubscription: async (data, actions) => {
        // Call your backend to create subscription plan
        const response = await fetch('/api/payments/paypal-create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ planId })
        })
        
        const subscriptionData = await response.json()
        
        return actions.subscription.create({
          plan_id: subscriptionData.paypalPlanId
        })
      },
      
      onApprove: async (data, actions) => {
        // Subscription created successfully
        await handlePaymentSuccess({
          provider: 'paypal',
          subscriptionId: data.subscriptionID,
          planId: planId
        })
      },
      
      onError: (err) => {
        console.error('PayPal error:', err)
        alert('Payment failed. Please try again.')
      }
    })
    
    buttons.render(`#${elementId}`)
  })
}

// Google Pay integration
let googlePayClient = null

export async function initGooglePay() {
  if (!PAYMENT_CONFIG.googlePay.enabled) return null
  
  try {
    if (!window.google || !window.google.payments) {
      await loadScript('https://pay.google.com/gp/p/js/pay.js')
    }
    
    googlePayClient = new google.payments.api.PaymentsClient({
      environment: 'TEST' // Change to 'PRODUCTION' for live
    })
    
    return googlePayClient
  } catch (error) {
    console.error('Failed to initialize Google Pay:', error)
    return null
  }
}

export async function requestGooglePayPayment(planId) {
  const client = await initGooglePay()
  if (!client) throw new Error('Google Pay not available')
  
  const plan = PRICING_PLANS[planId]
  
  const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'stripe',
          'stripe:version': '2018-10-31',
          'stripe:publishableKey': PAYMENT_CONFIG.stripe.publicKey
        }
      }
    }],
    merchantInfo: {
      merchantId: PAYMENT_CONFIG.googlePay.merchantId,
      merchantName: 'FretPilot Studio & School'
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: plan.price.toString(),
      currencyCode: 'USD',
      countryCode: 'US'
    }
  }
  
  try {
    const paymentData = await client.loadPaymentData(paymentDataRequest)
    
    // Process payment token with your backend
    const response = await fetch('/api/payments/process-google-pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        paymentToken: paymentData.paymentMethodData.tokenizationData.token,
        planId: planId
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      await handlePaymentSuccess({
        provider: 'google_pay',
        transactionId: result.transactionId,
        planId: planId
      })
    }
    
    return result
  } catch (error) {
    console.error('Google Pay error:', error)
    throw error
  }
}

// Apple Pay integration (requires HTTPS and Apple merchant registration)
export async function isApplePayAvailable() {
  if (!PAYMENT_CONFIG.applePay.enabled) return false
  
  if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
    return true
  }
  return false
}

export async function requestApplePayPayment(planId) {
  if (!await isApplePayAvailable()) {
    throw new Error('Apple Pay not available')
  }
  
  const plan = PRICING_PLANS[planId]
  
  const paymentRequest = {
    countryCode: 'US',
    currencyCode: 'USD',
    merchantCapabilities: ['supports3DS'],
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
    total: {
      label: `FretPilot ${plan.name}`,
      type: 'final',
      amount: plan.price.toString()
    }
  }
  
  const session = new ApplePaySession(3, paymentRequest)
  
  session.onvalidatemerchant = async (event) => {
    // Validate with your server
    const response = await fetch('/api/payments/apple-pay-validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        validationURL: event.validationURL
      })
    })
    
    const merchantSession = await response.json()
    session.completeMerchantValidation(merchantSession)
  }
  
  session.onpaymentauthorized = async (event) => {
    const payment = event.payment
    
    try {
      // Process payment with your backend
      const response = await fetch('/api/payments/process-apple-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          paymentToken: payment.token,
          planId: planId
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        session.completePayment(ApplePaySession.STATUS_SUCCESS)
        await handlePaymentSuccess({
          provider: 'apple_pay',
          transactionId: result.transactionId,
          planId: planId
        })
      } else {
        session.completePayment(ApplePaySession.STATUS_FAILURE)
      }
    } catch (error) {
      session.completePayment(ApplePaySession.STATUS_FAILURE)
      throw error
    }
  }
  
  session.begin()
}

// Payment success handler
async function handlePaymentSuccess(paymentData) {
  const { provider, planId, subscriptionId, transactionId } = paymentData
  
  try {
    // Update user's subscription status
    const response = await fetch('/api/payments/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        provider,
        planId,
        subscriptionId,
        transactionId
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Update local storage
      const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}')
      auth.premium = true
      auth.plan = planId
      auth.subscriptionId = subscriptionId || transactionId
      localStorage.setItem('fretpilot-auth', JSON.stringify(auth))
      
      // Reload to apply premium features
      window.location.href = '/payment-success'
    }
    
    return result
  } catch (error) {
    console.error('Payment confirmation error:', error)
    throw error
  }
}

// Utility functions
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function getAuthToken() {
  const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}')
  return auth.token || ''
}

// Subscription management
export async function cancelSubscription() {
  try {
    const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}')
    
    const response = await fetch('/api/payments/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        subscriptionId: auth.subscriptionId
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      auth.premium = false
      auth.plan = 'free'
      delete auth.subscriptionId
      localStorage.setItem('fretpilot-auth', JSON.stringify(auth))
    }
    
    return result
  } catch (error) {
    console.error('Cancel subscription error:', error)
    throw error
  }
}

export async function getSubscriptionStatus() {
  try {
    const response = await fetch('/api/payments/subscription-status', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })
    
    return await response.json()
  } catch (error) {
    console.error('Get subscription status error:', error)
    return null
  }
}

export function getCurrentPlan() {
  const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}')
  return PRICING_PLANS[auth.plan || 'free']
}
