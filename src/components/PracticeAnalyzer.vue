<template>
  <div class="practice-analyzer">
    <div class="analyzer-header">
      <h1>📊 Practice Analyzer</h1>
      <p class="subtitle">Record your practice and get AI-powered feedback</p>
    </div>

    <!-- Session Setup -->
    <div v-if="!isRecording && !sessionComplete" class="session-setup">
      <div class="setup-card">
        <h2>🎯 What are you practicing?</h2>
        
        <div class="practice-type-selector">
          <button 
            v-for="type in practiceTypes" 
            :key="type.id"
            class="type-btn"
            :class="{ selected: practiceType === type.id }"
            @click="practiceType = type.id"
          >
            <span class="type-icon">{{ type.icon }}</span>
            <span class="type-name">{{ type.name }}</span>
          </button>
        </div>

        <div class="tempo-setup">
          <label>Target Tempo</label>
          <div class="tempo-control">
            <button class="tempo-adj" @click="targetTempo = Math.max(40, targetTempo - 5)">−</button>
            <span class="tempo-display">{{ targetTempo }} BPM</span>
            <button class="tempo-adj" @click="targetTempo = Math.min(200, targetTempo + 5)">+</button>
          </div>
        </div>

        <div class="duration-setup">
          <label>Practice Duration</label>
          <div class="duration-options">
            <button 
              v-for="d in [60, 120, 180, 300]" 
              :key="d"
              class="duration-btn"
              :class="{ selected: targetDuration === d }"
              @click="targetDuration = d"
            >
              {{ formatDuration(d) }}
            </button>
          </div>
        </div>

        <button class="start-btn" @click="startRecording">
          🎙️ Start Practice Session
        </button>
      </div>
    </div>

    <!-- Recording Interface -->
    <div v-if="isRecording" class="recording-interface">
      <div class="recording-status">
        <div class="rec-indicator">
          <span class="rec-dot"></span>
          <span>Recording</span>
        </div>
        <div class="timer">{{ formatTime(elapsedTime) }}</div>
      </div>

      <!-- Live Waveform Visualization -->
      <div class="waveform-container">
        <canvas ref="waveformCanvas" class="waveform"></canvas>
      </div>

      <!-- Live Metrics -->
      <div class="live-metrics">
        <div class="metric-card">
          <span class="metric-label">Detected Tempo</span>
          <span class="metric-value" :class="tempoClass">{{ detectedTempo || '--' }}</span>
          <span class="metric-unit">BPM</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Target</span>
          <span class="metric-value">{{ targetTempo }}</span>
          <span class="metric-unit">BPM</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Variance</span>
          <span class="metric-value" :class="varianceClass">{{ tempoVariance }}%</span>
          <span class="metric-unit">deviation</span>
        </div>
      </div>

      <!-- Metronome -->
      <div class="metronome-section">
        <div class="metronome-toggle">
          <button 
            class="metro-btn"
            :class="{ active: metronomeEnabled }"
            @click="toggleMetronome"
          >
            {{ metronomeEnabled ? '🔊 Metronome On' : '🔇 Metronome Off' }}
          </button>
        </div>
        <div v-if="metronomeEnabled" class="beat-display">
          <span 
            v-for="beat in 4" 
            :key="beat"
            class="beat"
            :class="{ active: currentBeat === beat }"
          >{{ beat }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="recording-controls">
        <button class="control-btn stop" @click="stopRecording">
          ⏹️ Stop & Analyze
        </button>
      </div>
    </div>

    <!-- Analysis Results -->
    <div v-if="sessionComplete && analysisResults" class="analysis-results">
      <div class="results-header">
        <h2>🎉 Session Complete!</h2>
        <p>Here's your practice analysis</p>
      </div>

      <!-- Overall Score -->
      <div class="score-card">
        <div class="score-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" class="score-bg"/>
            <circle 
              cx="50" cy="50" r="45" 
              class="score-fill"
              :style="{ strokeDasharray: `${analysisResults.overallScore * 2.83} 283` }"
            />
          </svg>
          <span class="score-value">{{ analysisResults.overallScore }}</span>
        </div>
        <div class="score-label">
          <span class="score-grade">{{ getGrade(analysisResults.overallScore) }}</span>
          <span class="score-text">Overall Score</span>
        </div>
      </div>

      <!-- Detailed Metrics -->
      <div class="metrics-grid">
        <div class="metric-detail">
          <div class="metric-header">
            <span class="metric-icon">⏱️</span>
            <span class="metric-title">Timing Accuracy</span>
          </div>
          <div class="metric-bar">
            <div 
              class="bar-fill timing"
              :style="{ width: getTimingScore() + '%' }"
            ></div>
          </div>
          <span class="metric-desc">{{ analysisResults.timing.accuracy }}</span>
        </div>

        <div class="metric-detail">
          <div class="metric-header">
            <span class="metric-icon">🎯</span>
            <span class="metric-title">Tempo Consistency</span>
          </div>
          <div class="metric-bar">
            <div 
              class="bar-fill consistency"
              :style="{ width: getConsistencyScore() + '%' }"
            ></div>
          </div>
          <span class="metric-desc">{{ analysisResults.timing.variance }}% variance from target</span>
        </div>

        <div class="metric-detail">
          <div class="metric-header">
            <span class="metric-icon">📈</span>
            <span class="metric-title">Practice Time</span>
          </div>
          <div class="metric-value-lg">{{ analysisResults.practiceMinutes }} min</div>
          <span class="metric-desc">Great job staying focused!</span>
        </div>
      </div>

      <!-- Mistake Heatmap (Simplified) -->
      <div class="heatmap-section">
        <h3>🔥 Activity Heatmap</h3>
        <div class="heatmap">
          <div 
            v-for="(intensity, i) in heatmapData" 
            :key="i"
            class="heatmap-cell"
            :style="{ opacity: 0.2 + intensity * 0.8, backgroundColor: getHeatColor(intensity) }"
          ></div>
        </div>
        <div class="heatmap-legend">
          <span>Less active</span>
          <div class="legend-gradient"></div>
          <span>More active</span>
        </div>
      </div>

      <!-- Strengths & Improvements -->
      <div class="feedback-section">
        <div class="feedback-card strengths">
          <h3>💪 Strengths</h3>
          <ul>
            <li v-for="strength in analysisResults.strengths" :key="strength">{{ strength }}</li>
          </ul>
        </div>
        <div class="feedback-card improvements">
          <h3>🎯 Areas to Improve</h3>
          <ul>
            <li v-for="suggestion in analysisResults.suggestions" :key="suggestion">{{ suggestion }}</li>
          </ul>
        </div>
      </div>

      <!-- AI Tips -->
      <div class="ai-tips-section" v-if="aiTips.length">
        <h3>🤖 AI Practice Tips</h3>
        <div class="tips-carousel">
          <div v-for="tip in aiTips" :key="tip.title" class="tip-card">
            <h4>{{ tip.title }}</h4>
            <p>{{ tip.description }}</p>
            <div v-if="tip.exercise" class="tip-exercise">
              <strong>Try this:</strong> {{ tip.exercise }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="results-actions">
        <button class="action-btn" @click="saveSession">💾 Save Session</button>
        <button class="action-btn primary" @click="newSession">🎸 New Session</button>
      </div>
    </div>

    <!-- Practice History -->
    <div v-if="practiceHistory.length && !isRecording" class="history-section">
      <h3>📅 Practice History</h3>
      <div class="history-list">
        <div v-for="(session, i) in practiceHistory.slice(0, 5)" :key="i" class="history-item">
          <div class="history-date">{{ formatDate(session.date) }}</div>
          <div class="history-details">
            <span class="history-type">{{ session.type }}</span>
            <span class="history-duration">{{ session.duration }} min</span>
          </div>
          <div class="history-score" :class="getScoreClass(session.score)">
            {{ session.score }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { analyzePractice, generatePracticeTips } from '../services/aiService'

const isRecording = ref(false)
const sessionComplete = ref(false)
const practiceType = ref('chords')
const targetTempo = ref(80)
const targetDuration = ref(120)
const elapsedTime = ref(0)
const detectedTempo = ref(null)
const metronomeEnabled = ref(false)
const currentBeat = ref(0)
const analysisResults = ref(null)
const aiTips = ref([])
const waveformCanvas = ref(null)
const practiceHistory = ref([])

let audioContext = null
let analyserNode = null
let mediaStream = null
let recordingInterval = null
let metronomeInterval = null
let animationFrame = null
let tempoSamples = []

const practiceTypes = [
  { id: 'chords', name: 'Chord Changes', icon: '🎸' },
  { id: 'scales', name: 'Scales', icon: '🎹' },
  { id: 'song', name: 'Song Practice', icon: '🎵' },
  { id: 'fingerpicking', name: 'Fingerpicking', icon: '🤌' },
  { id: 'technique', name: 'Technique', icon: '⚡' },
  { id: 'improv', name: 'Improvisation', icon: '🎤' }
]

const tempoVariance = computed(() => {
  if (!detectedTempo.value) return 0
  return Math.abs(Math.round((detectedTempo.value - targetTempo.value) / targetTempo.value * 100))
})

const tempoClass = computed(() => {
  if (!detectedTempo.value) return ''
  if (tempoVariance.value < 5) return 'good'
  if (tempoVariance.value < 10) return 'warning'
  return 'bad'
})

const varianceClass = computed(() => {
  if (tempoVariance.value < 5) return 'good'
  if (tempoVariance.value < 10) return 'warning'
  return 'bad'
})

// Generate random heatmap data for demo
const heatmapData = computed(() => {
  return Array.from({ length: 28 }, () => Math.random())
})

// Load practice history
onMounted(() => {
  try {
    const saved = localStorage.getItem('fp_practice_history')
    if (saved) practiceHistory.value = JSON.parse(saved)
  } catch (e) { /* ignore */ }
})

async function startRecording() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = 2048
    
    const source = audioContext.createMediaStreamSource(mediaStream)
    source.connect(analyserNode)
    
    isRecording.value = true
    elapsedTime.value = 0
    tempoSamples = []
    
    // Start timer
    recordingInterval = setInterval(() => {
      elapsedTime.value++
      
      // Simulate tempo detection every second
      if (Math.random() > 0.3) {
        const variance = (Math.random() - 0.5) * 20
        detectedTempo.value = Math.round(targetTempo.value + variance)
        tempoSamples.push(detectedTempo.value)
      }
      
      // Auto-stop at target duration
      if (elapsedTime.value >= targetDuration.value) {
        stopRecording()
      }
    }, 1000)
    
    // Start waveform visualization
    drawWaveform()
    
    // Start metronome if enabled
    if (metronomeEnabled.value) {
      startMetronome()
    }
  } catch (error) {
    console.error('Failed to start recording:', error)
    alert('Could not access microphone. Please check permissions.')
  }
}

function stopRecording() {
  isRecording.value = false
  
  // Stop recording
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
  
  // Stop metronome
  stopMetronome()
  
  // Stop audio
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }
  
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  
  // Analyze session
  analyzeSession()
}

