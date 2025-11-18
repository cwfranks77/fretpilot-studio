<template>
  <div class="payment-checkout">
    <div class="checkout-header">
      <h1>Choose Your Plan</h1>
      <p>Unlock your full guitar potential with FretPilot Premium</p>
    </div>

    <!-- Pricing Cards -->
    <div class="pricing-grid">
      <div 
        v-for="(plan, key) in plans" 
        :key="key"
        class="pricing-card"
        :class="{ 
          featured: plan.badge,
          selected: selectedPlan === key 
        }"
      >
        <div v-if="plan.badge" class="badge">{{ plan.badge }}</div>
        
        <h3>{{ plan.name }}</h3>
        
        <div class="price">
          <span class="currency">$</span>
          <span class="amount">{{ plan.price }}</span>
          <span class="interval" v-if="plan.interval !== 'once'">
            /{{ plan.interval === 'forever' ? 'free' : plan.interval }}
          </span>
        </div>
        
        <p v-if="plan.savings" class="savings">{{ plan.savings }}</p>
        
        <ul class="features">
          <li v-for="(feature, idx) in plan.features" :key="idx">
            ✓ {{ feature }}
          </li>
        </ul>
        
        <button 
          v-if="plan.id !== 'free'"
          @click="selectPlan(key)" 
          class="select-btn"
          :class="{ selected: selectedPlan === key }"
        >
          {{ selectedPlan === key ? 'Selected' : 'Select Plan' }}
        </button>
        
        <button v-else class="select-btn current" disabled>
          Current Plan
        </button>
      </div>
    </div>

    <!-- Payment Methods (shown when plan selected) -->
    <div v-if="selectedPlan && selectedPlan !== 'free'" class="payment-methods">
      <h2>Choose Payment Method</h2>
      
      <div class="method-grid">
        <!-- Stripe (Credit Card) -->
        <div class="payment-method" @click="initiateStripePayment">
          <div class="method-icon">💳</div>
          <h3>Credit Card</h3>
          <p>Powered by Stripe</p>
          <div class="accepted-cards">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>AMEX</span>
          </div>
        </div>
        
        <!-- PayPal -->
        <div class="payment-method">
          <div class="method-icon">
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg" alt="PayPal" />
          </div>
          <h3>PayPal</h3>
          <p>Pay with PayPal balance or card</p>
          <div id="paypal-button-container" class="paypal-container"></div>
        </div>
        
        <!-- Google Pay -->
        <div 
          v-if="googlePayAvailable" 
          class="payment-method"
          @click="initiateGooglePay"
        >
          <div class="method-icon">
            <img src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" alt="Google Pay" style="width: 100px;" />
          </div>
          <h3>Google Pay</h3>
          <p>Quick checkout with Google</p>
        </div>
        
        <!-- Apple Pay -->
        <div 
          v-if="applePayAvailable" 
          class="payment-method"
          @click="initiateApplePay"
        >
          <div class="method-icon">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <path d="M8.5,25c0,8.8,7.2,16,16,16s16-7.2,16-16s-7.2-16-16-16S8.5,16.2,8.5,25z" fill="#000"/>
              <path d="M18,20h-3v10h3v-10z M22,20h-3v10h3v-10z M26,20h-3v10h3v-10z M30,20h-3v10h3v-10z M34,20h-3v10h3v-10z" fill="#fff"/>
            </svg>
          </div>
          <h3>Apple Pay</h3>
          <p>One-touch payment</p>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div v-if="selectedPlan && selectedPlan !== 'free'" class="order-summary">
      <h3>Order Summary</h3>
      <div class="summary-line">
        <span>{{ plans[selectedPlan].name }}</span>
        <span>${{ plans[selectedPlan].price }}</span>
      </div>
      <div v-if="plans[selectedPlan].interval !== 'once'" class="summary-line recurring">
        <span>Billing: {{ plans[selectedPlan].interval }}ly</span>
        <span>Recurring</span>
      </div>
      <div class="summary-line total">
        <span>Total Today</span>
        <span>${{ plans[selectedPlan].price }}</span>
      </div>
      
      <div class="guarantee">
        🔒 Secure payment • 30-day money-back guarantee
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="processing" class="processing-overlay">
      <div class="spinner"></div>
      <p>Processing your payment...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  PRICING_PLANS,
  createStripeCheckout,
  renderPayPalButton,
  requestGooglePayPayment,
  requestApplePayPayment,
  isApplePayAvailable,
  initGooglePay
} from '../services/paymentService'

const plans = ref(PRICING_PLANS)
const selectedPlan = ref(null)
const processing = ref(false)
const googlePayAvailable = ref(false)
const applePayAvailable = ref(false)

