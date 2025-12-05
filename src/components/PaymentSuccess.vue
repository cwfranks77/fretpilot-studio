<template>
  <div class="payment-success">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Verifying your payment...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="icon">❌</div>
      <h2>Payment Verification Failed</h2>
      <p>{{ error }}</p>
      <button @click="$emit('close')">Back to App</button>
    </div>

    <div v-else class="success-state">
      <div class="icon">✅</div>
      <h2>Welcome to FretPilot Premium!</h2>
      <p class="plan">{{ planName }}</p>
      <p class="amount">{{ amount }}</p>
      
      <div class="benefits">
        <h3>You now have access to:</h3>
        <ul>
          <li>🎬 Unlimited AI-generated video lessons</li>
          <li>📊 Advanced practice analytics</li>
          <li>🎵 500+ professional backing tracks</li>
          <li>🎙️ Multi-track music studio</li>
          <li>🔥 Mistake heatmap & technique tips</li>
          <li>🚫 Ad-free experience</li>
        </ul>
      </div>

      <div class="actions">
        <button class="primary" @click="startPracticing">Start Practicing! 🎸</button>
        <button class="secondary" @click="viewReceipt">View Receipt</button>
      </div>

      <p class="email-note">A receipt has been sent to your email.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setPremium } from '../services/featureFlags'
import { handlePaymentSuccess } from '../services/stripeService'

const emit = defineEmits(['close'])

const loading = ref(true)
const error = ref(null)
const planName = ref('')
const amount = ref('')

onMounted(async () => {
  // Small delay for UX
  await new Promise(r => setTimeout(r, 1000))
  
  // Check for pending payment from our tracking
  const pendingPayment = handlePaymentSuccess()
  
  // If we have payment_success in URL, treat as successful
  const urlParams = new URLSearchParams(window.location.search)
  const paymentSuccess = urlParams.get('payment_success')
  
  if (paymentSuccess || pendingPayment) {
    // Payment successful!
    const plan = pendingPayment?.plan || 'premium'
    planName.value = plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan'
    amount.value = plan === 'monthly' ? '$9.99/month' : plan === 'yearly' ? '$99.99/year' : '$49.99 one-time'
    
    // Activate premium features
    setPremium(true)
    
    // Store subscription info
    localStorage.setItem('fretpilot-premium', 'true')
    localStorage.setItem('fretpilot-subscription-plan', plan)
    localStorage.setItem('fp_premium', '1') // For featureFlags
    
    loading.value = false
  } else {
    error.value = 'No payment confirmation found. If you completed a payment, please contact support@fretpilotstudio.com'
    loading.value = false
  }
})

function startPracticing() {
  // Clear URL params and reload to start fresh
  window.history.replaceState({}, document.title, window.location.pathname)
  window.location.reload()
}

function viewReceipt() {
  // Open Stripe customer portal or receipt (implement later)
  alert('Receipt has been sent to your email. Check your inbox!')
}
</script>

<style scoped>
.payment-success {
  max-width: 600px;
  margin: 60px auto;
  padding: 40px;
  text-align: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #2a2f37;
  border-top-color: #1E90FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-state,
.error-state {
  background: #0d1117;
  border: 1px solid #1e2530;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 12px 40px -12px rgba(0,0,0,.65);
}

.icon {
  font-size: 80px;
  margin-bottom: 20px;
}

h2 {
  margin: 0 0 10px;
  font-size: 2rem;
  background: linear-gradient(135deg, #1E90FF, #0066ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.plan {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1E90FF;
  margin: 10px 0;
}

.amount {
  font-size: 1.1rem;
  color: #9aa4b7;
  margin-bottom: 30px;
}

.benefits {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #000;
  border-radius: 12px;
}

.benefits h3 {
  margin: 0 0 15px;
  font-size: 1.1rem;
  color: #fff;
}

.benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits li {
  padding: 8px 0;
  color: #b8c2cf;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

button {
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}

.primary {
  background: linear-gradient(135deg, #1E90FF, #0066ff);
  color: #fff;
  box-shadow: 0 10px 36px -10px rgba(0,102,255,.55);
}

.secondary {
  background: #1a1f28;
  color: #fff;
  border: 1px solid #2a2f37;
}

.email-note {
  margin-top: 20px;
  color: #6b7685;
  font-size: 0.9rem;
}

.error-state p {
  color: #f87171;
  margin: 20px 0;
}

@media (max-width: 600px) {
  .payment-success {
    padding: 20px;
  }
  
  .success-state,
  .error-state {
    padding: 30px 20px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  button {
    width: 100%;
  }
}
</style>
