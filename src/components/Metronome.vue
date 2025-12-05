<template>
  <div class="metronome-tuner">
    <div class="tab-selector">
      <button :class="['tab-btn', { active: activeTab === 'metronome' }]" @click="activeTab = 'metronome'">🎵 Metronome</button>
      <button :class="['tab-btn', { active: activeTab === 'tuner' }]" @click="activeTab = 'tuner'">🎸 Tuner</button>
    </div>

    <!-- Metronome Section -->
    <div v-if="activeTab === 'metronome'" class="metronome-section">
      <h1>🎵 Metronome</h1>
      <div class="bpm-display">
        <div class="bpm-value">{{ bpm }}</div>
        <div class="bpm-label">BPM</div>
      </div>
      <div class="beat-visual">
        <div v-for="beat in timeSignature" :key="beat" :class="['beat-dot', { active: currentBeat === beat, accent: beat === 1 }]"></div>
      </div>
      <div class="bpm-control">
        <button class="bpm-btn" @click="adjustBpm(-5)">−5</button>
        <input type="range" v-model.number="bpm" min="20" max="280" class="bpm-slider" />
        <button class="bpm-btn" @click="adjustBpm(5)">+5</button>
      </div>
      <div class="tap-tempo">
        <button class="tap-btn" @click="tapTempo">👆 Tap Tempo</button>
        <span class="tap-hint">Tap to set BPM</span>
      </div>
      <div class="time-signature">
        <label>Time Signature:</label>
        <div class="sig-buttons">
          <button v-for="sig in [3, 4, 6, 8]" :key="sig" :class="['sig-btn', { active: timeSignature === sig }]" @click="timeSignature = sig">{{ sig }}/4</button>
        </div>
      </div>
      <button :class="['play-btn', { playing: isPlaying }]" @click="toggleMetronome">{{ isPlaying ? '⏹ Stop' : '▶ Start' }}</button>
      <div class="tempo-reference">
        <div v-for="tempo in tempoMarkings" :key="tempo.name" :class="['tempo-item', { active: bpm >= tempo.min && bpm <= tempo.max }]" @click="bpm = Math.floor((tempo.min + tempo.max) / 2)">
          <span class="tempo-name">{{ tempo.name }}</span>
          <span class="tempo-range">{{ tempo.min }}-{{ tempo.max }}</span>
        </div>
      </div>
    </div>

    <!-- Tuner Section -->
    <div v-if="activeTab === 'tuner'" class="tuner-section">
      <h1>🎸 Chromatic Tuner</h1>
      <div class="tuner-display">
        <div class="note-display">
          <span class="detected-note">{{ detectedNote || '--' }}</span>
          <span class="octave" v-if="detectedNote">{{ detectedOctave }}</span>
        </div>
        <div class="tuning-meter">
          <div class="meter-labels"><span>♭ Flat</span><span>In Tune</span><span>Sharp ♯</span></div>
          <div class="meter-bar">
            <div class="meter-center"></div>
            <div class="meter-needle" :style="{ transform: `translateX(${cents * 2}px)` }" :class="{ 'in-tune': Math.abs(cents) < 5 }"></div>
          </div>
          <div class="cents-display"><span :class="{ 'in-tune': Math.abs(cents) < 5 }">{{ cents > 0 ? '+' : '' }}{{ cents }} cents</span></div>
        </div>
        <div :class="['tuner-status', tuningStatus]">{{ tuningMessage }}</div>
      </div>
      <div class="string-reference">
        <h3>Standard Guitar Tuning</h3>
        <div class="strings">
          <button v-for="string in guitarStrings" :key="string.name" :class="['string-btn', { active: targetNote === string.note }]" @click="playReferenceNote(string)">
            <span class="string-name">{{ string.name }}</span>
            <span class="string-note">{{ string.note }}</span>
            <span class="string-freq">{{ string.freq }}Hz</span>
          </button>
        </div>
      </div>
      <div class="tuner-controls">
        <button :class="['listen-btn', { listening: isListening }]" @click="toggleTuner">{{ isListening ? '🎤 Listening...' : '🎤 Start Tuner' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'

const activeTab = ref('metronome')
const bpm = ref(120)
const isPlaying = ref(false)
const currentBeat = ref(0)
const timeSignature = ref(4)
let metronomeInterval = null
let audioContext = null
let tapTimes = []

const tempoMarkings = [
  { name: 'Largo', min: 40, max: 60 },
  { name: 'Adagio', min: 60, max: 80 },
  { name: 'Andante', min: 80, max: 100 },
  { name: 'Moderato', min: 100, max: 120 },
  { name: 'Allegro', min: 120, max: 160 },
  { name: 'Vivace', min: 160, max: 180 },
  { name: 'Presto', min: 180, max: 220 },
]

function adjustBpm(amount) { bpm.value = Math.max(20, Math.min(280, bpm.value + amount)) }

function tapTempo() {
  const now = Date.now()
  tapTimes.push(now)
  if (tapTimes.length > 4) tapTimes.shift()
  if (tapTimes.length >= 2) {
    const intervals = []
    for (let i = 1; i < tapTimes.length; i++) intervals.push(tapTimes[i] - tapTimes[i - 1])
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const calculatedBpm = Math.round(60000 / avgInterval)
    if (calculatedBpm >= 20 && calculatedBpm <= 280) bpm.value = calculatedBpm
  }
  setTimeout(() => { if (Date.now() - tapTimes[tapTimes.length - 1] > 2000) tapTimes = [] }, 2000)
}

function playClick(accent = false) {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.type = 'sine'
    osc.frequency.value = accent ? 1000 : 800
    gain.gain.setValueAtTime(accent ? 0.5 : 0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    osc.connect(gain)
    gain.connect(audioContext.destination)
    osc.start()
    osc.stop(audioContext.currentTime + 0.1)
  } catch (e) {}
}

function toggleMetronome() {
  if (isPlaying.value) { stopMetronome() } else { startMetronome() }
}

function startMetronome() {
  isPlaying.value = true
  currentBeat.value = 1
  playClick(true)
  const interval = 60000 / bpm.value
  metronomeInterval = setInterval(() => {
    currentBeat.value = currentBeat.value >= timeSignature.value ? 1 : currentBeat.value + 1
    playClick(currentBeat.value === 1)
  }, interval)
}

function stopMetronome() {
  isPlaying.value = false
  currentBeat.value = 0
  if (metronomeInterval) { clearInterval(metronomeInterval); metronomeInterval = null }
}

watch(bpm, () => { if (isPlaying.value) { stopMetronome(); startMetronome() } })
watch(timeSignature, () => { if (isPlaying.value) { stopMetronome(); startMetronome() } })

// Tuner
const isListening = ref(false)
const detectedNote = ref('')
const detectedOctave = ref(4)
const cents = ref(0)
const tuningStatus = ref('')
const tuningMessage = ref('Tap "Start Tuner" and play a note')
const targetNote = ref('')
let analyserNode = null
let micStream = null

const guitarStrings = [
  { name: '1st (e)', note: 'E4', freq: 329.63 },
  { name: '2nd (B)', note: 'B3', freq: 246.94 },
  { name: '3rd (G)', note: 'G3', freq: 196.00 },
  { name: '4th (D)', note: 'D3', freq: 146.83 },
  { name: '5th (A)', note: 'A2', freq: 110.00 },
  { name: '6th (E)', note: 'E2', freq: 82.41 },
]

const noteFrequencies = {
  'C': [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50],
  'C#': [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73],
  'D': [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66],
  'D#': [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51],
  'E': [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51],
  'F': [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91],
  'F#': [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98],
  'G': [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98],
  'G#': [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22],
  'A': [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00],
  'A#': [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66],
  'B': [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53],
}

function frequencyToNote(freq) {
  let minDiff = Infinity, closestNote = 'A', closestOctave = 4, closestFreq = 440
  for (const [note, freqs] of Object.entries(noteFrequencies)) {
    freqs.forEach((f, octave) => {
      const diff = Math.abs(freq - f)
      if (diff < minDiff) { minDiff = diff; closestNote = note; closestOctave = octave; closestFreq = f }
    })
  }
  const centsOff = Math.round(1200 * Math.log2(freq / closestFreq))
  return { note: closestNote, octave: closestOctave, cents: centsOff }
}

async function toggleTuner() {
  if (isListening.value) { stopTuner() } else { await startTuner() }
}

async function startTuner() {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = 2048
    const source = audioContext.createMediaStreamSource(micStream)
    source.connect(analyserNode)
    isListening.value = true
    tuningMessage.value = 'Play a note...'
    detectPitch()
  } catch (err) {
    tuningMessage.value = 'Microphone access denied'
    tuningStatus.value = 'error'
  }
}

function stopTuner() {
  isListening.value = false
  if (micStream) { micStream.getTracks().forEach(track => track.stop()); micStream = null }
  detectedNote.value = ''
  cents.value = 0
  tuningMessage.value = 'Tap "Start Tuner" and play a note'
  tuningStatus.value = ''
}

function detectPitch() {
  if (!isListening.value || !analyserNode) return
  const buffer = new Float32Array(analyserNode.fftSize)
  analyserNode.getFloatTimeDomainData(buffer)
  const freq = autoCorrelate(buffer, audioContext.sampleRate)
  if (freq > 0) {
    const { note, octave, cents: centsOff } = frequencyToNote(freq)
    detectedNote.value = note
    detectedOctave.value = octave
    cents.value = Math.max(-50, Math.min(50, centsOff))
    if (Math.abs(centsOff) < 5) { tuningStatus.value = 'perfect'; tuningMessage.value = '✓ In Tune!' }
    else if (centsOff < 0) { tuningStatus.value = 'flat'; tuningMessage.value = '↑ Tune Up' }
    else { tuningStatus.value = 'sharp'; tuningMessage.value = '↓ Tune Down' }
  }
  requestAnimationFrame(detectPitch)
}

function autoCorrelate(buffer, sampleRate) {
  let size = buffer.length, rms = 0
  for (let i = 0; i < size; i++) rms += buffer[i] * buffer[i]
  rms = Math.sqrt(rms / size)
  if (rms < 0.01) return -1
  let r1 = 0, r2 = size - 1
  const threshold = 0.2
  for (let i = 0; i < size / 2; i++) { if (Math.abs(buffer[i]) < threshold) { r1 = i; break } }
  for (let i = 1; i < size / 2; i++) { if (Math.abs(buffer[size - i]) < threshold) { r2 = size - i; break } }
  buffer = buffer.slice(r1, r2)
  size = buffer.length
  const c = new Array(size).fill(0)
  for (let i = 0; i < size; i++) { for (let j = 0; j < size - i; j++) { c[i] += buffer[j] * buffer[j + i] } }
  let d = 0
  while (c[d] > c[d + 1]) d++
  let maxval = -1, maxpos = -1
  for (let i = d; i < size; i++) { if (c[i] > maxval) { maxval = c[i]; maxpos = i } }
  return sampleRate / maxpos
}

function playReferenceNote(string) {
  targetNote.value = string.note
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.type = 'sine'
    osc.frequency.value = string.freq
    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)
    osc.connect(gain)
    gain.connect(audioContext.destination)
    osc.start()
    osc.stop(audioContext.currentTime + 2)
  } catch (e) {}
}

