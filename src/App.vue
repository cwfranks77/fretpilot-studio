<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand" @click="view='home'" style="cursor: pointer;">
        <div class="brand-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#logo-grad)"/>
            <path d="M12 20L20 12L28 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 12V30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="20" cy="24" r="3.5" fill="white"/>
            <circle cx="16" cy="28" r="2" fill="rgba(255,255,255,0.6)"/>
            <circle cx="24" cy="28" r="2" fill="rgba(255,255,255,0.6)"/>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40">
                <stop stop-color="#f97316"/>
                <stop offset="1" stop-color="#ea580c"/>
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

    <!-- Mobile Bottom Nav -->
    <nav class="mobile-nav">
      <button class="mobile-nav-item" :class="{ active: view === 'home' }" @click="view='home'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Home</span>
      </button>
      <button class="mobile-nav-item" :class="{ active: view === 'chord-trainer' }" @click="view='chord-trainer'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Learn</span>
      </button>
      <button class="mobile-nav-item" :class="{ active: view === 'chord-library' }" @click="view='chord-library'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 2H20V22H6.5A2.5 2.5 0 014 19.5V4.5A2.5 2.5 0 016.5 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Library</span>
      </button>
      <button class="mobile-nav-item" :class="{ active: view === 'metronome' }" @click="view='metronome'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Tools</span>
      </button>
      <button class="mobile-nav-item pricing" :class="{ active: view === 'pricing' }" @click="view='pricing'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Pro</span>
      </button>
    </nav>

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
  requestAnimationFrame(() => { 
    const app = document.getElementById('app')
    if (app) {
      app.classList.remove('app-loading')
      app.classList.add('loaded')
    }
  })
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
* { 
  box-sizing: border-box; 
  margin: 0;
  padding: 0;
}

html { 
  overflow-y: scroll; 
  overflow-x: hidden;
  scrollbar-gutter: stable; 
  width: 100%; 
  max-width: 100vw;
  scroll-behavior: smooth;
}

html, body, #app { 
  height: 100%; 
  background: #0c0a09; 
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  max-width: 100%;
}

