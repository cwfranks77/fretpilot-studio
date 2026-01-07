<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-glow"></div>
        <div class="hero-grid"></div>
        <div class="floating-notes">
          <span class="note n1">♪</span>
          <span class="note n2">♫</span>
          <span class="note n3">♩</span>
          <span class="note n4">♬</span>
        </div>
      </div>
      <div class="hero-content">
        <div class="hero-pill">
          <span class="pill-dot"></span>
          <span>Join 12,000+ musicians worldwide</span>
        </div>
        <h1 class="hero-title">
          <span class="title-line">Master Any</span>
          <span class="title-line accent">Instrument</span>
          <span class="title-line small">with AI-Powered Learning</span>
        </h1>
        <p class="hero-instruments">
          <span>Guitar</span><span class="dot">•</span>
          <span>Piano</span><span class="dot">•</span>
          <span>Bass</span><span class="dot">•</span>
          <span>Drums</span><span class="dot">•</span>
          <span>Violin</span><span class="dot">•</span>
          <span>& More</span>
        </p>
        <p class="hero-description">
          Personalized lessons that adapt to your skill level. Practice smarter, 
          progress faster, and unlock your musical potential.
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="$emit('view-pricing')">
            <span>Start Free Trial</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="btn-ghost" @click="openFeature('chord-trainer')">
            <span class="play-icon">▶</span>
            Try Chord Trainer
          </button>
        </div>
        <div class="hero-metrics">
          <div class="metric">
            <span class="metric-value">500K+</span>
            <span class="metric-label">Lessons Completed</span>
          </div>
          <div class="metric-sep"></div>
          <div class="metric">
            <span class="metric-value">4.9★</span>
            <span class="metric-label">App Store Rating</span>
          </div>
          <div class="metric-sep"></div>
          <div class="metric">
            <span class="metric-value">50+</span>
            <span class="metric-label">Instruments</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Instruments Grid -->
    <section class="instruments-section">
      <div class="section-header">
        <span class="section-tag">INSTRUMENTS</span>
        <h2>Learn <em>Any</em> Instrument</h2>
        <p>From strings to keys to percussion — we've got you covered</p>
      </div>
      <div class="instruments-carousel">
        <div class="instrument-pill" v-for="inst in instruments" :key="inst.name">
          <span class="inst-icon">{{ inst.icon }}</span>
          <span class="inst-name">{{ inst.name }}</span>
          <span class="inst-count">{{ inst.lessons }}+</span>
        </div>
      </div>
    </section>

    <!-- Features Bento Grid -->
    <section class="features-section">
      <div class="section-header">
        <span class="section-tag">FEATURES</span>
        <h2>Everything You Need to<br/><em>Become a Better Musician</em></h2>
      </div>
      <div class="bento-grid">
        <div class="bento-card large" @click="openFeature('ai-lessons')">
          <div class="card-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L4 10L16 16L28 10L16 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M4 16L16 22L28 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 22L16 28L28 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>AI Lesson Generator</h3>
          <p>Get personalized lessons tailored to your goals, skill level, and favorite genres. Our AI adapts to how you learn.</p>
          <span class="card-link">Try it free →</span>
        </div>
        
        <div class="bento-card" @click="openFeature('chord-trainer')">
          <div class="card-icon orange">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2"/>
              <circle cx="16" cy="16" r="4" fill="currentColor"/>
            </svg>
          </div>
          <h3>Interactive Training</h3>
          <p>Master chords, scales, and techniques with real-time feedback.</p>
          <span class="card-link">Start training →</span>
        </div>
        
        <div class="bento-card" @click="openFeature('practice-analyzer')">
          <div class="card-icon teal">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4 24L10 18L16 22L22 12L28 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Practice Analytics</h3>
          <p>Record sessions, analyze timing, and get AI insights on improvement.</p>
          <span class="card-link">Analyze now →</span>
        </div>
        
        <div class="bento-card wide" @click="openFeature('jam-companion')">
          <div class="card-icon purple">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16H10V24H6V16Z" fill="currentColor"/>
              <path d="M14 12H18V24H14V12Z" fill="currentColor"/>
              <path d="M22 8H26V24H22V8Z" fill="currentColor"/>
            </svg>
          </div>
          <h3>Jam Companion</h3>
          <p>Generate backing tracks in any key, tempo, and style. Perfect for practice or songwriting sessions.</p>
          <span class="card-link">Start jamming →</span>
        </div>
        
        <div class="bento-card" @click="openFeature('scale-explorer')">
          <div class="card-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 8V24H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="20" r="2" fill="currentColor"/>
              <circle cx="16" cy="16" r="2" fill="currentColor"/>
              <circle cx="20" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h3>Scale Explorer</h3>
          <p>Interactive scale patterns across the fretboard and keyboard.</p>
          <span class="card-link">Explore →</span>
        </div>
        
        <div class="bento-card" @click="openFeature('metronome')">
          <div class="card-icon orange">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 6V16L22 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3>Pro Tools</h3>
          <p>Metronome, tuner, and essential practice tools built right in.</p>
          <span class="card-link">Open tools →</span>
        </div>
      </div>
    </section>

    <!-- Social Proof / Testimonials -->
    <section class="testimonials-section">
      <div class="section-header">
        <span class="section-tag">TESTIMONIALS</span>
        <h2>Musicians <em>Love</em> FretPilot</h2>
      </div>
      <div class="testimonials-track">
        <div class="testimonial" v-for="(t, i) in testimonials" :key="i">
          <div class="testimonial-rating">
            <span v-for="n in 5" :key="n">★</span>
          </div>
          <p class="testimonial-quote">"{{ t.quote }}"</p>
          <div class="testimonial-author">
            <div class="author-avatar">{{ t.initials }}</div>
            <div class="author-info">
              <span class="author-name">{{ t.name }}</span>
              <span class="author-meta">{{ t.meta }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="pricing-glow"></div>
      <div class="section-header light">
        <span class="section-tag">PRICING</span>
        <h2>Start Your Musical Journey</h2>
        <p>Join thousands of musicians improving every day</p>
      </div>
      <div class="pricing-cards">
        <div class="price-card">
          <span class="plan-name">Monthly</span>
          <div class="plan-price">
            <span class="currency">$</span>
            <span class="amount">9</span>
            <span class="period">.99/mo</span>
          </div>
          <button class="plan-btn" @click="$emit('view-pricing')">Get Started</button>
        </div>
        
        <div class="price-card featured">
          <span class="featured-tag">BEST VALUE</span>
          <span class="plan-name">Lifetime</span>
          <div class="plan-price">
            <span class="currency">$</span>
            <span class="amount">49</span>
            <span class="period">.99</span>
          </div>
          <span class="plan-note">One-time payment</span>
          <button class="plan-btn primary" @click="$emit('view-pricing')">Unlock Forever</button>
        </div>
        
        <div class="price-card">
          <span class="plan-name">Yearly</span>
          <div class="plan-price">
            <span class="currency">$</span>
            <span class="amount">99</span>
            <span class="period">.99/yr</span>
          </div>
          <span class="plan-note">Save 17%</span>
          <button class="plan-btn" @click="$emit('view-pricing')">Subscribe</button>
        </div>
      </div>
    </section>

    <!-- Beta Section -->
    <section class="beta-section" v-if="isTesterSignupAvailable()">
      <div class="beta-card">
        <div class="beta-icon">🧪</div>
        <div class="beta-content">
          <h3>Join Our Beta Program</h3>
          <p>Get <strong>FREE lifetime premium access</strong> in exchange for your feedback. Help us build the best music learning platform.</p>
          <div class="beta-perks">
            <span>✓ All premium features</span>
            <span>✓ Early access</span>
            <span>✓ Direct to developers</span>
            <span>✓ Forever free</span>
          </div>
        </div>
        <button class="beta-btn" @click="openTesterSignup">
          Apply Now
          <span class="spots">{{ spotsRemaining }} spots left</span>
        </button>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <h2>Ready to <em>Level Up?</em></h2>
      <p>Start learning today. No credit card required for free features.</p>
      <button class="btn-primary large" @click="openFeature('chord-trainer')">
        <span>Start Learning Free</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </section>

    <!-- Dev Access (Hidden) -->
    <div 
      class="dev-trigger"
      @click="handleLogoClick" 
      @mousedown="startLongPress"
      @mouseup="cancelLongPress"
      @mouseleave="cancelLongPress"
      @touchstart.prevent="startLongPress"
      @touchend="cancelLongPress"
    ></div>
    
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
    
    <Transition name="toast">
      <div v-if="showDevToast" class="dev-toast">{{ devToastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from 'vue'
import { isPremium, getTesterSignupUrl, getTesterCount, MAX_TESTERS, isTesterSignupAvailable as checkTesterAvailable } from '../services/featureFlags'

const DEV_PASSWORD = 'pw638256'
const showPasswordModal = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const passwordInputRef = ref(null)
const showDevToast = ref(false)
const devToastMessage = ref('')
let clickCount = 0
let clickTimer = null
let longPressTimer = null

const instruments = [
  { name: 'Guitar', icon: '🎸', lessons: 250 },
  { name: 'Piano', icon: '🎹', lessons: 200 },
  { name: 'Bass', icon: '🎸', lessons: 150 },
  { name: 'Ukulele', icon: '🪕', lessons: 120 },
  { name: 'Drums', icon: '🥁', lessons: 180 },
  { name: 'Violin', icon: '🎻', lessons: 100 },
  { name: 'Voice', icon: '🎤', lessons: 80 },
  { name: 'More...', icon: '🎵', lessons: 200 },
]

const testimonials = [
  {
    quote: "I've tried dozens of guitar apps. FretPilot is the first one that actually feels like having a real teacher. The AI lessons are incredibly personalized.",
    name: "Marcus Rodriguez",
    initials: "MR",
    meta: "Guitar, 2 years"
  },
  {
    quote: "Finally, an app that supports multiple instruments! I switch between piano and ukulele, and FretPilot tracks my progress on both seamlessly.",
    name: "Sarah Kim",
    initials: "SK",
    meta: "Piano & Ukulele"
  },
  {
    quote: "The practice analyzer changed everything. I can actually see where I'm making mistakes and the AI suggestions are spot-on. Worth every penny.",
    name: "James Thompson",
    initials: "JT",
    meta: "Bass, 5 years"
  }
]

const testerCount = ref(0)
const spotsRemaining = computed(() => Math.max(0, MAX_TESTERS - testerCount.value))

function isTesterSignupAvailable() {
  return checkTesterAvailable()
}

onMounted(() => {
  testerCount.value = getTesterCount()
})

function openTesterSignup() {
  if (!checkTesterAvailable()) {
    alert("Sorry, we've reached our limit of beta testers!")
    return
  }
  window.location.href = getTesterSignupUrl()
}

const emit = defineEmits(['view-pricing', 'open-feature'])

function openFeature(feature) {
  emit('open-feature', feature)
}

function handleLogoClick() {
  clickCount++
  if (clickTimer) clearTimeout(clickTimer)
  clickTimer = setTimeout(() => { clickCount = 0 }, 500)
  if (clickCount === 3) {
    showPasswordPrompt()
    clickCount = 0
  }
}

function startLongPress() {
  longPressTimer = setTimeout(() => { showPasswordPrompt() }, 3000)
}

function cancelLongPress() {
  if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null }
}

function showPasswordPrompt() {
  passwordInput.value = ''
  passwordError.value = ''
  showPasswordModal.value = true
  nextTick(() => { if (passwordInputRef.value) passwordInputRef.value.focus() })
}

function closePasswordModal() {
  showPasswordModal.value = false
  passwordInput.value = ''
  passwordError.value = ''
}

function submitPassword() {
  if (!passwordInput.value) { passwordError.value = 'Please enter a password'; return }
  if (passwordInput.value === DEV_PASSWORD) {
    closePasswordModal()
    localStorage.setItem('fp_developer_mode', '1')
    localStorage.setItem('fp_premium', '1')
    localStorage.setItem('fretpilot-user-email', 'charles@thefranksstandard.com')
    showToast('🔓 Developer Mode ACTIVATED!')
    setTimeout(() => { window.location.reload() }, 1500)
  } else {
    passwordError.value = 'Incorrect password'
    passwordInput.value = ''
    setTimeout(() => { passwordError.value = '' }, 2000)
  }
}

function showToast(message) {
  devToastMessage.value = message
  showDevToast.value = true
  setTimeout(() => { showDevToast.value = false }, 3000)
}
</script>

<style scoped>
.homepage {
  width: 100%;
  overflow-x: hidden;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 24px 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #0c0a09;
}

.hero-glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 70%;
  background: radial-gradient(ellipse at center, rgba(249, 115, 22, 0.15), transparent 60%);
  pointer-events: none;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent);
}

