#!/usr/bin/env node
/*
Verify DNS A records and HTTPS reachability for a domain (and www subdomain).
Usage:
  node scripts/dns-verify.js fretpilotstudio.com --www --expected 76.76.21.21 --wait 1800 --interval 15
*/
const dns = require('dns').promises
const https = require('https')

const args = process.argv.slice(2)
const domain = args[0]
if (!domain) { console.error('Usage: node scripts/dns-verify.js <domain> [--www] [--expected 76.76.21.21] [--wait 1800] [--interval 15]'); process.exit(1) }

const opts = {
  www: args.includes('--www'),
  expected: '76.76.21.21',
  wait: 1800,
  interval: 15,
}
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--expected') opts.expected = args[++i]
  if (args[i] === '--wait') opts.wait = parseInt(args[++i],10)
  if (args[i] === '--interval') opts.interval = parseInt(args[++i],10)
}

const targets = [domain]
if (opts.www) targets.push('www.' + domain)

async function resolveA(host) {
  try { const a = await dns.resolve4(host); return a } catch { return [] }
}

function head(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => resolve(true))
    req.on('error', () => resolve(false))
    req.setTimeout(5000, () => { req.destroy(); resolve(false) })
    req.end()
  })
}

(async () => {
  console.log(`\n🔎 Waiting for DNS A record -> ${opts.expected}`)
  const start = Date.now()
  let allOk = false
  while ((Date.now() - start) / 1000 < opts.wait) {
    allOk = true
    for (const t of targets) {
      const ips = await resolveA(t)
      const ok = ips.includes(opts.expected)
      console.log(`${t.padEnd(28)} ${ok ? '✅' : '❌'} ${ips.length ? ips.join(', ') : '(no A record)'}`)
      if (!ok) allOk = false
    }
    if (allOk) break
    await new Promise(r => setTimeout(r, opts.interval * 1000))
  }
  if (!allOk) { console.error('\n❌ DNS did not resolve within timeout'); process.exit(1) }

  console.log('\n🌐 Testing HTTPS reachability')
  let httpOk = true
  for (const t of targets) {
    const ok = await head('https://' + t)
    console.log(`${('https://' + t).padEnd(28)} ${ok ? '✅' : '❌'}`)
    if (!ok) httpOk = false
  }
  if (!httpOk) { console.log('\n⚠️ DNS ready, SSL may still be issuing. Try again shortly.'); process.exit(2) }
  console.log('\n✅ DNS and HTTPS look good!')
  process.exit(0)
})()
