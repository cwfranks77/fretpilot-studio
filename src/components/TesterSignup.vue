<template>
  <div class="tester-signup">
    <div class="signup-card">
      <div v-if="signupClosed" class="signup-closed">
        <div class="closed-icon">🔒</div>
        <h2>Beta Testing Full</h2>
        <p class="closed-message">
          We've reached our limit of <strong>100 beta testers</strong>! Thank you for your interest.
        </p>
        <p class="closed-submessage">
          Stay tuned for the public launch of FretPilot Studio. In the meantime, you can still use the free version of the app.
        </p>
        <button @click="goHome" class="home-btn">
          Go to FretPilot Studio
        </button>
      </div>
      
      <div v-else-if="!signedIn" class="signup-form">
        <h2>🎸 Join FretPilot Beta Testing</h2>
        <p class="subtitle">Get <strong>FREE lifetime premium access</strong> for helping us test!</p>
        <p class="spots-remaining" v-if="spotsRemaining > 0 && spotsRemaining <= 10">
          ⚠️ Only <strong>{{ spotsRemaining }}</strong> spots remaining!
        </p>
        
        <div class="form-group">
          <label>Your Email</label>
          <input 
            v-model="userEmail" 
            type="email" 
            placeholder="your.email@example.com"
            class="input-field"
            @keyup.enter="signUp"
          />
        </div>
        
        <div class="form-group">
          <label>Your Name (Optional)</label>
          <input 
            v-model="userName" 
            type="text" 
            placeholder="Your name"
            class="input-field"
            @keyup.enter="signUp"
          />
        </div>
        
        <button @click="signUp" class="signup-btn" :disabled="!userEmail || signingUp">
          {{ signingUp ? 'Signing Up...' : 'Get Free Lifetime Access' }}
        </button>
        
        <p class="terms-note">
          By signing up, you agree to help test FretPilot and provide feedback. 
          You'll receive lifetime premium access as a thank you! 🎉
        </p>
      </div>
      
      <div v-else class="success-state">
        <div class="success-icon">✅</div>
        <h2>Welcome to FretPilot Beta!</h2>
        <p class="success-message">
          You've been granted <strong>FREE lifetime premium access</strong>!
        </p>
        <p class="user-info">
          Signed in as: <strong>{{ userEmail }}</strong>
        </p>
        <button @click="startUsing" class="start-btn">
          Start Using FretPilot
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { verifyTesterToken, addTester, setPremium, isPremium, isTesterSignupAvailable, getTesterCount, MAX_TESTERS } from '../services/featureFlags'

const userEmail = ref('')
const userName = ref('')
const signingUp = ref(false)
const signedIn = ref(false)
const signupClosed = ref(false)
const testerCount = ref(0)

const spotsRemaining = computed(() => {
  return Math.max(0, MAX_TESTERS - testerCount.value)
})

// Check if we have a valid tester token in URL
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('tester_signup')
  
  if (!token) {
    // No token - redirect to home
    window.location.href = '/'
    return
  }
  
  // Check tester count
  testerCount.value = getTesterCount()
  
  // Check if signup is still available
  if (!isTesterSignupAvailable()) {
    signupClosed.value = true
    return
  }
  
  // Verify token
  if (!verifyTesterToken(token)) {
    if (!isTesterSignupAvailable()) {
      signupClosed.value = true
      return
    }
    alert('Invalid tester signup link. Please use the link provided to you.')
    window.location.href = '/'
    return
  }
  
  // Check if user is already signed in and has premium
  const existingEmail = localStorage.getItem('fretpilot-user-email')
  if (existingEmail && isPremium()) {
    signedIn.value = true
    userEmail.value = existingEmail
  }
})

