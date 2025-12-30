<template>
  <section class="premium">
    <h2>Go Premium</h2>
    <p class="subtitle">Unlock the full FretPilot experience and remove ads.</p>
    <ul class="benefits">
      <li>🎬 AI-generated video lessons tailored to your goals</li>
      <li>📊 Practice Analyzer with timing & consistency metrics</li>
      <li>🎵 Jam Companion with smart chord progressions</li>
      <li>🎙️ Music Studio with multi-track recording</li>
      <li>🎸 Multi-instrument support (Guitar, Bass, Ukulele, Piano, Drums)</li>
      <li>🔌 Bluetooth instrument connectivity</li>
      <li>🔥 Mistake Heatmap and technique tips</li>
      <li>🚫 Ad-free experience</li>
    </ul>
    
    <div class="payment-methods">
      <h3>Choose Your Payment Method</h3>
      <div class="method-tabs">
        <button 
          v-if="!isIOS"
          :class="{ active: paymentMethod === 'card' }"
          @click="paymentMethod = 'card'"
        >
          💳 Credit Card
        </button>
        <button 
          :class="{ active: paymentMethod === 'bitcoin' }"
          @click="paymentMethod = 'bitcoin'"
        >
          ₿ Bitcoin
        </button>
      </div>
      <p v-if="isIOS" class="ios-note">On iOS, in-app purchases are coming soon. You can purchase with Bitcoin today.</p>
    </div>

    <div v-if="billingAvailable && !subscriptionActive" class="restore-wrapper">
      <button class="restore-btn" @click="doRestore">Restore Purchases</button>
    </div>

    <div class="plans">
      <div class="card">
        <h3>Monthly</h3>
        <div class="price">
          <template v-if="paymentMethod === 'card'">
            {{ productPrices.monthly }} <span>/ month</span>
          </template>
          <template v-else>
            <span class="btc-price">0.00015 BTC</span>
            <span class="usd-equiv">≈ $9.99</span>
          </template>
        </div>
        <button @click="initiatePurchase('monthly')">Start Monthly</button>
      </div>
      <div class="card" v-if="paymentMethod === 'card' && !isIOS">
        <h3>Yearly</h3>
        <div class="price">
          <template v-if="paymentMethod === 'card'">
            {{ productPrices.yearly }} <span>/ year</span>
          </template>
        </div>
        <button @click="initiatePurchase('yearly')">Start Yearly</button>
      </div>
      <div class="card featured">
        <h3>Lifetime</h3>
        <div class="badge">BEST VALUE</div>
        <div class="price">
          <template v-if="paymentMethod === 'card'">
            {{ productPrices.lifetime }} <span>one‑time</span>
          </template>
          <template v-else>
            <span class="btc-price">0.00075 BTC</span>
            <span class="usd-equiv">≈ $49.99</span>
          </template>
        </div>
        <button class="primary" @click="initiatePurchase('lifetime')">Unlock Lifetime</button>
      </div>
    </div>

    <!-- Bitcoin Payment Modal -->
    <div v-if="showBitcoinModal" class="modal-overlay" @click="showBitcoinModal = false">
      <div class="modal" @click.stop>
        <h3>₿ Bitcoin Payment</h3>
        <p class="plan-info">{{ selectedPlan === 'monthly' ? 'Monthly Subscription' : (selectedPlan === 'yearly' ? 'Yearly Subscription' : 'Lifetime Access') }}</p>
        
        <div class="bitcoin-details">
          <div class="qr-code">
            <img :src="qrCodeUrl" alt="BTC QR" />
          </div>
          
          <div class="payment-address">
            <label>Send exactly:</label>
            <div class="amount">{{ bitcoinAmount }} BTC</div>
            <label>To this address:</label>
            <div class="address">
              <code>{{ bitcoinAddress }}</code>
              <button @click="copyBitcoinAddress" class="copy-btn">📋 Copy</button>
            </div>
          </div>

          <div class="payment-status">
            <div v-if="!paymentConfirmed" class="waiting">
              <div class="spinner-small"></div>
              <p>Waiting for payment confirmation...</p>
              <p class="status-note">This can take 10-30 minutes</p>
            </div>
            <div v-else class="confirmed">
              <div class="checkmark">✓</div>
              <p>Payment confirmed!</p>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="showBitcoinModal = false" class="cancel-btn">Close</button>
          <button v-if="!paymentConfirmed" @click="checkPaymentStatus" class="check-btn">
            Check Status
          </button>
        </div>
      </div>
    </div>

    <p class="note">
      💳 On Android: Secure payments via Google Play Billing<br>
      💳 On Web: Secure card payments via Stripe<br>
      ₿ Bitcoin payments available on all platforms<br>
      All transactions are encrypted and secure
    </p>
    <div v-if="subscriptionActive" class="subscription-status">
      <p class="active-msg">✅ Premium active (Plan: {{ subscriptionPlan }})</p>
      <button class="manage-btn" @click="manageSubscription()">Manage Subscription</button>
    </div>

    <!-- Tester Management - Only visible to creator -->
    <div v-if="isCreatorEmail" class="dev-section">
      <div class="dev-card">
        <h3>🧪 Tester Management</h3>
        <p>Add testers who get lifetime free access for helping with testing.</p>
        <div class="tester-input">
          <input 
            v-model="newTesterEmail" 
            type="text" 
            placeholder="Enter tester email or ID"
            class="tester-field"
          />
          <button class="add-tester-btn" @click="addTesterHandler">Add Tester</button>
        </div>
        <div v-if="testers.emails.length > 0 || testers.ids.length > 0" class="tester-list">
          <h4>Current Testers:</h4>
          <ul>
            <li v-for="email in testers.emails" :key="email">{{ email }}</li>
            <li v-for="id in testers.ids" :key="id">ID: {{ id }}</li>
          </ul>
        </div>
        <p v-if="isTester" class="tester-badge">✅ You are a registered tester - lifetime access granted!</p>
      </div>
    </div>

    <!-- Developer Section - Only visible to creator -->
    <div v-if="isCreatorEmail" class="dev-section">
      <div class="dev-card">
        <h3>🎸 Creator Access</h3>
        <p>You're the creator - enjoy full access while learning guitar!</p>
        <button class="dev-btn" @click="enableDevMode">
          {{ isDevMode ? '✅ Developer Mode Active' : 'Enable Developer Mode' }}
        </button>
        <button v-if="isDevMode" class="dev-btn-secondary" @click="disableDevMode">
          Disable Developer Mode
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { setPremium, enableDeveloperMode, disableDeveloperMode, isDeveloperMode, isCreator, addTester, getTesters, isTester } from '../services/featureFlags'
import { createBitcoinPayment, checkPaymentStatus as checkBitcoinPaymentStatus, startPaymentMonitoring, stopPaymentMonitoring, getPaymentQRCode } from '../services/bitcoinPaymentService'
import { purchaseProduct, isGooglePlayBillingAvailable, SUBSCRIPTION_PRODUCTS, getProducts, checkSubscriptionStatus, manageSubscription, restorePurchases } from '../services/googlePlayBilling'
import { redirectToCheckout, isStripeConfigured } from '../services/stripeService'

