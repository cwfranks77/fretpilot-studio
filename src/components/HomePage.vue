<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <!-- Hidden dev access: Triple-click OR long-press (3 sec) the logo to unlock -->
        <div 
          class="hero-logo" 
          @click="handleLogoClick" 
          @mousedown="startLongPress"
          @mouseup="cancelLongPress"
          @mouseleave="cancelLongPress"
          @touchstart.prevent="startLongPress"
          @touchend="cancelLongPress"
          :class="{ 'dev-unlocked': devUnlocked, 'pressing': isLongPressing }"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="55" :stroke="devUnlocked ? '#ffd700' : '#06c167'" stroke-width="3" fill="none"/>
            <path d="M40 50 L60 30 L80 50 M60 30 L60 90" :stroke="devUnlocked ? '#ffd700' : '#06c167'" stroke-width="4" stroke-linecap="round"/>
            <circle cx="60" cy="70" r="8" :fill="devUnlocked ? '#ffd700' : '#06c167'"/>
          </svg>
          <!-- Dev unlock indicator -->
          <div v-if="devUnlocked" class="dev-badge">🔓 DEV</div>
        </div>
        <h1 class="hero-title">FretPilot Studio</h1>
        <p class="hero-subtitle">AI-Powered Music Learning Platform</p>
        <p class="hero-tagline">Train smarter. Play better. Master faster.</p>
        <div class="hero-cta">
          <button class="btn-primary" @click="$emit('view-pricing')">Get Started</button>
        </div>
        <!-- Dev mode toast notification -->
        <Transition name="toast">
          <div v-if="showDevToast" class="dev-toast">
            {{ devToastMessage }}
          </div>
        </Transition>
        
        <!-- Password prompt modal (hidden until triggered) -->
        <Transition name="modal">
          <div v-if="showPasswordModal" class="dev-password-overlay" @click.self="closePasswordModal">
            <div class="dev-password-modal">
              <div class="modal-header">🔐 Developer Access</div>
              <input 
                type="password" 
                v-model="passwordInput" 
                placeholder="Enter password"
                class="password-input"
                @keyup.enter="submitPassword"
                ref="passwordInputRef"
                autocomplete="off"
              />
              <div class="modal-buttons">
                <button class="btn-cancel" @click="closePasswordModal">Cancel</button>
                <button class="btn-submit" @click="submitPassword">Unlock</button>
              </div>
              <div v-if="passwordError" class="password-error">{{ passwordError }}</div>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features">
      <h2 class="section-title">🎯 Start Learning</h2>
      <div class="features-grid">
        <!-- FREE Features - Clickable -->
        <div class="feature-card clickable" @click="openFeature('chord-trainer')">
          <div class="feature-badge badge-free">FREE</div>
          <h3 class="feature-title">🎸 Chord Trainer</h3>
          <p class="feature-description">Master chords with interactive training, progress tracking, and achievement certificates.</p>
          <span class="feature-action">Start Training →</span>
        </div>

        <div class="feature-card clickable" @click="openFeature('metronome')">
          <div class="feature-badge badge-free">FREE</div>
          <h3 class="feature-title">🎵 Metronome & Tuner</h3>
          <p class="feature-description">Built-in metronome with tempo tap, visual beats, and chromatic guitar tuner.</p>
          <span class="feature-action">Open Tools →</span>
        </div>

        <div class="feature-card clickable" @click="openFeature('chord-library')">
          <div class="feature-badge badge-free">FREE</div>
          <h3 class="feature-title">📚 Chord Library</h3>
          <p class="feature-description">Multi-instrument chord library: Guitar, Bass, Ukulele, Piano, and Drums.</p>
          <span class="feature-action">Browse Chords →</span>
        </div>

        <!-- AI-Powered Features - NOW LIVE! -->
        <div class="feature-card clickable ai-feature" @click="openFeature('ai-lessons')">
          <div class="feature-badge badge-ai">✨ AI POWERED</div>
          <h3 class="feature-title">🤖 AI Lesson Generator</h3>
          <p class="feature-description">Custom lessons tailored to your skill level, goals, and preferred music style.</p>
          <span class="feature-action">Generate Lesson →</span>
        </div>

        <div class="feature-card clickable ai-feature" @click="openFeature('ai-video')">
          <div class="feature-badge badge-ai">✨ AI POWERED</div>
          <h3 class="feature-title">🎬 AI Video Lessons</h3>
          <p class="feature-description">Interactive step-by-step tutorials with animated fretboard and practice tools.</p>
          <span class="feature-action">Start Learning →</span>
        </div>

        <div class="feature-card clickable ai-feature" @click="openFeature('practice-analyzer')">
          <div class="feature-badge badge-ai">✨ AI POWERED</div>
          <h3 class="feature-title">📊 Practice Analyzer</h3>
          <p class="feature-description">Record your practice, get AI feedback on timing, stability, and see mistake heatmaps.</p>
          <span class="feature-action">Analyze Practice →</span>
        </div>

        <div class="feature-card clickable ai-feature" @click="openFeature('jam-companion')">
          <div class="feature-badge badge-ai">✨ AI POWERED</div>
          <h3 class="feature-title">🎹 Jam Companion</h3>
          <p class="feature-description">Generate chord progressions in any key, tempo, and style for practice or songwriting.</p>
          <span class="feature-action">Start Jamming →</span>
        </div>

        <div class="feature-card clickable ai-feature" @click="openFeature('scale-explorer')">
          <div class="feature-badge badge-ai">✨ AI POWERED</div>
          <h3 class="feature-title">🎼 Scale Explorer</h3>
          <p class="feature-description">Interactive scale patterns, modes, and positions across the entire fretboard.</p>
          <span class="feature-action">Explore Scales →</span>
        </div>

        <!-- Coming Soon Features -->
        <div class="feature-card coming-soon">
          <div class="feature-badge badge-coming">COMING SOON</div>
          <h3 class="feature-title">🎙️ Music Studio</h3>
          <p class="feature-description">Multi-track recording, Bluetooth instrument input, effects, and song creation.</p>
          <span class="coming-tag">🚧 In Development</span>
        </div>
      </div>
    </section>

    <!-- Beta Tester CTA -->
    <section class="tester-cta">
      <div class="tester-cta-content">
        <div class="tester-badge-large">🧪 BETA</div>
        <h2>Become a Beta Tester!</h2>
        <p>Get <strong>FREE lifetime premium access</strong> in exchange for testing and feedback.</p>
        <button class="btn-tester" @click="openTesterSignup">Join Beta Program →</button>
        <span class="tester-spots" v-if="spotsRemaining <= 20">{{ spotsRemaining }} spots remaining!</span>
      </div>
    </section>

    <!-- Premium CTA Section -->
    <section class="premium-cta">
      <div class="premium-cta-content">
        <h2>Want Full Access?</h2>
        <p>Unlock all premium features including unlimited AI lessons, practice analysis, and more.</p>
        <button class="btn-primary" @click="$emit('view-pricing')">Go Premium - $9.99/month</button>
      </div>
    </section>

    <!-- Store Section -->
    <section class="store-section">
      <div class="store-content">
        <div class="store-text">
          <h2>Shop The Franks Standard</h2>
          <p>Premium guitars, pro audio, and musician gear. Quality is our standard.</p>
          <button class="btn-secondary">Visit Store</button>
        </div>
        <div class="store-visual">
          <div class="guitar-neck">
            <div class="fret"></div>
            <div class="fret"></div>
            <div class="fret"></div>
            <div class="fret"></div>
            <div class="fret"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Practice Tips Section -->
    <section class="tips-section">
      <div class="tips-card">
        <h3>Practice Tips</h3>
        <ul>
          <li>Smooth is smooth. Smooth is fast.</li>
          <li>Use a metronome, increase BPM gradually.</li>
          <li>Focus on accuracy before speed.</li>
          <li>Practice daily, even if just 15 minutes.</li>
        </ul>
        <button class="btn-link">Keep going →</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { defineComponent, h, ref, nextTick, computed, onMounted } from 'vue'
