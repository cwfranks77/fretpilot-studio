<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">🎵</span>
          <span>Trusted by 12,000+ musicians worldwide</span>
        </div>
        <h1 class="hero-title">Master Any Instrument<br/>with <span class="highlight">AI-Powered</span> Learning</h1>
        <p class="hero-subtitle">Guitar • Bass • Piano • Ukulele • Drums • Violin & More</p>
        <p class="hero-description">
          Personalized lessons that adapt to your skill level. Practice smarter, progress faster, 
          and track your journey from beginner to pro.
        </p>
        <div class="hero-cta">
          <button class="btn-primary" @click="$emit('view-pricing')">
            Start Free Trial
            <span class="btn-arrow">→</span>
          </button>
          <button class="btn-secondary" @click="openFeature('chord-trainer')">
            Try Chord Trainer
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">500K+</span>
            <span class="stat-label">Lessons Completed</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">4.9</span>
            <span class="stat-label">App Store Rating</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">50+</span>
            <span class="stat-label">Instruments</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Instruments Showcase -->
    <section class="instruments-section">
      <h2 class="section-title">Learn Any Instrument</h2>
      <p class="section-subtitle">From strings to keys to percussion — we've got you covered</p>
      <div class="instruments-grid">
        <div class="instrument-card" v-for="inst in instruments" :key="inst.name">
          <div class="instrument-icon">{{ inst.icon }}</div>
          <h3>{{ inst.name }}</h3>
          <p>{{ inst.lessons }}+ lessons</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="features-header">
        <span class="features-badge">FEATURES</span>
        <h2>Everything You Need to<br/>Become a Better Musician</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card" @click="openFeature('ai-lessons')">
          <div class="feature-icon-wrap">
            <div class="feature-icon">🤖</div>
          </div>
          <h3>AI Lesson Generator</h3>
          <p>Get personalized lessons tailored to your goals, skill level, and favorite genres.</p>
          <span class="feature-link">Try it free →</span>
        </div>
        
        <div class="feature-card" @click="openFeature('chord-trainer')">
          <div class="feature-icon-wrap">
            <div class="feature-icon">🎯</div>
          </div>
          <h3>Interactive Training</h3>
          <p>Master chords, scales, and techniques with real-time feedback and progress tracking.</p>
          <span class="feature-link">Start training →</span>
        </div>
        
        <div class="feature-card" @click="openFeature('practice-analyzer')">
          <div class="feature-icon-wrap">
            <div class="feature-icon">📊</div>
          </div>
          <h3>Practice Analytics</h3>
          <p>Record sessions, analyze your timing, and get AI insights on how to improve.</p>
          <span class="feature-link">Analyze now →</span>
        </div>
        
        <div class="feature-card" @click="openFeature('jam-companion')">
          <div class="feature-icon-wrap">
            <div class="feature-icon">🎹</div>
          </div>
          <h3>Jam Companion</h3>
          <p>Generate backing tracks in any key, tempo, and style. Perfect for practice or songwriting.</p>
          <span class="feature-link">Start jamming →</span>
        </div>
        
        <div class="feature-card" @click="openFeature('scale-explorer')">
          <div class="feature-icon-wrap">
            <div class="feature-icon">🎼</div>
          </div>
          <h3>Scale Explorer</h3>
          <p>Interactive scale patterns and modes across the entire fretboard and keyboard.</p>
          <span class="feature-link">Explore scales →</span>
        </div>
        
        <div class="feature-card" @click="openFeature('metronome')">
          <div class="feature-icon-wrap">
            <div class="feature-icon">⏱️</div>
          </div>
          <h3>Pro Tools</h3>
          <p>Metronome, tuner, and essential practice tools built right in. Always ready when you are.</p>
          <span class="feature-link">Open tools →</span>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <h2 class="section-title">What Musicians Are Saying</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"I've tried dozens of guitar apps. FretPilot is the first one that actually feels like having a real teacher. The AI lessons are incredibly personalized."</p>
          <div class="testimonial-author">
            <div class="author-avatar">MR</div>
            <div class="author-info">
              <span class="author-name">Marcus Rodriguez</span>
              <span class="author-detail">Guitar, 2 years</span>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"Finally, an app that supports multiple instruments! I switch between piano and ukulele, and FretPilot tracks my progress on both seamlessly."</p>
          <div class="testimonial-author">
            <div class="author-avatar">SK</div>
            <div class="author-info">
              <span class="author-name">Sarah Kim</span>
              <span class="author-detail">Piano & Ukulele</span>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"The practice analyzer changed everything. I can actually see where I'm making mistakes and the AI suggestions are spot-on. Worth every penny."</p>
          <div class="testimonial-author">
            <div class="author-avatar">JT</div>
            <div class="author-info">
              <span class="author-name">James Thompson</span>
              <span class="author-detail">Bass, 5 years</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing CTA -->
    <section class="pricing-cta">
      <div class="pricing-content">
        <div class="pricing-badge">LIMITED TIME</div>
        <h2>Start Your Musical Journey Today</h2>
        <p>Join thousands of musicians improving every day with FretPilot Studio</p>
        <div class="pricing-options">
          <div class="price-card">
            <h3>Monthly</h3>
            <div class="price">$9.99<span>/mo</span></div>
            <button class="btn-outline" @click="$emit('view-pricing')">Get Started</button>
          </div>
          <div class="price-card featured">
            <div class="price-badge">BEST VALUE</div>
            <h3>Lifetime</h3>
            <div class="price">$49.99<span>one-time</span></div>
            <button class="btn-primary" @click="$emit('view-pricing')">Unlock Forever</button>
            <p class="price-note">Pay once, learn forever</p>
          </div>
          <div class="price-card">
            <h3>Yearly</h3>
            <div class="price">$99.99<span>/yr</span></div>
            <button class="btn-outline" @click="$emit('view-pricing')">Save 17%</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Beta Tester Section -->
    <section class="beta-section" v-if="isTesterSignupAvailable()">
      <div class="beta-content">
        <div class="beta-badge">🧪 BETA PROGRAM</div>
        <h2>Join Our Beta Testers</h2>
        <p>Get <strong>FREE lifetime premium access</strong> in exchange for your feedback. Help us build the best music learning platform.</p>
        <div class="beta-perks">
          <div class="perk">✓ All premium features unlocked</div>
          <div class="perk">✓ Early access to new instruments</div>
          <div class="perk">✓ Direct line to developers</div>
          <div class="perk">✓ Lifetime access — forever free</div>
        </div>
        <button class="btn-beta" @click="openTesterSignup">
          Apply for Beta Access
          <span class="spots-left">{{ spotsRemaining }} spots left</span>
        </button>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <h2>Ready to Level Up?</h2>
      <p>Start learning today. No credit card required for free features.</p>
      <button class="btn-primary large" @click="openFeature('chord-trainer')">
        Start Learning Free →
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
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
    radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255, 119, 48, 0.15), transparent),
    radial-gradient(ellipse 50% 30% at 20% 80%, rgba(34, 197, 94, 0.15), transparent),
    linear-gradient(180deg, #0a0a0f 0%, #0f0f18 50%, #0a0a0f 100%);
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #22c55e;
  margin-bottom: 32px;
  animation: fadeInDown 0.6s ease-out;
}

