<template>
  <div class="login-wrapper">
    <div class="panel">
      <h1>{{ isSignUp ? '🚀 Create Account' : '🔐 Welcome Back' }}</h1>
      <p class="tagline">
        {{ isSignUp ? 'Join FretPilot to unlock premium features' : 'Sign in to continue your musical journey' }}
      </p>

      <!-- Error/Success Messages -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <!-- Google Sign-In Button -->
      <button @click="handleGoogleSignIn" class="google-btn" :disabled="loading">
        <svg class="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ loading ? 'Signing in...' : 'Continue with Google' }}
      </button>

      <div class="divider">
        <span>or</span>
      </div>

      <!-- Email/Password Form -->
      <form @submit.prevent="handleEmailAuth">
        <input 
          v-if="isSignUp"
          v-model.trim="displayName" 
          placeholder="Display Name" 
          autocomplete="name"
          :disabled="loading"
        />
        <input 
          v-model.trim="email" 
          placeholder="Email" 
          type="email" 
          autocomplete="email"
          required
          :disabled="loading"
        />
        <input 
          v-model="password" 
          placeholder="Password (min 6 chars)" 
          type="password" 
          :autocomplete="isSignUp ? 'new-password' : 'current-password'"
          required
          minlength="6"
          :disabled="loading"
        />
        <button type="submit" :disabled="!email || !password || loading">
          {{ loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In' }}
        </button>
      </form>

      <!-- Toggle Sign Up / Sign In -->
      <p class="toggle">
        {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
        <a @click="toggleMode" href="javascript:void(0)">
          {{ isSignUp ? 'Sign In' : 'Sign Up' }}
        </a>
      </p>

      <!-- Forgot Password -->
      <p v-if="!isSignUp" class="forgot">
        <a @click="showPasswordReset = true" href="javascript:void(0)">Forgot password?</a>
      </p>

      <!-- Guest Access -->
      <div class="guest-section">
        <div class="divider"><span>or</span></div>
        <button @click="handleGuestAccess" class="guest-btn" :disabled="loading">
          🎸 Continue as Guest
        </button>
        <p class="guest-note">Limited features • Upgrade anytime</p>
      </div>

      <!-- Password Reset Modal -->
      <div v-if="showPasswordReset" class="modal-overlay" @click="showPasswordReset = false">
        <div class="modal" @click.stop>
          <h3>Reset Password</h3>
          <p>Enter your email to receive a password reset link.</p>
          <input 
            v-model.trim="resetEmail" 
            placeholder="Your email" 
            type="email"
            :disabled="loading"
          />
          <div class="modal-actions">
            <button @click="handlePasswordReset" :disabled="!resetEmail || loading">
              Send Reset Link
            </button>
            <button @click="showPasswordReset = false" class="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  signInAnonymously,
  sendPasswordReset
} from '../services/firebaseAuth'

const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const displayName = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('info') // 'success', 'error', 'info'
const showPasswordReset = ref(false)
const resetEmail = ref('')

function toggleMode() {
  isSignUp.value = !isSignUp.value
  clearMessage()
}

function clearMessage() {
  message.value = ''
  messageType.value = 'info'
}

function showMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
  setTimeout(() => clearMessage(), 5000)
}

async function handleEmailAuth() {
  if (!email.value || !password.value) return
  
  loading.value = true
  clearMessage()

  try {
    const result = isSignUp.value 
      ? await signUpWithEmail(email.value, password.value, displayName.value)
      : await signInWithEmail(email.value, password.value)

    if (result.success) {
      showMessage(
        result.message || 'Success! Redirecting...',
        'success'
      )
      // Capture referral code early (non-blocking)
      try {
        const refCode = typeof window !== 'undefined' && window.getReferralCode ? window.getReferralCode() : ''
        if (refCode) {
          fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, userId: (result.uid || ''), refCode })
          }).catch(()=>{})
        } else if (result.uid || email.value) {
          // Persist basic user record even without ref for consistency
          fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, userId: (result.uid || '') })
          }).catch(()=>{})
        }
      } catch(_) {}
      setTimeout(() => {
        // Let App.vue handle navigation via auth state change
      }, 1000)
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Authentication failed. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