import { isPremium, getTesterSignupUrl, getTesterCount, MAX_TESTERS, isTesterSignupAvailable } from '../services/featureFlags'

// Developer password
const DEV_PASSWORD = 'pw638256'

// Developer access state
const devUnlocked = ref(checkDevMode())
const showDevToast = ref(false)
const devToastMessage = ref('')
const isLongPressing = ref(false)
const showPasswordModal = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const passwordInputRef = ref(null)
let clickCount = 0
let clickTimer = null
let longPressTimer = null

// Check if already in dev mode
function checkDevMode() {
  try {
    return localStorage.getItem('fp_developer_mode') === '1' || isPremium()
  } catch (e) {
    return false
  }
}

// Handle logo click - triple click to show password prompt
function handleLogoClick() {
  clickCount++
  
  if (clickTimer) clearTimeout(clickTimer)
  
  clickTimer = setTimeout(() => {
    clickCount = 0
  }, 500) // Reset after 500ms
  
  if (clickCount === 3) {
    // Triple click detected - show password modal
    showPasswordPrompt()
    clickCount = 0
  } else if (clickCount === 2) {
    // Double click - show hint
    showToast('One more click... 🔑')
  }
}

// Long press (hold for 3 seconds) to show password prompt
function startLongPress() {
  isLongPressing.value = true
  longPressTimer = setTimeout(() => {
    showPasswordPrompt()
    isLongPressing.value = false
  }, 3000) // 3 seconds
}