.badge-icon {
  font-size: 1rem;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 24px;
  color: #fff;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.hero-title .highlight {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #a1a1aa;
  margin: 0 0 16px;
  font-weight: 500;
  letter-spacing: 0.1em;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.hero-description {
  font-size: 1.1rem;
  color: #71717a;
  margin: 0 0 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.hero-cta {
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
  gap: 8px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 32px -8px rgba(34, 197, 94, 0.5);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px -8px rgba(34, 197, 94, 0.6);
}

.btn-primary.large {
  padding: 20px 48px;
  font-size: 1.2rem;
}

.btn-arrow {
  transition: transform 0.3s;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.btn-outline:hover {
  border-color: #22c55e;
  color: #22c55e;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 0.85rem;
  color: #71717a;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

/* Instruments Section */
.instruments-section {
  padding: 100px 24px;
  background: linear-gradient(180deg, transparent, rgba(34, 197, 94, 0.03), transparent);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: #71717a;
  margin: 0 0 48px;
}

.instruments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.instrument-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px 16px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.instrument-card:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  transform: translateY(-4px);
}

.instrument-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.instrument-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.instrument-card p {
  font-size: 0.8rem;
  color: #71717a;
  margin: 0;
}

/* Features Section */
.features-section {
  padding: 100px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 60px;
}

.features-badge {
  display: inline-block;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.features-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(34, 197, 94, 0.3);
  transform: translateY(-4px);
}

.feature-icon-wrap {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon {
  font-size: 1.8rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px;
}

.feature-card p {
  font-size: 0.95rem;
  color: #71717a;
  line-height: 1.6;
  margin: 0 0 16px;
}

.feature-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: #22c55e;
  transition: transform 0.2s;
  display: inline-block;
}

.feature-card:hover .feature-link {
  transform: translateX(4px);
}

/* Testimonials */
.testimonials-section {
  padding: 100px 24px;
  background: rgba(0, 0, 0, 0.3);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 48px auto 0;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
}

.testimonial-stars {
  color: #fbbf24;
  font-size: 1.1rem;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.testimonial-text {
  font-size: 1rem;
  color: #d4d4d8;
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
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

.author-detail {
  font-size: 0.8rem;
  color: #71717a;
}

/* Pricing CTA */
.pricing-cta {
  padding: 100px 24px;
}

.pricing-content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.pricing-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.pricing-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
}

.pricing-content > p {
  font-size: 1.1rem;
  color: #71717a;
  margin: 0 0 48px;
}

.pricing-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  align-items: center;
}

.price-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px 24px;
  position: relative;
}

.price-card.featured {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.4);
  transform: scale(1.05);
}

.price-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.price-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #a1a1aa;
  margin: 0 0 16px;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
}

