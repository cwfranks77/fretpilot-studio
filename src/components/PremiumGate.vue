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
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { setPremium } from '../services/featureFlags'
import { createBitcoinPayment, checkPaymentStatus as checkBitcoinPaymentStatus, startPaymentMonitoring, stopPaymentMonitoring, getPaymentQRCode } from '../services/bitcoinPaymentService'
import { purchaseProduct, isGooglePlayBillingAvailable, SUBSCRIPTION_PRODUCTS, getProducts } from '../services/googlePlayBilling'

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
    // Google Play Billing (Android) or Stripe fallback (web)
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
    } else {
      // Stripe fallback for web
      const labelMap = {
        monthly: `${productPrices.value.monthly}/month`,
        yearly: `${productPrices.value.yearly}/year`,
        lifetime: `${productPrices.value.lifetime} lifetime`
      }
      const label = labelMap[plan] || 'Selected plan'
      alert(`Opening Stripe checkout for ${label}...\n\nIn production, this will:\n• Open secure Stripe checkout\n• Process payment\n• Activate premium features\n• Send confirmation email`)
      
      // In production:
      // openStripeCheckout(plan)
    }
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

onMounted(() => {
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
})

onUnmounted(() => {
  if (monitoringInterval) {
    stopPaymentMonitoring(monitoringInterval)
  }
})
</script>

<style scoped>
.premium { 
  padding: 24px; 
  background: #000; 
  color: #e8ecf6; 
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle { 
  color: #8892a6;
  text-align: center;
  font-size: 1.1em;
  margin-bottom: 30px;
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
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 14px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: all 0.3s;
}

.method-tabs button.active {
  background: #06c167;
  border-color: #06c167;
  color: #fff;
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
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 32px;
  width: 300px;
  text-align: center;
  transition: all 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  border-color: #06c167;
}

.card.featured { 
  border-color: #06c167;
  box-shadow: 0 8px 24px -10px rgba(6,193,103,0.6);
  position: relative;
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #06c167;
  color: #fff;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.85em;
  font-weight: 700;
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
  background: #1e90ff;
  border: none;
  color: #fff;
  padding: 14px 28px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.primary { 
  background: #06c167;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
</style>
