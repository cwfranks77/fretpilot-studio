// Stripe payment service for FretPilot Premium subscriptions
// Uses Stripe Payment Links (no backend required)

// Stripe Payment Links - Direct checkout URLs (create these in Stripe Dashboard)
// These are pre-configured payment links that handle the entire checkout flow
export const STRIPE_PAYMENT_LINKS = {
  // Set these in Vercel environment variables
  monthly: import.meta.env.VITE_STRIPE_LINK_MONTHLY || '',
  yearly: import.meta.env.VITE_STRIPE_LINK_YEARLY || '',
  lifetime: import.meta.env.VITE_STRIPE_LINK_LIFETIME || ''
}

// Fallback prices for display (actual price comes from Stripe)
export const DISPLAY_PRICES = {
  monthly: '$9.99',
  yearly: '$99.99',
  lifetime: '$49.99'
}

/**
 * Redirect to Stripe Payment Link
 * @param {string} plan - 'monthly', 'yearly', or 'lifetime'
 * @param {string} userEmail - Optional user email for pre-fill
 */
export async function redirectToCheckout(plan, userEmail = '') {
  const paymentLink = STRIPE_PAYMENT_LINKS[plan]
  
  if (!paymentLink) {
    throw new Error(`Payment link not configured for plan: ${plan}. Please contact support@fretpilotstudio.com`)
  }

  // Build URL with optional email prefill
  const url = new URL(paymentLink)
  
  // Add prefilled email if provided
  if (userEmail) {
    url.searchParams.set('prefilled_email', userEmail)
  }
  
  // Add client reference for tracking
  const clientRef = `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('fp_pending_payment', JSON.stringify({
    plan,
    clientRef,
    timestamp: Date.now()
  }))
  url.searchParams.set('client_reference_id', clientRef)

  // Redirect to Stripe Payment Link
  window.location.href = url.toString()
}

/**
 * Check if Stripe payments are configured
 * @returns {boolean}
 */
export function isStripeConfigured() {
  return !!(STRIPE_PAYMENT_LINKS.monthly || STRIPE_PAYMENT_LINKS.yearly || STRIPE_PAYMENT_LINKS.lifetime)
}

/**
 * Handle successful payment return
 * Call this when user returns from Stripe with success
 */
export function handlePaymentSuccess() {
  const pending = localStorage.getItem('fp_pending_payment')
  if (pending) {
    try {
      const payment = JSON.parse(pending)
      console.log('[Stripe] Payment completed for plan:', payment.plan)
      localStorage.removeItem('fp_pending_payment')
      return payment
    } catch (e) {
      console.error('[Stripe] Error parsing pending payment:', e)
    }
  }
  return null
}
