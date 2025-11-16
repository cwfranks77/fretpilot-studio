#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function exists(p) { try { fs.accessSync(p); return true } catch { return false } }
function read(p) { try { return fs.readFileSync(p, 'utf8') } catch { return '' } }
function json(p) { try { return JSON.parse(read(p)) } catch { return null } }

const root = process.cwd()
const results = []

function check(name, ok, details='') {
  results.push({ name, ok, details })
}

// 1) package.json sanity
const pkg = json(path.join(root, 'package.json'))
check('package.json present', !!pkg)
if (pkg) {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  check('Capacitor Android dependency', !!deps['@capacitor/android'])
  check('Electron Builder configured', !!deps['electron-builder'])
  check('Cordova Purchase plugin installed', !!deps['cordova-plugin-purchase'])
  check('Vite configured', !!deps['vite'])
  check('Build config present in package.json', !!pkg.build)
}

// 2) Android manifest billing permission
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml')
const manifest = read(manifestPath)
check('AndroidManifest.xml exists', !!manifest)
if (manifest) {
  check('Billing permission present', /com\.android\.vending\.BILLING/.test(manifest))
}

// 3) iOS Podfile exists
const podfilePath = path.join(root, 'ios', 'App', 'Podfile')
check('iOS Podfile exists', exists(podfilePath))

// 4) Electron output directory
const electronOut = path.join(root, 'dist-electron')
check('Electron output directory exists (post-build)', exists(electronOut))

// 5) Server endpoints basic scan
const serverPath = path.join(root, 'server', 'index.js')
const serverCode = read(serverPath)
check('Backend server present', !!serverCode)
if (serverCode) {
  check('Health endpoint', /\/api\/health/.test(serverCode))
  check('Stripe checkout endpoint', /stripe\/create-checkout-session/.test(serverCode))
  check('BTCPay endpoints', /api\/bitcoin\//.test(serverCode))
  check('Dropship endpoints', /api\/dropship\//.test(serverCode))
}

// 6) Env example present
const envExample = path.join(root, '.env.example')
check('.env.example present', exists(envExample))
if (exists(envExample)) {
  const env = read(envExample)
  const required = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLIC_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'BTCPAY_SERVER_URL',
    'BTCPAY_STORE_ID',
    'BTCPAY_API_KEY',
    'BTCPAY_WEBHOOK_SECRET',
    'PRINTFUL_API_KEY',
    'SPOCKET_API_KEY',
    'APP_URL',
    'VITE_API_URL',
    'VITE_STRIPE_PUBLIC_KEY'
  ]
  required.forEach(k => check(`env contains ${k}`, env.includes(k)))
}

// 6b) Production env file presence
const envProd = path.join(root, '.env.production')
check('.env.production present', exists(envProd))

// 6c) CI workflow presence
const workflowPath = path.join(root, '.github', 'workflows', 'build-release.yml')
check('GitHub Actions release workflow present', exists(workflowPath))

// 6d) Release tagging script
const tagScript = path.join(root, 'tag-release.ps1')
check('Release tagging script present', exists(tagScript))

// 7) Android build outputs
const apkPath = path.join(root, 'android', 'app', 'build', 'outputs', 'apk', 'release')
const aabPath = path.join(root, 'android', 'app', 'build', 'outputs', 'bundle', 'release')
check('Android release APK exists', exists(apkPath))
check('Android release AAB exists', exists(aabPath))

// 8) Summarize
const okCount = results.filter(r => r.ok).length
const total = results.length

console.log('=== Preflight Check Summary ===')
results.forEach(r => console.log(`${r.ok ? '✅' : '❌'} ${r.name}${r.details ? ' - ' + r.details : ''}`))
console.log(`\nPassed ${okCount}/${total} checks`)

process.exit(okCount === total ? 0 : 1)
