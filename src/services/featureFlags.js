// Minimal feature flags and premium state helpers

// CREATOR EMAIL - Only this email can access developer mode
export const CREATOR_EMAIL = 'charles@thefranksstandard.com' // Change this to your email

// Tester access system - lifetime free access for beta testers
const TESTER_EMAILS = [
  // Add tester emails here - they get lifetime premium access
  // Example: 'tester@example.com',
]

// Tester signup token - secure token for tester signup links
// Generate a secure random token: Use a long random string
const TESTER_SIGNUP_TOKEN = 'fretpilot-beta-2025-tester-access-secure-token-xyz789' // Change this to a secure random string

// Maximum number of testers allowed
export const MAX_TESTERS = 100
const TESTER_COUNT_KEY = 'fp_tester_count'

// Developer/Creator mode - for the app creator only
const DEVELOPER_MODE_KEY = 'fp_developer_mode'

export function isPremium() {
  try {
    // Check if premium is set
    if (localStorage.getItem('fp_premium') === '1') return true
    
    // Check if developer mode is enabled
    if (localStorage.getItem(DEVELOPER_MODE_KEY) === '1') return true
    
    // Check if user is a tester
    const userEmail = localStorage.getItem('fretpilot-user-email') || ''
    if (userEmail && TESTER_EMAILS.includes(userEmail.toLowerCase())) {
      return true
    }
    
    // Check tester by ID (for users without email)
    const userId = localStorage.getItem('fretpilot-user-id') || ''
    const testerIds = JSON.parse(localStorage.getItem('fp_testers') || '[]')
    if (userId && testerIds.includes(userId)) {
      return true
    }
    
    return false
  } catch (_) { return false }
}

export function setPremium(v) {
  try { localStorage.setItem('fp_premium', v ? '1' : '0') } catch (_) {}
}

export function enableDeveloperMode() {
  try {
    // Allow creator email OR if already in dev mode (for convenience)
    const userEmail = localStorage.getItem('fretpilot-user-email') || ''
    const isCreatorEmail = userEmail.toLowerCase() === CREATOR_EMAIL.toLowerCase()
    const alreadyDevMode = localStorage.getItem(DEVELOPER_MODE_KEY) === '1'
    
    // Allow if creator email matches OR if already enabled (creator convenience)
    if (!isCreatorEmail && !alreadyDevMode) {
      console.warn('Developer mode access denied - creator email required')
      return false
    }
    
    localStorage.setItem(DEVELOPER_MODE_KEY, '1')
    localStorage.setItem('fp_premium', '1') // Also set premium for compatibility
    
    // Store creator email for future checks
    if (!userEmail) {
      localStorage.setItem('fretpilot-user-email', CREATOR_EMAIL)
    }
    
    return true
  } catch (_) { return false }
}

// Check if current user is the creator
export function isCreator() {
  try {
    const userEmail = localStorage.getItem('fretpilot-user-email') || ''
    // If developer mode is enabled, assume creator
    if (localStorage.getItem(DEVELOPER_MODE_KEY) === '1') {
      return true
    }
    return userEmail.toLowerCase() === CREATOR_EMAIL.toLowerCase()
  } catch (_) { return false }
}

// Quick enable function for creator (can be called from browser console)
export function quickEnableCreatorAccess() {
  try {
    localStorage.setItem('fretpilot-user-email', CREATOR_EMAIL)
    localStorage.setItem(DEVELOPER_MODE_KEY, '1')
    localStorage.setItem('fp_premium', '1')
    console.log('✅ Creator access enabled! Refresh the page.')
    return true
  } catch (_) { 
    console.error('Failed to enable creator access')
    return false 
  }
}

export function disableDeveloperMode() {
  try {
    localStorage.removeItem(DEVELOPER_MODE_KEY)
    // Don't remove premium if it was set legitimately
    return true
  } catch (_) { return false }
}

export function isDeveloperMode() {
  try {
    return localStorage.getItem(DEVELOPER_MODE_KEY) === '1'
  } catch (_) { return false }
}

// Get current tester count
export function getTesterCount() {
  try {
    const count = parseInt(localStorage.getItem(TESTER_COUNT_KEY) || '0', 10)
    return isNaN(count) ? 0 : count
  } catch (_) { return 0 }
}

// Check if tester signup is still available
export function isTesterSignupAvailable() {
  return getTesterCount() < MAX_TESTERS
}

// Add a tester by email or ID
export function addTester(identifier) {
  try {
    // Check if we've reached the limit
    const currentCount = getTesterCount()
    if (currentCount >= MAX_TESTERS) {
      console.warn('Tester limit reached. Cannot add more testers.')
      return false
    }

    let wasNewTester = false
    
    if (identifier.includes('@')) {
      // Email-based tester
      const testers = JSON.parse(localStorage.getItem('fp_testers_emails') || '[]')
      if (!testers.includes(identifier.toLowerCase())) {
        testers.push(identifier.toLowerCase())
        localStorage.setItem('fp_testers_emails', JSON.stringify(testers))
        wasNewTester = true
      }
    } else {
      // ID-based tester
      const testers = JSON.parse(localStorage.getItem('fp_testers') || '[]')
      if (!testers.includes(identifier)) {
        testers.push(identifier)
        localStorage.setItem('fp_testers', JSON.stringify(testers))
        wasNewTester = true
      }
    }
    
    // Increment count if this was a new tester
    if (wasNewTester) {
      const newCount = currentCount + 1
      localStorage.setItem(TESTER_COUNT_KEY, newCount.toString())
      console.log(`Tester added. Total testers: ${newCount}/${MAX_TESTERS}`)
    }
    
    return true
  } catch (_) { return false }
}

// Verify tester signup token and grant access
export function verifyTesterToken(token) {
  if (token !== TESTER_SIGNUP_TOKEN) {
    return false
  }
  // Also check if signup is still available
  return isTesterSignupAvailable()
}

// Get tester signup URL
export function getTesterSignupUrl() {
  const baseUrl = window.location.origin || 'https://fretpilotstudio.com'
  return `${baseUrl}/?tester_signup=${TESTER_SIGNUP_TOKEN}`
}

// Get list of testers
export function getTesters() {
  try {
    const emails = JSON.parse(localStorage.getItem('fp_testers_emails') || '[]')
    const ids = JSON.parse(localStorage.getItem('fp_testers') || '[]')
    return { emails, ids }
  } catch (_) { return { emails: [], ids: [] } }
}

// Check if current user is a tester
export function isTester() {
  try {
    const userEmail = localStorage.getItem('fretpilot-user-email') || ''
    const userId = localStorage.getItem('fretpilot-user-id') || ''
    const testerEmails = JSON.parse(localStorage.getItem('fp_testers_emails') || '[]')
    const testerIds = JSON.parse(localStorage.getItem('fp_testers') || '[]')
    
    return (userEmail && testerEmails.includes(userEmail.toLowerCase())) ||
           (userId && testerIds.includes(userId)) ||
           (userEmail && TESTER_EMAILS.includes(userEmail.toLowerCase()))
  } catch (_) { return false }
}

export function getDailyLessonRemaining() {
  // Simple placeholder quota
  return 3
}
