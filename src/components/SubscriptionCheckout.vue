<template>
  <div class="subscription-checkout">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Redirecting to secure checkout...</p>
    </div>
    
    <div v-else-if="success" class="success-message">
      <div class="success-icon">✓</div>
      <h2>Welcome to {{ tierName }}!</h2>
      <p>Your subscription is now active. Enjoy all premium features!</p>
      <button @click="$emit('close')" class="btn-continue">
        Start Learning
      </button>
    </div>
    
    <div v-else class="checkout-form">
      <h2>Subscribe to {{ tierName }}</h2>
      <div class="price-display">
        <span class="amount">${{ price }}</span>
        <span class="period">/month</span>
      </div>
      
      <button @click="startCheckout" class="btn-checkout">
        Subscribe with Stripe
      </button>
      
      <p class="disclaimer">
        Secure payment powered by Stripe. Cancel anytime.
      </p>
    </div>
  </div>
</template>

<script>
import subscriptionService from '../services/subscriptionService';

export default {
  name: 'SubscriptionCheckout',
  props: {
    tier: {
      type: String,
      required: true
    },
    stripePriceId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    tierName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      success: false
    };
  },
  methods: {
    async startCheckout() {
      this.loading = true;
      
      try {
        // Call backend to create Stripe checkout session
        const response = await fetch('/api/create-subscription-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: this.stripePriceId,
            tier: this.tier,
            successUrl: `${window.location.origin}/subscription-success?tier=${this.tier}`,
            cancelUrl: `${window.location.origin}/subscription-cancelled`
          })
        });
        
        const { sessionId, url } = await response.json();
        
        // Redirect to Stripe Checkout
        window.location.href = url;
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to start checkout. Please try again.');
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.subscription-checkout {
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
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-message {
  max-width: 400px;
  margin: 0 auto;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 20px;
}

.checkout-form h2 {
  margin: 0 0 20px 0;
}

.price-display {
  margin: 30px 0;
}

.price-display .amount {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
}

.price-display .period {
  font-size: 1.2rem;
  color: #666;
}

.btn-checkout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
  width: 100%;
  max-width: 400px;
}

.btn-checkout:hover {
  transform: scale(1.05);
}

.btn-continue {
  background: #4caf50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
}

.disclaimer {
  margin-top: 20px;
  color: #666;
  font-size: 0.9rem;
}
</style>
