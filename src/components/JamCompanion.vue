<template>
  <div class="jam-companion">
    <div class="jam-header">
      <h1>🎹 Jam Companion</h1>
      <p class="subtitle">Generate chord progressions for practice and songwriting</p>
    </div>

    <!-- Generator Controls -->
    <div class="generator-panel">
      <div class="controls-row">
        <div class="control-group">
          <label>Key</label>
          <div class="key-selector">
            <select v-model="selectedKey" class="key-select">
              <option v-for="key in keys" :key="key" :value="key">{{ key }}</option>
            </select>
            <div class="mode-toggle">
              <button 
                :class="['mode-btn', { active: mode === 'major' }]"
                @click="mode = 'major'"
              >
                Major
              </button>
              <button 
                :class="['mode-btn', { active: mode === 'minor' }]"
                @click="mode = 'minor'"
              >
                Minor
              </button>
            </div>
          </div>
        </div>

        <div class="control-group">
          <label>Style</label>
          <select v-model="selectedStyle" class="style-select">
            <option value="pop">Pop / Rock</option>
            <option value="blues">Blues</option>
            <option value="jazz">Jazz</option>
            <option value="country">Country / Folk</option>
            <option value="rnb">R&B / Soul</option>
            <option value="metal">Metal / Hard Rock</option>
            <option value="classical">Classical</option>
            <option value="random">Random / Experimental</option>
          </select>
        </div>

        <div class="control-group">
          <label>Complexity</label>
          <div class="complexity-slider">
            <input 
              type="range" 
              v-model="complexity" 
              min="1" 
              max="5" 
              class="slider"
            >
            <span class="complexity-label">{{ complexityLabels[complexity - 1] }}</span>
          </div>
        </div>
      </div>

      <div class="controls-row">
        <div class="control-group">
          <label>Tempo (BPM)</label>
          <div class="tempo-control">
            <button class="tempo-btn" @click="tempo = Math.max(40, tempo - 5)">−</button>
            <input type="number" v-model.number="tempo" min="40" max="240" class="tempo-input">
            <button class="tempo-btn" @click="tempo = Math.min(240, tempo + 5)">+</button>
          </div>
        </div>

        <div class="control-group">
          <label>Bars per Chord</label>
          <div class="bars-selector">
            <button 
              v-for="b in [1, 2, 4]" 
              :key="b"
              :class="['bars-btn', { active: barsPerChord === b }]"
              @click="barsPerChord = b"
            >
              {{ b }}
            </button>
          </div>
        </div>

        <div class="control-group">
          <label>Length</label>
          <select v-model="progressionLength" class="length-select">
            <option :value="4">4 Chords</option>
            <option :value="8">8 Chords</option>
            <option :value="12">12 Chords (Full Song)</option>
            <option :value="16">16 Chords (Extended)</option>
          </select>
        </div>
      </div>

      <button class="generate-btn" @click="generateProgression">
        🎲 Generate New Progression
      </button>
    </div>

    <!-- Current Progression Display -->
    <div class="progression-display" v-if="currentProgression.length">
      <div class="progression-header">
        <h2>{{ selectedKey }} {{ mode === 'major' ? 'Major' : 'Minor' }} • {{ selectedStyle }}</h2>
        <div class="progression-actions">
          <button class="action-btn" @click="copyProgression" title="Copy">
            📋 Copy
          </button>
          <button class="action-btn" @click="saveProgression" title="Save">
            💾 Save
          </button>
          <button class="action-btn shuffle" @click="shuffleProgression" title="Shuffle">
            🔀 Shuffle
          </button>
        </div>
      </div>

      <!-- Chord Cards -->
      <div class="chords-display">
        <div 
          v-for="(chord, index) in currentProgression" 
          :key="index"
          :class="['chord-card', { active: playingIndex === index, playing: isPlaying }]"
          @click="playChord(chord, index)"
        >
          <div class="chord-number">{{ index + 1 }}</div>
          <div class="chord-name">{{ chord.name }}</div>
          <div class="chord-numeral">{{ chord.numeral }}</div>
          <div class="chord-bars" v-if="barsPerChord > 1">
            {{ barsPerChord }} bars
          </div>
        </div>
      </div>

      <!-- Playback Controls -->
      <div class="playback-section">
        <div class="playback-controls">
          <button class="play-btn" @click="togglePlayback">
            {{ isPlaying ? '⏹️ Stop' : '▶️ Play' }}
          </button>
          <button class="loop-btn" :class="{ active: isLooping }" @click="isLooping = !isLooping">
            🔁 Loop
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-container" v-if="isPlaying">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(playingIndex + 1) / currentProgression.length * 100}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ playingIndex + 1 }} / {{ currentProgression.length }}</span>
        </div>
      </div>

      <!-- Roman Numeral Analysis -->
      <div class="analysis-section">
        <h3>📊 Progression Analysis</h3>
        <div class="numeral-display">
          <span 
            v-for="(chord, i) in currentProgression" 
            :key="i"
            :class="['numeral', { highlight: chord.function === 'tonic' }]"
          >
            {{ chord.numeral }}
            <span class="arrow" v-if="i < currentProgression.length - 1">→</span>
          </span>
        </div>
        <p class="analysis-tip">{{ getProgressionTip() }}</p>
      </div>
    </div>

    <!-- Common Progressions Library -->
    <div class="library-section">
      <h3>📚 Common Progressions</h3>
      <div class="progressions-grid">
        <div 
          v-for="prog in commonProgressions" 
          :key="prog.name"
          class="preset-card"
          @click="loadPreset(prog)"
        >
          <div class="preset-name">{{ prog.name }}</div>
          <div class="preset-numerals">{{ prog.numerals.join(' - ') }}</div>
          <div class="preset-songs">{{ prog.famousSongs }}</div>
        </div>
      </div>
    </div>

    <!-- Saved Progressions -->
    <div class="saved-section" v-if="savedProgressions.length">
      <h3>💾 Saved Progressions</h3>
      <div class="saved-grid">
        <div 
          v-for="(saved, index) in savedProgressions" 
          :key="index"
          class="saved-card"
        >
          <div class="saved-header">
            <span class="saved-key">{{ saved.key }} {{ saved.mode }}</span>
            <button class="delete-btn" @click="deleteSaved(index)">✕</button>
          </div>
          <div class="saved-chords">
            {{ saved.chords.map(c => c.name).join(' - ') }}
          </div>
          <button class="load-btn" @click="loadSaved(saved)">Load</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const complexityLabels = ['Simple', 'Easy', 'Medium', 'Complex', 'Advanced']