function cancelLongPress() {
  isLongPressing.value = false
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

// Show the password modal
function showPasswordPrompt() {
  passwordInput.value = ''
  passwordError.value = ''
  showPasswordModal.value = true
  // Focus the input after modal opens
  nextTick(() => {
    if (passwordInputRef.value) {
      passwordInputRef.value.focus()
    }
  })
}

// Close password modal
function closePasswordModal() {
  showPasswordModal.value = false
  passwordInput.value = ''
  passwordError.value = ''
}

// Submit password - FIXED: proper password check
function submitPassword() {
  const entered = passwordInput.value
  
  // Debug: log what's being compared
  console.log('Password check:', { entered, expected: DEV_PASSWORD, match: entered === DEV_PASSWORD })
  
  if (!entered) {
    passwordError.value = 'Please enter a password'
    return
  }
  
  if (entered === DEV_PASSWORD) {
    // Correct password - activate dev mode
    console.log('Password correct! Activating dev mode...')
    closePasswordModal()
    activateDevMode()
  } else {
    // Wrong password
    passwordError.value = 'Incorrect password'
    passwordInput.value = ''
    // Clear error after 2 seconds
    setTimeout(() => {
      passwordError.value = ''
    }, 2000)
  }
}

function activateDevMode() {
  try {
    // Directly set localStorage values
    localStorage.setItem('fp_developer_mode', '1')
    localStorage.setItem('fp_premium', '1')
    localStorage.setItem('fretpilot-user-email', 'charles@thefranksstandard.com')
    
    console.log('Dev mode activated! localStorage set.')
    
    // Update UI immediately
    devUnlocked.value = true
    showToast('🔓 Developer Mode ACTIVATED! Refreshing...')
    
    // Reload page after showing message
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (error) {
    console.error('Failed to enable dev mode:', error)
    showToast('⚠️ Failed to enable dev mode')
  }
}

function showToast(message) {
  devToastMessage.value = message
  showDevToast.value = true
  setTimeout(() => {
    showDevToast.value = false
  }, 3000)
}

// Tester signup
const testerCount = ref(0)
const spotsRemaining = computed(() => Math.max(0, MAX_TESTERS - testerCount.value))

onMounted(() => {
  testerCount.value = getTesterCount()
})

function openTesterSignup() {
  if (!isTesterSignupAvailable()) {
    alert('Sorry, we\'ve reached our limit of beta testers! Check back later.')
    return
  }
  window.location.href = getTesterSignupUrl()
}

// Emit for opening features
const emit = defineEmits(['view-pricing', 'open-feature'])

function openFeature(feature) {
  emit('open-feature', feature)
}
</script>

<style scoped>
.homepage {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 60px 0 80px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-logo {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: transform 0.3s;
}

.hero-logo:active {
  transform: scale(0.95);
}

.hero-logo.pressing svg {
  animation: pressPulse 3s linear forwards;
}

@keyframes pressPulse {
  0% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.2)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5)); transform: scale(1.05); }
  100% { filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1)); transform: scale(1.1); }
}

.hero-logo.dev-unlocked svg {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
  animation: devPulse 2s infinite;
}

@keyframes devPulse {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.4)); }
  50% { filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)); }
}

.dev-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #000;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  animation: badgeBounce 0.5s ease-out;
}

@keyframes badgeBounce {
  0% { transform: translateX(-50%) scale(0); }
  50% { transform: translateX(-50%) scale(1.2); }
  100% { transform: translateX(-50%) scale(1); }
}

.dev-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 215, 0, 0.3);
  z-index: 1000;
}

.toast-enter-active {
  animation: toastIn 0.3s ease-out;
}

