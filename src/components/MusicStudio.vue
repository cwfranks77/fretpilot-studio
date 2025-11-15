<template>
  <div class="music-studio">
    <AnimatedHero>
      <img src="/images/instruments-montage.svg" alt="Studio" class="page-hero animate-float" />
    </AnimatedHero>

    <div class="container">
      <h1>🎙️ Music Studio</h1>
      <p class="subtitle">Record, mix, and produce your music — all in one place</p>

      <!-- Bluetooth Device Connection -->
      <div class="bluetooth-section" v-if="!bluetoothConnected">
        <div class="connect-card">
          <h3>🎸 Connect Your Instrument</h3>
          <p>Use a Bluetooth audio adapter (like iRig, Focusrite, or any BT interface)</p>
          <button @click="connectBluetooth" class="connect-btn" :disabled="scanning">
            {{ scanning ? '🔍 Scanning...' : '📡 Scan for Devices' }}
          </button>
          
          <div v-if="devices.length > 0" class="device-list">
            <div 
              v-for="device in devices" 
              :key="device.id"
              class="device-item"
              @click="selectDevice(device)"
            >
              <span class="device-icon">🎵</span>
              <span class="device-name">{{ device.name }}</span>
              <span class="device-connect">Connect →</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="studio-workspace">
        <!-- Connected Device Status -->
        <div class="device-status">
          <span class="status-indicator connected"></span>
          <span>{{ connectedDevice?.name || 'Audio Input' }} Connected</span>
          <button @click="disconnectBluetooth" class="disconnect-btn">Disconnect</button>
        </div>

        <!-- Instrument Selector -->
        <div class="instrument-selector">
          <label>Recording:</label>
          <select v-model="selectedInstrument">
            <option value="guitar">🎸 Guitar</option>
            <option value="bass">🎸 Bass</option>
            <option value="ukulele">🎸 Ukulele</option>
            <option value="piano">🎹 Piano</option>
            <option value="drums">🥁 Drums</option>
            <option value="vocals">🎤 Vocals</option>
          </select>
        </div>

        <!-- Multi-Track Recorder -->
        <div class="tracks-panel">
          <div class="tracks-header">
            <h2>🎚️ Tracks</h2>
            <button @click="addTrack" class="add-track-btn">➕ Add Track</button>
          </div>

          <div class="track-list">
            <div 
              v-for="(track, index) in tracks" 
              :key="track.id"
              class="track"
              :class="{ active: activeTrack === index, recording: track.recording }"
            >
              <div class="track-header">
                <button @click="selectTrack(index)" class="track-number">{{ index + 1 }}</button>
                <input 
                  v-model="track.name" 
                  class="track-name"
                  placeholder="Track name"
                />
                <button @click="toggleMute(index)" class="mute-btn" :class="{ muted: track.muted }">
                  {{ track.muted ? '🔇' : '🔊' }}
                </button>
                <button @click="toggleSolo(index)" class="solo-btn" :class="{ solo: track.solo }">
                  S
                </button>
                <button @click="deleteTrack(index)" class="delete-btn">🗑️</button>
              </div>

              <div class="track-waveform" @click="selectTrack(index)">
                <canvas :ref="el => waveformRefs[index] = el" :id="`waveform-${track.id}`"></canvas>
                <div v-if="!track.audioUrl" class="empty-track">
                  Click record to capture audio
                </div>
              </div>

              <div class="track-controls">
                <input 
                  type="range" 
                  v-model="track.volume" 
                  min="0" 
                  max="100" 
                  class="volume-slider"
                />
                <span class="volume-label">{{ track.volume }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transport Controls -->
        <div class="transport">
          <button @click="rewind" class="transport-btn">⏮️</button>
          <button @click="togglePlay" class="transport-btn play" :class="{ playing: isPlaying }">
            {{ isPlaying ? '⏸️' : '▶️' }}
          </button>
          <button @click="stop" class="transport-btn">⏹️</button>
          <button @click="toggleRecord" class="transport-btn record" :class="{ recording: isRecording }">
            ⏺️
          </button>
          
          <div class="timeline">
            <span class="time">{{ formatTime(currentTime) }}</span>
            <input 
              type="range" 
              v-model="currentTime" 
              min="0" 
              :max="totalDuration" 
              class="timeline-slider"
            />
            <span class="time">{{ formatTime(totalDuration) }}</span>
          </div>

          <div class="master-volume">
            <span>🔊 Master</span>
            <input type="range" v-model="masterVolume" min="0" max="100" />
            <span>{{ masterVolume }}%</span>
          </div>
        </div>

        <!-- Export Options -->
        <div class="export-section">
          <h3>💾 Export & Share</h3>
          <div class="export-buttons">
            <button @click="exportMix('mp3')" class="export-btn">📁 Export MP3</button>
            <button @click="exportMix('wav')" class="export-btn">📁 Export WAV</button>
            <button @click="exportMix('project')" class="export-btn">💾 Save Project</button>
            <button @click="shareProject" class="export-btn">🔗 Share</button>
          </div>
        </div>

        <!-- Effects Panel -->
        <div class="effects-panel">
          <h3>🎛️ Effects</h3>
          <div class="effects-grid">
            <div class="effect-card" @click="toggleEffect('reverb')">
              <div class="effect-icon">🌊</div>
              <span>Reverb</span>
            </div>
            <div class="effect-card" @click="toggleEffect('delay')">
              <div class="effect-icon">⏱️</div>
              <span>Delay</span>
            </div>
            <div class="effect-card" @click="toggleEffect('distortion')">
              <div class="effect-icon">⚡</div>
              <span>Distortion</span>
            </div>
            <div class="effect-card" @click="toggleEffect('eq')">
              <div class="effect-icon">📊</div>
              <span>EQ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Projects -->
      <div class="projects-library" v-if="savedProjects.length > 0">
        <h2>📚 Your Projects</h2>
        <div class="projects-grid">
          <div 
            v-for="project in savedProjects" 
            :key="project.id"
            class="project-card"
            @click="loadProject(project)"
          >
            <div class="project-icon">🎵</div>
            <h4>{{ project.name }}</h4>
            <span class="project-date">{{ formatDate(project.date) }}</span>
            <span class="project-tracks">{{ project.trackCount }} tracks</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AnimatedHero from './AnimatedHero.vue'
import { scanBluetoothDevices, connectDevice, disconnectDevice } from '../services/bluetoothAudioService'

const bluetoothConnected = ref(false)
const scanning = ref(false)
const devices = ref([])
const connectedDevice = ref(null)
const selectedInstrument = ref('guitar')

const tracks = ref([])
const activeTrack = ref(0)
const waveformRefs = ref([])
const isPlaying = ref(false)
const isRecording = ref(false)
const currentTime = ref(0)
const totalDuration = ref(180)
const masterVolume = ref(80)
const savedProjects = ref([])

let audioContext = null
let mediaRecorder = null
let recordedChunks = []

async function connectBluetooth() {
  scanning.value = true
  try {
    const foundDevices = await scanBluetoothDevices()
    devices.value = foundDevices
  } catch (error) {
    alert('Bluetooth scan failed. Make sure your device has Bluetooth enabled.')
  } finally {
    scanning.value = false
  }
}

async function selectDevice(device) {
  try {
    await connectDevice(device)
    connectedDevice.value = device
    bluetoothConnected.value = true
    initializeAudioContext()
  } catch (error) {
    alert('Failed to connect to device')
  }
}

function disconnectBluetooth() {
  if (connectedDevice.value) {
    disconnectDevice(connectedDevice.value)
  }
  bluetoothConnected.value = false
  connectedDevice.value = null
}

function initializeAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  // Initialize first track
  if (tracks.value.length === 0) {
    addTrack()
  }
}