async function analyzeSession() {
  const avgTempo = tempoSamples.length 
    ? Math.round(tempoSamples.reduce((a, b) => a + b, 0) / tempoSamples.length)
    : targetTempo.value
  
  analysisResults.value = await analyzePractice({
    tempo: avgTempo,
    targetTempo: targetTempo.value,
    notes: [],
    duration: elapsedTime.value
  })
  
  // Get AI tips
  const tips = await generatePracticeTips({
    weakAreas: analysisResults.value.timing.accuracy === 'needs work' ? ['timing'] : [],
    recentChords: ['G', 'C', 'D', 'Em'],
    practiceTime: analysisResults.value.practiceMinutes
  })
  aiTips.value = tips.tips || []
  
  sessionComplete.value = true
}

function drawWaveform() {
  if (!isRecording.value || !waveformCanvas.value || !analyserNode) return
  
  const canvas = waveformCanvas.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width = canvas.offsetWidth * 2
  const height = canvas.height = canvas.offsetHeight * 2
  
  const bufferLength = analyserNode.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  
  function draw() {
    if (!isRecording.value) return
    
    animationFrame = requestAnimationFrame(draw)
    analyserNode.getByteTimeDomainData(dataArray)
    
    ctx.fillStyle = '#0f1424'
    ctx.fillRect(0, 0, width, height)
    
    ctx.lineWidth = 3
    ctx.strokeStyle = '#10b981'
    ctx.beginPath()
    
    const sliceWidth = width / bufferLength
    let x = 0
    
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = v * height / 2
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      
      x += sliceWidth
    }
    
    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }
  
  draw()
}