async function handleGoogleSignIn() {
  loading.value = true
  clearMessage()

  try {
    const result = await signInWithGoogle()
    
    if (result.success) {
      showMessage('Signed in with Google!', 'success')
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Google sign-in failed. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

async function handleGuestAccess() {
  loading.value = true
  clearMessage()

  try {
    const result = await signInAnonymously()
    
    if (result.success) {
      showMessage('Welcome, Guest! Explore with limited features.', 'success')
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Guest access failed. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

async function handlePasswordReset() {
  if (!resetEmail.value) return

  loading.value = true
  clearMessage()

  try {
    const result = await sendPasswordReset(resetEmail.value)
    
    if (result.success) {
      showMessage(result.message, 'success')
      showPasswordReset.value = false
      resetEmail.value = ''
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Failed to send reset email. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  min-height: calc(100vh - 60px); 
  padding: 20px; 
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
}

.panel { 
  background: rgba(15, 15, 15, 0.95); 
  padding: 40px 32px; 
  border-radius: 20px; 
  width: 100%; 
  max-width: 440px; 
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255,255,255,0.1); 
  color: #fff; 
  border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
}

h1 { 
  margin: 0 0 10px; 
  font-size: 32px; 
  background: linear-gradient(135deg, #fff 0%, #b3b3b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline { 
  margin: 0 0 25px; 
  color: #8892a6; 
  font-size: 14px;
}

.message {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: rgba(6, 193, 103, 0.15);
  border: 1px solid rgba(6, 193, 103, 0.3);
  color: #06c167;
}

.message.error {
  background: rgba(255, 68, 68, 0.15);
  border: 1px solid rgba(255, 68, 68, 0.3);
  color: #ff6b6b;
}

.message.info {
  background: rgba(0, 212, 255, 0.15);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.google-btn {
  width: 100%;
  padding: 14px 20px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-1px);
}

.google-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider:before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: rgba(255,255,255,0.1);
}

.divider span {
  background: rgba(15, 15, 15, 0.95);
  padding: 0 15px;
  position: relative;
  color: #6f7d91;
  font-size: 13px;
}

form { 
  display: flex; 
  flex-direction: column;
  gap: 12px; 
  margin-bottom: 20px;
}

input { 
  padding: 14px 16px; 
  border-radius: 10px; 
  border: 1px solid rgba(255,255,255,0.08); 
  background: rgba(0,0,0,0.3); 
  color: #fff; 
  font-size: 15px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #06c167;
  background: rgba(0,0,0,0.5);
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button[type="submit"] { 
  padding: 14px 22px; 
  border: none; 
  border-radius: 12px; 
  background: linear-gradient(135deg, #06c167, #04a554); 
  color: #fff; 
  font-weight: 600; 
  cursor: pointer; 
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(6, 193, 103, 0.3);
}

button[type="submit"]:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 193, 103, 0.4);
}

button[type="submit"]:disabled { 
  opacity: 0.5; 
  cursor: not-allowed;
  transform: none;
}

.toggle {
  text-align: center;
  margin: 0;
  font-size: 14px;
  color: #8892a6;
}

.toggle a {
  color: #06c167;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  cursor: pointer;
}

.toggle a:hover {
  text-decoration: underline;
}

.forgot {
  text-align: center;
  margin: 10px 0 0;
  font-size: 13px;
}

.forgot a {
  color: #00d4ff;
  text-decoration: none;
  cursor: pointer;
}

.forgot a:hover {
  text-decoration: underline;
}

.guest-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.guest-btn {
  width: 100%;
  padding: 12px 20px;
  border: 1px dashed rgba(255,255,255,0.2);
  border-radius: 10px;
  background: transparent;
  color: #8892a6;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.guest-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}

.guest-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.guest-note {
  text-align: center;
  margin: 10px 0 0;
  font-size: 12px;
  color: #6f7d91;
}

/* Password Reset Modal */
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
  backdrop-filter: blur(5px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: #0a0a0a;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal h3 {
  margin: 0 0 10px;
  color: #fff;
}

.modal p {
  margin: 0 0 20px;
  color: #8892a6;
  font-size: 14px;
}

.modal input {
  width: 100%;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-actions button:first-child {
  background: #06c167;
  color: #fff;
}

.modal-actions button:first-child:hover:not(:disabled) {
  background: #05a85a;
}

.modal-actions button.cancel {
  background: rgba(255,255,255,0.05);
  color: #8892a6;
  border: 1px solid rgba(255,255,255,0.1);
}

.modal-actions button.cancel:hover {
  background: rgba(255,255,255,0.08);
}

@media (max-width: 500px) {
  .panel {
    padding: 30px 24px;
  }

  h1 {
    font-size: 28px;
  }
}
</style>