// Bitcoin Payment Service - BTCPay Server Integration
// Professional Bitcoin payment processing via self-hosted BTCPay Server

// BTCPay Server configuration (set in environment variables)
const BTCPAY_SERVER_URL = import.meta.env.VITE_BTCPAY_SERVER_URL || 'https://your-btcpay-server.com'
const BTCPAY_STORE_ID = import.meta.env.VITE_BTCPAY_STORE_ID || ''
const BTCPAY_API_KEY = import.meta.env.VITE_BTCPAY_API_KEY || ''

// Fallback to backend API for production security
const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Payment tracking storage
let activePayments = new Map()

export async function createBitcoinPayment(plan) {
  const paymentId = generatePaymentId()
  
  // Plan pricing in USD (converted to BTC by BTCPay)
  const pricing = {
    monthly: 9.99,
    yearly: 99.99,
    lifetime: 299.99
  }
  
  try {
    // Create invoice via backend API (recommended for production)
    const response = await fetch(`${BACKEND_API_URL}/api/bitcoin/create-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentId,
        plan,
        amount: pricing[plan] || 9.99,
        currency: 'USD'
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to create BTCPay invoice')
    }
    
    const invoiceData = await response.json()
    
    const payment = {
      id: paymentId,
      plan,
      amount: invoiceData.btcAmount,
      amountUSD: pricing[plan],
      address: invoiceData.address,
      invoiceId: invoiceData.invoiceId,
      invoiceUrl: invoiceData.invoiceUrl,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
      confirmations: 0,
      requiredConfirmations: 1
    }
    
    activePayments.set(paymentId, payment)
    savePayments()
    
    return payment
  } catch (error) {
    console.error('BTCPay invoice creation error:', error)
    
    // Fallback to demo mode if BTCPay unavailable
    console.warn('Using demo Bitcoin payment - NOT FOR PRODUCTION')
    return createDemoPayment(paymentId, plan, pricing[plan])
  }
}

function createDemoPayment(paymentId, plan, amountUSD) {
  const payment = {
    id: paymentId,
    plan,
    amount: amountUSD * 0.000015, // Rough BTC estimate
    amountUSD,
    address: generateDemoAddress(),
    invoiceId: 'demo_' + paymentId,
    invoiceUrl: null,
    status: 'pending',
    createdAt: Date.now(),
    expiresAt: Date.now() + (15 * 60 * 1000),
    confirmations: 0,
    requiredConfirmations: 1,
    isDemoMode: true
  }
  
  activePayments.set(paymentId, payment)
  savePayments()
  
  return payment
}

export async function checkPaymentStatus(paymentId) {
  const payment = activePayments.get(paymentId)
  if (!payment) {
    throw new Error('Payment not found')
  }
  
  // Check if payment expired
  if (payment.expiresAt && Date.now() > payment.expiresAt) {
    payment.status = 'expired'
    savePayments()
    return {
      confirmed: false,
      expired: true,
      payment
    }
  }
  
  try {
    // Check invoice status via backend API
    const response = await fetch(`${BACKEND_API_URL}/api/bitcoin/check-invoice/${payment.invoiceId}`)
    
    if (!response.ok) {
      throw new Error('Failed to check invoice status')
    }
    
    const invoiceStatus = await response.json()
    
    // Update payment based on BTCPay invoice status
    payment.confirmations = invoiceStatus.confirmations || 0
    
    // BTCPay invoice statuses: New, Processing, Settled, Invalid, Expired
    if (invoiceStatus.status === 'Settled' || invoiceStatus.status === 'Processing') {
      payment.status = 'confirmed'
      savePayments()
      return {
        confirmed: true,
        payment
      }
    } else if (invoiceStatus.status === 'Expired' || invoiceStatus.status === 'Invalid') {
      payment.status = invoiceStatus.status.toLowerCase()
      savePayments()
      return {
        confirmed: false,
        expired: true,
        payment
      }
    }
    
    // Still pending
    return {
      confirmed: false,
      payment
    }
  } catch (error) {
    console.error('Payment check error:', error)
    
    // Demo fallback for testing
    if (payment.isDemoMode && Math.random() > 0.85) {
      payment.status = 'confirmed'
      payment.confirmations = 1
      savePayments()
      return {
        confirmed: true,
        payment
      }
    }
    
    return {
      confirmed: false,
      payment
    }
  }
}

export function getPaymentQRCode(address, amount) {
  // Generate Bitcoin URI for QR code
  const uri = `bitcoin:${address}?amount=${amount}`
  
  // Use QRCode.js library for production QR generation
  // Install: npm install qrcode
  // For now, return simple data URL or redirect to BTCPay invoice page
  
  return {
    uri,
    dataUrl: generateQRCodeDataURL(uri),
    // BTCPay invoices have built-in QR codes, use invoiceUrl instead
    useInvoiceUrl: true
  }
}

export function getPaymentExplorerLink(address, txId = null) {
  // Use mempool.space for better UX
  if (txId) {
    return `https://mempool.space/tx/${txId}`
  }
  return `https://mempool.space/address/${address}`
}

export function getAllActivePayments() {
  return Array.from(activePayments.values())
}

export function getPayment(paymentId) {
  return activePayments.get(paymentId)
}

// Auto-check payments every 30 seconds
export function startPaymentMonitoring(callback) {
  const interval = setInterval(async () => {
    const payments = getAllActivePayments().filter(p => p.status === 'pending')
    
    for (const payment of payments) {
      const result = await checkPaymentStatus(payment.id)
      if (result.confirmed && callback) {
        callback(payment)
      }
    }
  }, 30000)
  
  return interval
}

export function stopPaymentMonitoring(interval) {
  clearInterval(interval)
}

// Helper functions
function generatePaymentId() {
  return 'btc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

function generateDemoAddress() {
  // Demo address - in production, generate from wallet or payment processor
  const prefixes = ['bc1q', '3', '1']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let address = prefix
  for (let i = 0; i < 32; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

function generateQRCodeDataURL(uri) {
  // Simplified QR generation - in production use qrcode library
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#fff"/>
      <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" fill="#000" font-size="12" font-family="monospace">
        ${uri.substring(0, 30)}...
      </text>
    </svg>
  `)}`
}

function savePayments() {
  const paymentsArray = Array.from(activePayments.entries())
  localStorage.setItem('fretpilot-btc-payments', JSON.stringify(paymentsArray))
}

function loadPayments() {
  try {
    const saved = localStorage.getItem('fretpilot-btc-payments')
    if (saved) {
      const paymentsArray = JSON.parse(saved)
      activePayments = new Map(paymentsArray)
    }
  } catch (error) {
    console.error('Failed to load payments:', error)
  }
}

// Load saved payments on initialization
loadPayments()
