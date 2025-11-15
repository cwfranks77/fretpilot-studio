// featureFlags.js
// Simple gating and credits using localStorage.

const KEY = 'fretpilot-flags'
const DAILY_LIMIT = 3

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function write(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch {}
}

export function isPremium() {
  const f = read()
  if (f['premium-dev'] === true) return true
  return f.premium === true
}

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