const selectedKey = ref('C')
const mode = ref('major')
const selectedStyle = ref('pop')
const complexity = ref(2)
const tempo = ref(120)
const barsPerChord = ref(2)
const progressionLength = ref(4)

const currentProgression = ref([])
const isPlaying = ref(false)
const playingIndex = ref(0)
const isLooping = ref(false)
const savedProgressions = ref([])
const showToast = ref(false)
const toastMessage = ref('')

let playbackInterval = null
let audioContext = null

// Scale degrees for major and minor
const majorScale = [0, 2, 4, 5, 7, 9, 11]
const minorScale = [0, 2, 3, 5, 7, 8, 10]

// Chord qualities for each scale degree
const majorChordQualities = ['', 'm', 'm', '', '', 'm', 'dim']
const minorChordQualities = ['m', 'dim', '', 'm', 'm', '', '']

// Roman numerals
const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
const minorNumerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']

// Chord functions
const chordFunctions = {
  0: 'tonic',
  1: 'supertonic', 
  2: 'mediant',
  3: 'subdominant',
  4: 'dominant',
  5: 'submediant',
  6: 'leading'
}

// Style-specific progression tendencies
const styleProgressions = {
  pop: {
    common: [[0, 4, 5, 3], [0, 3, 4, 4], [5, 3, 0, 4], [0, 5, 3, 4]],
    extensions: ['', '7', 'sus4', 'add9'],
    complexity: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 3 }
  },
  blues: {
    common: [[0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4]],
    extensions: ['7', '9', '7'],
    complexity: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 2 }
  },
  jazz: {
    common: [[1, 4, 0, 0], [0, 5, 1, 4], [2, 5, 0, 0]],
    extensions: ['maj7', 'm7', '7', 'dim7', 'm7b5', '9', '13'],
    complexity: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }
  },
  country: {
    common: [[0, 4, 0, 4], [0, 3, 4, 0], [0, 0, 3, 4]],
    extensions: ['', '7', 'sus4'],
    complexity: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2 }
  },
  rnb: {
    common: [[0, 5, 3, 4], [1, 4, 0, 0], [5, 4, 3, 0]],
    extensions: ['maj7', 'm7', '9', '7', 'add9'],
    complexity: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 4 }
  },
  metal: {
    common: [[0, 5, 3, 4], [0, 6, 5, 4], [0, 2, 3, 4]],
    extensions: ['5', 'm', ''],
    complexity: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 }
  },
  classical: {
    common: [[0, 3, 4, 0], [0, 4, 5, 0], [0, 1, 4, 0]],
    extensions: ['', '7', 'dim', 'aug'],
    complexity: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 }
  },
  random: {
    common: [[0, 1, 2, 3, 4, 5, 6]],
    extensions: ['', 'm', '7', 'maj7', 'm7', 'dim', 'aug', 'sus2', 'sus4', 'add9'],
    complexity: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }
  }
}

