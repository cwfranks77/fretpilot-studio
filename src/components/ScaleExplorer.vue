<template>
  <div class="scale-explorer">
    <div class="explorer-header">
      <h1>🎼 Scale Explorer</h1>
      <p class="subtitle">Master scales, modes, and positions across the fretboard</p>
    </div>

    <!-- Controls -->
    <div class="controls-section">
      <div class="control-group">
        <label>Root Note</label>
        <div class="btn-group">
          <button 
            v-for="note in notes" 
            :key="note"
            :class="['note-btn', { active: rootNote === note }]"
            @click="rootNote = note"
          >
            {{ note }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>Scale Type</label>
        <select v-model="selectedScale" class="scale-select">
          <optgroup label="Common Scales">
            <option value="major">Major (Ionian)</option>
            <option value="minor">Natural Minor (Aeolian)</option>
            <option value="pentatonic_major">Major Pentatonic</option>
            <option value="pentatonic_minor">Minor Pentatonic</option>
            <option value="blues">Blues</option>
          </optgroup>
          <optgroup label="Modes">
            <option value="dorian">Dorian</option>
            <option value="phrygian">Phrygian</option>
            <option value="lydian">Lydian</option>
            <option value="mixolydian">Mixolydian</option>
            <option value="locrian">Locrian</option>
          </optgroup>
          <optgroup label="Exotic Scales">
            <option value="harmonic_minor">Harmonic Minor</option>
            <option value="melodic_minor">Melodic Minor</option>
            <option value="hungarian_minor">Hungarian Minor</option>
            <option value="japanese">Japanese (Hirajoshi)</option>
            <option value="arabic">Arabic (Double Harmonic)</option>
          </optgroup>
        </select>
      </div>

      <div class="control-group">
        <label>Position</label>
        <div class="btn-group position-btns">
          <button 
            v-for="pos in 5" 
            :key="pos"
            :class="['pos-btn', { active: position === pos }]"
            @click="position = pos"
          >
            {{ pos }}
          </button>
          <button 
            :class="['pos-btn full-btn', { active: position === 0 }]"
            @click="position = 0"
          >
            Full
          </button>
        </div>
      </div>
    </div>

    <!-- Scale Info Card -->
    <div class="scale-info">
      <div class="info-header">
        <h2>{{ rootNote }} {{ scaleInfo.name }}</h2>
        <button class="play-scale-btn" @click="playScale">
          {{ isPlaying ? '⏹️ Stop' : '🔊 Play Scale' }}
        </button>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Formula</span>
          <span class="info-value">{{ scaleInfo.formula }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Notes</span>
          <span class="info-value notes-display">
            <span 
              v-for="(note, i) in scaleNotes" 
              :key="i" 
              :class="['scale-note', { root: i === 0 }]"
            >
              {{ note }}
            </span>
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">Intervals</span>
          <span class="info-value">{{ scaleInfo.intervals }}</span>
        </div>
        <div class="info-item full-width">
          <span class="info-label">Character</span>
          <span class="info-value">{{ scaleInfo.character }}</span>
        </div>
      </div>
    </div>

    <!-- Fretboard Visualization -->
    <div class="fretboard-container">
      <div class="fretboard">
        <!-- Fret numbers -->
        <div class="fret-numbers">
          <span v-for="fret in 15" :key="fret" class="fret-number">{{ fret - 1 }}</span>
        </div>
        
        <!-- Strings -->
        <div 
          v-for="(stringNote, stringIndex) in tuning" 
          :key="stringIndex"
          class="string-row"
        >
          <span class="string-label">{{ stringNote }}</span>
          <div class="frets">
            <div 
              v-for="fret in 15" 
              :key="fret"
              :class="[
                'fret',
                { 
                  'in-scale': isNoteInScale(stringNote, fret - 1),
                  'root-note': isRootNote(stringNote, fret - 1),
                  'in-position': isInPosition(fret - 1),
                  'fret-marker': [3, 5, 7, 9, 12].includes(fret - 1)
                }
              ]"
              @click="playNote(stringNote, fret - 1)"
            >
              <span v-if="isNoteInScale(stringNote, fret - 1)" class="note-marker">
                {{ showIntervals ? getInterval(stringNote, fret - 1) : getNoteAt(stringNote, fret - 1) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Fret markers -->
        <div class="fret-markers">
          <div v-for="fret in 15" :key="fret" class="marker-slot">
            <span v-if="[3, 5, 7, 9].includes(fret - 1)" class="marker">●</span>
            <span v-if="fret - 1 === 12" class="marker double">●●</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Display Options -->
    <div class="display-options">
      <label class="toggle-option">
        <input type="checkbox" v-model="showIntervals">
        <span class="toggle-label">Show Intervals</span>
      </label>
      <label class="toggle-option">
        <input type="checkbox" v-model="highlightRoot">
        <span class="toggle-label">Highlight Root</span>
      </label>
    </div>

    <!-- Scale Patterns -->
    <div class="patterns-section">
      <h3>📍 CAGED Positions</h3>
      <div class="patterns-grid">
        <div 
          v-for="(pattern, index) in cagedPatterns" 
          :key="index"
          :class="['pattern-card', { active: position === index + 1 }]"
          @click="position = index + 1"
        >
          <div class="pattern-name">{{ pattern.name }}</div>
          <div class="pattern-frets">Frets {{ pattern.startFret }}-{{ pattern.endFret }}</div>
          <div class="pattern-shape">{{ pattern.shape }}</div>
        </div>
      </div>
    </div>

    <!-- Related Chords -->
    <div class="related-section">
      <h3>🎵 Chords in {{ rootNote }} {{ scaleInfo.name }}</h3>
      <div class="chords-grid">
        <div 
          v-for="(chord, index) in relatedChords" 
          :key="index"
          class="chord-pill"
          :class="{ tonic: index === 0 }"
          @click="playChord(chord)"
        >
          <span class="chord-numeral">{{ chord.numeral }}</span>
          <span class="chord-name">{{ chord.name }}</span>
        </div>
      </div>
    </div>

    <!-- Practice Tips -->
    <div class="tips-section">
      <h3>💡 Practice Tips for {{ scaleInfo.name }}</h3>
      <ul class="tips-list">
        <li v-for="(tip, i) in scaleInfo.tips" :key="i">{{ tip }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const tuning = ['E', 'B', 'G', 'D', 'A', 'E'] // Standard tuning, high to low

const rootNote = ref('A')
const selectedScale = ref('pentatonic_minor')
const position = ref(0) // 0 = full fretboard
const showIntervals = ref(false)
const highlightRoot = ref(true)
const isPlaying = ref(false)

let audioContext = null

// Scale definitions with intervals (semitones from root)
const scales = {
  major: { 
    name: 'Major', 
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: '1 2 3 4 5 6 7',
    intervalNames: ['1', '2', '3', '4', '5', '6', '7'],
    character: 'Bright, happy, triumphant. The foundation of Western music.',
    tips: [
      'Practice ascending and descending in sequences of 3rds',
      'Try playing the scale over a I-IV-V progression',
      'Connect positions by sliding on the 2nd and 6th strings'
    ]
  },
  minor: { 
    name: 'Natural Minor', 
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: '1 2 ♭3 4 5 ♭6 ♭7',
    intervalNames: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
    character: 'Sad, introspective, emotional. Essential for rock and metal.',
    tips: [
      'Compare with major scale to hear the difference',
      'Practice over Am-Dm-Em progressions',
      'Focus on the ♭3 and ♭7 for the minor sound'
    ]
  },
  pentatonic_major: { 
    name: 'Major Pentatonic', 
    intervals: [0, 2, 4, 7, 9],
    formula: '1 2 3 5 6',
    intervalNames: ['1', '2', '3', '5', '6'],
    character: 'Country, folk, happy blues. Safe and melodic.',
    tips: [
      'Great for country and folk solos',
      'Mix with blues scale for variety',
      'Learn to connect all 5 positions'
    ]
  },
  pentatonic_minor: { 
    name: 'Minor Pentatonic', 
    intervals: [0, 3, 5, 7, 10],
    formula: '1 ♭3 4 5 ♭7',
    intervalNames: ['1', '♭3', '4', '5', '♭7'],
    character: 'Rock, blues, essential for soloing. The most used scale.',
    tips: [
      'Master the "box" pattern in position 1 first',
      'Add the blue note (♭5) for blues flavor',
      'Practice bending the ♭3 up to the 3 for expression'
    ]
  },
  blues: { 
    name: 'Blues', 
    intervals: [0, 3, 5, 6, 7, 10],
    formula: '1 ♭3 4 ♭5 5 ♭7',
    intervalNames: ['1', '♭3', '4', '♭5', '5', '♭7'],
    character: 'Gritty, soulful, expressive. The heart of blues and rock.',
    tips: [
      'The ♭5 (blue note) is the key to blues sound',
      'Practice sliding into notes from a half step below',
      'Use bends and vibrato liberally'
    ]
  },
  dorian: { 
    name: 'Dorian', 
    intervals: [0, 2, 3, 5, 7, 9, 10],
    formula: '1 2 ♭3 4 5 6 ♭7',
    intervalNames: ['1', '2', '♭3', '4', '5', '6', '♭7'],
    character: 'Minor but brighter. Jazz, funk, Santana-style.',
    tips: [
      'Emphasize the natural 6th - it defines Dorian',
      'Great over minor 7th chords',
      'Compare with natural minor to hear the 6th'
    ]
  },
  phrygian: { 
    name: 'Phrygian', 
    intervals: [0, 1, 3, 5, 7, 8, 10],
    formula: '1 ♭2 ♭3 4 5 ♭6 ♭7',
    intervalNames: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'],
    character: 'Spanish, Middle Eastern, dark and exotic.',
    tips: [
      'The ♭2 creates the Spanish/flamenco sound',
      'Use over E power chords for metal riffs',
      'Practice the root to ♭2 resolution'
    ]
  },
  lydian: { 
    name: 'Lydian', 
    intervals: [0, 2, 4, 6, 7, 9, 11],
    formula: '1 2 3 #4 5 6 7',
    intervalNames: ['1', '2', '3', '#4', '5', '6', '7'],
    character: 'Dreamy, floating, ethereal. Joe Satriani favorite.',
    tips: [
      'The #4 creates the dreamy, floating quality',
      'Great for creating atmospheric passages',
      'Use over major 7th chords'
    ]
  },
  mixolydian: { 
    name: 'Mixolydian', 
    intervals: [0, 2, 4, 5, 7, 9, 10],
    formula: '1 2 3 4 5 6 ♭7',
    intervalNames: ['1', '2', '3', '4', '5', '6', '♭7'],
    character: 'Bluesy major, rock and roll, Grateful Dead vibes.',
    tips: [
      'Perfect for dominant 7th chords',
      'The ♭7 gives it a bluesy major sound',
      'Essential for classic rock soloing'
    ]
  },
  locrian: { 
    name: 'Locrian', 
    intervals: [0, 1, 3, 5, 6, 8, 10],
    formula: '1 ♭2 ♭3 4 ♭5 ♭6 ♭7',
    intervalNames: ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7'],
    character: 'Unstable, tense, rarely used melodically.',
    tips: [
      'Used over half-diminished chords',
      'The ♭5 makes it very unstable',
      'More theoretical than practical for most'
    ]
  },
  harmonic_minor: { 
    name: 'Harmonic Minor', 
    intervals: [0, 2, 3, 5, 7, 8, 11],
    formula: '1 2 ♭3 4 5 ♭6 7',
    intervalNames: ['1', '2', '♭3', '4', '5', '♭6', '7'],
    character: 'Classical, neoclassical metal, Yngwie Malmsteen.',
    tips: [
      'The natural 7th creates tension wanting to resolve',
      'Essential for neoclassical metal',
      'Practice the 1.5 step between ♭6 and 7'
    ]
  },
  melodic_minor: { 
    name: 'Melodic Minor', 
    intervals: [0, 2, 3, 5, 7, 9, 11],
    formula: '1 2 ♭3 4 5 6 7',
    intervalNames: ['1', '2', '♭3', '4', '5', '6', '7'],
    character: 'Jazz, sophisticated, smooth minor sound.',
    tips: [
      'Like Dorian with a natural 7th',
      'Foundation for many jazz scales',
      'Great for minor-major 7th chords'
    ]
  },
  hungarian_minor: { 
    name: 'Hungarian Minor', 
    intervals: [0, 2, 3, 6, 7, 8, 11],
    formula: '1 2 ♭3 #4 5 ♭6 7',
    intervalNames: ['1', '2', '♭3', '#4', '5', '♭6', '7'],
    character: 'Dark, exotic, Eastern European folk music.',
    tips: [
      'Two augmented 2nds give it the exotic sound',
      'Great for creating tension and drama',
      'Used in film scores and metal'
    ]
  },
  japanese: { 
    name: 'Japanese (Hirajoshi)', 
    intervals: [0, 2, 3, 7, 8],
    formula: '1 2 ♭3 5 ♭6',
    intervalNames: ['1', '2', '♭3', '5', '♭6'],
    character: 'Traditional Japanese, peaceful, meditative.',
    tips: [
      'Use for Asian-influenced passages',
      'Works great with clean tones and reverb',
      'Let notes ring and breathe'
    ]
  },
  arabic: { 
    name: 'Arabic (Double Harmonic)', 
    intervals: [0, 1, 4, 5, 7, 8, 11],
    formula: '1 ♭2 3 4 5 ♭6 7',
    intervalNames: ['1', '♭2', '3', '4', '5', '♭6', '7'],
    character: 'Middle Eastern, dramatic, snake charmer vibes.',
    tips: [
      'The ♭2 and natural 3 create the exotic tension',
      'Use for Middle Eastern flavored passages',
      'Great for creating atmosphere and drama'
    ]
  }
}

// Get current scale info
const scaleInfo = computed(() => scales[selectedScale.value])

// Calculate scale notes
const scaleNotes = computed(() => {
  const rootIndex = notes.indexOf(rootNote.value)
  return scaleInfo.value.intervals.map(interval => {
    return notes[(rootIndex + interval) % 12]
  })
})

// Get note at specific fret
function getNoteAt(openString, fret) {
  const stringIndex = notes.indexOf(openString)
  return notes[(stringIndex + fret) % 12]
}

// Check if note is in scale
function isNoteInScale(openString, fret) {
  const note = getNoteAt(openString, fret)
  return scaleNotes.value.includes(note)
}

// Check if note is root
function isRootNote(openString, fret) {
  if (!highlightRoot.value) return false
  const note = getNoteAt(openString, fret)
  return note === rootNote.value
}

// Get interval name for note
function getInterval(openString, fret) {
  const note = getNoteAt(openString, fret)
  const noteIndex = scaleNotes.value.indexOf(note)
  if (noteIndex === -1) return ''
  return scaleInfo.value.intervalNames[noteIndex]
}

// Check if fret is in current position
function isInPosition(fret) {
  if (position.value === 0) return true // Full fretboard
  const positions = getPositionFrets()
  return fret >= positions.start && fret <= positions.end
}

// Get fret range for current position
function getPositionFrets() {
  const rootIndex = notes.indexOf(rootNote.value)
  // Position offsets based on root note (simplified CAGED approach)
  const positionOffsets = {
    1: [0, 3],
    2: [3, 6],
    3: [5, 8],
    4: [7, 10],
    5: [10, 13]
  }
  const offset = positionOffsets[position.value] || [0, 14]
  return { start: offset[0], end: offset[1] }
}

// CAGED pattern info
const cagedPatterns = computed(() => {
  const rootIndex = notes.indexOf(rootNote.value)
  return [
    { name: 'Position 1', shape: 'E Shape', startFret: 0, endFret: 3 },
    { name: 'Position 2', shape: 'D Shape', startFret: 3, endFret: 6 },
    { name: 'Position 3', shape: 'C Shape', startFret: 5, endFret: 8 },
    { name: 'Position 4', shape: 'A Shape', startFret: 7, endFret: 10 },
    { name: 'Position 5', shape: 'G Shape', startFret: 10, endFret: 13 }
  ]
})

// Related chords in the scale
const relatedChords = computed(() => {
  const chordQualities = {
    major: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
    minor: ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
    pentatonic_major: ['maj', 'min', 'min', 'maj', 'min'],
    pentatonic_minor: ['min', 'maj', 'maj', 'min', 'maj'],
    blues: ['7', '7', '7', '', '', ''],
    dorian: ['min7', 'min7', 'maj7', '7', 'min7', 'ø7', 'maj7'],
    phrygian: ['min', 'maj', 'maj', 'min', 'dim', 'maj', 'min'],
    lydian: ['maj', 'maj', 'min', 'dim', 'maj', 'min', 'min'],
    mixolydian: ['maj', 'min', 'dim', 'maj', 'min', 'min', 'maj'],
    locrian: ['dim', 'maj', 'min', 'min', 'maj', 'maj', 'min'],
    harmonic_minor: ['min', 'dim', 'aug', 'min', 'maj', 'maj', 'dim'],
    melodic_minor: ['min', 'min', 'aug', 'maj', 'maj', 'dim', 'dim'],
    hungarian_minor: ['min', 'maj', 'maj', 'dim', 'min', 'maj', 'dim'],
    japanese: ['min', 'sus', '', 'sus', 'maj'],
    arabic: ['maj', 'dim', 'maj', 'min', 'maj', 'dim', 'dim']
  }
  
  const romanNumerals = {
    major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
  }

  const qualities = chordQualities[selectedScale.value] || chordQualities.major
  const numerals = selectedScale.value.includes('minor') || selectedScale.value === 'dorian' || selectedScale.value === 'phrygian'
    ? romanNumerals.minor
    : romanNumerals.major

  return scaleNotes.value.slice(0, 7).map((note, i) => ({
    name: `${note}${qualities[i] || ''}`,
    numeral: numerals[i] || (i + 1).toString()
  }))
})

// Audio playback
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function playNote(stringNote, fret) {
  const ctx = initAudio()
  const note = getNoteAt(stringNote, fret)
  const noteIndex = notes.indexOf(note)
  
  // Calculate frequency (A4 = 440Hz)
  const a4Index = notes.indexOf('A')
  const octave = stringNote === 'E' && tuning.indexOf(stringNote) === 0 ? 4 : 3
  const semitonesFromA4 = (noteIndex - a4Index) + (octave - 4) * 12 + fret
  const frequency = 440 * Math.pow(2, semitonesFromA4 / 12)

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  osc.start()
  osc.stop(ctx.currentTime + 1)
}

async function playScale() {
  if (isPlaying.value) {
    isPlaying.value = false
    return
  }
  
  isPlaying.value = true
  const ctx = initAudio()
  
  for (let i = 0; i < scaleNotes.value.length && isPlaying.value; i++) {
    const note = scaleNotes.value[i]
    const noteIndex = notes.indexOf(note)
    const frequency = 220 * Math.pow(2, noteIndex / 12)
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
    
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  isPlaying.value = false
}

function playChord(chord) {
  // Simple chord playback - play root, 3rd, 5th
  const ctx = initAudio()
  const rootIndex = notes.indexOf(chord.name.charAt(0))
  const isMinor = chord.name.includes('min') || chord.name.includes('m')
  
  const intervals = isMinor ? [0, 3, 7] : [0, 4, 7]
  
  intervals.forEach((interval, i) => {
    const frequency = 220 * Math.pow(2, (rootIndex + interval) / 12)
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(ctx.currentTime + i * 0.05)
    osc.stop(ctx.currentTime + 1.5)
  })
}
</script>

<style scoped>
.scale-explorer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #fff;
}

.explorer-header {
  text-align: center;
  margin-bottom: 32px;
}

.explorer-header h1 {
  font-size: 2.5rem;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #06c167, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #8892a6;
  font-size: 1.1rem;
  margin: 0;
}

/* Controls */
.controls-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #2a2a3e;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-group label {
  font-weight: 600;
  color: #8892a6;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.note-btn {
  background: #1a1a2a;
  border: 2px solid #2a2a3e;
  color: #cfd6e6;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  min-width: 40px;
}

.note-btn:hover {
  border-color: #06c167;
  color: #fff;
}

.note-btn.active {
  background: #06c167;
  border-color: #06c167;
  color: #000;
}

.scale-select {
  background: #1a1a2a;
  border: 2px solid #2a2a3e;
  color: #cfd6e6;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.scale-select:hover, .scale-select:focus {
  border-color: #06c167;
  outline: none;
}

.scale-select option {
  background: #1a1a2a;
  color: #cfd6e6;
}

.scale-select optgroup {
  color: #06c167;
  font-weight: bold;
}

.position-btns {
  gap: 8px;
}

.pos-btn {
  background: #1a1a2a;
  border: 2px solid #2a2a3e;
  color: #cfd6e6;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.pos-btn:hover {
  border-color: #06c167;
  color: #fff;
}

.pos-btn.active {
  background: #06c167;
  border-color: #06c167;
  color: #000;
}

.full-btn {
  padding: 8px 20px;
}

/* Scale Info */
.scale-info {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.info-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
}

.play-scale-btn {
  background: linear-gradient(135deg, #06c167, #05a557);
  border: none;
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.play-scale-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(6, 193, 103, 0.3);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  color: #6b7280;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #cfd6e6;
  font-size: 1rem;
}

.notes-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scale-note {
  background: #2a2a3e;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
}

.scale-note.root {
  background: #06c167;
  color: #000;
}

/* Fretboard */
.fretboard-container {
  overflow-x: auto;
  padding: 20px 0;
  margin-bottom: 24px;
}

.fretboard {
  background: linear-gradient(180deg, #3d2c1f, #2a1f15);
  border-radius: 12px;
  padding: 20px;
  min-width: 900px;
  border: 3px solid #4a3728;
}

.fret-numbers {
  display: flex;
  margin-left: 40px;
  margin-bottom: 10px;
}

.fret-number {
  width: 56px;
  text-align: center;
  color: #8b7355;
  font-size: 0.8rem;
  font-weight: 600;
}

.string-row {
  display: flex;
  align-items: center;
  height: 36px;
  border-bottom: 2px solid #8b7355;
}

.string-row:last-of-type {
  border-bottom: none;
}

.string-label {
  width: 40px;
  text-align: center;
  color: #d4a574;
  font-weight: 700;
  font-size: 0.9rem;
}

.frets {
  display: flex;
  flex: 1;
}

.fret {
  width: 56px;
  height: 100%;
  border-right: 3px solid #c9a66b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.15s;
}

.fret:first-child {
  border-left: 6px solid #f0f0f0;
}

.fret:hover {
  background: rgba(6, 193, 103, 0.1);
}

.fret.fret-marker {
  background: rgba(139, 115, 85, 0.1);
}

.note-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #4a5568;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  transition: all 0.2s;
}

.fret.in-scale .note-marker {
  background: #3b82f6;
  opacity: 1;
}

.fret.in-position .note-marker {
  opacity: 1;
  transform: scale(1.1);
}

.fret.root-note .note-marker {
  background: #06c167;
  box-shadow: 0 0 12px rgba(6, 193, 103, 0.5);
  transform: scale(1.15);
}

.fret-markers {
  display: flex;
  margin-left: 40px;
  margin-top: 10px;
}

.marker-slot {
  width: 56px;
  text-align: center;
}

.marker {
  color: #8b7355;
  font-size: 0.6rem;
}

.marker.double {
  letter-spacing: 4px;
}

/* Display Options */
.display-options {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding: 16px;
  background: #0f1424;
  border-radius: 12px;
  justify-content: center;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle-option input {
  width: 20px;
  height: 20px;
  accent-color: #06c167;
}

.toggle-label {
  color: #cfd6e6;
  font-weight: 500;
}

/* Patterns Section */
.patterns-section {
  margin-bottom: 32px;
}

.patterns-section h3 {
  color: #fff;
  margin: 0 0 16px;
  font-size: 1.3rem;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.pattern-card {
  background: #1a1a2a;
  border: 2px solid #2a2a3e;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pattern-card:hover {
  border-color: #06c167;
  transform: translateY(-2px);
}

.pattern-card.active {
  background: rgba(6, 193, 103, 0.1);
  border-color: #06c167;
}

.pattern-name {
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.pattern-frets {
  color: #8892a6;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.pattern-shape {
  color: #06c167;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Related Chords */
.related-section {
  margin-bottom: 32px;
}

.related-section h3 {
  color: #fff;
  margin: 0 0 16px;
  font-size: 1.3rem;
}

.chords-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chord-pill {
  background: #1a1a2a;
  border: 2px solid #2a2a3e;
  border-radius: 20px;
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chord-pill:hover {
  border-color: #06c167;
  background: rgba(6, 193, 103, 0.1);
}

.chord-pill.tonic {
  background: rgba(6, 193, 103, 0.15);
  border-color: #06c167;
}

.chord-numeral {
  color: #8892a6;
  font-size: 0.8rem;
  font-weight: 600;
}

.chord-name {
  color: #fff;
  font-weight: 600;
}

/* Tips Section */
.tips-section {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 24px;
}

.tips-section h3 {
  color: #fff;
  margin: 0 0 16px;
  font-size: 1.3rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  color: #cfd6e6;
  padding: 10px 0;
  padding-left: 28px;
  position: relative;
  line-height: 1.5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tips-list li:last-child {
  border-bottom: none;
}

.tips-list li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: #06c167;
}

@media (max-width: 768px) {
  .scale-explorer {
    padding: 16px;
  }

  .explorer-header h1 {
    font-size: 1.8rem;
  }

  .controls-section {
    padding: 16px;
  }

  .info-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-header h2 {
    font-size: 1.4rem;
  }

  .display-options {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