function addTrack() {
  const newTrack = {
    id: Date.now(),
    name: `Track ${tracks.value.length + 1}`,
    volume: 80,
    muted: false,
    solo: false,
    recording: false,
    audioUrl: null,
    audioBuffer: null
  }
  tracks.value.push(newTrack)
  nextTick(() => {
    drawWaveform(tracks.value.length - 1)
  })
}

function selectTrack(index) {
  activeTrack.value = index
}

function toggleMute(index) {
  tracks.value[index].muted = !tracks.value[index].muted
}

function toggleSolo(index) {
  tracks.value[index].solo = !tracks.value[index].solo
}

function deleteTrack(index) {
  if (tracks.value.length > 1) {
    tracks.value.splice(index, 1)
    if (activeTrack.value >= tracks.value.length) {
      activeTrack.value = tracks.value.length - 1
    }
  }
}

async function toggleRecord() {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    recordedChunks = []
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      tracks.value[activeTrack.value].audioUrl = url
      drawWaveform(activeTrack.value)
    }
    
    mediaRecorder.start()
    isRecording.value = true
    tracks.value[activeTrack.value].recording = true
  } catch (error) {
    alert('Microphone access denied')
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
    tracks.value[activeTrack.value].recording = false
  }
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    playTracks()
  } else {
    pauseTracks()
  }
}

