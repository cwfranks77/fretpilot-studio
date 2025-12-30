<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand" @click="view='home'" style="cursor: pointer;">
        <div class="brand-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="url(#logo-grad)"/>
            <path d="M10 18L18 10L26 18M18 10V28" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="18" cy="22" r="3" fill="white"/>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36">
                <stop stop-color="#22c55e"/>
                <stop offset="1" stop-color="#16a34a"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="brand-name">FretPilot<span class="brand-studio">Studio</span></span>
      </div>
      
      <nav class="nav">
        <button class="nav-link" :class="{ active: view === 'home' }" @click="view='home'">Home</button>
        <button class="nav-link" :class="{ active: view === 'chord-trainer' }" @click="view='chord-trainer'">Learn</button>
        <button class="nav-link" :class="{ active: view === 'chord-library' }" @click="view='chord-library'">Library</button>
        <button class="nav-link" :class="{ active: view === 'metronome' }" @click="view='metronome'">Tools</button>
        <button class="nav-link pricing-link" :class="{ active: view === 'pricing' }" @click="view='pricing'">
          <span v-if="!premium">Upgrade</span>
          <span v-else>Pro</span>
        </button>
        <button v-if="isCreatorUser" class="nav-link dev-link" @click="view='admin'">Dev</button>
      </nav>
      
      <div class="header-right">
        <span class="badge" :class="premium ? 'pro' : 'free'">
          <span v-if="premium">✓ Premium</span>
          <span v-else>Free</span>
        </span>
      </div>
    </header>

    <div v-if="view !== 'home' && view !== 'pricing'" class="back-bar">
      <button class="back-btn" @click="view='home'">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Home
      </button>
    </div>

    <main class="content">
      <HomePage v-if="view==='home'" @view-pricing="view='pricing'" @open-feature="openFeature" />
      <ChordTrainer v-else-if="view==='chord-trainer'" />
      <ChordLibrary v-else-if="view==='chord-library'" />
      <Metronome v-else-if="view==='metronome'" />
      <PremiumGate v-else-if="view==='pricing'" />
      <PaymentSuccess v-else-if="view==='payment-success'" />
      <TesterSignup v-else-if="view==='tester-signup'" />
      <AdminDashboard v-else-if="view==='admin'" />
      <AILessonGenerator v-else-if="view==='ai-lessons'" />
      <AIVideoLessons v-else-if="view==='ai-video'" />
      <ScaleExplorer v-else-if="view==='scale-explorer'" />
      <JamCompanion v-else-if="view==='jam-companion'" />
      <PracticeAnalyzer v-else-if="view==='practice-analyzer'" />
      <div v-else class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This feature is under development.</p>
        <button @click="view='home'">Go Back</button>
      </div>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">FretPilot Studio</span>
          <p class="footer-tagline">Master any instrument with AI</p>
        </div>
        <div class="footer-links">
          <a href="/privacy.html" target="_blank">Privacy</a>
          <a href="/terms.html" target="_blank">Terms</a>
          <a href="/refund-policy.html" target="_blank">Refunds</a>
          <a href="mailto:support@fretpilotstudio.com">Support</a>
        </div>
        <p class="footer-copyright">© 2025 FretPilot Studio. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { isPremium, isCreator } from './services/featureFlags'
import HomePage from './components/HomePage.vue'
import PremiumGate from './components/PremiumGate.vue'
import PaymentSuccess from './components/PaymentSuccess.vue'
import TesterSignup from './components/TesterSignup.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import ChordTrainer from './components/ChordTrainer.vue'
import ChordLibrary from './components/ChordLibrary.vue'
import Metronome from './components/Metronome.vue'
import AILessonGenerator from './components/AILessonGenerator.vue'
import AIVideoLessons from './components/AIVideoLessons.vue'
import ScaleExplorer from './components/ScaleExplorer.vue'
import JamCompanion from './components/JamCompanion.vue'
import PracticeAnalyzer from './components/PracticeAnalyzer.vue'

const view = ref('home')
const premium = ref(false)
const isCreatorUser = ref(false)

function readAuth() { 
  premium.value = isPremium() 
  isCreatorUser.value = isCreator()
}

function openFeature(feature) { 
  view.value = feature 
}

let premiumCheckInterval = null

onMounted(() => {
  readAuth()
  requestAnimationFrame(() => { document.getElementById('app')?.classList.add('loaded') })
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('tester_signup')) view.value = 'tester-signup'
  if (window.location.search.includes('payment_success')) view.value = 'payment-success'
  premiumCheckInterval = setInterval(() => { 
    premium.value = isPremium() 
    isCreatorUser.value = isCreator()
  }, 5000)
})