const paymentMethod = ref('card')
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
if (isIOS) {
  paymentMethod.value = 'bitcoin'
}
const showBitcoinModal = ref(false)
const selectedPlan = ref(null)
const bitcoinAddress = ref('')
const bitcoinAmount = ref(0)
const paymentConfirmed = ref(false)
const currentPaymentId = ref(null)
const qrCodeUrl = ref('')
let monitoringInterval = null

// Dynamic pricing pulled from store when available
const productPrices = ref({
  monthly: '$9.99',
  yearly: '$99.99',
  lifetime: '$49.99'
})

// Subscription status
const subscriptionActive = ref(false)
const subscriptionPlan = ref(null)
const billingAvailable = isGooglePlayBillingAvailable()

// Developer mode - only for creator
const isCreatorEmail = ref(false)
const isDevMode = ref(false)

// Tester management
const newTesterEmail = ref('')
const testers = ref({ emails: [], ids: [] })
const userIsTester = ref(false)

async function initiatePurchase(plan) {
  selectedPlan.value = plan
  
  if (paymentMethod.value === 'bitcoin') {
    try {
      // Create real Bitcoin payment
      const payment = await createBitcoinPayment(plan)
      currentPaymentId.value = payment.id
      bitcoinAmount.value = payment.amount
      bitcoinAddress.value = payment.address
      qrCodeUrl.value = getPaymentQRCode(payment.address, payment.amount)
      
      showBitcoinModal.value = true
      paymentConfirmed.value = false
      
      // Start monitoring for payment
      monitoringInterval = startPaymentMonitoring((confirmedPayment) => {
        if (confirmedPayment.id === currentPaymentId.value) {
          paymentConfirmed.value = true
          setTimeout(() => {
            setPremium(true)
            showBitcoinModal.value = false
            alert('✅ Premium activated! Thank you for your payment.')
            location.reload()
          }, 2000)
        }
      })
    } catch (error) {
      alert('Failed to create Bitcoin payment. Please try again.')
    }
  } else {
    // Card payment
    if (isGooglePlayBillingAvailable()) {
      // Use Google Play Billing on Android
      const productId = plan === 'monthly' 
        ? SUBSCRIPTION_PRODUCTS.monthly 
        : plan === 'yearly' 
        ? SUBSCRIPTION_PRODUCTS.yearly 
        : SUBSCRIPTION_PRODUCTS.lifetime
      
      const result = await purchaseProduct(productId)
      
      if (result.success) {
        setPremium(true)
        alert('✅ Premium activated! Welcome to FretPilot Premium.')
        location.reload()
      } else {
        alert('Purchase failed: ' + (result.error || 'Unknown error'))
      }
    } else if (isStripeConfigured()) {
      // Use Stripe for web payments
      try {
        // Get user email if available (from localStorage or auth)
        const userEmail = localStorage.getItem('fretpilot-user-email') || ''
        const userId = localStorage.getItem('fretpilot-user-id') || ''
        
        // Redirect to Stripe Checkout
        await redirectToCheckout(plan, userEmail, userId)
      } catch (error) {
        const errorMsg = error.message || 'Unknown error'
        if (errorMsg.includes('Network') || errorMsg.includes('connection')) {
          alert('Network connection error. Please check your internet connection. If the problem persists, try Bitcoin payment or contact support@fretpilotstudio.com')
        } else {
          alert('Failed to start checkout: ' + errorMsg)
        }
      }
    } else {
      // Fallback: Web checkout not configured - show helpful message
      alert('Card payments are not available at this time. Please use Bitcoin payment or contact support@fretpilotstudio.com for assistance.')
    }
  }
}