body { 
  width: 100%; 
  position: relative; 
  color: #fafaf9;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

.app-shell { 
  display: flex; 
  flex-direction: column; 
  min-height: 100%; 
  background: #0c0a09; 
  overflow-x: hidden; 
  width: 100%; 
}

/* Top Navigation - Modern Glass Effect */
.topbar { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  gap: 16px; 
  padding: 16px 32px; 
  background: rgba(12, 10, 9, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(245, 158, 11, 0.1); 
  position: sticky; 
  top: 0; 
  z-index: 100;
}

.brand { 
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.brand:hover .brand-logo {
  transform: rotate(-5deg) scale(1.05);
}

.brand-name { 
  font-weight: 700;
  font-size: 1.2rem;
  color: #fafaf9; 
  letter-spacing: -0.03em;
}

.brand-studio {
  color: #f97316;
  font-weight: 600;
}

@media (max-width: 600px) { 
  .brand-name { display: none; } 
  .topbar { padding: 12px 16px; }
}

.nav { 
  display: flex; 
  gap: 6px; 
  flex-wrap: wrap; 
  align-items: center; 
}

@media (max-width: 600px) {
  .nav {
    display: none !important;
  }
  .topbar {
    justify-content: center;
  }
  .header-right {
    display: none !important;
  }
  .brand-name {
    display: block !important;
  }
}

@media (max-width: 480px) {
  .nav {
    display: none !important;
  }
  .topbar {
    justify-content: center;
  }
  .header-right {
    display: none !important;
  }
  .brand-name {
    display: block !important;
  }
}

.nav-link { 
  background: transparent; 
  color: #a8a29e; 
  border: none; 
  padding: 10px 18px; 
  border-radius: 10px; 
  cursor: pointer; 
  font-size: 0.9rem; 
  font-weight: 500;
  transition: all 0.25s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #f97316;
  transition: all 0.25s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}

.nav-link:hover { 
  color: #fafaf9; 
}

.nav-link:hover::after {
  width: 20px;
}

.nav-link.active { 
  color: #f97316; 
  background: rgba(249, 115, 22, 0.1); 
}

.nav-link.active::after {
  width: 20px;
}

.nav-link.pricing-link {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 20px -4px rgba(249, 115, 22, 0.4);
}

.nav-link.pricing-link::after {
  display: none;
}

.nav-link.pricing-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px -4px rgba(249, 115, 22, 0.5);
}

.nav-link.dev-link { 
  color: #fbbf24; 
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  font-size: 0.8rem;
  padding: 6px 12px;
}

.nav-link.dev-link::after {
  display: none;
}

@media (max-width: 600px) { 
  .nav-link { 
    padding: 8px 12px; 
    font-size: 0.8rem; 
  } 
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge { 
  padding: 8px 14px; 
  border-radius: 999px; 
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.badge.free { 
  background: rgba(168, 162, 158, 0.1); 
  color: #a8a29e;
  border: 1px solid rgba(168, 162, 158, 0.15);
}

.badge.pro { 
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.1)); 
  color: #fb923c;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

/* Content Area */
.content { 
  flex: 1; 
  background: #0c0a09; 
}

.back-bar { 
  background: rgba(12, 10, 9, 0.95);
  backdrop-filter: blur(12px);
  padding: 14px 32px; 
  border-bottom: 1px solid rgba(245, 158, 11, 0.08); 
}

.back-btn { 
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none; 
  border: none; 
  color: #78716c; 
  font-size: 0.9rem; 
  font-weight: 500;
  cursor: pointer; 
  padding: 0; 
  transition: all 0.2s ease; 
}

.back-btn:hover { 
  color: #f97316;
  transform: translateX(-2px);
}

.coming-soon { 
  max-width: 600px; 
  margin: 0 auto; 
  padding: 100px 24px; 
  text-align: center; 
  color: #fafaf9; 
}

.coming-soon h2 { 
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 3rem; 
  margin-bottom: 16px;
  font-weight: 400;
  font-style: italic;
}

.coming-soon p {
  color: #78716c;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.coming-soon button { 
  padding: 16px 32px; 
  background: linear-gradient(135deg, #f97316, #ea580c); 
  color: #fff; 
  border: none; 
  border-radius: 12px; 
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px -8px rgba(249, 115, 22, 0.5);
}

.coming-soon button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px -8px rgba(249, 115, 22, 0.6);
}

/* Footer - Refined */
.app-footer { 
  background: linear-gradient(180deg, #0c0a09, #1c1917);
  border-top: 1px solid rgba(245, 158, 11, 0.08); 
  padding: 60px 32px 40px; 
  margin-top: auto; 
}

.footer-content { 
  max-width: 1200px; 
  margin: 0 auto; 
  text-align: center; 
}

.footer-brand {
  margin-bottom: 32px;
}

.footer-logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fafaf9;
  letter-spacing: -0.02em;
}

.footer-tagline {
  font-size: 0.95rem;
  color: #57534e;
  margin-top: 8px;
  font-style: italic;
}

.footer-links { 
  display: flex; 
  justify-content: center; 
  gap: 40px; 
  flex-wrap: wrap; 
  margin-bottom: 32px; 
}

.footer-links a { 
  color: #78716c; 
  text-decoration: none; 
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease; 
  position: relative;
}

.footer-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: #f97316;
  transition: width 0.2s ease;
}

.footer-links a:hover { 
  color: #f97316; 
}

.footer-links a:hover::after {
  width: 100%;
}

.footer-copyright { 
  color: #44403c; 
  font-size: 0.85rem; 
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1c1917;
}

::-webkit-scrollbar-thumb {
  background: #44403c;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #57534e;
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

/* Mobile Bottom Navigation */
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(12, 10, 9, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(245, 158, 11, 0.1);
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 200;
  justify-content: space-around;
}

@media (max-width: 600px) {
  .mobile-nav {
    display: flex;
  }
  .app-footer {
    padding-bottom: 100px;
  }
  .content {
    padding-bottom: 80px;
  }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #78716c;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.mobile-nav-item svg {
  width: 22px;
  height: 22px;
}

.mobile-nav-item span {
  font-size: 0.65rem;
  font-weight: 500;
}

.mobile-nav-item.active {
  color: #f97316;
}

.mobile-nav-item.pricing {
  color: #f97316;
}

.mobile-nav-item.pricing.active {
  color: #fb923c;
}
</style>