onUnmounted(() => { 
  if (premiumCheckInterval) clearInterval(premiumCheckInterval) 
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { 
  box-sizing: border-box; 
  margin: 0;
  padding: 0;
}

html { 
  overflow-y: scroll; 
  scrollbar-gutter: stable; 
  width: 100%; 
  scroll-behavior: smooth;
}

html, body, #app { 
  height: 100%; 
  background: #09090b; 
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

body { 
  width: 100%; 
  position: relative; 
  color: #fafafa;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-shell { 
  display: flex; 
  flex-direction: column; 
  min-height: 100%; 
  background: #09090b; 
  overflow-x: hidden; 
  width: 100%; 
}

/* Top Navigation */
.topbar { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  gap: 16px; 
  padding: 12px 24px; 
  background: rgba(9, 9, 11, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06); 
  position: sticky; 
  top: 0; 
  z-index: 100;
}

.brand { 
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name { 
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff; 
  letter-spacing: -0.02em;
}

.brand-studio {
  color: #22c55e;
  font-weight: 600;
}

@media (max-width: 600px) { 
  .brand-name { display: none; } 
}

.nav { 
  display: flex; 
  gap: 4px; 
  flex-wrap: wrap; 
  align-items: center; 
}

.nav-link { 
  background: transparent; 
  color: #a1a1aa; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 8px; 
  cursor: pointer; 
  font-size: 0.9rem; 
  font-weight: 500;
  transition: all 0.2s; 
}

.nav-link:hover { 
  color: #fff; 
  background: rgba(255, 255, 255, 0.05); 
}

.nav-link.active { 
  color: #22c55e; 
  background: rgba(34, 197, 94, 0.1); 
}

.nav-link.pricing-link {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.nav-link.pricing-link:hover {
  background: rgba(34, 197, 94, 0.15);
}

.nav-link.dev-link { 
  color: #fbbf24; 
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  font-size: 0.8rem;
  padding: 6px 12px;
}

@media (max-width: 600px) { 
  .nav-link { 
    padding: 6px 10px; 
    font-size: 0.8rem; 
  } 
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge { 
  padding: 6px 12px; 
  border-radius: 999px; 
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.badge.free { 
  background: rgba(161, 161, 170, 0.1); 
  color: #a1a1aa;
  border: 1px solid rgba(161, 161, 170, 0.2);
}

.badge.pro { 
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1)); 
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

/* Content Area */
.content { 
  flex: 1; 
  background: #09090b; 
}

.back-bar { 
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(8px);
  padding: 12px 24px; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.04); 
}

.back-btn { 
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none; 
  border: none; 
  color: #71717a; 
  font-size: 0.9rem; 
  cursor: pointer; 
  padding: 0; 
  transition: color 0.2s; 
}

.back-btn:hover { 
  color: #22c55e; 
}

.coming-soon { 
  max-width: 600px; 
  margin: 0 auto; 
  padding: 100px 24px; 
  text-align: center; 
  color: #fff; 
}

.coming-soon h2 { 
  font-size: 2.5rem; 
  margin-bottom: 12px;
  font-weight: 700;
}

.coming-soon p {
  color: #71717a;
  margin-bottom: 32px;
}

.coming-soon button { 
  padding: 14px 28px; 
  background: linear-gradient(135deg, #22c55e, #16a34a); 
  color: #fff; 
  border: none; 
  border-radius: 10px; 
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.coming-soon button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -8px rgba(34, 197, 94, 0.5);
}

/* Footer */
.app-footer { 
  background: #09090b;
  border-top: 1px solid rgba(255, 255, 255, 0.06); 
  padding: 48px 24px 32px; 
  margin-top: auto; 
}

.footer-content { 
  max-width: 1200px; 
  margin: 0 auto; 
  text-align: center; 
}

.footer-brand {
  margin-bottom: 24px;
}

.footer-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.footer-tagline {
  font-size: 0.9rem;
  color: #52525b;
  margin-top: 4px;
}

.footer-links { 
  display: flex; 
  justify-content: center; 
  gap: 32px; 
  flex-wrap: wrap; 
  margin-bottom: 24px; 
}

.footer-links a { 
  color: #71717a; 
  text-decoration: none; 
  font-size: 0.9rem; 
  transition: color 0.2s; 
}

.footer-links a:hover { 
  color: #22c55e; 
}

.footer-copyright { 
  color: #3f3f46; 
  font-size: 0.85rem; 
}

/* Hide Vercel widgets */
#__vercel-toolbar, 
[data-vercel-toolbar], 
[data-vercel-feedback],
.vercel-live-feedback-button,
#vercel-live-feedback,
div[class*="vercel"],
iframe[src*="vercel"] { 
  display: none !important; 
  visibility: hidden !important;
}
</style>