onMounted(async () => {
  // Preselect plan if user came from PremiumGate
  try {
    const sel = localStorage.getItem('fretpilot-selected-plan')
    if (sel && plans.value[sel]) selectedPlan.value = sel
  } catch (_) {}
  // Check available payment methods
  applePayAvailable.value = await isApplePayAvailable()
  
  try {
    const googlePay = await initGooglePay()
    googlePayAvailable.value = !!googlePay
  } catch (error) {
    googlePayAvailable.value = false
  }
})

function selectPlan(planKey) {
  selectedPlan.value = planKey
  
  // Render PayPal button when plan is selected
  setTimeout(() => {
    try {
      renderPayPalButton('paypal-button-container', planKey)
    } catch (error) {
      console.error('PayPal button error:', error)
    }
  }, 100)
}

async function initiateStripePayment() {
  if (!selectedPlan.value) return
  
  processing.value = true
  
  try {
    await createStripeCheckout(selectedPlan.value)
    // Redirect happens automatically
  } catch (error) {
    alert('Payment failed: ' + error.message)
    processing.value = false
  }
}

async function initiateGooglePay() {
  if (!selectedPlan.value) return
  
  processing.value = true
  
  try {
    await requestGooglePayPayment(selectedPlan.value)
    // Success handled by payment service
  } catch (error) {
    alert('Payment failed: ' + error.message)
    processing.value = false
  }
}

async function initiateApplePay() {
  if (!selectedPlan.value) return
  
  processing.value = true
  
  try {
    await requestApplePayPayment(selectedPlan.value)
    // Success handled by payment service
  } catch (error) {
    alert('Payment failed: ' + error.message)
    processing.value = false
  }
}
</script>

<style scoped>
.payment-checkout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: white;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.checkout-header {
  text-align: center;
  margin-bottom: 50px;
}

.checkout-header h1 {
  font-size: 48px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.checkout-header p {
  font-size: 18px;
  color: #888;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.pricing-card {
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 30px;
  border: 2px solid rgba(255,255,255,0.1);
  transition: all 0.3s;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0,212,255,0.2);
}

.pricing-card.featured {
  border-color: #ffd700;
  box-shadow: 0 0 30px rgba(255,215,0,0.3);
}

.pricing-card.selected {
  border-color: #00d4ff;
  box-shadow: 0 0 30px rgba(0,212,255,0.5);
}

.badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: black;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.pricing-card h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

.price {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.currency {
  font-size: 24px;
  margin-right: 5px;
}

.amount {
  font-size: 48px;
  font-weight: bold;
}

.interval {
  font-size: 18px;
  color: #888;
  margin-left: 5px;
}

.savings {
  color: #4caf50;
  font-weight: bold;
  margin-bottom: 20px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 30px 0;
}

.features li {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  font-size: 15px;
}

.select-btn {
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.select-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(0,212,255,0.4);
}

.select-btn.selected {
  background: linear-gradient(135deg, #4caf50, #45a049);
}

.select-btn.current {
  background: rgba(255,255,255,0.1);
  cursor: not-allowed;
}

.payment-methods {
  margin: 60px 0;
  text-align: center;
}

.payment-methods h2 {
  margin-bottom: 30px;
  font-size: 32px;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.payment-method {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 30px;
  border: 2px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: #00d4ff;
  box-shadow: 0 5px 20px rgba(0,212,255,0.3);
  transform: translateY(-3px);
}

.method-icon {
  font-size: 48px;
  margin-bottom: 15px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-icon img {
  max-height: 50px;
}

.payment-method h3 {
  margin: 10px 0;
  font-size: 20px;
}

.payment-method p {
  color: #888;
  font-size: 14px;
  margin-bottom: 15px;
}

.accepted-cards {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.accepted-cards span {
  background: rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
}

.paypal-container {
  margin-top: 15px;
  min-height: 50px;
}

.order-summary {
  max-width: 500px;
  margin: 40px auto;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 30px;
  border: 2px solid rgba(255,255,255,0.1);
}

.order-summary h3 {
  margin-bottom: 20px;
  font-size: 24px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.summary-line.recurring {
  font-size: 14px;
  color: #888;
}

.summary-line.total {
  font-size: 20px;
  font-weight: bold;
  border-bottom: none;
  margin-top: 10px;
}

.guarantee {
  text-align: center;
  margin-top: 20px;
  color: #4caf50;
  font-size: 14px;
}

.processing-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255,255,255,0.1);
  border-top-color: #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.processing-overlay p {
  margin-top: 20px;
  font-size: 18px;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .method-grid {
    grid-template-columns: 1fr;
  }
}
</style>