function toggleMetronome() {
  metronomeEnabled.value = !metronomeEnabled.value
  
  if (metronomeEnabled.value && isRecording.value) {
    startMetronome()
  } else {
    stopMetronome()
  }
}

function startMetronome() {
  const beatDuration = 60000 / targetTempo.value
  currentBeat.value = 0
  
  metronomeInterval = setInterval(() => {
    currentBeat.value = (currentBeat.value % 4) + 1
    playClick(currentBeat.value === 1)
  }, beatDuration)
}

function stopMetronome() {
  if (metronomeInterval) {
    clearInterval(metronomeInterval)
    metronomeInterval = null
  }
  currentBeat.value = 0
}

function playClick(accent) {
  if (!audioContext) return
  
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  
  osc.type = 'sine'
  osc.frequency.value = accent ? 1000 : 800
  
  gain.gain.setValueAtTime(accent ? 0.3 : 0.15, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
  
  osc.connect(gain)
  gain.connect(audioContext.destination)
  
  osc.start()
  osc.stop(audioContext.currentTime + 0.05)
}

function saveSession() {
  const session = {
    date: new Date().toISOString(),
    type: practiceTypes.find(t => t.id === practiceType.value)?.name || practiceType.value,
    duration: analysisResults.value.practiceMinutes,
    score: analysisResults.value.overallScore,
    tempo: targetTempo.value
  }
  
  practiceHistory.value.unshift(session)
  localStorage.setItem('fp_practice_history', JSON.stringify(practiceHistory.value.slice(0, 50)))
  
  alert('Session saved!')
}

function newSession() {
  sessionComplete.value = false
  analysisResults.value = null
  aiTips.value = []
  elapsedTime.value = 0
  detectedTempo.value = null
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)} min`
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getGrade(score) {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  return 'Keep Practicing!'
}

function getTimingScore() {
  if (!analysisResults.value) return 0
  const accuracy = analysisResults.value.timing.accuracy
  if (accuracy === 'excellent') return 95
  if (accuracy === 'good') return 75
  return 50
}

function getConsistencyScore() {
  if (!analysisResults.value) return 0
  return Math.max(0, 100 - analysisResults.value.timing.variance * 2)
}

function getHeatColor(intensity) {
  const r = Math.round(16 + intensity * 223)
  const g = Math.round(185 - intensity * 100)
  const b = Math.round(129 - intensity * 100)
  return `rgb(${r}, ${g}, ${b})`
}

function getScoreClass(score) {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  return 'needs-work'
}

onUnmounted(() => {
  if (recordingInterval) clearInterval(recordingInterval)
  if (metronomeInterval) clearInterval(metronomeInterval)
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (mediaStream) mediaStream.getTracks().forEach(track => track.stop())
})
</script>

<style scoped>
.practice-analyzer {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.analyzer-header {
  text-align: center;
  margin-bottom: 32px;
}

.analyzer-header h1 {
  font-size: 2.5rem;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #f59e0b, #ef4444, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #8892a6;
  font-size: 1.1rem;
  margin: 0;
}

/* Session Setup */
.setup-card {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 20px;
  padding: 32px;
  text-align: center;
}

.setup-card h2 {
  color: #fff;
  margin: 0 0 24px;
}

.practice-type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.type-btn {
  padding: 20px 16px;
  border-radius: 14px;
  border: 2px solid #2a2a3e;
  background: #0f1424;
  cursor: pointer;
  transition: all 0.2s;
}

.type-btn:hover {
  border-color: #f59e0b;
}

.type-btn.selected {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.type-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 8px;
}

.type-name {
  display: block;
  color: #fff;
  font-weight: 600;
}

.tempo-setup, .duration-setup {
  margin-bottom: 24px;
}

.tempo-setup label, .duration-setup label {
  display: block;
  color: #8892a6;
  margin-bottom: 12px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tempo-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.tempo-adj {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #2a2a3e;
  background: #0f1424;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tempo-adj:hover {
  border-color: #f59e0b;
}

.tempo-display {
  font-size: 2rem;
  font-weight: 700;
  color: #f59e0b;
  min-width: 120px;
}

.duration-options {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.duration-btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: 2px solid #2a2a3e;
  background: #0f1424;
  color: #8892a6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.duration-btn:hover {
  border-color: #f59e0b;
  color: #fff;
}

.duration-btn.selected {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.start-btn {
  padding: 18px 48px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 16px;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
}

/* Recording Interface */
.recording-interface {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #ef4444;
  border-radius: 20px;
  padding: 32px;
  animation: recordingPulse 2s infinite;
}

@keyframes recordingPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 30px 10px rgba(239, 68, 68, 0.1); }
}

.recording-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.rec-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ef4444;
  font-weight: 600;
}

.rec-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.timer {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  font-family: monospace;
}

.waveform-container {
  height: 120px;
  background: #0a0a14;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.waveform {
  width: 100%;
  height: 100%;
}

.live-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: #0a0a14;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.metric-label {
  display: block;
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.metric-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.metric-value.good { color: #10b981; }
.metric-value.warning { color: #f59e0b; }
.metric-value.bad { color: #ef4444; }

.metric-unit {
  display: block;
  color: #6b7280;
  font-size: 0.8rem;
}

.metronome-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.metro-btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: 2px solid #2a2a3e;
  background: #0f1424;
  color: #8892a6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.metro-btn:hover, .metro-btn.active {
  border-color: #10b981;
  color: #10b981;
}

.beat-display {
  display: flex;
  gap: 12px;
}

.beat {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2a2a3e;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.1s;
}

.beat.active {
  background: #10b981;
  color: #fff;
  transform: scale(1.1);
}

.recording-controls {
  text-align: center;
}

.control-btn.stop {
  padding: 16px 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn.stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
}

/* Analysis Results */
.analysis-results {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.results-header {
  text-align: center;
  margin-bottom: 32px;
}

.results-header h2 {
  color: #fff;
  margin: 0 0 8px;
  font-size: 2rem;
}

.results-header p {
  color: #8892a6;
  margin: 0;
}

.score-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
}

.score-ring {
  width: 140px;
  height: 140px;
  position: relative;
}

.score-ring svg {
  transform: rotate(-90deg);
}

.score-bg {
  fill: none;
  stroke: #2a2a3e;
  stroke-width: 8;
}

.score-fill {
  fill: none;
  stroke: url(#scoreGradient);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease-out;
}

.score-ring svg {
  overflow: visible;
}

.score-ring svg defs {
  display: none;
}

.score-fill {
  stroke: #10b981;
}

.score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
}

.score-label {
  text-align: left;
}

.score-grade {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-text {
  display: block;
  color: #8892a6;
  font-size: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.metric-detail {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 20px;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.metric-icon {
  font-size: 1.3rem;
}

.metric-title {
  color: #fff;
  font-weight: 600;
}

.metric-bar {
  height: 8px;
  background: #2a2a3e;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-out;
}

.bar-fill.timing { background: linear-gradient(90deg, #10b981, #06b6d4); }
.bar-fill.consistency { background: linear-gradient(90deg, #f59e0b, #ef4444); }

.metric-desc {
  color: #6b7280;
  font-size: 0.85rem;
}

.metric-value-lg {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 8px;
}

/* Heatmap */
.heatmap-section {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.heatmap-section h3 {
  color: #fff;
  margin: 0 0 20px;
}

.heatmap {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 16px;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 4px;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.8rem;
  color: #6b7280;
}

.legend-gradient {
  width: 100px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #1a1f35, #10b981, #ef4444);
}

/* Feedback Section */
.feedback-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.feedback-card {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border-radius: 16px;
  padding: 24px;
}

.feedback-card.strengths {
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.feedback-card.improvements {
  border: 2px solid rgba(245, 158, 11, 0.3);
}

.feedback-card h3 {
  color: #fff;
  margin: 0 0 16px;
}

.feedback-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feedback-card li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: #a5b4fc;
}

.feedback-card li::before {
  content: '→';
  position: absolute;
  left: 0;
}

.feedback-card.strengths li::before {
  color: #10b981;
}

.feedback-card.improvements li::before {
  color: #f59e0b;
}

/* AI Tips */
.ai-tips-section {
  margin-bottom: 32px;
}

.ai-tips-section h3 {
  color: #fff;
  margin: 0 0 16px;
}

.tips-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.tip-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1));
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 20px;
}

.tip-card h4 {
  color: #a78bfa;
  margin: 0 0 12px;
}

.tip-card p {
  color: #a5b4fc;
  margin: 0 0 12px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.tip-exercise {
  background: rgba(139, 92, 246, 0.1);
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #c4b5fd;
}

.tip-exercise strong {
  color: #a78bfa;
}

/* Actions */
.results-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.action-btn {
  padding: 14px 32px;
  border-radius: 12px;
  border: 2px solid #2a2a3e;
  background: transparent;
  color: #8892a6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #10b981;
  color: #fff;
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  border: none;
  color: #fff;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

/* History Section */
.history-section {
  margin-top: 48px;
}

.history-section h3 {
  color: #fff;
  margin: 0 0 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.history-date {
  color: #6b7280;
  font-size: 0.9rem;
  min-width: 60px;
}

.history-details {
  flex: 1;
}

.history-type {
  display: block;
  color: #fff;
  font-weight: 600;
}

.history-duration {
  color: #8892a6;
  font-size: 0.85rem;
}

.history-score {
  font-size: 1.5rem;
  font-weight: 700;
}

.history-score.excellent { color: #10b981; }
.history-score.good { color: #f59e0b; }
.history-score.needs-work { color: #ef4444; }

/* Responsive */
@media (max-width: 768px) {
  .practice-analyzer {
    padding: 16px;
  }

  .analyzer-header h1 {
    font-size: 2rem;
  }

  .practice-type-selector {
    grid-template-columns: repeat(2, 1fr);
  }

  .live-metrics, .metrics-grid {
    grid-template-columns: 1fr;
  }

  .feedback-section {
    grid-template-columns: 1fr;
  }

  .score-card {
    flex-direction: column;
    gap: 20px;
  }

  .score-label {
    text-align: center;
  }
}
</style>

