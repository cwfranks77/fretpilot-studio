<template>
  <div class="metronome-page">
    <img src="/images/metronome.svg" alt="Metronome" class="page-hero" />
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0;">
      <FeatureIcons icon="metronome" :size="48" />
      <h2 style="margin: 0;">🎵 Metronome & Tuner</h2>
    </div>
    <p class="subtitle">Keep perfect time and stay in tune</p>

    <div class="tool-tabs">
      <button :class="{active: mode==='metronome'}" @click="mode='metronome'">⏱️ Metronome</button>
      <button :class="{active: mode==='tuner'}" @click="mode='tuner'">🎸 Tuner</button>
    </div>

    <div v-if="mode==='metronome'" class="metronome">
      <div class="tempo-display">
        <div class="bpm">{{ bpm }}</div>
        <div class="label">BPM</div>
      </div>
      
      <div class="tempo-controls">
        <button @click="bpm = Math.max(40, bpm-1)">-</button>
        <input type="range" v-model.number="bpm" min="40" max="240" />
        <button @click="bpm = Math.min(240, bpm+1)">+</button>
      </div>

      <button @click="tapTempo" class="tap-button">Tap Tempo</button>

      <div class="beat-indicator">
        <div v-for="i in 4" :key="i" 
             class="beat" 
             :class="{active: playing && currentBeat === i}">
        </div>
      </div>

      <button @click="toggleMetronome" class="play-button">
        {{ playing ? '⏸️ Stop' : '▶️ Start' }}
      </button>
    </div>

    <div v-else class="tuner">
      <div class="tuner-display">
        <div class="note">{{ detectedNote || '—' }}</div>
        <div class="frequency">{{ detectedFreq ? detectedFreq.toFixed(1) + ' Hz' : 'Play a note' }}</div>
      </div>

      <div class="tuner-needle">
        <div class="needle" :style="{transform: `rotate(${needleAngle}deg)`}"></div>
        <div class="scale">
          <span>♭</span>
          <span>●</span>
          <span>♯</span>
        </div>
      </div>

      <button @click="toggleTuner" class="tuner-button">
        {{ tunerActive ? '🔴 Stop Listening' : '🎤 Start Tuner' }}
      </button>

      <div class="string-reference">
        <h4>Standard Tuning Reference</h4>
        <div class="strings">
          <button v-for="s in standardStrings" :key="s.note" 
                  @click="playReference(s.freq)"
                  class="string-btn">
            {{ s.string }}: {{ s.note }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import FeatureIcons from '../assets/logos/FeatureIcons.vue'

const mode = ref('metronome')
const bpm = ref(120)
const playing = ref(false)
const currentBeat = ref(1)
let metronomeInterval = null
let audioContext = null
let tapTimes = []

const tunerActive = ref(false)
const detectedNote = ref(null)
const detectedFreq = ref(null)
const needleAngle = ref(0)

const standardStrings = [
  { string: 'E', note: 'E2', freq: 82.41 },
  { string: 'A', note: 'A2', freq: 110.00 },
  { string: 'D', note: 'D3', freq: 146.83 },
  { string: 'G', note: 'G3', freq: 196.00 },
  { string: 'B', note: 'B3', freq: 246.94 },
  { string: 'e', note: 'E4', freq: 329.63 }
]

function toggleMetronome() {
  playing.value = !playing.value
  if (playing.value) {
    startMetronome()
  } else {
    stopMetronome()
  }
}

function startMetronome() {
  if (!audioContext) audioContext = new AudioContext()
  const interval = 60000 / bpm.value
  currentBeat.value = 1
  
  playClick()
  metronomeInterval = setInterval(() => {
    currentBeat.value = (currentBeat.value % 4) + 1
    playClick()
  }, interval)
}

function stopMetronome() {
  if (metronomeInterval) {
    clearInterval(metronomeInterval)
    metronomeInterval = null
  }
  currentBeat.value = 1
}

function playClick() {
  if (!audioContext) return
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  
  osc.connect(gain)
  gain.connect(audioContext.destination)
  
  osc.frequency.value = currentBeat.value === 1 ? 1200 : 800
  gain.gain.setValueAtTime(0.3, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
  
  osc.start(audioContext.currentTime)
  osc.stop(audioContext.currentTime + 0.05)
}

function tapTempo() {
  const now = Date.now()
  tapTimes.push(now)
  tapTimes = tapTimes.filter(t => now - t < 3000)
  
  if (tapTimes.length >= 2) {
    const intervals = []
    for (let i = 1; i < tapTimes.length; i++) {
      intervals.push(tapTimes[i] - tapTimes[i-1])
    }
    const avgInterval = intervals.reduce((a,b) => a+b, 0) / intervals.length
    bpm.value = Math.round(60000 / avgInterval)
  }
}

function toggleTuner() {
  tunerActive.value = !tunerActive.value
  if (tunerActive.value) {
    startTuner()
  } else {
    stopTuner()
  }
}

async function startTuner() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // Simplified tuner simulation - real implementation would use pitch detection
    detectedNote.value = 'A'
    detectedFreq.value = 440.0
    needleAngle.value = -5 + Math.random() * 10
  } catch (err) {
    alert('Microphone access denied. Please enable microphone permissions.')
    tunerActive.value = false
  }
}

