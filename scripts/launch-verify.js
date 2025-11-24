#!/usr/bin/env node
/**
 * Launch Verification Script
 * Performs a series of readiness checks for production launch.
 * Run: node scripts/launch-verify.js --domain fretpilotstudio.com
 */
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

function log(title, status, detail='') {
  const ok = status ? 'OK' : 'FAIL'
  console.log(`${ok.padEnd(5)} | ${title}${detail? ' -> '+detail: ''}`)
}

async function checkDomain(domain) {
  const base = `https://${domain}`
  try {
    const resp = await fetch(base, { timeout: 10000 })
    log('HTTP root', resp.ok, `status=${resp.status}`)
    const html = await resp.text()
    log('SEO meta description', /meta name="description"/i.test(html))
    log('OpenGraph tags', /og:title/i.test(html) && /og:description/i.test(html))
  } catch (e) { log('HTTP root', false, e.message) }
  try {
    const v = await fetch(`${base}/version.json`, { timeout: 10000 })
    log('version.json reachable', v.ok, `status=${v.status}`)
    if (v.ok) {
      const data = await v.json().catch(()=>({}))
      log('version.json has build', !!data.build, JSON.stringify(data))
    }
  } catch (e) { log('version.json reachable', false, e.message) }
}

async function checkLocal() {
  // Prefer explicit LAUNCH_LOCAL_BASE (Express server) else fallback to Express default port 5175
  // Dev meta checks also attempt Vite dev server (5173) if reachable
  const expressBase = process.env.LAUNCH_LOCAL_BASE || `http://localhost:${process.env.PORT || 5175}`
  const devBase = 'http://localhost:5173'
  try {
    const h = await fetch(`${expressBase}/api/health`)
    log('Local /api/health', h.ok)
  } catch (e) { log('Local /api/health', false, e.message) }
  try {
    const email = process.env.LAUNCH_TEST_EMAIL || 'launch-test@example.com'
    const p = await fetch(`${expressBase}/api/premium/status?email=${encodeURIComponent(email)}`)
    log('Local premium status endpoint', p.ok)
  } catch (e) { log('Local premium status endpoint', false, e.message) }
  // Optional dev server HTML meta scan (non-fatal)
  try {
    const r = await fetch(devBase)
    const html = await r.text()
    const hasDesc = /meta name="description"/i.test(html)
    log('Dev meta description', hasDesc)
    const hasOG = /og:title/i.test(html) && /og:description/i.test(html)
    log('Dev OpenGraph tags', hasOG)
  } catch (_) { /* ignore */ }
}

async function main() {
  const domainArgIndex = process.argv.indexOf('--domain')
  const domain = domainArgIndex !== -1 ? process.argv[domainArgIndex+1] : null
  console.log('=== Launch Verification Start ===')
  if (domain) {
    await checkDomain(domain)
  } else {
    console.log('Skipping domain checks (pass --domain fretpilotstudio.com)')
  }
  await checkLocal()
  // Basic file presence checks
  const files = ['server/data/users.json', 'server/data/processed-sessions.json', 'PLAY_ASSETS/README.md']
  files.forEach(f => {
    const exists = fs.existsSync(path.join(process.cwd(), f))
    log(`File exists: ${f}`, exists)
  })
  console.log('=== Launch Verification Complete ===')
}

main()