<template>
  <div v-if="screen === 'splash'" class="splash-screen">
    <div class="logo-container">
  <img :src="logo" alt="FretPilot Logo" class="logo" />
    </div>
  <h1 class="title">Welcome to FretPilot</h1>
    <p class="tagline">Master chords. Earn legacy. Play with purpose.</p>
    <button @click="runSequence" class="enter-button">Begin Your Quest</button>
  </div>

  <div v-else-if="screen === 'trainer'" class="trainer-screen">
    <h2>Chord Trainer Module</h2>
    <p>Track your progress, master chords, and unlock certificates.</p>

    <div class="dashboard">
      <p>Total Chords: {{ chords.length }}</p>
      <p>Mastered: {{ masteredCount }}</p>
      <p>Completion: {{ completionRate }}%</p>
    </div>

    <ul class="chord-list">
      <li v-for="chord in chords" :key="chord.name">
        <label>
          <input type="checkbox" v-model="chord.mastered" @change="saveProgress" />
          {{ chord.name }}
        </label>
        <button @click="playChord(chord.name)" class="play-button">🔊</button>
      </li>
    </ul>

    <input v-model="userName" placeholder="Enter your name" class="name-input" />
    <button @click="generateCertificate" class="cert-button">Generate Certificate</button>

    <div v-if="certificateReady" class="certificate-preview" ref="certificateRef">
      <h3>🎉 Certificate of Mastery</h3>
      <p>This certifies that <strong>{{ userName || 'Anonymous' }}</strong> has mastered:</p>
      <ul>
        <li v-for="chord in masteredChords" :key="chord">{{ chord }}</li>
      </ul>
      <p class="date">Issued on: {{ issueDate }}</p>
  <p class="footer">FretPilot Legacy Edition</p>
      <button @click="exportCertificate" class="export-button">🖨️ Export Certificate</button>
    </div>

    <div v-if="suggestions.length" class="suggestions">
      <h4>🎯 Suggested Next Chords</h4>
      <ul>
        <li v-for="s in suggestions" :key="s">{{ s }}</li>
      </ul>
    </div>

    <div class="payment-section">
  <h4>💳 Upgrade to FretPilot Pro</h4>
      <button @click="initiatePayment" class="pay-button">Subscribe via Stripe</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import logo from '../assets/fretpilot-logo.svg'
import html2canvas from 'html2canvas'

// App state
const screen = ref('splash')
const userName = ref('')
const issueDate = ref('')
const certificateReady = ref(false)
const certificateRef = ref(null)

// Chord data
const chords = ref([
  { name: 'C Major', mastered: false },
  { name: 'G Major', mastered: false },
  { name: 'D Major', mastered: false },
  { name: 'E Minor', mastered: false },
  { name: 'A Minor', mastered: false },
  { name: 'F Major', mastered: false },
  { name: 'B Diminished', mastered: false }
])

// Computed
const masteredChords = computed(() => chords.value.filter(c => c.mastered).map(c => c.name))
const masteredCount = computed(() => masteredChords.value.length)
const completionRate = computed(() => Math.round((masteredCount.value / chords.value.length) * 100))

const suggestions = computed(() => {
  const all = ['E Major', 'A Major', 'D Minor', 'G7', 'C7']
  // Suggest chords that aren't already in the list and not mastered
  return all.filter(s => !chords.value.some(c => c.name === s) && !masteredChords.value.includes(s))
})

// Pause helper
function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Save progress to localStorage
function saveProgress() {
  try {
    // Persist the current chord list and mastered state
    localStorage.setItem('fretpilot-chords', JSON.stringify(chords.value))
  } catch (e) {
    // Storage may fail in some contexts; fail silently
    console.warn('Failed to save progress:', e)
  }
}

// Load progress on mount
onMounted(() => {
    const saved = localStorage.getItem('fretpilot-chords')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // Validate parsed structure roughly
      if (Array.isArray(parsed)) chords.value = parsed
    } catch (e) {
      console.warn('Failed to parse saved chords:', e)
    }
  }
})