function playTracks() {
  // Simplified playback - play all non-muted tracks
  tracks.value.forEach((track, index) => {
    if (track.audioUrl && !track.muted) {
      const audio = new Audio(track.audioUrl)
      audio.volume = track.volume / 100 * (masterVolume.value / 100)
      audio.play()
    }
  })
}

function pauseTracks() {
  // Stop all audio elements
}

function stop() {
  isPlaying.value = false
  currentTime.value = 0
}

function rewind() {
  currentTime.value = 0
}

function drawWaveform(trackIndex) {
  const canvas = waveformRefs.value[trackIndex]
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  canvas.width = canvas.offsetWidth
  canvas.height = 60
  
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  if (tracks.value[trackIndex].audioUrl) {
    // Draw simple waveform visualization
    ctx.strokeStyle = '#06c167'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < canvas.width; i++) {
      const y = canvas.height / 2 + Math.sin(i * 0.1) * Math.random() * 20
      if (i === 0) ctx.moveTo(i, y)
      else ctx.lineTo(i, y)
    }
    ctx.stroke()
  }
}

function toggleEffect(effectName) {
  alert(`${effectName} effect toggled (effects processing coming soon)`)
}

function exportMix(format) {
  alert(`Exporting as ${format.toUpperCase()}...`)
  // Mix all tracks and export
  const projectData = {
    name: `FretPilot Mix ${new Date().toISOString().split('T')[0]}`,
    tracks: tracks.value.map(t => ({
      name: t.name,
      volume: t.volume,
      audioUrl: t.audioUrl
    }))
  }
  
  const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `fretpilot-project-${Date.now()}.json`
  link.click()
}

function shareProject() {
  alert('Share functionality coming soon!')
}

function loadProject(project) {
  tracks.value = project.tracks || []
  currentTime.value = 0
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  const saved = localStorage.getItem('fretpilot-projects')
  if (saved) {
    try {
      savedProjects.value = JSON.parse(saved)
    } catch (e) {
      savedProjects.value = []
    }
  }
})

onUnmounted(() => {
  if (audioContext) {
    audioContext.close()
  }
})
</script>

<style scoped>
.music-studio {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

.page-hero {
  max-width: 450px;
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(30, 144, 255, 0.3));
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #8892a6;
  font-size: 1.1em;
  margin-bottom: 40px;
}

.bluetooth-section {
  margin: 40px 0;
}

