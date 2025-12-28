<template>
  <div class="app-shell music-bg">
    <header class="topbar">
      <div class="brand" @click="view='home'" style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
        <img :src="brandLogo" alt="FretPilot Studio" class="brand-logo" />
        <span class="brand-name">FretPilot Studio</span>
      </div>
      <nav class="nav">
        <button class="nav-link" :class="{ active: view === 'home' }" @click="view='home'">Home</button>
        <button class="nav-link" :class="{ active: view === 'chord-trainer' }" @click="view='chord-trainer'">Chord Trainer</button>
        <button class="nav-link" :class="{ active: view === 'chord-library' }" @click="view='chord-library'">Chords</button>
        <button class="nav-link" :class="{ active: view === 'metronome' }" @click="view='metronome'">Tools</button>
        <button class="nav-link" :class="{ active: view === 'pricing' }" @click="view='pricing'">Pricing</button>
        <button v-if="isCreatorUser" class="nav-link dev-link" :class="{ active: view === 'admin' }" @click="view='admin'">🛠️ Dev</button>
      </nav>
      <div class="status">
        <span class="badge" :class="premium ? 'pro' : 'free'">{{ premium ? 'Premium' : 'Free' }}</span>
      </div>
    </header>

    <div v-if="view !== 'home' && view !== 'pricing'" class="back-bar">
      <button class="back-btn" @click="view='home'">← Back to Home</button>
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
        <h2>Coming soon</h2>
        <button @click="view='home'">Back</button>
      </div>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="/privacy.html" target="_blank" rel="noopener">Privacy Policy</a>
          <a href="/terms.html" target="_blank" rel="noopener">Terms of Service</a>
          <a href="/refund-policy.html" target="_blank" rel="noopener">Refund Policy</a>
          <a href="mailto:support@fretpilotstudio.com">Contact Support</a>
        </div>
        <p class="affiliate-disclosure">Some links & referral codes may be affiliate links. If you purchase, we may earn a commission at no extra cost to you.</p>
        <p class="footer-copyright">© 2025 FretPilot Studio.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { isPremium, isCreator } from './services/featureFlags'
import brandLogo from '../images/temple-logo-2025.jpeg'
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
function openFeature(feature) { view.value = feature }

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

onUnmounted(() => { if (premiumCheckInterval) clearInterval(premiumCheckInterval) })
</script>

<style>
* { box-sizing: border-box; }
html { overflow-y: scroll; scrollbar-gutter: stable; width: 100%; }
html,body,#app { height:100%; margin:0; padding:0; background:#000; }
body { width: 100%; position: relative; }
.app-shell { display:flex; flex-direction:column; min-height:100%; background:#000; overflow-x: hidden; width: 100%; }
.topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; background:#0a0a0a; border-bottom:1px solid rgba(255,255,255,0.08); position:sticky; top:0; z-index:10; flex-wrap: wrap; }
.brand { font-weight:700 }
.brand-name { color: #fff; }
@media (max-width: 600px) { .brand-name { display: none; } }
.brand-logo { height:42px; width:auto; display:block; filter:drop-shadow(0 0 4px rgba(0,0,0,0.6)); border-radius:6px }
@media (max-width: 768px) { .brand-logo { height:34px } }
.nav { display:flex; gap:8px; flex-wrap: wrap; align-items: center; }
.nav-link { background:transparent; color:#cfd6e6; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; text-decoration: none; display: inline-block; white-space: nowrap; font-size: 0.95rem; transition: all 0.2s; }
.nav-link:hover { color:#fff; background:#1a1a1a; }
.nav-link.active { color:#06c167; background: rgba(6, 193, 103, 0.1); }
.nav-link.dev-link { color:#ffa500; border: 1px solid rgba(255, 165, 0, 0.3); }
.nav-link.dev-link:hover { background: rgba(255, 165, 0, 0.1); }
.nav-link.dev-link.active { color:#ffa500; background: rgba(255, 165, 0, 0.15); }
@media (max-width: 600px) { .nav-link { padding: 6px 10px; font-size: 0.85rem; } }
.status { display:flex; align-items:center; gap:8px }
.badge { padding:4px 8px; border-radius:999px; font-size:12px; border:1px solid #2a2a2a }
.badge.free { background:#1a1a1a; color:#d4daea }
.badge.pro { background:#06c167; color:#0b1c12; border-color:#09a557 }
.content { flex:1; background:#000; }
.back-bar { background: #0a0a0a; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.back-btn { background: none; border: none; color: #8892a6; font-size: 0.95rem; cursor: pointer; padding: 0; transition: color 0.2s; }
.back-btn:hover { color: #06c167; }
.coming-soon { max-width: 600px; margin: 0 auto; padding: 60px 20px; text-align: center; color: #fff; }
.coming-soon h2 { font-size: 2.5em; margin-bottom: 15px; }
.coming-soon button { padding: 12px 24px; background: #06c167; color: #fff; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer; }
.music-bg { background: radial-gradient(1200px 600px at 10% 0%, rgba(0,64,255,0.08), transparent), radial-gradient(1000px 500px at 90% 20%, rgba(0,200,140,0.08), transparent), linear-gradient(180deg, #0a0a0f 0%, #0b0d15 100%); position: relative; overflow-x: hidden; }
.app-footer { background: #0a0a0a; border-top: 1px solid rgba(255,255,255,0.1); padding: 24px 20px; margin-top: auto; }
.footer-content { max-width: 1400px; margin: 0 auto; text-align: center; }
.footer-links { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 16px; }
.footer-links a { color: #8892a6; text-decoration: none; font-size: 0.9em; transition: color 0.3s; }
.footer-links a:hover { color: #06c167; }
.affiliate-disclosure { color: #555; font-size: 0.8em; margin: 0 0 8px; }
.footer-copyright { color: #555; font-size: 0.85em; margin: 0; }
/* Hide ALL Vercel widgets - feedback, analytics, toolbar */
#__vercel-toolbar, 
[data-vercel-toolbar], 
[data-vercel-feedback],
.vercel-live-feedback-button,
#vercel-live-feedback,
a[href*="vercel.com"],
div[class*="vercel"],
iframe[src*="vercel"],
div[style*="position: fixed"][style*="left: 0px"],
div[style*="position: fixed"][style*="z-index: 2147483647"],
body > div[style*="position: fixed"]:not(.app-shell):not(#app) { 
  display: none !important; 
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
}
</style>
