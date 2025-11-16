<template>
  <div class="app-shell music-bg">
    <header class="topbar">
      <div class="brand" @click="view='home'" style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
        <MainLogo :size="40" :compact="true" />
        <span>FretPilot Studio & School</span>
      </div>
      <nav class="nav" v-if="loggedIn">
        <button :class="{ active: view==='home' }" @click="view='home'">🏠 Home</button>
        <button :class="{ active: view==='trainer' }" @click="view='trainer'">🎯 Trainer</button>
        <button :class="{ active: view==='ai' }" @click="view='ai'" style="display: flex; align-items: center; gap: 4px;">
          <FeatureIcons icon="ai" :size="18" /> AI Lessons
        </button>
        <button :class="{ active: view==='video' }" @click="view='video'">🎬 Video</button>
        <button :class="{ active: view==='videolessons' }" @click="view='videolessons'">📚 Video Lessons</button>
        <button :class="{ active: view==='videoplatform' }" @click="view='videoplatform'" style="display: flex; align-items: center; gap: 4px;">
          <FeatureIcons icon="jam" :size="18" /> Video Platform
        </button>
        <button :class="{ active: view==='studio' }" @click="view='studio'">🎙️ Studio</button>
        <button :class="{ active: view==='store' }" @click="view='store'">🛒 Store</button>
        <button :class="{ active: view==='practice' }" @click="view='practice'" style="display: flex; align-items: center; gap: 4px;">
          <FeatureIcons icon="practice" :size="18" /> Practice
        </button>
        <button :class="{ active: view==='jam' }" @click="view='jam'" style="display: flex; align-items: center; gap: 4px;">
          <FeatureIcons icon="jam" :size="18" /> Jam
        </button>
        <button :class="{ active: view==='multiplayer' }" @click="view='multiplayer'" style="display: flex; align-items: center; gap: 4px;">
          <FeatureIcons icon="multiplayer" :size="18" /> Multiplayer
        </button>
        <button :class="{ active: view==='orders' }" @click="view='orders'">📦 Orders</button>
        <button :class="{ active: view==='premium' }" @click="view='premium'">Premium</button>
        <button :class="{ active: view==='payment' }" @click="view='payment'" class="payment-btn">💳 Upgrade</button>
      </nav>
      <div class="status">
        <template v-if="loggedIn">
          <span class="user">👤 {{ userName }}</span>
          <span class="badge" :class="premium ? 'pro' : 'free'">{{ premium ? 'Premium' : 'Free' }}</span>
          <span v-if="!premium" class="quota">{{ quota }} free AI</span>
          <button class="ambience" :class="{ on: ambienceOn }" @click="toggleAmbience">🎵 Ambience</button>
          <button class="logout" @click="logout">Logout</button>
        </template>
        <template v-else>
          <span class="badge free">Guest</span>
        </template>
      </div>
    </header>

    <ConsentPrompt />

    <main class="content">
      <ErrorBoundary :key="view" @reset="() => {}">
        <Login v-if="!loggedIn" />
        <template v-else>
          <HomePage v-if="view==='home'" @navigate="view = $event" />
          <FretPilotTrainer v-else-if="view==='trainer'" />
          <AiLessonGenerator v-else-if="view==='ai'" />
          <AIVideoGenerator v-else-if="view==='video'" />
          <AIVideoLessons v-else-if="view==='videolessons'" @upgrade-tier="handleUpgradeTier" />
          <VideoLessonPlatform v-else-if="view==='videoplatform'" />
          <MusicStudio v-else-if="view==='studio'" />
          <MusicStore v-else-if="view==='store'" />
          <PracticeAnalyzer v-else-if="view==='practice'" />
          <JamCompanion v-else-if="view==='jam'" />
          <MultiplayerJam v-else-if="view==='multiplayer'" />
          <OrderHistory v-else-if="view==='orders'" />
          <PaymentCheckout v-else-if="view==='payment'" />
          <PaymentSuccess v-else-if="view==='payment-success'" />
          <MetronomeTuner v-else-if="view==='metronome'" />
          <ChordLibrary v-else-if="view==='library'" />
          <div v-else-if="view==='scales'" class="coming-soon">
            <h2>🎼 Scale Explorer</h2>
            <p>Explore common scales and positions. More interactive diagrams coming soon.</p>
            <button @click="view='home'">← Back to Home</button>
          </div>
          <div v-else-if="view==='rhythm'" class="coming-soon">
            <h2>🥁 Rhythm Trainer</h2>
            <p>Practice with visual beat guides and metronome accents.</p>
            <button @click="view='home'">← Back to Home</button>
          </div>
          <PremiumGate v-else />
        </template>
      </ErrorBoundary>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="/about.html" target="_blank">About Us</a>
          <a href="/privacy.html" target="_blank">Privacy Policy</a>
          <a href="/terms.html" target="_blank">Terms of Service</a>
          <a href="mailto:support@fretpilot.com">Contact Support</a>
        </div>
        <p class="footer-copyright">© 2025 FretPilot Studio & School. Premium AI-powered music education & gear.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import HomePage from './components/HomePage.vue'