.floating-notes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  max-width: 100%;
}

.note {
  position: absolute;
  font-size: 2rem;
  color: rgba(249, 115, 22, 0.2);
  animation: float 8s ease-in-out infinite;
}

.n1 { top: 20%; left: 10%; animation-delay: 0s; }
.n2 { top: 60%; right: 10%; animation-delay: 2s; }
.n3 { top: 80%; left: 15%; animation-delay: 4s; }
.n4 { top: 30%; right: 5%; animation-delay: 6s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-30px) rotate(10deg); opacity: 0.4; }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  text-align: center;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.25);
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 0.9rem;
  color: #fb923c;
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease-out;
}

.pill-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero-title {
  margin: 0 0 24px;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.title-line {
  display: block;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 400;
  line-height: 1.05;
  color: #fafaf9;
  letter-spacing: -0.03em;
}

.title-line.accent {
  color: #f97316;
  font-style: italic;
}

.title-line.small {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 500;
  color: #78716c;
  margin-top: 16px;
  letter-spacing: 0;
}

.hero-instruments {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 1rem;
  color: #a8a29e;
  margin: 0 0 20px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.hero-instruments .dot {
  color: #57534e;
}

.hero-description {
  font-size: 1.15rem;
  color: #78716c;
  margin: 0 0 40px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  color: #fff;
  padding: 18px 36px;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px -8px rgba(249, 115, 22, 0.5);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px -8px rgba(249, 115, 22, 0.65);
}

.btn-primary.large {
  padding: 22px 48px;
  font-size: 1.15rem;
  border-radius: 16px;
}

.btn-primary svg {
  transition: transform 0.3s ease;
}

.btn-primary:hover svg {
  transform: translateX(4px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(250, 250, 249, 0.05);
  border: 1px solid rgba(250, 250, 249, 0.1);
  color: #fafaf9;
  padding: 18px 32px;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  background: rgba(250, 250, 249, 0.1);
  border-color: rgba(250, 250, 249, 0.2);
}

.play-icon {
  font-size: 0.8rem;
  opacity: 0.7;
}

.hero-metrics {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #fafaf9;
  letter-spacing: -0.02em;
}

.metric-label {
  font-size: 0.85rem;
  color: #78716c;
  margin-top: 4px;
}

.metric-sep {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, transparent, #44403c, transparent);
}

/* Instruments Section */
.instruments-section {
  padding: 100px 24px;
  background: linear-gradient(180deg, #0c0a09, #1c1917);
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #f97316;
  margin-bottom: 16px;
}

.section-header h2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  color: #fafaf9;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.section-header h2 em {
  font-style: italic;
  color: #f97316;
}

.section-header p {
  font-size: 1.1rem;
  color: #78716c;
  margin: 0;
}

.section-header.light h2 {
  color: #fafaf9;
}

.instruments-carousel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;
}

.instrument-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(250, 250, 249, 0.03);
  border: 1px solid rgba(250, 250, 249, 0.08);
  border-radius: 999px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.instrument-pill:hover {
  background: rgba(249, 115, 22, 0.1);
  border-color: rgba(249, 115, 22, 0.3);
  transform: translateY(-2px);
}

.inst-icon {
  font-size: 1.5rem;
}

.inst-name {
  font-weight: 600;
  color: #fafaf9;
}

.inst-count {
  font-size: 0.8rem;
  color: #78716c;
  background: rgba(250, 250, 249, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
}

/* Features Bento Grid */
.features-section {
  padding: 100px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.bento-card {
  background: rgba(250, 250, 249, 0.02);
  border: 1px solid rgba(250, 250, 249, 0.06);
  border-radius: 24px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.35s ease;
  position: relative;
  overflow: hidden;
}

.bento-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bento-card:hover {
  background: rgba(250, 250, 249, 0.04);
  border-color: rgba(249, 115, 22, 0.2);
  transform: translateY(-4px);
}

.bento-card:hover::before {
  opacity: 1;
}

.bento-card.large {
  grid-column: span 2;
}

.bento-card.wide {
  grid-column: span 2;
}

.card-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #f97316;
}

.card-icon.orange {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(251, 146, 60, 0.05));
  color: #fb923c;
}

.card-icon.teal {
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(20, 184, 166, 0.05));
  color: #14b8a6;
}

.card-icon.purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05));
  color: #a855f7;
}

