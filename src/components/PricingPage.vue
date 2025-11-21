<template>
  <div class="pricing-page">
    <div class="pricing-header">
      <h1>Choose Your Plan</h1>
      <p>Unlock the full power of FretPilot with Premium or Pro</p>
      
      <div class="billing-toggle">
        <button 
          @click="billingCycle = 'monthly'" 
          :class="{ active: billingCycle === 'monthly' }"
        >
          Monthly
        </button>
        <button 
          @click="billingCycle = 'yearly'" 
          :class="{ active: billingCycle === 'yearly' }"
        >
          Yearly
          <span class="save-badge">Save 17%</span>
        </button>
      </div>
    </div>

    <div class="pricing-grid">
      <!-- Free Plan -->
      <div class="pricing-card">
        <div class="plan-header">
          <h3>Free</h3>
          <div class="price">
            <span class="amount">$0</span>
            <span class="period">/forever</span>
          </div>
        </div>
        
        <ul class="features-list">
          <li>✓ 5 AI lessons per day</li>
          <li>✓ Basic chord library</li>
          <li>✓ Metronome & tuner</li>
          <li>✓ Limited video lessons</li>
          <li>✓ Community access</li>
          <li class="disabled">✗ AI mistake detection</li>
          <li class="disabled">✗ Advanced analytics</li>
          <li class="disabled">✗ Multiplayer features</li>
        </ul>
        
        <button class="btn-plan current" disabled>
          Current Plan
        </button>
      </div>

      <!-- Premium Plan -->
      <div class="pricing-card featured">
        <div class="popular-badge">MOST POPULAR</div>
        <div class="plan-header">
          <h3>Premium</h3>
          <div class="price">
            <span class="amount">${{ premiumPrice }}</span>
            <span class="period">/{{ billingCycle === 'monthly' ? 'month' : 'year' }}</span>
          </div>
          <div v-if="billingCycle === 'yearly'" class="savings">
            Save ${{ yearlyDiscount }} per year
          </div>
        </div>
        
        <ul class="features-list">
          <li>✓ <strong>Unlimited</strong> AI lessons</li>
          <li>✓ Full video library access</li>
          <li>✓ <strong>AI mistake detection</strong></li>
          <li>✓ Real-time play-along monitoring</li>
          <li>✓ Interactive practice mode</li>
          <li>✓ Progress analytics</li>
          <li>✓ Multiplayer jam sessions</li>
          <li>✓ Download for offline practice</li>
          <li>✓ <strong>No ads</strong></li>
          <li>✓ Priority support</li>
        </ul>
        
        <StripeCheckout
          :planType="billingCycle"
          mode="subscription"
          :buttonText="`Start Premium ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}`"
        >
          <template #trigger="{ checkout }">
            <button @click="checkout" class="btn-plan premium">
              Get Premium
            </button>
          </template>
        </StripeCheckout>
      </div>

      <!-- Pro Plan -->
      <div class="pricing-card">
        <div class="plan-header">
          <h3>Pro</h3>
          <div class="price">
            <span class="amount">$19.99</span>
            <span class="period">/month</span>
          </div>
        </div>
        
        <ul class="features-list">
          <li>✓ <strong>Everything in Premium</strong></li>
          <li>✓ 1-on-1 instructor connect</li>
          <li>✓ Custom lesson plan creation</li>
          <li>✓ Advanced pose detection</li>
          <li>✓ Studio recording tools</li>
          <li>✓ Exclusive masterclasses</li>
          <li>✓ Guitar gear discounts (20%)</li>
          <li>✓ Early access to features</li>
          <li>✓ White-glove support</li>
        </ul>
        
        <StripeCheckout
          planType="pro"
          mode="subscription"
          buttonText="Get Pro"
        >
          <template #trigger="{ checkout }">
            <button @click="checkout" class="btn-plan pro">
              Get Pro
            </button>
          </template>
        </StripeCheckout>
      </div>
    </div>

    <!-- Features Comparison -->
    <div class="comparison-section">
      <h2>Feature Comparison</h2>
      <div class="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th>Premium</th>
              <th>Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AI Lessons per Day</td>
              <td>5</td>
              <td>Unlimited</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td>Video Lessons</td>
              <td>Limited</td>
              <td>Full Library</td>
              <td>Full Library</td>
            </tr>
            <tr>
              <td>AI Mistake Detection</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓ Advanced</td>
            </tr>
            <tr>
              <td>Real-time Monitoring</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Progress Analytics</td>
              <td>Basic</td>
              <td>Advanced</td>
              <td>Advanced</td>
            </tr>
            <tr>
              <td>Multiplayer Jam</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>1-on-1 Instructor</td>
              <td>✗</td>
              <td>✗</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Custom Lesson Plans</td>
              <td>✗</td>
              <td>✗</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Support Level</td>
              <td>Community</td>
              <td>Priority</td>
              <td>White-glove</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h4>Can I cancel anytime?</h4>
          <p>Yes! Cancel anytime from your account settings. No long-term commitments required.</p>
        </div>
        <div class="faq-item">
          <h4>What payment methods do you accept?</h4>
          <p>We accept all major credit cards (Visa, Mastercard, Amex, Discover) via Stripe.</p>
        </div>
        <div class="faq-item">
          <h4>Is there a free trial?</h4>
          <p>The Free plan is available forever! Upgrade anytime to access premium features.</p>
        </div>
        <div class="faq-item">
          <h4>Can I switch plans?</h4>
          <p>Absolutely! Upgrade or downgrade anytime. Changes take effect immediately with prorated billing.</p>
        </div>
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="trust-section">
      <div class="trust-badge">
        <div class="trust-icon">🔒</div>
        <div class="trust-text">
          <strong>Secure Payments</strong>
          <span>Powered by Stripe</span>
        </div>
      </div>
      <div class="trust-badge">
        <div class="trust-icon">💯</div>
        <div class="trust-text">
          <strong>Money-Back Guarantee</strong>
          <span>30-day refund policy</span>
        </div>
      </div>
      <div class="trust-badge">
        <div class="trust-icon">🎸</div>
        <div class="trust-text">
          <strong>10,000+ Musicians</strong>
          <span>Join our community</span>
        </div>
      </div>
    </div>

    <!-- Social Footer -->
    <div class="pricing-footer">
      <SocialMediaFooter variant="fretpilot" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StripeCheckout from './StripeCheckout.vue'