import FretPilotTrainer from './components/FretPilotTrainer.vue'
import AiLessonGenerator from './components/AiLessonGenerator.vue'
import AIVideoGenerator from './components/AIVideoGenerator.vue'
import PracticeAnalyzer from './components/PracticeAnalyzer.vue'
import JamCompanion from './components/JamCompanion.vue'
import MultiplayerJam from './components/MultiplayerJam.vue'
import MusicStudio from './components/MusicStudio.vue'
import MusicStore from './components/MusicStore.vue'
import MetronomeTuner from './components/MetronomeTuner.vue'
import ChordLibrary from './components/ChordLibrary.vue'
import PremiumGate from './components/PremiumGate.vue'
import OrderHistory from './components/OrderHistory.vue'
import AIVideoLessons from './components/AIVideoLessons.vue'
import VideoLessonPlatform from './components/VideoLessonPlatform.vue'
import PaymentCheckout from './components/PaymentCheckout.vue'
import PaymentSuccess from './components/PaymentSuccess.vue'
import Login from './components/Login.vue'
import ConsentPrompt from './components/ConsentPrompt.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import MainLogo from './assets/logos/MainLogo.vue'
import FeatureIcons from './assets/logos/FeatureIcons.vue'
import { initAds, showBanner } from './services/adService'
import { isPremium as ffIsPremium, getDailyLessonRemaining } from './services/featureFlags'
import { initAnalytics } from './services/analyticsService'

const view = ref('home')
const premium = ref(ffIsPremium())
const quota = ref(getDailyLessonRemaining())
const loggedIn = ref(false)
const userName = ref('')
const ambienceOn = ref(false)
let ambienceAudio = null
let ambienceFallbackApplied = false

function readAuth() {
  try {
    const raw = localStorage.getItem('fretpilot-auth')
    if(!raw) { loggedIn.value = false; userName.value=''; return }
    const obj = JSON.parse(raw)
    loggedIn.value = true
    userName.value = obj.user || 'Player'
  } catch(err) {
    loggedIn.value = false
  }
}

function logout() {
  localStorage.removeItem('fretpilot-auth')
  readAuth()
}

function toggleAmbience() {
  try {
    if (!ambienceAudio) {
      ambienceAudio = new Audio()
      ambienceAudio.loop = true
      ambienceAudio.volume = 0.25
      ambienceAudio.src = '/audio/ambience.mp3'
      ambienceAudio.onerror = () => {
        if (!ambienceFallbackApplied) {
          ambienceFallbackApplied = true
          ambienceAudio.src = '/audio/a_minor.mp3'
        }
      }
    }
    if (ambienceOn.value) {
      ambienceAudio.pause()
      ambienceOn.value = false
    } else {
      ambienceAudio.play().then(() => { ambienceOn.value = true }).catch(() => {
        if (!ambienceFallbackApplied) {
          ambienceFallbackApplied = true
          ambienceAudio.src = '/audio/a_minor.mp3'
          ambienceAudio.play().then(() => { ambienceOn.value = true }).catch(() => { ambienceOn.value = false })
        } else {
          ambienceOn.value = false
        }
      })
    }
  } catch (_) { ambienceOn.value = false }
}