.toast-leave-active {
  animation: toastOut 0.3s ease-in;
}

@keyframes toastIn {
  0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toastOut {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}

/* Password Modal Styles */
.dev-password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
}

.dev-password-modal {
  background: linear-gradient(135deg, #1a1a2e, #0f0f1a);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 32px;
  min-width: 320px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.modal-header {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  text-align: center;
  margin-bottom: 24px;
}

.password-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 1.1rem;
  background: #0a0a14;
  border: 2px solid #2a2a3a;
  border-radius: 10px;
  color: #fff;
  outline: none;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.password-input:focus {
  border-color: #ffd700;
}

.password-input::placeholder {
  color: #555;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.btn-cancel, .btn-submit {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-cancel {
  background: #2a2a3a;
  color: #8892a6;
}

.btn-cancel:hover {
  background: #3a3a4a;
  color: #fff;
}

.btn-submit {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #000;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
}

.password-error {
  margin-top: 16px;
  padding: 10px;
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.4);
  border-radius: 8px;
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
}

/* Modal animations */
.modal-enter-active {
  animation: modalIn 0.3s ease-out;
}

.modal-leave-active {
  animation: modalOut 0.2s ease-in;
}

@keyframes modalIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes modalOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.9); }
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #fff, #b3b3b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #06c167;
  margin: 0 0 12px;
  font-weight: 600;
}

.hero-tagline {
  font-size: 1.2rem;
  color: #8892a6;
  margin: 0 0 32px;
}

.hero-cta {
  margin-top: 32px;
}

.btn-primary {
  background: linear-gradient(135deg, #06c167, #05a557);
  border: none;
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 24px -8px rgba(6, 193, 103, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px -8px rgba(6, 193, 103, 0.6);
}

.btn-secondary {
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  border-color: #06c167;
  color: #fff;
}

.btn-link {
  background: none;
  border: none;
  color: #06c167;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-top: 16px;
}

.btn-link:hover {
  text-decoration: underline;
}

/* Features Grid */
.features {
  margin: 60px 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: #fff;
  margin-bottom: 32px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-card {
  background: linear-gradient(135deg, #0a0a12, #0f1020);
  border: 2px solid #1a1a2a;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
  position: relative;
}

.feature-card:hover {
  border-color: #2a2a3a;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.4);
}

.feature-card.clickable {
  cursor: pointer;
}

.feature-card.clickable:hover {
  border-color: #06c167;
  box-shadow: 0 12px 32px -8px rgba(6, 193, 103, 0.2);
}

.feature-card.premium-locked {
  cursor: pointer;
  opacity: 0.85;
}

.feature-card.premium-locked:hover {
  border-color: #6c5ce7;
  box-shadow: 0 12px 32px -8px rgba(108, 92, 231, 0.2);
}

.feature-card.coming-soon {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: rgba(255, 165, 0, 0.3);
}

.feature-card.coming-soon:hover {
  transform: none;
  border-color: rgba(255, 165, 0, 0.3);
  box-shadow: none;
}

.feature-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-free {
  background: rgba(6, 193, 103, 0.2);
  color: #06c167;
  border: 1px solid rgba(6, 193, 103, 0.3);
}

.badge-premium {
  background: rgba(108, 92, 231, 0.2);
  color: #6c5ce7;
  border: 1px solid rgba(108, 92, 231, 0.3);
}

.badge-coming {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
  border: 1px solid rgba(255, 165, 0, 0.3);
}

.badge-ai {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.5);
  animation: aiGlow 2s ease-in-out infinite;
}

@keyframes aiGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.6); }
}

.feature-card.ai-feature {
  border-color: rgba(139, 92, 246, 0.3);
  background: linear-gradient(135deg, #0a0a12, #12101f);
}

.feature-card.ai-feature:hover {
  border-color: #8b5cf6;
  box-shadow: 0 12px 32px -8px rgba(139, 92, 246, 0.3);
}

.feature-card.ai-feature .feature-action {
  color: #a78bfa;
}

.feature-card.ai-feature:hover .feature-action {
  color: #c4b5fd;
}

.feature-title {
  font-size: 1.25rem;
  margin: 0 0 10px;
  color: #fff;
  font-weight: 600;
  padding-right: 80px;
}

.feature-description {
  color: #8892a6;
  line-height: 1.5;
  margin: 0 0 16px;
  font-size: 0.9rem;
}

.feature-action {
  display: inline-block;
  color: #06c167;
  font-weight: 600;
  font-size: 0.9rem;
  transition: transform 0.2s;
}

.feature-card.clickable:hover .feature-action {
  transform: translateX(4px);
}

.coming-tag {
  display: inline-block;
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.premium-tag {
  display: inline-block;
  color: #6c5ce7;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Tester CTA */
.tester-cta {
  margin: 60px 0;
  text-align: center;
  padding: 48px 24px;
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.08), rgba(255, 100, 0, 0.05));
  border-radius: 24px;
  border: 2px solid rgba(255, 165, 0, 0.25);
  position: relative;
  overflow: hidden;
}

.tester-cta::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255, 165, 0, 0.05) 0%, transparent 50%);
  animation: testerGlow 8s ease-in-out infinite;
}