// Common progressions presets
const commonProgressions = [
  { name: 'I-V-vi-IV (Pop Anthem)', numerals: ['I', 'V', 'vi', 'IV'], degrees: [0, 4, 5, 3], famousSongs: 'Let It Be, No Woman No Cry' },
  { name: 'vi-IV-I-V (Pop Ballad)', numerals: ['vi', 'IV', 'I', 'V'], degrees: [5, 3, 0, 4], famousSongs: 'Despacito, Africa' },
  { name: 'I-IV-V-I (Classic)', numerals: ['I', 'IV', 'V', 'I'], degrees: [0, 3, 4, 0], famousSongs: 'La Bamba, Wild Thing' },
  { name: 'ii-V-I (Jazz Standard)', numerals: ['ii', 'V', 'I'], degrees: [1, 4, 0], famousSongs: 'Autumn Leaves, Fly Me to the Moon' },
  { name: 'I-vi-IV-V (50s Doo-Wop)', numerals: ['I', 'vi', 'IV', 'V'], degrees: [0, 5, 3, 4], famousSongs: 'Stand By Me, Earth Angel' },
  { name: '12 Bar Blues', numerals: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'], degrees: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4], famousSongs: 'Sweet Home Chicago, Pride and Joy' },
  { name: 'I-V-vi-iii-IV (Canon)', numerals: ['I', 'V', 'vi', 'iii', 'IV'], degrees: [0, 4, 5, 2, 3], famousSongs: 'Canon in D, Basket Case' },
  { name: 'i-VI-III-VII (Epic)', numerals: ['i', 'VI', 'III', 'VII'], degrees: [0, 5, 2, 6], famousSongs: 'Stairway to Heaven, My Immortal' }
]

// Get note at scale degree
function getNoteAtDegree(root, degree, isMajor) {
  const rootIndex = notes.indexOf(root)
  const scale = isMajor ? majorScale : minorScale
  const noteIndex = (rootIndex + scale[degree % 7]) % 12
  return notes[noteIndex]
}

// Get chord quality for degree
function getChordQuality(degree, isMajor, styleComplexity) {
  const baseQuality = isMajor ? majorChordQualities[degree] : minorChordQualities[degree]
  const style = styleProgressions[selectedStyle.value]
  
  if (styleComplexity > 0 && Math.random() < 0.3 * styleComplexity) {
    const extensions = style.extensions
    return baseQuality + extensions[Math.floor(Math.random() * extensions.length)]
  }
  
  return baseQuality
}

// Generate chord from degree
function generateChord(degree) {
  const isMajor = mode.value === 'major'
  const style = styleProgressions[selectedStyle.value]
  const styleComplexity = style.complexity[complexity.value]
  
  const rootNote = getNoteAtDegree(selectedKey.value, degree, isMajor)
  const quality = getChordQuality(degree, isMajor, styleComplexity)
  const numeral = isMajor ? majorNumerals[degree] : minorNumerals[degree]
  
  return {
    name: rootNote + quality,
    root: rootNote,
    quality,
    degree,
    numeral,
    function: chordFunctions[degree]
  }
}

// Generate full progression
function generateProgression() {
  const style = styleProgressions[selectedStyle.value]
  const patterns = style.common
  
  // Select base pattern
  let pattern = patterns[Math.floor(Math.random() * patterns.length)]
  
  // Extend or trim to match desired length
  let degrees = []
  while (degrees.length < progressionLength.value) {
    degrees = [...degrees, ...pattern]
  }
  degrees = degrees.slice(0, progressionLength.value)
  
  // Add variation based on complexity
  if (complexity.value >= 3) {
    degrees = degrees.map((deg, i) => {
      if (Math.random() < 0.2) {
        // Substitute with related chord
        const substitutes = {
          0: [2, 5], // I -> iii, vi
          3: [1, 5], // IV -> ii, vi
          4: [6], // V -> vii
          5: [3, 0] // vi -> IV, I
        }
        const subs = substitutes[deg]
        if (subs) {
          return subs[Math.floor(Math.random() * subs.length)]
        }
      }
      return deg
    })
  }
  
  currentProgression.value = degrees.map(deg => generateChord(deg))
  playingIndex.value = 0
}

// Shuffle current progression
function shuffleProgression() {
  const shuffled = [...currentProgression.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  currentProgression.value = shuffled
  showToastMessage('🔀 Progression shuffled!')
}

// Load preset
function loadPreset(preset) {
  selectedStyle.value = 'pop'
  progressionLength.value = preset.degrees.length
  currentProgression.value = preset.degrees.map(deg => generateChord(deg))
  playingIndex.value = 0
  showToastMessage(`Loaded: ${preset.name}`)
}

// Copy progression to clipboard
function copyProgression() {
  const text = `${selectedKey.value} ${mode.value}: ${currentProgression.value.map(c => c.name).join(' - ')}`
  navigator.clipboard.writeText(text)
  showToastMessage('📋 Copied to clipboard!')
}

// Save progression
function saveProgression() {
  const saved = {
    key: selectedKey.value,
    mode: mode.value,
    style: selectedStyle.value,
    chords: currentProgression.value,
    tempo: tempo.value
  }
  savedProgressions.value.push(saved)
  localStorage.setItem('fp_saved_progressions', JSON.stringify(savedProgressions.value))
  showToastMessage('💾 Progression saved!')
}

// Load saved
function loadSaved(saved) {
  selectedKey.value = saved.key
  mode.value = saved.mode
  selectedStyle.value = saved.style
  currentProgression.value = saved.chords
  tempo.value = saved.tempo
  showToastMessage('Loaded saved progression')
}

// Delete saved
function deleteSaved(index) {
  savedProgressions.value.splice(index, 1)
  localStorage.setItem('fp_saved_progressions', JSON.stringify(savedProgressions.value))
}

// Audio playback
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function playChord(chord, index) {
  playingIndex.value = index
  const ctx = initAudio()
  const rootIndex = notes.indexOf(chord.root)
  
  // Determine intervals based on quality
  let intervals = [0, 4, 7] // Major triad
  if (chord.quality.includes('m') && !chord.quality.includes('maj')) {
    intervals = [0, 3, 7] // Minor
  } else if (chord.quality.includes('dim')) {
    intervals = [0, 3, 6] // Diminished
  } else if (chord.quality.includes('aug')) {
    intervals = [0, 4, 8] // Augmented
  }
  
  // Add 7th if present
  if (chord.quality.includes('7') || chord.quality.includes('maj7')) {
    intervals.push(chord.quality.includes('maj7') ? 11 : 10)
  }
  
  // Play chord
  intervals.forEach((interval, i) => {
    const frequency = 220 * Math.pow(2, (rootIndex + interval) / 12)
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(ctx.currentTime + i * 0.02)
    osc.stop(ctx.currentTime + 1.5)
  })
}

// Toggle playback
function togglePlayback() {
  if (isPlaying.value) {
    stopPlayback()
  } else {
    startPlayback()
  }
}

function startPlayback() {
  if (!currentProgression.value.length) return
  
  isPlaying.value = true
  playingIndex.value = 0
  
  // Calculate interval based on tempo and bars per chord
  const beatsPerChord = barsPerChord.value * 4 // 4 beats per bar
  const msPerBeat = 60000 / tempo.value
  const intervalMs = msPerBeat * beatsPerChord
  
  playChord(currentProgression.value[0], 0)
  
  playbackInterval = setInterval(() => {
    playingIndex.value++
    
    if (playingIndex.value >= currentProgression.value.length) {
      if (isLooping.value) {
        playingIndex.value = 0
      } else {
        stopPlayback()
        return
      }
    }
    
    playChord(currentProgression.value[playingIndex.value], playingIndex.value)
  }, intervalMs)
}

function stopPlayback() {
  isPlaying.value = false
  if (playbackInterval) {
    clearInterval(playbackInterval)
    playbackInterval = null
  }
}

// Get analysis tip
function getProgressionTip() {
  if (!currentProgression.value.length) return ''
  
  const degrees = currentProgression.value.map(c => c.degree)
  
  if (degrees.includes(4) && degrees.includes(0)) {
    return '💡 This progression has strong resolution (V → I movement). Great for creating satisfying endings!'
  }
  if (degrees[0] === 5) {
    return '💡 Starting on vi (minor) creates an emotional, introspective feel.'
  }
  if (degrees.filter(d => d === 0).length >= 2) {
    return '💡 Multiple tonic chords give this progression a grounded, stable feeling.'
  }
  if (degrees.includes(1) && degrees.includes(4)) {
    return '💡 The ii-V movement is a classic jazz turnaround - very smooth!'
  }
  
  return '💡 Try experimenting with different tempos and keys to find your sound!'
}

// Toast notification
function showToastMessage(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => showToast.value = false, 2500)
}

// Load saved progressions on mount
try {
  const saved = localStorage.getItem('fp_saved_progressions')
  if (saved) savedProgressions.value = JSON.parse(saved)
} catch (e) {}

// Initial generation
generateProgression()

onUnmounted(() => {
  stopPlayback()
})
</script>

<style scoped>
.jam-companion {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #fff;
}

.jam-header {
  text-align: center;
  margin-bottom: 32px;
}

.jam-header h1 {
  font-size: 2.5rem;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #f472b6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #8892a6;
  font-size: 1.1rem;
  margin: 0;
}

/* Generator Panel */
.generator-panel {
  background: linear-gradient(135deg, #1a0a2e, #2d1b4e);
  border: 2px solid #4c1d95;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
}

.controls-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-group label {
  font-weight: 600;
  color: #a78bfa;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.key-selector {
  display: flex;
  gap: 10px;
}

.key-select, .style-select, .length-select {
  background: #2d1b4e;
  border: 2px solid #5b21b6;
  color: #e9d5ff;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
}

.key-select:focus, .style-select:focus, .length-select:focus {
  border-color: #a855f7;
  outline: none;
}

.mode-toggle {
  display: flex;
  gap: 4px;
}

.mode-btn {
  background: #2d1b4e;
  border: 2px solid #5b21b6;
  color: #a78bfa;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.mode-btn:hover {
  border-color: #a855f7;
}

.mode-btn.active {
  background: #a855f7;
  border-color: #a855f7;
  color: #fff;
}

.complexity-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: #5b21b6;
  border-radius: 4px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #a855f7;
  border-radius: 50%;
  cursor: pointer;
}

.complexity-label {
  color: #e9d5ff;
  font-weight: 600;
  min-width: 80px;
}

.tempo-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tempo-btn {
  background: #5b21b6;
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tempo-btn:hover {
  background: #7c3aed;
}

.tempo-input {
  width: 70px;
  background: #2d1b4e;
  border: 2px solid #5b21b6;
  color: #e9d5ff;
  padding: 10px;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
}

.bars-selector {
  display: flex;
  gap: 8px;
}

.bars-btn {
  background: #2d1b4e;
  border: 2px solid #5b21b6;
  color: #a78bfa;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.bars-btn:hover {
  border-color: #a855f7;
}

.bars-btn.active {
  background: #a855f7;
  border-color: #a855f7;
  color: #fff;
}

.generate-btn {
  width: 100%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border: none;
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 30px -10px rgba(168, 85, 247, 0.5);
}

.generate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px -10px rgba(168, 85, 247, 0.7);
}

/* Progression Display */
.progression-display {
  background: linear-gradient(135deg, #0f0a1f, #1a1030);
  border: 2px solid #3b2760;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
}

.progression-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.progression-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #e9d5ff;
}

.progression-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: #3b2760;
  border: none;
  color: #e9d5ff;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #5b21b6;
}