function handleUpgradeTier(data) {
  // Redirect to checkout or show payment modal
  console.log('Upgrade tier requested:', data)
  // In production, this would navigate to Stripe checkout
  alert(`Redirecting to checkout for ${data.tier}...`)
}

onMounted(async () => {
  readAuth()
  window.addEventListener('fretpilot-auth-changed', readAuth)
  initAnalytics()
  await initAds()
  await showBanner()
  setInterval(() => {
    premium.value = ffIsPremium()
    quota.value = getDailyLessonRemaining()
    readAuth()
  }, 3000)
})
</script>

<style>
/* Global lightweight reset - Dark Room Theme */
html,body,#app { height:100%; margin:0; background:#000 }
.app-shell { display:flex; flex-direction:column; min-height:100%; background:#000 }
.topbar {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding:10px 12px;
  background:#0a0a0a;
  border-bottom:1px solid rgba(255,255,255,0.08);
  position:sticky;
  top:0;
  z-index:10;
}
.brand { font-weight:700 }
.nav { display:flex; gap:8px }
.nav button { background:#1a1a1a; color:#cfd6e6; border:1px solid #2a2a2a; padding:8px 10px; border-radius:8px; cursor:pointer }
.nav button.active { background:#2a2a2a; color:#fff }
.nav button.payment-btn { 
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  color: #fff;
  border: none;
  font-weight: bold;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(0,212,255,0.3); }
  50% { box-shadow: 0 0 20px rgba(0,212,255,0.6); }
}
.status { display:flex; align-items:center; gap:8px }
.badge { padding:4px 8px; border-radius:999px; font-size:12px; border:1px solid #2a2a2a }
.badge.free { background:#1a1a1a; color:#d4daea }
.badge.pro { background:#06c167; color:#0b1c12; border-color:#09a557 }
.quota { color:#b7c3d9; font-size:12px }
.content { flex:1; background:#000; }
.ambience { background:#1a1a1a; color:#cfd6e6; border:1px solid #2a2a2a; padding:6px 10px; border-radius:8px; cursor:pointer }
.ambience.on { background:#222; color:#06c167; border-color:#09a557 }
.coming-soon {
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
  color: #fff;
}
.coming-soon h2 { font-size: 2.5em; margin-bottom: 15px; }
.coming-soon p { color: #8892a6; font-size: 1.2em; margin-bottom: 30px; }
.coming-soon button {
  padding: 12px 24px;
  background: #06c167;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
}

/* Music themed animated background */
.music-bg {
  background: radial-gradient(1200px 600px at 10% 0%, rgba(0,64,255,0.08), transparent),
              radial-gradient(1000px 500px at 90% 20%, rgba(0,200,140,0.08), transparent),
              linear-gradient(180deg, #0a0a0f 0%, #0b0d15 100%);
  position: relative;
  overflow-x: hidden;
}
.music-bg::before, .music-bg::after {
  content: "♪";
  position: absolute;
  font-size: 56px;
  color: rgba(255,255,255,0.08);
  animation: floatNote 14s linear infinite;
  pointer-events: none;
}
.music-bg::after { content: "♫"; left: 80%; animation-duration: 18s; animation-delay: 2s; }
.music-bg::before { left: 10%; }
@keyframes floatNote {
  0% { top: 110%; transform: translateX(0) rotate(0deg); }
  100% { top: -10%; transform: translateX(-40px) rotate(360deg); }
}

/* Footer */
.app-footer {
  background: #0a0a0a;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 24px 20px;
  margin-top: auto;
}
.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}
.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.footer-links a {
  color: #8892a6;
  text-decoration: none;
  font-size: 0.9em;
  transition: color 0.3s;
}
.footer-links a:hover {
  color: #06c167;
}
.footer-copyright {
  color: #555;
  font-size: 0.85em;
  margin: 0;
}
</style>