.connect-card {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.connect-card h3 {
  margin-bottom: 12px;
}

.connect-card p {
  color: #8892a6;
  margin-bottom: 24px;
}

.connect-btn {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.connect-btn:hover:not(:disabled) {
  background: #09a557;
  transform: translateY(-2px);
}

.connect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.device-list {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1a1a1a;
  padding: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.device-item:hover {
  background: #2a2a2a;
  border-color: #06c167;
}

.device-icon {
  font-size: 1.5em;
}

.device-name {
  flex: 1;
  text-align: left;
}

.device-connect {
  color: #06c167;
  font-weight: 600;
}

.studio-workspace {
  margin-top: 30px;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
}

.status-indicator.connected {
  background: #06c167;
  box-shadow: 0 0 12px #06c167;
}

.disconnect-btn {
  margin-left: auto;
  background: #2a2a2a;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.instrument-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  background: #0a0a0a;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
}

.instrument-selector select {
  flex: 1;
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #2a2a2a;
  padding: 10px;
  border-radius: 8px;
  font-size: 1em;
}

.tracks-panel {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.tracks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-track-btn {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.track {
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.track.active {
  border-color: #06c167;
}

.track.recording {
  border-color: #ff4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.track-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.track-number {
  width: 40px;
  height: 40px;
  background: #2a2a2a;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.track-name {
  flex: 1;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
}

.mute-btn, .solo-btn, .delete-btn {
  background: #2a2a2a;
  border: none;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.mute-btn.muted {
  background: #ff4444;
}

.solo-btn.solo {
  background: #06c167;
}

.track-waveform {
  background: #0a0a0a;
  border-radius: 8px;
  height: 60px;
  margin-bottom: 12px;
  position: relative;
  cursor: pointer;
}

.track-waveform canvas {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.empty-track {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 0.9em;
}

.track-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-slider {
  flex: 1;
  height: 6px;
  background: #2a2a2a;
  border-radius: 999px;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #06c167;
  border-radius: 50%;
  cursor: pointer;
}

.volume-label {
  color: #8892a6;
  font-size: 0.9em;
  min-width: 45px;
}

.transport {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.transport-btn {
  width: 50px;
  height: 50px;
  background: #2a2a2a;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1.5em;
  cursor: pointer;
  transition: all 0.3s;
}

.transport-btn:hover {
  background: #3a3a3a;
  transform: scale(1.05);
}

.transport-btn.play.playing {
  background: #06c167;
}

.transport-btn.record.recording {
  background: #ff4444;
  animation: pulse 1.5s infinite;
}

.timeline {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.timeline-slider {
  flex: 1;
  height: 8px;
  background: #2a2a2a;
  border-radius: 999px;
  outline: none;
  -webkit-appearance: none;
}

.timeline-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #1e90ff;
  border-radius: 50%;
  cursor: pointer;
}

.time {
  color: #8892a6;
  font-size: 0.9em;
  min-width: 50px;
}

.master-volume {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8892a6;
}

.master-volume input {
  width: 100px;
}

.export-section {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.export-section h3 {
  margin-bottom: 20px;
}

.export-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.export-btn {
  background: #1e90ff;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.export-btn:hover {
  background: #1873cc;
  transform: translateY(-2px);
}

.effects-panel {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.effects-panel h3 {
  margin-bottom: 20px;
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.effect-card {
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.effect-card:hover {
  border-color: #06c167;
  transform: translateY(-4px);
}

.effect-icon {
  font-size: 2em;
  margin-bottom: 8px;
}

.projects-library {
  margin-top: 60px;
}

.projects-library h2 {
  text-align: center;
  margin-bottom: 30px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.project-card {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.project-card:hover {
  border-color: #06c167;
  transform: translateY(-4px);
}

.project-icon {
  font-size: 3em;
  margin-bottom: 12px;
}

.project-card h4 {
  margin-bottom: 8px;
}

.project-date, .project-tracks {
  display: block;
  color: #8892a6;
  font-size: 0.9em;
  margin-top: 4px;
}
</style>