import SocialMediaFooter from './SocialMediaFooter.vue'

const billingCycle = ref('monthly')

const premiumPrice = computed(() => {
  return billingCycle.value === 'monthly' ? '9.99' : '99.99'
})

const yearlyDiscount = computed(() => {
  return ((9.99 * 12) - 99.99).toFixed(2)
})
</script>

<style scoped>
.pricing-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
}

.pricing-header {
  text-align: center;
  margin-bottom: 60px;
}

.pricing-header h1 {
  font-size: 3em;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #00ff88, #00aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pricing-header p {
  font-size: 1.2em;
  color: #aaa;
  margin: 0 0 40px 0;
}

.billing-toggle {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  padding: 4px;
  gap: 4px;
}

.billing-toggle button {
  background: transparent;
  border: none;
  padding: 12px 32px;
  border-radius: 50px;
  color: #aaa;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.billing-toggle button.active {
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #000;
}

.save-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
}

.pricing-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 32px;
  position: relative;
  transition: all 0.3s;
}

.pricing-card:hover {
  transform: translateY(-8px);
  border-color: rgba(0, 255, 136, 0.3);
  box-shadow: 0 20px 60px rgba(0, 255, 136, 0.1);
}

.pricing-card.featured {
  border-color: #00ff88;
  box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2);
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #000;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.plan-header {
  text-align: center;
  margin-bottom: 32px;
}

.plan-header h3 {
  font-size: 1.8em;
  margin: 0 0 16px 0;
  color: #00ff88;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.amount {
  font-size: 3em;
  font-weight: 700;
  color: #fff;
}

.period {
  font-size: 1.2em;
  color: #666;
}

.savings {
  margin-top: 8px;
  color: #00ff88;
  font-size: 0.9em;
  font-weight: 600;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
}

.features-list li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #ccc;
}

.features-list li.disabled {
  color: #555;
}

.btn-plan {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-plan.current {
  background: rgba(255, 255, 255, 0.1);
  color: #666;
  cursor: not-allowed;
}

.btn-plan.premium {
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #000;
}

.btn-plan.pro {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.btn-plan:not(.current):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.comparison-section,
.faq-section {
  margin-bottom: 80px;
}

.comparison-section h2,
.faq-section h2 {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 40px;
  color: #00ff88;
}

.comparison-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
}

thead {
  background: rgba(0, 255, 136, 0.1);
}

th,
td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

th {
  font-weight: 700;
  color: #00ff88;
}

td {
  color: #ccc;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-item h4 {
  color: #00ff88;
  margin: 0 0 12px 0;
}

.faq-item p {
  color: #aaa;
  margin: 0;
  line-height: 1.6;
}

.trust-section {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trust-icon {
  font-size: 2.5em;
}

.trust-text {
  display: flex;
  flex-direction: column;
}

.trust-text strong {
  color: #fff;
  font-size: 1.1em;
}

.trust-text span {
  color: #888;
  font-size: 0.9em;
}

.pricing-footer {
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .pricing-header h1 {
    font-size: 2em;
  }

  .pricing-card.featured {
    transform: scale(1);
  }

  .comparison-section h2,
  .faq-section h2 {
    font-size: 2em;
  }

  .trust-section {
    flex-direction: column;
    align-items: center;
  }
}
</style>