.price span {
  font-size: 1rem;
  font-weight: 400;
  color: #71717a;
}

.price-note {
  font-size: 0.85rem;
  color: #22c55e;
  margin: 12px 0 0;
}

/* Beta Section */
.beta-section {
  padding: 80px 24px;
  margin: 40px 24px;
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.05));
  border: 1px solid rgba(251, 146, 60, 0.2);
  border-radius: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.beta-content {
  text-align: center;
}

.beta-badge {
  display: inline-block;
  background: linear-gradient(135deg, #fb923c, #f97316);
  color: #fff;
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
}

.beta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
}

.beta-content > p {
  font-size: 1.1rem;
  color: #a1a1aa;
  margin: 0 0 32px;
}

.beta-content strong {
  color: #fb923c;
}

.beta-perks {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 32px;
  margin-bottom: 32px;
}

.perk {
  color: #d4d4d8;
  font-size: 0.95rem;
}

.btn-beta {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #fb923c, #f97316);
  border: none;
  color: #fff;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 32px -8px rgba(249, 115, 22, 0.5);
}

.btn-beta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px -8px rgba(249, 115, 22, 0.6);
}

.spots-left {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Final CTA */
.final-cta {
  padding: 100px 24px;
  text-align: center;
}

.final-cta h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
}

.final-cta p {
  font-size: 1.1rem;
  color: #71717a;
  margin: 0 0 32px;
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

.dev-password-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
}

.dev-password-modal {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 16px;
  padding: 32px;
  min-width: 320px;
}

.modal-header {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
  text-align: center;
  margin-bottom: 24px;
}

.password-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  background: #09090b;
  border: 1px solid #27272a;
  border-radius: 10px;
  color: #fff;
  outline: none;
  margin-bottom: 20px;
  box-sizing: border-box;
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
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: #27272a;
  color: #a1a1aa;
}

.btn-submit {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
}

.password-error {
  margin-top: 16px;
  padding: 10px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  color: #ef4444;
  text-align: center;
}

.dev-toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #18181b;
  border: 1px solid #27272a;
  color: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1000;
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

.toast-enter-active { animation: fadeInUp 0.3s ease-out; }
.toast-leave-active { animation: fadeInUp 0.3s ease-in reverse; }
.modal-enter-active { animation: fadeInUp 0.3s ease-out; }
.modal-leave-active { animation: fadeInUp 0.2s ease-in reverse; }

/* Responsive */
@media (max-width: 768px) {
  .hero { min-height: auto; padding: 60px 20px; }
  .hero-stats { flex-direction: column; gap: 20px; }
  .stat-divider { display: none; }
  .features-grid { grid-template-columns: 1fr; }
  .pricing-options { grid-template-columns: 1fr; }
  .price-card.featured { transform: none; }
  .testimonials-grid { grid-template-columns: 1fr; }
}
</style>