.action-btn.shuffle:hover {
  background: #ec4899;
}

/* Chord Cards */
.chords-display {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.chord-card {
  background: linear-gradient(135deg, #2d1b4e, #3b2760);
  border: 2px solid #5b21b6;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.chord-card:hover {
  border-color: #a855f7;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -10px rgba(168, 85, 247, 0.4);
}

.chord-card.active {
  border-color: #ec4899;
  background: linear-gradient(135deg, #4c1d95, #7c3aed);
  box-shadow: 0 0 30px rgba(236, 72, 153, 0.4);
}

.chord-card.active.playing {
  animation: pulse 0.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.chord-number {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a78bfa;
}

.chord-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.chord-numeral {
  font-size: 0.9rem;
  color: #a78bfa;
  font-weight: 600;
}

.chord-bars {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 8px;
}

/* Playback */
.playback-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.playback-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.play-btn {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border: none;
  color: #fff;
  padding: 14px 36px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.play-btn:hover {
  transform: scale(1.05);
}

.loop-btn {
  background: #3b2760;
  border: 2px solid #5b21b6;
  color: #a78bfa;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.loop-btn:hover {
  border-color: #a855f7;
}

.loop-btn.active {
  background: #5b21b6;
  border-color: #a855f7;
  color: #fff;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #3b2760;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  transition: width 0.3s;
}

.progress-text {
  color: #a78bfa;
  font-weight: 600;
  min-width: 60px;
}

/* Analysis */
.analysis-section {
  background: #1a0a2e;
  border-radius: 12px;
  padding: 20px;
}

.analysis-section h3 {
  margin: 0 0 16px;
  color: #e9d5ff;
  font-size: 1.1rem;
}

.numeral-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.numeral {
  background: #2d1b4e;
  padding: 8px 16px;
  border-radius: 8px;
  color: #e9d5ff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.numeral.highlight {
  background: #5b21b6;
}

.arrow {
  color: #6b7280;
}

.analysis-tip {
  color: #a78bfa;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Library */
.library-section {
  margin-bottom: 32px;
}

.library-section h3 {
  color: #fff;
  margin: 0 0 16px;
  font-size: 1.3rem;
}

.progressions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.preset-card {
  background: linear-gradient(135deg, #1a1030, #2d1b4e);
  border: 2px solid #3b2760;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.preset-card:hover {
  border-color: #a855f7;
  transform: translateY(-3px);
}

.preset-name {
  font-weight: 700;
  color: #e9d5ff;
  margin-bottom: 8px;
}

.preset-numerals {
  color: #a78bfa;
  font-size: 0.95rem;
  margin-bottom: 8px;
  font-family: monospace;
}

.preset-songs {
  color: #6b7280;
  font-size: 0.85rem;
  font-style: italic;
}

/* Saved */
.saved-section {
  margin-bottom: 32px;
}

.saved-section h3 {
  color: #fff;
  margin: 0 0 16px;
  font-size: 1.3rem;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.saved-card {
  background: #1a1030;
  border: 2px solid #3b2760;
  border-radius: 12px;
  padding: 16px;
}

.saved-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.saved-key {
  color: #e9d5ff;
  font-weight: 600;
}

.delete-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
}

.delete-btn:hover {
  color: #ef4444;
}

.saved-chords {
  color: #a78bfa;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.load-btn {
  background: #5b21b6;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
}

.load-btn:hover {
  background: #7c3aed;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2d1b4e, #4c1d95);
  color: #fff;
  padding: 16px 28px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.toast-enter-active { animation: toastIn 0.3s ease-out; }
.toast-leave-active { animation: toastOut 0.3s ease-in; }

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}

@media (max-width: 768px) {
  .jam-companion { padding: 16px; }
  .jam-header h1 { font-size: 1.8rem; }
  .generator-panel { padding: 20px; }
  .controls-row { gap: 16px; }
  .progression-header { flex-direction: column; align-items: flex-start; }
  .chords-display { grid-template-columns: repeat(2, 1fr); }
}
</style>