// Certificate logic
function generateCertificate() {
  if (masteredCount.value >= 3) {
    certificateReady.value = true
    issueDate.value = new Date().toLocaleDateString()
    // Ensure certificate is saved (optional)
    saveProgress()
  } else {
    // Use a friendly UI alert - keep simple for scaffold
    window.alert('Master at least 3 chords to unlock your certificate.')
  }
}

// Audio playback
function playChord(name) {
  // Path conventions: use lowercased underscore name. The dev should provide matching audio assets in /public/audio/
  const fileName = name.replace(/\s+/g, '_').toLowerCase() + '.mp3'
  const audioPath = `/audio/${fileName}`
  try {
    const audio = new Audio(audioPath)
    audio.play().catch(err => console.warn('Audio playback failed:', err))
  } catch (e) {
    console.warn('Failed to play audio:', e)
  }
}

// Export certificate
async function exportCertificate() {
  if (!certificateRef.value) return
  await pause(200)
  try {
    const canvas = await html2canvas(certificateRef.value)
    const link = document.createElement('a')
      link.download = 'fretpilot_certificate.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    console.error('Export failed:', e)
    window.alert('Failed to export certificate. Check console for details.')
  }
}

// Stripe payment scaffold
function initiatePayment() {
  // Real payment requires a backend and API keys. Keep scaffold here.
  window.alert('Stripe payment flow would begin here. Implement server-side checkout to proceed.')
}

// Sequential flow
async function runSequence() {
  screen.value = 'splash'
  await pause(800)

  screen.value = 'trainer'
  await pause(400)
}
</script>

<style scoped>
:root {
  --bg-1: #000;
  --bg-2: #0a0a0a;
  --accent: #ff6f61;
  --muted: #bfc6d9;
}

.splash-screen,
.trainer-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-1), var(--bg-2));
  color: #fff;
  text-align: center;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 120px;
  height: auto;
  border-radius: 8px;
}

.title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.tagline {
  font-size: 1.05rem;
  margin-bottom: 22px;
  font-style: italic;
  color: var(--muted);
}

.enter-button {
  background-color: var(--accent);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.enter-button:hover {
  background-color: #ff3b2e;
}

.dashboard {
  margin-bottom: 16px;
  font-size: 1rem;
  color: var(--muted);
}

.chord-list {
  list-style: none;
  padding: 0;
  margin: 18px 0;
  text-align: left;
  width: 90%;
  max-width: 640px;
}

.chord-list li {
  margin: 10px 0;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0a0a0a;
  padding: 10px 12px;
  border-radius: 8px;
}

.play-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.name-input {
  margin-top: 10px;
  padding: 10px;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  width: 60%;
  max-width: 420px;
}

.cert-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 14px;
}

.cert-button:hover {
  background-color: #388e3c;
}

.certificate-preview {
  margin-top: 24px;
  background-color: #0a0a0a;
  padding: 18px;
  border-radius: 10px;
  width: 85%;
  max-width: 720px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.45);
}

.certificate-preview ul {
  list-style: none;
  padding: 0;
  margin: 8px 0;
}

.date {
  margin-top: 10px;
  font-style: italic;
  color: var(--muted);
}

.footer {
  margin-top: 14px;
  font-weight: 700;
  font-size: 1.05rem;
}

.export-button {
  margin-top: 12px;
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 14px;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
}

.export-button:hover {
  background-color: #1976d2;
}

.suggestions {
  margin-top: 18px;
  color: var(--muted);
}

.payment-section {
  margin-top: 18px;
}

.pay-button {
  background: linear-gradient(90deg,#ffb86b,#ff6f61);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.pay-button:hover { opacity: 0.95 }

@media (max-width: 600px) {
  .title { font-size: 1.8rem }
  .chord-list li { font-size: 0.98rem }
  .name-input { width: 90% }
}
</style>
