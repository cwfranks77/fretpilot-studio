#!/usr/bin/env node
/**
 * Simple backend smoke test to verify core endpoints respond.
 * Run: node scripts/smoke-test.js
 */
const fetch = require('node-fetch')
const base = process.env.API_BASE || process.env.VITE_API_BASE || 'http://localhost:5175'

const endpoints = [
  { path: '/api/health', expect: r => r.ok === true },
  { path: '/api/stripe/create-checkout-session', method: 'POST', body: { cart: [{ id: 8, quantity: 1 }] }, expect: r => r.url },
  { path: '/api/bitcoin/create-invoice', method: 'POST', body: { paymentId: 'smoke_' + Date.now(), plan: 'monthly', amount: 9.99 }, expect: r => r.invoiceId },
  { path: '/api/dropship/products', expect: r => r.products !== undefined },
]

;(async () => {
  console.log(`\n🚦 Smoke testing backend at ${base}`)
  let pass = 0
  for (const e of endpoints) {
    const url = base + e.path
    try {
      const res = await fetch(url, {
        method: e.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: e.body ? JSON.stringify(e.body) : undefined
      })
      const json = await res.json().catch(() => ({}))
      const ok = res.ok && e.expect(json)
      console.log(`${ok ? '✅' : '❌'} ${e.path} -> status ${res.status}`)
      if (!ok) {
        console.log('   Response:', json)
      } else pass++
    } catch (err) {
      console.log(`❌ ${e.path} error`, err.message)
    }
  }
  console.log(`\nPassed ${pass}/${endpoints.length} endpoint checks`)
  process.exit(pass === endpoints.length ? 0 : 1)
})()