async function doRestore() {
  try {
    const res = await restorePurchases()
    if (res.restored > 0) {
      const status = await checkSubscriptionStatus()
      subscriptionActive.value = !!status.active
      subscriptionPlan.value = status.plan || null
      setPremium(true)
      alert('✅ Subscription restored successfully.')
    } else {
      alert('No previous purchases found to restore.')
    }
  } catch (e) {
    alert('Restore failed: ' + (e.message || 'Unknown error'))
  }
}

function copyBitcoinAddress() {
  navigator.clipboard.writeText(bitcoinAddress.value)
  alert('Bitcoin address copied to clipboard!')
}

async function checkPaymentStatus() {
  if (!currentPaymentId.value) return
  
  try {
    const result = await checkBitcoinPaymentStatus(currentPaymentId.value)
    if (result.confirmed) {
      paymentConfirmed.value = true
      setTimeout(() => {
        setPremium(true)
        showBitcoinModal.value = false
        alert('✅ Premium activated! Thank you for your payment.')
        location.reload()
      }, 2000)
    } else {
      alert('No payment detected yet. Please wait for blockchain confirmation.')
    }
  } catch (error) {
    alert('Failed to check payment status. Please try again.')
  }
}

function enableDevMode() {
  if (enableDeveloperMode()) {
    isDevMode.value = true
    setPremium(true)
    alert('✅ Developer mode enabled! You now have full premium access.')
    location.reload()
  }
}

function disableDevMode() {
  if (disableDeveloperMode()) {
    isDevMode.value = false
    alert('Developer mode disabled.')
    location.reload()
  }
}


function addTesterHandler() {
  if (!newTesterEmail.value.trim()) {
    alert('Please enter a tester email or ID')
    return
  }
  
  if (addTester(newTesterEmail.value.trim())) {
    alert(`✅ Added ${newTesterEmail.value} as a tester with lifetime access!`)
    newTesterEmail.value = ''
    loadTesters()
  } else {
    alert('Failed to add tester. Please try again.')
  }
}

function loadTesters() {
  testers.value = getTesters()
  userIsTester.value = isTester()
}

