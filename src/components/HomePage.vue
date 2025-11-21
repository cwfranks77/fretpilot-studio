<template>
  <div class="home-page">
    <!-- Beta Access Banner -->
    <div class="beta-banner" v-if="!hideBetaBanner">
      <div class="beta-content">
        <span class="beta-badge">🚀 BETA LAUNCH</span>
        <p class="beta-text">Join our beta testers! Get early access + exclusive perks</p>
        <button @click="showBetaModal = true" class="beta-cta">Sign Up Free</button>
        <button @click="hideBetaBanner = true" class="beta-close">✕</button>
      </div>
    </div>

    <div class="hero">
      <img class="hero-image animate-float" src="/images/guitar-hero.svg" alt="FretPilot hero" />
      <h1 class="hero-title">🎸 FretPilot</h1>
      <p class="hero-tagline">AI-Powered Music Learning Platform</p>
      <p class="hero-subtitle">Train smarter. Play better. Master faster.</p>
      <button @click="showBetaModal = true" class="hero-beta-btn">🎸 Join Beta Waitlist</button>
    </div>

    <div class="feature-grid">
      <div class="feature-card" @click="$emit('navigate', 'trainer')">
        <div class="feature-icon">🎯</div>
        <h3>Chord Trainer</h3>
        <p>Master chords with interactive training, progress tracking, and achievement certificates</p>
        <div class="feature-badge free">FREE</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'ai')">
        <div class="feature-icon">🤖</div>
        <h3>AI Lesson Generator</h3>
        <p>Custom lessons tailored to your skill level, goals, and preferred music style</p>
        <div class="feature-badge" :class="quota > 0 ? 'free' : 'premium'">
          {{ quota > 0 ? `${quota} FREE TODAY` : 'PREMIUM' }}
        </div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'videolessons')">
        <div class="feature-icon">🎬</div>
        <h3>AI Video Lessons</h3>
        <p>Generate custom instructional videos with AI - perfect for visual learners</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'studio')">
        <div class="feature-icon">🎙️</div>
        <h3>Music Studio</h3>
        <p>Multi-track recording, Bluetooth instrument input, effects, and song creation</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'practice')">
        <div class="feature-icon">📊</div>
        <h3>Practice Analyzer</h3>
        <p>Record your practice, get AI feedback on timing, stability, and see mistake heatmaps</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'jam')">
        <div class="feature-icon">🎵</div>
        <h3>Jam Companion</h3>
        <p>Generate chord progressions in any key, tempo, and style for practice or songwriting</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'metronome')">
        <div class="feature-icon">⏱️</div>
        <h3>Metronome & Tuner</h3>
        <p>Built-in metronome with tempo tap, visual beats, and chromatic guitar tuner</p>
        <div class="feature-badge free">FREE</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'library')">
        <div class="feature-icon">📚</div>
        <h3>Chord Library</h3>
        <p>Multi-instrument chord library: Guitar, Bass, Ukulele, Piano, and Drums</p>
        <div class="feature-badge free">FREE</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'scales')">
        <div class="feature-icon">🎼</div>
        <h3>Scale Explorer</h3>
        <p>Interactive scale patterns, modes, and positions across the entire fretboard</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'rhythm')">
        <div class="feature-icon">🥁</div>
        <h3>Rhythm Trainer</h3>
        <p>Master strumming patterns with visual guides and timing challenges</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Want Full Access?</h2>
      <p>Unlock all premium features including unlimited AI lessons, practice analysis, and more</p>
      <button @click="$emit('navigate', 'premium')" class="cta-button">
        ⭐ Go Premium - $9.99/month
      </button>
    </div>

    <div class="store-promo">
      <div class="promo-card">
        <div class="promo-left">
          <h2>Shop The Franks Standard</h2>
          <p>Premium guitars, pro audio, and musician gear. Quality is our standard.</p>
          <a class="promo-btn" href="https://thefranksstandard.com" target="_blank" rel="noopener">
            🛒 Visit Store
          </a>
        </div>
        <div class="promo-right">
          <img src="/images/guitar-hero.svg" alt="The Franks Standard" />
        </div>
      </div>
    </div>

    <div class="gallery">
      <img src="/images/practice-tips.svg" alt="Practice tips" />
      <img src="/images/jam-session.svg" alt="Jam session" />
    </div>

    <!-- Beta Signup Modal -->
    <div v-if="showBetaModal" class="modal-overlay" @click="showBetaModal = false">
      <div class="beta-modal" @click.stop>
        <button @click="showBetaModal = false" class="modal-close">✕</button>
        
        <div class="beta-modal-header">
          <h2>🚀 Join FretPilot Beta</h2>
          <p>Get early access + help shape the future of music learning</p>
        </div>

        <div v-if="!betaSubmitted" class="beta-form">
          <div class="form-group">
            <label>Email *</label>
            <input 
              v-model="betaForm.email" 
              type="email" 
              placeholder="your@email.com" 
              required
              @keyup.enter="submitBeta"
            />
          </div>

          <div class="form-group">
            <label>Name</label>
            <input 
              v-model="betaForm.name" 
              type="text" 
              placeholder="Your name" 
              @keyup.enter="submitBeta"
            />
          </div>

          <div class="form-group">
            <label>Primary Instrument</label>
            <select v-model="betaForm.instrument">
              <option value="guitar">Guitar</option>
              <option value="bass">Bass</option>
              <option value="piano">Piano/Keys</option>
              <option value="drums">Drums</option>
              <option value="vocals">Vocals</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Experience Level</label>
            <select v-model="betaForm.experience">
              <option value="beginner">Beginner (0-1 year)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3-5 years)</option>
              <option value="pro">Professional (5+ years)</option>
            </select>
          </div>

          <div class="form-group">
            <label>How did you hear about us?</label>
            <select v-model="betaForm.referral">
              <option value="search">Google/Search</option>
              <option value="social">Social Media</option>
              <option value="friend">Friend/Word of Mouth</option>
              <option value="ad">Advertisement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="beta-benefits">
            <h4>Beta Tester Perks:</h4>
            <ul>
              <li>✅ Free Premium access during beta</li>
              <li>✅ Lifetime 50% discount when we launch</li>
              <li>✅ Direct line to dev team</li>
              <li>✅ Your feedback shapes the product</li>
              <li>✅ Beta Tester badge & credits</li>
            </ul>
          </div>

          <button 
            @click="submitBeta" 
            class="beta-submit-btn" 
            :disabled="betaLoading || !betaForm.email"
          >
            {{ betaLoading ? '⏳ Joining...' : '🚀 Join Beta Waitlist' }}
          </button>

          <p v-if="betaError" class="beta-error">{{ betaError }}</p>
        </div>

        <div v-else class="beta-success">
          <div class="success-icon">✅</div>
          <h3>You're on the list!</h3>
          <p>Check your email for next steps and beta access details.</p>
          <p class="success-subtext">We'll be in touch within 24-48 hours.</p>
          <button @click="showBetaModal = false" class="success-btn">Got it!</button>
        </div>
      </div>
    </div>

    <!-- Social Media Footer -->
    <div class="home-footer">
      <SocialMediaFooter variant="fretpilot" :showFollowText="true" />
      <p class="copyright">© 2025 FretPilot Studio. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isPremium, getDailyLessonRemaining } from '../services/featureFlags'
