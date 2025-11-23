<template>
  <div class="stripe-checkout">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Redirecting to secure checkout...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="error = null" class="btn-close">Close</button>
    </div>

    <div v-if="!loading && !error" class="checkout-content">
      <slot name="trigger" :checkout="initiateCheckout">
        <button @click="initiateCheckout" class="btn-checkout" :disabled="processing">
          {{ buttonText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

const props = defineProps({
  priceId: {
    type: String,
    required: false
  },
  planType: {
    type: String,
    required: false,
    validator: (value) => ['monthly', 'yearly', 'pro'].includes(value)
  },
  mode: {
    type: String,
    default: 'subscription', // 'subscription' or 'payment'
    validator: (value) => ['subscription', 'payment'].includes(value)
  },
  amount: {
    type: Number,
    required: false
  },
  productName: {
    type: String,
    default: 'Purchase'
  },
  buttonText: {
    type: String,
    default: 'Subscribe Now'
  },
  successUrl: {
    type: String,
    default: null // Will fallback to /payment-success route if not provided
  },
  cancelUrl: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['success', 'cancel', 'error'])

const stripe = ref(null)
const loading = ref(false)
const processing = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
    if (!publishableKey || publishableKey.includes('your_')) {
      console.warn('Stripe publishable key not configured')
      return
    }
    stripe.value = await loadStripe(publishableKey)
  } catch (err) {
    console.error('Failed to load Stripe:', err)
    error.value = 'Payment system initialization failed'
  }
})

async function initiateCheckout() {
  if (!stripe.value) {
    error.value = 'Payment system not ready. Please refresh and try again.'
    return
  }

  processing.value = true
  loading.value = true
  error.value = null

  try {
    // Get price ID based on plan type if not provided
    let finalPriceId = props.priceId
    if (!finalPriceId && props.planType) {
      const priceIdMap = {
        monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY,
        yearly: import.meta.env.VITE_STRIPE_PRICE_YEARLY,
        pro: import.meta.env.VITE_STRIPE_PRICE_PRO
      }
      finalPriceId = priceIdMap[props.planType]
    }

    // Extract user email from local auth (placeholder until secure auth implemented)
    let userEmail = ''
    try {
      const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}')
      userEmail = auth.email || auth.userEmail || auth.user || ''
    } catch (_) {}

    // Create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: finalPriceId,
        mode: props.mode,
        amount: props.amount,
        productName: props.productName,
        // Use unified payment success route (PaymentSuccess.vue)
        successUrl: props.successUrl || `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: props.cancelUrl || window.location.href,
        userEmail
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()

    // Redirect to Stripe Checkout
    const result = await stripe.value.redirectToCheckout({
      sessionId: session.id
    })

    if (result.error) {
      throw new Error(result.error.message)
    }
  } catch (err) {
    console.error('Checkout error:', err)
    error.value = err.message || 'Checkout failed. Please try again.'
    emit('error', err)
  } finally {
    processing.value = false
    loading.value = false
  }
}

defineExpose({
  initiateCheckout
})
</script>

<style scoped>
.stripe-checkout {
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  margin-top: 20px;
  color: #fff;
  font-size: 16px;
}

.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ff4444;
  color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 10001;
  max-width: 400px;
  text-align: center;
}

.error-message p {
  margin: 0 0 16px 0;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-checkout {
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #000;
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 255, 136, 0.4);
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