onMounted(() => {
  // Check if user is creator
  isCreatorEmail.value = isCreator()
  
  // Check developer mode
  isDevMode.value = isDeveloperMode()
  
  // Load testers
  loadTesters()
  
  // Load dynamic product prices if available
  getProducts().then(res => {
    const products = Array.isArray(res) ? res : (res?.products || [])
    const byId = Object.fromEntries(products.map(p => [p.productId || p.id, p]))
    if (byId[SUBSCRIPTION_PRODUCTS.monthly]?.price) {
      productPrices.value.monthly = byId[SUBSCRIPTION_PRODUCTS.monthly].price
    }
    if (byId[SUBSCRIPTION_PRODUCTS.yearly]?.price) {
      productPrices.value.yearly = byId[SUBSCRIPTION_PRODUCTS.yearly].price
    }
    if (byId[SUBSCRIPTION_PRODUCTS.lifetime]?.price) {
      productPrices.value.lifetime = byId[SUBSCRIPTION_PRODUCTS.lifetime].price
    }
  }).catch(() => {})

  // Load subscription status
  checkSubscriptionStatus().then(status => {
    subscriptionActive.value = !!status.active
    subscriptionPlan.value = status.plan || null
  }).catch(() => {})
})

onUnmounted(() => {
  if (monitoringInterval) {
    stopPaymentMonitoring(monitoringInterval)
  }
})
</script>

<style scoped>
.premium { 
  padding: 32px 24px; 
  background: #0c0a09; 
  color: #fafaf9; 
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 3em;
  font-weight: 400;
  text-align: center;
  margin-bottom: 12px;
  color: #fafaf9;
}

.subtitle { 
  color: #78716c;
  text-align: center;
  font-size: 1.1em;
  margin-bottom: 40px;
}