.bento-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #fafaf9;
  margin: 0 0 12px;
}

.bento-card p {
  font-size: 0.95rem;
  color: #78716c;
  line-height: 1.6;
  margin: 0 0 16px;
}

.card-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f97316;
  transition: transform 0.2s ease;
  display: inline-block;
}

.bento-card:hover .card-link {
  transform: translateX(4px);
}

/* Testimonials */
.testimonials-section {
  padding: 100px 24px;
  background: #0c0a09;
  overflow: hidden;
}

.testimonials-track {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial {
  background: linear-gradient(180deg, rgba(250, 250, 249, 0.03), rgba(250, 250, 249, 0.01));
  border: 1px solid rgba(250, 250, 249, 0.06);
  border-radius: 24px;
  padding: 32px;
}

.testimonial-rating {
  color: #fbbf24;
  font-size: 1rem;
  margin-bottom: 16px;
  letter-spacing: 3px;
}

.testimonial-quote {
  font-size: 1rem;
  color: #d6d3d1;
  line-height: 1.7;
  margin: 0 0 24px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #fafaf9;
  font-size: 0.95rem;
}

.author-meta {
  font-size: 0.8rem;
  color: #78716c;
}

/* Pricing Section */
.pricing-section {
  padding: 100px 24px;
  background: linear-gradient(180deg, #1c1917, #0c0a09);
  position: relative;
  overflow: hidden;
}

.pricing-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 80%;
  background: radial-gradient(ellipse at center, rgba(249, 115, 22, 0.08), transparent 60%);
  pointer-events: none;
}

.pricing-cards {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.price-card {
  background: rgba(250, 250, 249, 0.02);
  border: 1px solid rgba(250, 250, 249, 0.08);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  min-width: 260px;
  transition: all 0.3s ease;
  position: relative;
}

.price-card:hover {
  border-color: rgba(249, 115, 22, 0.3);
  transform: translateY(-4px);
}

.price-card.featured {
  background: linear-gradient(180deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.02));
  border-color: rgba(249, 115, 22, 0.4);
  transform: scale(1.05);
  padding: 48px 40px;
}

.price-card.featured:hover {
  transform: scale(1.05) translateY(-4px);
}

.featured-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.plan-name {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #a8a29e;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: 8px;
}

.plan-price .currency {
  font-size: 1.5rem;
  font-weight: 600;
  color: #78716c;
}

.plan-price .amount {
  font-size: 3.5rem;
  font-weight: 700;
  color: #fafaf9;
  letter-spacing: -0.03em;
}

.plan-price .period {
  font-size: 1rem;
  color: #78716c;
}

.plan-note {
  display: block;
  font-size: 0.85rem;
  color: #f97316;
  margin-bottom: 24px;
}

.plan-btn {
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(250, 250, 249, 0.05);
  border: 1px solid rgba(250, 250, 249, 0.1);
  color: #fafaf9;
  margin-top: 16px;
}

.plan-btn:hover {
  background: rgba(250, 250, 249, 0.1);
  border-color: rgba(250, 250, 249, 0.2);
}

.plan-btn.primary {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  color: #fff;
  box-shadow: 0 8px 24px -8px rgba(249, 115, 22, 0.4);
}

.plan-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px -8px rgba(249, 115, 22, 0.5);
}