import { postJSON } from '../services/config'
import SocialMediaFooter from './SocialMediaFooter.vue'

defineEmits(['navigate'])

const premium = computed(() => isPremium())
const quota = computed(() => getDailyLessonRemaining())

// Beta modal state
const showBetaModal = ref(false)
const hideBetaBanner = ref(false)
const betaSubmitted = ref(false)
const betaLoading = ref(false)
const betaError = ref('')

const betaForm = ref({
  email: '',
  name: '',
  instrument: 'guitar',
  experience: 'beginner',
  referral: 'search'
})

async function submitBeta() {
  if (!betaForm.value.email) {
    betaError.value = 'Email is required'
    return
  }
  
  betaLoading.value = true
  betaError.value = ''
  
  try {
    const response = await postJSON('/api/beta/signup', betaForm.value)
    
    if (response.ok) {
      betaSubmitted.value = true
      // Track conversion if Google Ads is configured
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
          'event_callback': () => {}
        })
      }
    } else {
      betaError.value = response.error === 'rate_limited' 
        ? `Too many attempts. Please try again in ${response.retryAfter || 300} seconds.`
        : response.error === 'invalid_email'
        ? 'Please enter a valid email address'
        : 'Signup failed. Please try again.'
    }
  } catch (err) {
    betaError.value = 'Network error. Please check your connection and try again.'
  } finally {
    betaLoading.value = false
  }
}
</script>

<style scoped>
/* Beta Banner */
.beta-banner {
  background: linear-gradient(135deg, #06c167 0%, #4a90e2 100%);
  padding: 12px 20px;
  margin: -20px -20px 20px -20px;
  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  position: relative;
}

.beta-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.beta-badge {
  background: rgba(0,0,0,0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.85em;
  letter-spacing: 0.5px;
}

.beta-text {
  color: white;
  margin: 0;
  font-size: 1em;
  font-weight: 500;
}

.beta-cta {
  background: white;
  color: #06c167;
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95em;
}

.beta-cta:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255,255,255,0.3);
}

.beta-close {
  background: transparent;
  color: white;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 4px 8px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.beta-close:hover {
  opacity: 1;
}

.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #000;
  min-height: 100%;
}