function stopTuner() {
  detectedNote.value = null
  detectedFreq.value = null
  needleAngle.value = 0
}

function playReference(freq) {
  if (!audioContext) audioContext = new AudioContext()
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  
  osc.connect(gain)
  gain.connect(audioContext.destination)
  
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.3, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)
  
  osc.start(audioContext.currentTime)
  osc.stop(audioContext.currentTime + 2)
}

onUnmounted(() => {
  stopMetronome()
  stopTuner()
  if (audioContext) audioContext.close()
})
</script>

<style scoped>
.metronome-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
}

.page-hero { width: 100%; max-width: 600px; height: auto; margin: 0 auto 20px; display: block; border-radius: 12px; }

h2 { text-align: center; margin-bottom: 5px; }
.subtitle { text-align: center; color: #8892a6; margin-bottom: 20px; }

.tool-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tool-tabs button {
  flex: 1;
  padding: 12px;
  background: #0a0a0a;
  color: #cfd6e6;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s;
}

.tool-tabs button.active {
  background: #06c167;
  color: #fff;
  border-color: #09a557;
}

.tempo-display {
  text-align: center;
  margin: 30px 0;
}

.bpm {
  font-size: 4em;
  font-weight: 700;
  color: #06c167;
    animation: glowPulse 2.8s ease-in-out infinite;
}
@keyframes glowPulse {
  0% { text-shadow: 0 0 0 rgba(6,193,103,0.0); }
  50% { text-shadow: 0 0 16px rgba(6,193,103,0.35); }
  100% { text-shadow: 0 0 0 rgba(6,193,103,0.0); }
}

.label {
  color: #8892a6;
  font-size: 1.2em;
}

.tempo-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.tempo-controls button {
  width: 40px;
  height: 40px;
  background: #0a0a0a;
  color: #fff;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.5em;
}

.tempo-controls input[type="range"] {
  flex: 1;
  height: 8px;
  background: #0a0a0a;
  border-radius: 4px;
  outline: none;
}

.tap-button {
  width: 100%;
  padding: 16px;
  background: #1a1a1a;
  color: #fff;
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  margin-bottom: 20px;
}

.beat-indicator {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
}

.beat {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #0a0a0a;
  border: 3px solid #1a1a1a;
  transition: all 0.1s;
}

.beat.active {
  background: #06c167;
  border-color: #09a557;
  box-shadow: 0 0 20px rgba(6, 193, 103, 0.6);
}

.play-button {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #06c167 0%, #09a557 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.3em;
  font-weight: 700;
}

.tuner-display {
  text-align: center;
  margin: 30px 0;
}

.note {
  font-size: 5em;
  font-weight: 700;
  color: #06c167;
}

.frequency {
  color: #8892a6;
  font-size: 1.2em;
  margin-top: 10px;
}

.tuner-needle {
  position: relative;
  height: 150px;
  margin: 40px 0;
}

.needle {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 4px;
  height: 100px;
  background: #06c167;
  transform-origin: bottom center;
  transition: transform 0.3s;
  box-shadow: 0 0 10px rgba(6, 193, 103, 0.6);
}

.scale {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1.5em;
  color: #8892a6;
}

.tuner-button {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.3em;
  font-weight: 700;
  margin-bottom: 30px;
}

.string-reference {
  background: #0a0a0a;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #1a1a1a;
}

.string-reference h4 {
  text-align: center;
  margin-bottom: 15px;
  color: #cfd6e6;
}

.strings {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.string-btn {
  padding: 12px;
  background: #000;
  color: #cfd6e6;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.string-btn:hover {
  background: #1a1a1a;
  border-color: #06c167;
}
</style>