/* Beta Section */
.beta-section {
  padding: 60px 24px;
}

.beta-card {
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.02));
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 24px;
  padding: 48px;
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.beta-icon {
  font-size: 3rem;
}

.beta-content {
  flex: 1;
  min-width: 300px;
}

.beta-content h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.8rem;
  font-weight: 400;
  color: #fafaf9;
  margin: 0 0 12px;
}

.beta-content p {
  font-size: 1rem;
  color: #a8a29e;
  margin: 0 0 20px;
  line-height: 1.6;
}

.beta-content strong {
  color: #22c55e;
}

.beta-perks {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.beta-perks span {
  font-size: 0.9rem;
  color: #d6d3d1;
}

.beta-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  color: #fff;
  padding: 18px 40px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px -8px rgba(34, 197, 94, 0.5);
}

.beta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px -8px rgba(34, 197, 94, 0.6);
}

.beta-btn .spots {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Final CTA */
.final-cta {
  padding: 120px 24px;
  text-align: center;
  background: linear-gradient(180deg, #0c0a09, #1c1917 50%, #0c0a09);
}

.final-cta h2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #fafaf9;
  margin: 0 0 16px;
}

.final-cta h2 em {
  font-style: italic;
  color: #f97316;
}

.final-cta p {
  font-size: 1.15rem;
  color: #78716c;
  margin: 0 0 40px;
}

/* Animations */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Dev Access */
.dev-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 100;
}

