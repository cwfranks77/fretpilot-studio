// Bitcoin Payment Service for FretPilot Studio
// Real Bitcoin wallet address for receiving payments

// Your Bitcoin wallet address
const BITCOIN_WALLET_ADDRESS = 'bc1qdez0rwz2sg0j87w59ewzdvz2rxp6v0wurrz966m'

// Bitcoin amounts for each plan (approximate USD equivalents)
const PLAN_AMOUNTS = {
  monthly: 0.00012,   // ~$9.99 at ~$85,000/BTC
  yearly: 0.00118,    // ~$99.99
  lifetime: 0.00059   // ~$49.99
}

// Store pending payments locally
const pendingPayments = new Map()

/**
 * Create a Bitcoin payment request
 * @param {string} plan - 'monthly', 'yearly', or 'lifetime'
 * @returns {Object} Payment details including address and amount
 */
export async function createBitcoinPayment(plan) {
  const paymentId = 'btc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  const amount = PLAN_AMOUNTS[plan] || PLAN_AMOUNTS.lifetime
  
  const payment = {
    id: paymentId,
    plan: plan,
    amount: amount,
    address: BITCOIN_WALLET_ADDRESS,
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
  
  // Store locally for tracking
  pendingPayments.set(paymentId, payment)
  
  // Also store in localStorage for persistence
  try {
    const stored = JSON.parse(localStorage.getItem('fp_btc_payments') || '[]')
    stored.push(payment)
    localStorage.setItem('fp_btc_payments', JSON.stringify(stored))
  } catch (e) {
    console.warn('Failed to store payment:', e)
  }
  
  return payment
}

/**
 * Check if a payment has been confirmed
 * Note: In a production app, this would check the blockchain or a payment processor
 * @param {string} paymentId - The payment ID to check
 * @returns {Object} Payment status
 */
export async function checkPaymentStatus(paymentId) {
  const payment = pendingPayments.get(paymentId)
  
  // In a real implementation, this would:
  // 1. Query a blockchain API (e.g., Blockstream, Blockchain.com API)
  // 2. Check for incoming transactions to the wallet address
  // 3. Verify the amount matches the expected payment
  
  // For now, return pending status
  // The user should manually verify payment and contact support if needed
  return {
    confirmed: false,
    payment: payment,
    message: 'Payment verification is manual. Please allow 10-30 minutes for blockchain confirmation, then contact support@fretpilotstudio.com with your payment ID.'
  }
}

/**
 * Start monitoring for payment confirmation
 * @param {Function} callback - Called when payment is confirmed
 * @returns {number} Interval ID for stopping monitoring
 */
export function startPaymentMonitoring(callback) {
  // In production, this would poll a blockchain API
  // For now, it's a placeholder that checks every 30 seconds
  return setInterval(() => {
    // Check all pending payments
    pendingPayments.forEach((payment, id) => {
      // In production: check blockchain for confirmation
      // callback(payment) when confirmed
    })
  }, 30000)
}

/**
 * Stop payment monitoring
 * @param {number} intervalId - The interval ID returned by startPaymentMonitoring
 */
export function stopPaymentMonitoring(intervalId) {
  if (intervalId) {
    clearInterval(intervalId)
  }
}

/**
 * Generate a QR code URL for the Bitcoin payment
 * Uses a public QR code API
 * @param {string} address - Bitcoin address
 * @param {number} amount - BTC amount
 * @returns {string} QR code image URL
 */
export function getPaymentQRCode(address, amount) {
  // Create a Bitcoin URI for better wallet compatibility
  const bitcoinUri = `bitcoin:${address}?amount=${amount}`
  
  // Use QR Server API (free, no API key needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bitcoinUri)}`
  
  return qrUrl
}

/**
 * Get all pending payments for the current user
 * @returns {Array} List of pending payments
 */
export function getPendingPayments() {
  try {
    return JSON.parse(localStorage.getItem('fp_btc_payments') || '[]')
  } catch (e) {
    return []
  }
}

/**
 * Manually confirm a payment (for admin use or after verification)
 * @param {string} paymentId - The payment ID to confirm
 */
export function confirmPayment(paymentId) {
  const payment = pendingPayments.get(paymentId)
  if (payment) {
    payment.status = 'confirmed'
    payment.confirmedAt = new Date().toISOString()
    pendingPayments.set(paymentId, payment)
    
    // Update localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('fp_btc_payments') || '[]')
      const updated = stored.map(p => p.id === paymentId ? { ...p, status: 'confirmed' } : p)
      localStorage.setItem('fp_btc_payments', JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to update payment:', e)
    }
    
    return true
  }
  return false
}

// Export the wallet address for display purposes
export const WALLET_ADDRESS = BITCOIN_WALLET_ADDRESS