@keyframes testerGlow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10%, 10%); }
}

.tester-cta-content {
  position: relative;
  z-index: 1;
}

.tester-badge-large {
  display: inline-block;
  background: linear-gradient(135deg, #ffa500, #ff6b00);
  color: #fff;
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(255, 165, 0, 0.3);
}

.tester-cta-content h2 {
  font-size: 2rem;
  margin: 0 0 12px;
  color: #fff;
}

.tester-cta-content p {
  font-size: 1.1rem;
  color: #8892a6;
  margin: 0 0 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.tester-cta-content p strong {
  color: #ffa500;
}

.btn-tester {
  background: linear-gradient(135deg, #ffa500, #ff6b00);
  border: none;
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 24px -8px rgba(255, 165, 0, 0.4);
}

.btn-tester:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px -8px rgba(255, 165, 0, 0.6);
}

.tester-spots {
  display: block;
  margin-top: 16px;
  color: #ff6b6b;
  font-weight: 600;
  font-size: 0.95rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Premium CTA */
.premium-cta {
  margin: 80px 0;
  text-align: center;
  padding: 60px 24px;
  background: linear-gradient(135deg, rgba(6, 193, 103, 0.1), rgba(108, 92, 231, 0.1));
  border-radius: 24px;
  border: 2px solid rgba(6, 193, 103, 0.2);
}

.premium-cta-content h2 {
  font-size: 2.5rem;
  margin: 0 0 16px;
  color: #fff;
}

.premium-cta-content p {
  font-size: 1.2rem;
  color: #8892a6;
  margin: 0 0 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Store Section */
.store-section {
  margin: 80px 0;
  padding: 60px 24px;
  background: #0a0a0a;
  border-radius: 24px;
  border: 2px solid #1a1a1a;
}

.store-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.store-text h2 {
  font-size: 2.2rem;
  margin: 0 0 16px;
  color: #fff;
}

.store-text p {
  font-size: 1.1rem;
  color: #8892a6;
  margin: 0 0 24px;
  line-height: 1.6;
}

.store-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.guitar-neck {
  width: 200px;
  height: 300px;
  background: linear-gradient(180deg, #2a2a2a, #1a1a1a);
  border-radius: 12px;
  position: relative;
  border: 2px solid #3a3a3a;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 0;
}

.fret {
  width: 100%;
  height: 2px;
  background: #4a4a4a;
  margin: 8px 0;
}

/* Tips Section */
.tips-section {
  margin: 80px 0;
}

.tips-card {
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.tips-card h3 {
  font-size: 1.6rem;
  margin: 0 0 20px;
  color: #fff;
}

.tips-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}

.tips-card li {
  color: #8892a6;
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
  line-height: 1.6;
}

.tips-card li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: #06c167;
}

@media (max-width: 768px) {
  .homepage {
    padding: 24px 16px;
  }

  .hero {
    padding: 40px 0 60px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .store-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .premium-cta {
    padding: 40px 20px;
  }

  .premium-cta-content h2 {
    font-size: 2rem;
  }
}

/* Tips Section */
.tips-section {
  margin: 80px 0;
}

.tips-card {
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.tips-card h3 {
  font-size: 1.6rem;
  margin: 0 0 20px;
  color: #fff;
}

.tips-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}

.tips-card li {
  color: #8892a6;
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
  line-height: 1.6;
}

.tips-card li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: #06c167;
}

@media (max-width: 768px) {
  .homepage {
    padding: 24px 16px;
  }

  .hero {
    padding: 40px 0 60px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .store-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .premium-cta {
    padding: 40px 20px;
  }

  .premium-cta-content h2 {
    font-size: 2rem;
  }
}
</style>