.benefits { 
  margin: 30px 0;
  line-height: 2;
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.benefits li {
  padding: 8px 0;
  font-size: 1.05em;
}

.payment-methods {
  margin: 40px 0;
  text-align: center;
}

.payment-methods h3 {
  margin-bottom: 20px;
  color: #cfd6e6;
}

.method-tabs {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 30px;
}

.method-tabs button {
  background: rgba(250, 250, 249, 0.03);
  border: 1px solid rgba(250, 250, 249, 0.08);
  color: #a8a29e;
  padding: 14px 32px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: all 0.3s ease;
}

.method-tabs button.active {
  background: rgba(249, 115, 22, 0.1);
  border-color: rgba(249, 115, 22, 0.4);
  color: #f97316;
  transform: translateY(-2px);
}

.plans { 
  display: flex; 
  gap: 24px; 
  flex-wrap: wrap; 
  margin: 40px 0;
  justify-content: center;
}

.card { 
  background: rgba(250, 250, 249, 0.02);
  border: 1px solid rgba(250, 250, 249, 0.06);
  border-radius: 24px;
  padding: 40px 32px;
  width: 300px;
  text-align: center;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(249, 115, 22, 0.3);
}

.card.featured { 
  background: linear-gradient(180deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.02));
  border-color: rgba(249, 115, 22, 0.4);
  box-shadow: 0 8px 32px -10px rgba(249, 115, 22, 0.4);
  position: relative;
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.8em;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.card h3 { 
  margin: 0 0 16px;
  font-size: 1.8em;
}

.price { 
  font-size: 2.5em;
  font-weight: 700;
  margin: 20px 0 30px;
}

.price span { 
  font-weight: 500;
  color: #8892a6;
  font-size: 0.5em;
  display: block;
  margin-top: 8px;
}

.btc-price {
  color: #f7931a;
  display: block;
  font-size: 1.2em;
}

.usd-equiv {
  font-size: 0.4em !important;
  color: #8892a6;
}

button { 
  background: rgba(250, 250, 249, 0.05);
  border: 1px solid rgba(250, 250, 249, 0.1);
  color: #fafaf9;
  padding: 16px 28px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;
}

button:hover {
  background: rgba(250, 250, 249, 0.1);
  border-color: rgba(250, 250, 249, 0.2);
  transform: translateY(-2px);
}

.primary { 
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  box-shadow: 0 8px 24px -8px rgba(249, 115, 22, 0.4);
}

.primary:hover {
  box-shadow: 0 12px 32px -8px rgba(249, 115, 22, 0.5);
}

.cta { 
  margin-top: 40px;
  text-align: center;
}

.dev { 
  background: #6c5ce7;
  width: auto;
  padding: 12px 24px;
}

.note { 
  margin-top: 30px;
  color: #8892a6;
  font-size: 0.95rem;
  text-align: center;
  line-height: 1.8;
}

.subscription-status {
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 20px 28px;
  border-radius: 16px;
  margin: 30px auto 10px;
  max-width: 500px;
  text-align: center;
}
.active-msg {
  margin: 0 0 12px;
  font-weight: 600;
  color: #22c55e;
}
.manage-btn {
  background: rgba(250, 250, 249, 0.05);
  border: 1px solid rgba(250, 250, 249, 0.1);
  padding: 12px 24px;
  border-radius: 10px;
  color: #d6d3d1;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.manage-btn:hover { 
  background: rgba(250, 250, 249, 0.1);
  border-color: rgba(250, 250, 249, 0.2);
}

.restore-wrapper {
  text-align: center;
  margin: 10px 0 40px;
}
.restore-btn {
  background: rgba(250, 250, 249, 0.03);
  border: 1px solid rgba(250, 250, 249, 0.08);
  color: #a8a29e;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.restore-btn:hover {
  border-color: rgba(249, 115, 22, 0.3);
  color: #f97316;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 2em;
}

.plan-info {
  text-align: center;
  color: #8892a6;
  margin-bottom: 30px;
}

.bitcoin-details {
  margin: 30px 0;
}

.qr-code {
  text-align: center;
  margin-bottom: 30px;
}

.qr-code img {
  width: 200px;
  height: 200px;
  background: #fff;
  padding: 10px;
  border-radius: 12px;
}

.payment-address {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.payment-address label {
  display: block;
  color: #8892a6;
  font-size: 0.9em;
  margin-bottom: 8px;
}

.amount {
  font-size: 1.8em;
  font-weight: 700;
  color: #f7931a;
  margin-bottom: 20px;
}

.address {
  display: flex;
  gap: 12px;
  align-items: center;
}

.address code {
  flex: 1;
  background: #0a0a0a;
  padding: 12px;
  border-radius: 8px;
  word-break: break-all;
  font-size: 0.9em;
  color: #cfd6e6;
}

.copy-btn {
  background: #2a2a2a;
  padding: 10px 16px;
  width: auto;
  font-size: 0.9em;
}

.payment-status {
  text-align: center;
  padding: 30px;
}

.waiting, .confirmed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner-small {
  width: 40px;
  height: 40px;
  border: 4px solid #2a2a2a;
  border-top-color: #f7931a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-note {
  color: #8892a6;
  font-size: 0.9em;
}

.checkmark {
  width: 60px;
  height: 60px;
  background: #06c167;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  color: #fff;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.cancel-btn {
  background: #2a2a2a;
  flex: 1;
}

.check-btn {
  background: #f7931a;
  flex: 1;
}

/* Developer Section */
.dev-section {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 2px solid #2a2a2a;
}

.dev-card {
  background: #0a0a0a;
  border: 2px solid #6c5ce7;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.dev-card h3 {
  margin: 0 0 12px;
  color: #6c5ce7;
  font-size: 1.5em;
}

.dev-card p {
  color: #8892a6;
  margin-bottom: 20px;
  line-height: 1.6;
}

.dev-btn {
  background: #6c5ce7;
  border: none;
  color: #fff;
  padding: 14px 28px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s;
  margin-bottom: 12px;
}

.dev-btn:hover {
  background: #5a4cd6;
  transform: translateY(-2px);
}

.dev-btn-secondary {
  background: #2a2a2a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s;
}

.dev-btn-secondary:hover {
  border-color: #6c5ce7;
  color: #fff;
}

.tester-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tester-field {
  flex: 1;
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1em;
}

.tester-field:focus {
  outline: none;
  border-color: #6c5ce7;
}

.add-tester-btn {
  background: #06c167;
  border: none;
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s;
}

.add-tester-btn:hover {
  background: #05a557;
  transform: translateY(-2px);
}

.tester-list {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
}

.tester-list h4 {
  margin: 0 0 12px;
  color: #cfd6e6;
  font-size: 1em;
}

.tester-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tester-list li {
  color: #8892a6;
  padding: 6px 0;
  border-bottom: 1px solid #2a2a2a;
}

.tester-list li:last-child {
  border-bottom: none;
}

.tester-badge {
  background: #06c167;
  color: #0b1c12;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-weight: 600;
  text-align: center;
}

</style>