.hero {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
  position: relative;
}

.hero-image { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.22; pointer-events:none; border-radius:12px; transform:scale(1.015) }
.animate-float { animation: floatSlow 8s ease-in-out infinite }
@keyframes floatSlow { 0%{ transform:translateY(0) scale(1.015)} 50%{ transform:translateY(-8px) scale(1.02)} 100%{ transform:translateY(0) scale(1.015)} }

.hero-title {
  font-size: 3.5em;
  margin: 0;
  background: linear-gradient(135deg, #06c167 0%, #4a90e2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.hero-tagline {
  font-size: 1.5em;
  color: #cfd6e6;
  margin: 10px 0;
  font-weight: 600;
}

.hero-subtitle {
  color: #8892a6;
  font-size: 1.1em;
  margin: 5px 0;
}

.hero-beta-btn {
  background: linear-gradient(135deg, #06c167, #4a90e2);
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 30px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(6,193,103,0.4);
  margin-top: 20px;
}

.hero-beta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6,193,103,0.6);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #06c167;
  box-shadow: 0 8px 24px rgba(6, 193, 103, 0.2);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 12px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.feature-card h3 {
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 1.3em;
}

.feature-card p {
  color: #b7c3d9;
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 12px;
}

.feature-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feature-badge.free {
  background: #2a3142;
  color: #06c167;
  border: 1px solid #06c167;
}

.feature-badge.premium {
  background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
  color: #fff;
  border: none;
}

.cta-section {
  text-align: center;
  padding: 40px 20px;
  background: #0a0a0a;
  border-radius: 12px;
  border: 2px solid #1a1a1a;
  margin-top: 20px;
}

.cta-section h2 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 2em;
}

.cta-section p {
  color: #b7c3d9;
  font-size: 1.1em;
  margin-bottom: 20px;
}

.cta-button {
  background: linear-gradient(135deg, #06c167 0%, #09a557 100%);
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.2em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(6, 193, 103, 0.3);
}

.cta-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(6, 193, 103, 0.5);
}

.gallery { display:grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin:24px 0 }
.gallery img { width:100%; border-radius:12px; border:1px solid #1a1a1a; background:#0a0a0a }

/* Store promo */
.store-promo { margin: 30px 0 10px 0; }
.promo-card {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
  align-items: center;
  background: linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15));
  border: 1px solid rgba(255,255,255,0.08);
  padding: 24px;
  border-radius: 12px;
}
.promo-left h2 { margin: 0 0 8px 0; color: #fff; }
.promo-left p { margin: 0 0 16px 0; color: #cfd6e6 }
.promo-btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 0;
}
.promo-right img { width: 100%; opacity: 0.8 }

/* Beta Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.beta-modal {
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: #8892a6;
  font-size: 1.5em;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #fff;
}

.beta-modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.beta-modal-header h2 {
  margin: 0 0 8px 0;
  color: #fff;
  font-size: 1.8em;
}

.beta-modal-header p {
  margin: 0;
  color: #8892a6;
  font-size: 1em;
}

.beta-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #cfd6e6;
  font-size: 0.95em;
  font-weight: 500;
}

.form-group input,
.form-group select {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #06c167;
}

.beta-benefits {
  background: rgba(6,193,103,0.1);
  border: 1px solid rgba(6,193,103,0.3);
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
}

.beta-benefits h4 {
  margin: 0 0 12px 0;
  color: #06c167;
  font-size: 1em;
}

.beta-benefits ul {
  margin: 0;
  padding: 0 0 0 20px;
  color: #cfd6e6;
  font-size: 0.95em;
  line-height: 1.6;
}

.beta-submit-btn {
  background: linear-gradient(135deg, #06c167, #4a90e2);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
}

.beta-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6,193,103,0.4);
}

.beta-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.beta-error {
  color: #ff6b6b;
  font-size: 0.9em;
  margin: 8px 0 0 0;
  text-align: center;
}

.beta-success {
  text-align: center;
  padding: 20px;
}

.success-icon {
  font-size: 4em;
  margin-bottom: 16px;
}

.beta-success h3 {
  margin: 0 0 12px 0;
  color: #06c167;
  font-size: 1.8em;
}

.beta-success p {
  color: #cfd6e6;
  margin: 8px 0;
  font-size: 1.05em;
}

.success-subtext {
  color: #8892a6;
  font-size: 0.9em !important;
}

.success-btn {
  background: #06c167;
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s;
}

.success-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(6,193,103,0.4);
}

.home-footer {
  margin-top: 60px;
  padding: 40px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.copyright {
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

@media (max-width: 800px) {
  .promo-card { grid-template-columns: 1fr; }
  .promo-right { display: none }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5em;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
