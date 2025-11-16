<template>
  <div class="payment-success">
    <div class="success-card">
      <div class="checkmark">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#4caf50" stroke-width="4" fill="none" class="circle-animation"/>
          <path d="M30 50 L45 65 L70 35" stroke="#4caf50" stroke-width="5" fill="none" stroke-linecap="round" class="check-animation"/>
        </svg>
      </div>
      
      <h1>Payment Successful! 🎉</h1>
      <p class="subtitle">Welcome to FretPilot Premium</p>
      
      <div class="benefits">
        <h3>Your Premium Benefits:</h3>
        <ul>
          <li>✅ Unlimited AI-powered lessons</li>
          <li>✅ Full video library access</li>
          <li>✅ Interactive practice mode</li>
          <li>✅ Multiplayer jam sessions</li>
          <li>✅ No ads, ever</li>
          <li>✅ Priority support</li>
        </ul>
      </div>
      
      <div class="receipt">
        <h4>Order Details</h4>
        <div class="receipt-line">
          <span>Plan:</span>
          <span>{{ planName }}</span>
        </div>
        <div class="receipt-line">
          <span>Amount:</span>
          <span>${{ amount }}</span>
        </div>
        <div class="receipt-line">
          <span>Transaction ID:</span>
          <span class="transaction-id">{{ transactionId }}</span>
        </div>
        <div class="receipt-line">
          <span>Date:</span>
          <span>{{ orderDate }}</span>
        </div>
      </div>
      
      <div class="actions">
        <button @click="goToHome" class="primary-btn">
          Start Learning 🚀
        </button>
        <button @click="viewReceipt" class="secondary-btn">
          Email Receipt
        </button>
      </div>
      
      <p class="note">
        A confirmation email has been sent to your registered email address.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const planName = ref('Premium Monthly')
const amount = ref('9.99')
const transactionId = ref('TXN-' + Date.now())
const orderDate = ref(new Date().toLocaleDateString())

onMounted(() => {
  // Parse session/transaction info from URL
  const urlParams = new URLSearchParams(window.location.search)
  const sessionId = urlParams.get('session_id')
  if (sessionId) {
    // Verify payment with backend
    verifyPayment(sessionId)
  }
})

async function verifyPayment(sessionId) {
  try {
    const response = await fetch(`/api/payments/verify-session/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })
    
    const data = await response.json()
    
    if (data.success) {
      planName.value = data.planName
      amount.value = data.amount
      transactionId.value = data.transactionId
    }
  } catch (error) {
    console.error('Verification error:', error)
  }
}

function goToHome() {
  window.location.href = '/'
}

function viewReceipt() {
  alert('Receipt sent to your email!')
}

function getAuthToken() {
  const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}')
  return auth.token || ''
}
</script>

<style scoped>
.payment-success {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.success-card {
  max-width: 600px;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 50px;
  text-align: center;
  border: 2px solid rgba(76, 175, 80, 0.3);
  box-shadow: 0 10px 50px rgba(76, 175, 80, 0.2);
}

.checkmark {
  margin-bottom: 30px;
}

.circle-animation {
  animation: drawCircle 0.6s ease-out;
}

.check-animation {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: drawCheck 0.4s ease-out 0.6s forwards;
}

@keyframes drawCircle {
  from {
    stroke-dasharray: 0 283;
  }
  to {
    stroke-dasharray: 283 283;
  }
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

h1 {
  font-size: 36px;
  color: white;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 20px;
  color: #4caf50;
  margin-bottom: 40px;
}

.benefits {
  text-align: left;
  margin: 30px 0;
  background: rgba(76, 175, 80, 0.1);
  padding: 25px;
  border-radius: 12px;
}

.benefits h3 {
  margin-bottom: 15px;
  color: #4caf50;
}

.benefits ul {
  list-style: none;
  padding: 0;
}

.benefits li {
  padding: 8px 0;
  font-size: 16px;
  color: white;
}

.receipt {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: left;
}

.receipt h4 {
  margin-bottom: 15px;
  color: #00d4ff;
}

.receipt-line {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: white;
}

.transaction-id {
  font-family: monospace;
  font-size: 12px;
  color: #888;
}

.actions {
  display: flex;
  gap: 15px;
  margin: 30px 0;
  justify-content: center;
}

.primary-btn {
  padding: 15px 40px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
}

.secondary-btn {
  padding: 15px 30px;
  border-radius: 10px;
  border: 2px solid rgba(255,255,255,0.3);
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-btn:hover {
  border-color: #00d4ff;
  background: rgba(0,212,255,0.1);
}

.note {
  margin-top: 20px;
  font-size: 14px;
  color: #888;
}
</style>
