#!/usr/bin/env node
/**
 * Stripe session creation smoke test (test mode only).
 * Ensures backend endpoint responds and returns a session id or URL.
 * Usage: node scripts/stripe-test.js price_id_here
 */
const fetch = require('node-fetch')

async function main() {
  const priceId = process.argv[2] || process.env.TEST_PRICE_ID || ''
  if (!priceId) {
    console.error('Provide a test price ID as arg or TEST_PRICE_ID env.')
    process.exit(1)
  }
  const email = process.env.TEST_EMAIL || 'stripe-test@example.com'
  try {
    const resp = await fetch('http://localhost:5175/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, mode: 'subscription', userEmail: email })
    })
    const data = await resp.json()
    if (!resp.ok) {
      console.error('Non-OK response', data)
      process.exit(1)
    }
    if (data.id || data.url) {
      console.log('Session created:', data)
    } else {
      console.error('Unexpected session payload', data)
      process.exit(1)
    }
  } catch (e) {
    console.error('Request failed:', e)
    process.exit(1)
  }
}
main()