onUnmounted(() => { stopMetronome(); stopTuner() })
</script>

<style scoped>
.metronome-tuner { max-width: 700px; margin: 0 auto; padding: 24px; }
.tab-selector { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; }
.tab-btn { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; padding: 14px 32px; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.tab-btn:hover { border-color: #06c167; }
.tab-btn.active { background: linear-gradient(135deg, #06c167, #04a857); border-color: #06c167; color: #fff; }
.metronome-section h1, .tuner-section h1 { text-align: center; font-size: 2rem; margin-bottom: 32px; background: linear-gradient(135deg, #06c167, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.bpm-display { text-align: center; margin-bottom: 24px; }
.bpm-value { font-size: 6rem; font-weight: 700; color: #fff; line-height: 1; text-shadow: 0 0 40px rgba(6, 193, 103, 0.4); }
.bpm-label { font-size: 1.2rem; color: #8892a6; text-transform: uppercase; letter-spacing: 4px; }
.beat-visual { display: flex; justify-content: center; gap: 16px; margin-bottom: 32px; }
.beat-dot { width: 24px; height: 24px; border-radius: 50%; background: #2a2a3e; transition: all 0.1s; }
.beat-dot.active { background: #06c167; box-shadow: 0 0 20px rgba(6, 193, 103, 0.6); transform: scale(1.3); }
.beat-dot.accent { border: 2px solid #06c167; }
.bpm-control { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
.bpm-btn { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; width: 50px; height: 50px; border-radius: 50%; font-size: 1.2rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.bpm-btn:hover { border-color: #06c167; color: #06c167; }
.bpm-slider { width: 200px; height: 8px; border-radius: 4px; background: #2a2a3e; appearance: none; cursor: pointer; }
.bpm-slider::-webkit-slider-thumb { appearance: none; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #06c167, #04a857); cursor: pointer; box-shadow: 0 2px 8px rgba(6, 193, 103, 0.4); }
.tap-tempo { text-align: center; margin-bottom: 24px; }
.tap-btn { background: linear-gradient(135deg, #1a1a2e, #252540); border: 2px solid #3a3a5e; color: #fff; padding: 16px 40px; border-radius: 16px; font-size: 1.2rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.tap-btn:hover { border-color: #06c167; transform: scale(1.02); }
.tap-btn:active { transform: scale(0.98); }
.tap-hint { display: block; color: #666; font-size: 0.85rem; margin-top: 8px; }
.time-signature { margin-bottom: 24px; }
.time-signature label { display: block; color: #8892a6; margin-bottom: 12px; text-align: center; }
.sig-buttons { display: flex; justify-content: center; gap: 12px; }
.sig-btn { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.sig-btn:hover { border-color: #06c167; }
.sig-btn.active { background: rgba(6, 193, 103, 0.2); border-color: #06c167; color: #06c167; }
.play-btn { display: block; width: 100%; max-width: 300px; margin: 32px auto; padding: 20px; border-radius: 16px; font-size: 1.5rem; font-weight: 700; cursor: pointer; transition: all 0.3s; background: linear-gradient(135deg, #06c167, #04a857); border: none; color: #fff; box-shadow: 0 8px 32px rgba(6, 193, 103, 0.3); }
.play-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(6, 193, 103, 0.4); }
.play-btn.playing { background: linear-gradient(135deg, #ff6b6b, #ee5a5a); box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3); }
.tempo-reference { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 32px; }
.tempo-item { background: #1a1a2e; border: 1px solid #2a2a3e; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; text-align: center; }
.tempo-item:hover { border-color: #06c167; }
.tempo-item.active { background: rgba(6, 193, 103, 0.2); border-color: #06c167; }
.tempo-name { display: block; color: #fff; font-weight: 600; font-size: 0.9rem; }
.tempo-range { display: block; color: #666; font-size: 0.75rem; }
.tuner-display { background: linear-gradient(135deg, #0f1424, #1a1f35); border: 2px solid #2a2a3e; border-radius: 20px; padding: 40px; margin-bottom: 32px; }
.note-display { text-align: center; margin-bottom: 24px; }
.detected-note { font-size: 5rem; font-weight: 700; color: #fff; }
.octave { font-size: 2rem; color: #8892a6; vertical-align: super; }
.tuning-meter { margin-bottom: 24px; }
.meter-labels { display: flex; justify-content: space-between; color: #666; font-size: 0.85rem; margin-bottom: 8px; }
.meter-bar { height: 24px; background: linear-gradient(90deg, #ff6b6b 0%, #2a2a3e 45%, #06c167 50%, #2a2a3e 55%, #ff6b6b 100%); border-radius: 12px; position: relative; overflow: hidden; }
.meter-center { position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; background: #06c167; transform: translateX(-50%); box-shadow: 0 0 10px rgba(6, 193, 103, 0.5); }
.meter-needle { position: absolute; left: 50%; top: 2px; bottom: 2px; width: 8px; background: #fff; border-radius: 4px; transform: translateX(-50%); transition: transform 0.1s; box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
.meter-needle.in-tune { background: #06c167; box-shadow: 0 0 20px rgba(6, 193, 103, 0.8); }
.cents-display { text-align: center; margin-top: 12px; color: #8892a6; }
.cents-display .in-tune { color: #06c167; font-weight: 600; }
.tuner-status { text-align: center; font-size: 1.5rem; font-weight: 600; padding: 12px; border-radius: 12px; }
.tuner-status.perfect { background: rgba(6, 193, 103, 0.2); color: #06c167; }
.tuner-status.flat { background: rgba(0, 150, 255, 0.2); color: #0096ff; }
.tuner-status.sharp { background: rgba(255, 150, 0, 0.2); color: #ff9600; }
.string-reference { margin-bottom: 32px; }
.string-reference h3 { color: #fff; text-align: center; margin-bottom: 16px; }
.strings { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
.string-btn { background: #1a1a2e; border: 2px solid #2a2a3e; border-radius: 12px; padding: 12px 8px; cursor: pointer; transition: all 0.2s; text-align: center; }
.string-btn:hover { border-color: #06c167; }
.string-btn.active { background: rgba(6, 193, 103, 0.2); border-color: #06c167; }
.string-name { display: block; color: #666; font-size: 0.75rem; }
.string-note { display: block; color: #fff; font-size: 1.2rem; font-weight: 700; }
.string-freq { display: block; color: #666; font-size: 0.7rem; }
.tuner-controls { text-align: center; margin-bottom: 32px; }
.listen-btn { background: linear-gradient(135deg, #06c167, #04a857); border: none; color: #fff; padding: 16px 40px; border-radius: 16px; font-size: 1.2rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 24px rgba(6, 193, 103, 0.3); }
.listen-btn:hover { transform: translateY(-2px); }
.listen-btn.listening { background: linear-gradient(135deg, #ff6b6b, #ee5a5a); animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4); } 50% { box-shadow: 0 0 0 20px rgba(255, 107, 107, 0); } }
@media (max-width: 600px) { .strings { grid-template-columns: repeat(3, 1fr); } .bpm-value { font-size: 4rem; } }
</style>