.dev-trigger::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 4px;
  height: 4px;
  background: #3b82f6;
  border-radius: 50%;
  opacity: 0.6;
}

.dev-password-overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 10, 9, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(12px);
}

.dev-password-modal {
  background: #1c1917;
  border: 1px solid #292524;
  border-radius: 20px;
  padding: 40px;
  min-width: 340px;
}

.modal-header {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
  text-align: center;
  margin-bottom: 28px;
}

.password-input {
  width: 100%;
  padding: 16px 18px;
  font-size: 1rem;
  background: #0c0a09;
  border: 1px solid #292524;
  border-radius: 12px;
  color: #fafaf9;
  outline: none;
  margin-bottom: 24px;
  box-sizing: border-box;
  font-family: inherit;
}

.password-input:focus {
  border-color: #fbbf24;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.btn-cancel, .btn-submit {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.btn-cancel {
  background: #292524;
  color: #a8a29e;
}

.btn-submit {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #0c0a09;
}

.password-error {
  margin-top: 20px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #ef4444;
  text-align: center;
}

.dev-toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #1c1917;
  border: 1px solid #292524;
  color: #fafaf9;
  padding: 18px 28px;
  border-radius: 14px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 16px 48px -16px rgba(0, 0, 0, 0.5);
}

.toast-enter-active { animation: fadeInUp 0.3s ease-out; }
.toast-leave-active { animation: fadeInUp 0.3s ease-in reverse; }
.modal-enter-active { animation: fadeInUp 0.3s ease-out; }
.modal-leave-active { animation: fadeInUp 0.2s ease-in reverse; }

/* Responsive */
@media (max-width: 900px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-card.large,
  .bento-card.wide {
    grid-column: span 1;
  }
  .testimonials-track {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero { 
    min-height: auto; 
    padding: 80px 20px 60px; 
  }
  .hero-metrics { 
    flex-direction: column; 
    gap: 24px; 
  }
  .metric-sep { 
    display: none; 
  }
  .pricing-cards {
    flex-direction: column;
  }
  .price-card.featured {
    transform: none;
    order: -1;
  }
  .price-card.featured:hover {
    transform: translateY(-4px);
  }
  .beta-card {
    flex-direction: column;
    text-align: center;
  }
  .beta-perks {
    justify-content: center;
  }
}
</style>