function signUp() {
  if (!userEmail.value || !userEmail.value.includes('@')) {
    alert('Please enter a valid email address')
    return
  }
  
  // Double-check availability before signing up
  if (!isTesterSignupAvailable()) {
    signupClosed.value = true
    alert('Sorry, we\'ve reached our limit of 100 beta testers. Thank you for your interest!')
    return
  }
  
  signingUp.value = true
  
  // Store user info
  localStorage.setItem('fretpilot-user-email', userEmail.value.toLowerCase())
  if (userName.value) {
    localStorage.setItem('fretpilot-user-name', userName.value)
  }
  
  // Generate a simple user ID if not exists
  let userId = localStorage.getItem('fretpilot-user-id')
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('fretpilot-user-id', userId)
  }
  
  // Add as tester and grant premium access
  const added = addTester(userEmail.value.toLowerCase())
  if (added) {
    addTester(userId) // Also add by ID
    setPremium(true)
    testerCount.value = getTesterCount()
    
    // Small delay for UX
    setTimeout(() => {
      signingUp.value = false
      signedIn.value = true
    }, 500)
  } else {
    // Limit reached during signup
    signingUp.value = false
    signupClosed.value = true
    alert('Sorry, we\'ve just reached our limit of 100 beta testers. Thank you for your interest!')
  }
}

function goHome() {
  window.location.href = '/'
}

function startUsing() {
  // Clear URL params and reload
  window.history.replaceState({}, document.title, window.location.pathname)
  window.location.reload()
}
</script>

<style scoped>
.tester-signup {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #000;
}

.signup-card {
  background: #0a0a0a;
  border: 2px solid #06c167;
  border-radius: 20px;
  padding: 48px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 12px 40px -12px rgba(6, 193, 103, 0.3);
}

h2 {
  margin: 0 0 12px;
  font-size: 2em;
  text-align: center;
  color: #fff;
}

.subtitle {
  text-align: center;
  color: #8892a6;
  margin-bottom: 32px;
  font-size: 1.1em;
  line-height: 1.6;
}

.subtitle strong {
  color: #06c167;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  color: #cfd6e6;
  margin-bottom: 8px;
  font-weight: 600;
}

.input-field {
  width: 100%;
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 1em;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #06c167;
  background: #1f1f1f;
}

.signup-btn {
  width: 100%;
  background: #06c167;
  border: none;
  color: #fff;
  padding: 16px 32px;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.signup-btn:hover:not(:disabled) {
  background: #05a557;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(6, 193, 103, 0.5);
}

.signup-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.terms-note {
  color: #8892a6;
  font-size: 0.9em;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.success-state {
  text-align: center;
}

.success-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.success-message {
  color: #cfd6e6;
  font-size: 1.2em;
  margin-bottom: 24px;
  line-height: 1.6;
}

.success-message strong {
  color: #06c167;
}

.user-info {
  color: #8892a6;
  margin-bottom: 32px;
  padding: 16px;
  background: #1a1a1a;
  border-radius: 10px;
}

.user-info strong {
  color: #cfd6e6;
}

.start-btn {
  background: #06c167;
  border: none;
  color: #fff;
  padding: 16px 32px;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn:hover {
  background: #05a557;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(6, 193, 103, 0.5);
}

.signup-closed {
  text-align: center;
}

.closed-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.closed-message {
  color: #cfd6e6;
  font-size: 1.2em;
  margin-bottom: 16px;
  line-height: 1.6;
}

.closed-message strong {
  color: #06c167;
}

.closed-submessage {
  color: #8892a6;
  margin-bottom: 32px;
  line-height: 1.6;
}

.home-btn {
  background: #06c167;
  border: none;
  color: #fff;
  padding: 16px 32px;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.home-btn:hover {
  background: #05a557;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(6, 193, 103, 0.5);
}

.spots-remaining {
  background: #1a1a1a;
  border: 2px solid #ffa500;
  color: #ffa500;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
}

.spots-remaining strong {
  color: #fff;
  font-size: 1.2em;
}

@media (max-width: 600px) {
  .signup-card {
    padding: 32px 24px;
  }
  
  h2 {
    font-size: 1.6em;
  }
}
</style>

