// featureFlags.js
// Simple gating and credits using localStorage.

const KEY = 'fretpilot-flags'
const DAILY_LIMIT = 3

// Whitelist of emails that get free premium access (for testing / invites)
// 1. Hard-coded base whitelist (always active)
const BASE_PREMIUM_WHITELIST = [
  'cwfranks77@gmail.com',
]

// 2. Build-time environment whitelist (comma separated)
//    Add a line to your .env or .env.production: VITE_PREMIUM_WHITELIST=friend@example.com,another@domain.com
let ENV_PREMIUM_WHITELIST = []
try {
  const raw = (import.meta.env && import.meta.env.VITE_PREMIUM_WHITELIST) || ''
  ENV_PREMIUM_WHITELIST = raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
} catch(_) { ENV_PREMIUM_WHITELIST = [] }

// 3. Runtime dynamic whitelist (optional). If you host a JSON at /premium-whitelist.json
//    with: { "emails": ["tester@site.com", "vip@domain.com"] } it will be merged once per session.
let RUNTIME_PREMIUM_WHITELIST = []
let RUNTIME_PREMIUM_BLOCKLIST = []
let _runtimeLoadedOnce = false
const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes polling so you can revoke remotely

async function refreshRuntimeLists() {
  try {
    const w = await fetch('/premium-whitelist.json', { cache: 'no-store' })
    if (w.ok) {
      const data = await w.json()
      if (Array.isArray(data.emails)) {
        RUNTIME_PREMIUM_WHITELIST = data.emails.map(e => String(e).trim().toLowerCase()).filter(Boolean)
      }
    }
  } catch(_) { /* ignore */ }
  try {
    const b = await fetch('/premium-blocklist.json', { cache: 'no-store' })
    if (b.ok) {
      const data = await b.json()
      if (Array.isArray(data.emails)) {
        RUNTIME_PREMIUM_BLOCKLIST = data.emails.map(e => String(e).trim().toLowerCase()).filter(Boolean)
      }
    }
  } catch(_) { /* ignore */ }
  _runtimeLoadedOnce = true
}

refreshRuntimeLists()
setInterval(refreshRuntimeLists, REFRESH_INTERVAL_MS)

// 4. Invite codes via query param (?unlock=<CODE>)
//    Unlimited: Set VITE_PREMIUM_INVITE_CODE=yourSecretCode and share https://fretpilotstudio.com/?unlock=yourSecretCode
//    Limited (claimed via backend): Set VITE_LIMITED_INVITE_CODE=foundersClub10 and share same pattern. Frontend will
//    store a pending claim until user provides email, then call /api/invite/claim.
let INVITE_CODE = ''
let LIMITED_INVITE_CODE = ''
try { INVITE_CODE = (import.meta.env && import.meta.env.VITE_PREMIUM_INVITE_CODE) || '' } catch(_) {}
try { LIMITED_INVITE_CODE = (import.meta.env && import.meta.env.VITE_LIMITED_INVITE_CODE) || '' } catch(_) {}
try {
  const params = new URLSearchParams(location.search)
  const provided = params.get('unlock')
  if (provided) {
    if (INVITE_CODE && provided === INVITE_CODE) {
      // Soft flag for unlimited invite link
      const f = read(); f['invite-granted'] = true; write(f)
    } else if (LIMITED_INVITE_CODE && provided === LIMITED_INVITE_CODE) {
      // Record pending limited invite claim (will claim when email known)
      const f = read(); f['pending-limited-invite'] = LIMITED_INVITE_CODE; write(f)
    }
  }
} catch(_) {}

function combinedWhitelist() {
  return [...BASE_PREMIUM_WHITELIST, ...ENV_PREMIUM_WHITELIST, ...RUNTIME_PREMIUM_WHITELIST]
}

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function write(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch {}
}

export function isPremium() {
  const f = read()
  // Permanent developer override (manual) always wins.
  if (f['premium-dev'] === true) return true
  // Limited invite claimed via backend
  if (f['limited-invite-granted'] === true) {
    const userEmail = (f.userEmail||'').toLowerCase()
    if (userEmail && !RUNTIME_PREMIUM_BLOCKLIST.includes(userEmail)) {
      return true
    }
  }
  
  // Check whitelist (for testing / invited users without payment)
  const userEmail = f.userEmail || ''
  if (userEmail) {
    const lower = userEmail.toLowerCase()
    // Blocklist takes precedence to allow remote revocation.
    if (RUNTIME_PREMIUM_BLOCKLIST.includes(lower)) {
      return false
    }
    if (combinedWhitelist().includes(lower)) {
      return true
    }
  }

  // Invite link grant: only active if not later blocklisted.
  if (f['invite-granted'] && userEmail && !RUNTIME_PREMIUM_BLOCKLIST.includes(userEmail.toLowerCase())) {
    return true
  }
  
  return f.premium === true
}

export function setUserEmail(email) {
  const f = read()
  f.userEmail = email
  // Attempt limited invite claim if pending and not yet granted
  if (f['pending-limited-invite'] && !f['limited-invite-granted']) {
    const code = f['pending-limited-invite']
    fetch('/api/invite/claim', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, email })
    }).then(r => r.json()).then(res => {
      if (res && res.granted) {
        const f2 = read(); f2['limited-invite-granted'] = true; write(f2)
      } else if (res && (res.error === 'limit_reached' || res.error === 'inactive')) {
        const f2 = read(); delete f2['pending-limited-invite']; write(f2)
      }
    }).catch(() => { /* silent */ })
  }
  write(f)
}

// Manual grant helper (e.g. run from console): window.fretpilotGrantPremiumEmail('friend@example.com')
try {
  window.fretpilotGrantPremiumEmail = (email) => {
    const f = read(); f.userEmail = email; f.premium = true; write(f); return true
  }
} catch(_) {}

export function setPremium(v=true) {
  const f = read(); f.premium = !!v; write(f)
}

export function enableDevPremium(v=true) {
  const f = read(); f['premium-dev'] = !!v; write(f)
}

export function getDailyLessonRemaining() {
  const f = read()
  const today = new Date().toISOString().slice(0,10)
  if (f.day !== today) { f.day = today; f.used = 0; write(f) }
  const credits = Number(f.rewardCredits || 0)
  const remaining = Math.max(0, DAILY_LIMIT - (f.used||0)) + credits
  return remaining
}

export function consumeLessonSlot() {
  const f = read()
  const today = new Date().toISOString().slice(0,10)
  if (f.day !== today) { f.day = today; f.used = 0 }
  if ((f.rewardCredits||0) > 0) { f.rewardCredits -= 1 } else { f.used = (f.used||0) + 1 }
  write(f)
}

export function addRewardCredit(n=1) {
  const f = read(); f.rewardCredits = (f.rewardCredits||0) + n; write(f)
}
