<template>
  <div class="chord-trainer">
    <div class="trainer-header">
      <h1>🎸 Chord Trainer</h1>
      <p class="subtitle">Master your chords with interactive practice</p>
    </div>

    <!-- Instrument Selector -->
    <div class="instrument-selector">
      <button 
        v-for="inst in instruments" 
        :key="inst.id"
        :class="['instrument-btn', { active: instrument === inst.id }]"
        @click="instrument = inst.id"
      >
        {{ inst.icon }} {{ inst.name }}
      </button>
    </div>

    <!-- Current Chord Display -->
    <div class="chord-display">
      <div class="chord-name">{{ currentChord.name }}</div>
      <div class="chord-diagram">
        <div class="fretboard" v-if="instrument === 'guitar' || instrument === 'ukulele'">
          <div class="strings">
            <div 
              v-for="(string, sIdx) in currentChord.diagram" 
              :key="sIdx" 
              class="string"
            >
              <div 
                v-for="(fret, fIdx) in 5" 
                :key="fIdx" 
                :class="['fret', { active: string.includes(fIdx), open: fIdx === 0 && string.includes(0), muted: string.includes(-1) && fIdx === 0 }]"
              >
                <span v-if="string.includes(fIdx) && fIdx > 0" class="finger-dot"></span>
                <span v-if="fIdx === 0 && string.includes(0)" class="open-string">○</span>
                <span v-if="fIdx === 0 && string.includes(-1)" class="muted-string">✕</span>
              </div>
            </div>
          </div>
          <div class="fret-numbers">
            <span v-for="f in 5" :key="f">{{ f }}</span>
          </div>
        </div>
        <div class="piano-keys" v-else-if="instrument === 'piano'">
          <div 
            v-for="(key, idx) in pianoKeys" 
            :key="idx"
            :class="['piano-key', key.type, { active: currentChord.pianoKeys?.includes(key.note) }]"
          >
            <span class="key-label">{{ key.note }}</span>
          </div>
        </div>
      </div>
      <div class="chord-notes">
        Notes: {{ currentChord.notes?.join(' - ') || 'C - E - G' }}
      </div>
    </div>

    <!-- Practice Controls -->
    <div class="practice-controls">
      <button class="btn-action" @click="playChordSound">
        🔊 Play Sound
      </button>
      <button class="btn-action btn-next" @click="nextChord">
        Next Chord →
      </button>
      <button class="btn-action btn-random" @click="randomChord">
        🎲 Random
      </button>
    </div>

    <!-- Progress Tracker -->
    <div class="progress-section">
      <h3>Today's Progress</h3>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-stats">
        <span>{{ chordsCompleted }} / {{ dailyGoal }} chords practiced</span>
        <span class="streak" v-if="streak > 0">🔥 {{ streak }} day streak!</span>
      </div>
    </div>

    <!-- Chord Categories -->
    <div class="chord-categories">
      <h3>Choose Category</h3>
      <div class="category-grid">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="['category-btn', { active: category === cat.id }]"
          @click="setCategory(cat.id)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-count">{{ cat.count }} chords</span>
        </button>
      </div>
    </div>

    <!-- Quick Reference -->
    <div class="quick-reference">
      <h3>All {{ categoryName }} Chords</h3>
      <div class="chord-grid">
        <button 
          v-for="chord in categoryChords" 
          :key="chord.name"
          :class="['chord-btn', { current: currentChord.name === chord.name, completed: completedChords.includes(chord.name) }]"
          @click="selectChord(chord)"
        >
          {{ chord.name }}
          <span v-if="completedChords.includes(chord.name)" class="check">✓</span>
        </button>
      </div>
    </div>

    <!-- Mark Complete Button -->
    <div class="complete-section">
      <button 
        class="btn-complete" 
        @click="markComplete"
        :disabled="completedChords.includes(currentChord.name)"
      >
        {{ completedChords.includes(currentChord.name) ? '✓ Completed' : '✓ I Got It!' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const instrument = ref('guitar')
const category = ref('major')
const currentChordIndex = ref(0)
const completedChords = ref([])
const chordsCompleted = ref(0)
const dailyGoal = ref(20)
const streak = ref(0)

const instruments = [
  { id: 'guitar', name: 'Guitar', icon: '🎸' },
  { id: 'ukulele', name: 'Ukulele', icon: '🪕' },
  { id: 'piano', name: 'Piano', icon: '🎹' },
]

const categories = [
  { id: 'major', name: 'Major', icon: '🌟', count: 12 },
  { id: 'minor', name: 'Minor', icon: '🌙', count: 12 },
  { id: 'seventh', name: '7th Chords', icon: '7️⃣', count: 12 },
  { id: 'power', name: 'Power', icon: '⚡', count: 12 },
]

const chordLibrary = {
  major: [
    { name: 'C', notes: ['C', 'E', 'G'], diagram: [[0], [1], [0], [2], [3], [-1]], pianoKeys: ['C', 'E', 'G'] },
    { name: 'D', notes: ['D', 'F#', 'A'], diagram: [[2], [3], [2], [0], [-1], [-1]], pianoKeys: ['D', 'F#', 'A'] },
    { name: 'E', notes: ['E', 'G#', 'B'], diagram: [[0], [0], [1], [2], [2], [0]], pianoKeys: ['E', 'G#', 'B'] },
    { name: 'F', notes: ['F', 'A', 'C'], diagram: [[1], [1], [2], [3], [3], [1]], pianoKeys: ['F', 'A', 'C'] },
    { name: 'G', notes: ['G', 'B', 'D'], diagram: [[3], [0], [0], [0], [2], [3]], pianoKeys: ['G', 'B', 'D'] },
    { name: 'A', notes: ['A', 'C#', 'E'], diagram: [[0], [2], [2], [2], [0], [-1]], pianoKeys: ['A', 'C#', 'E'] },
    { name: 'B', notes: ['B', 'D#', 'F#'], diagram: [[2], [4], [4], [4], [2], [-1]], pianoKeys: ['B', 'D#', 'F#'] },
    { name: 'C#', notes: ['C#', 'E#', 'G#'], diagram: [[4], [6], [6], [6], [4], [-1]], pianoKeys: ['C#', 'F', 'G#'] },
    { name: 'D#', notes: ['D#', 'G', 'A#'], diagram: [[6], [8], [8], [8], [6], [-1]], pianoKeys: ['D#', 'G', 'A#'] },
    { name: 'F#', notes: ['F#', 'A#', 'C#'], diagram: [[2], [2], [3], [4], [4], [2]], pianoKeys: ['F#', 'A#', 'C#'] },
    { name: 'G#', notes: ['G#', 'C', 'D#'], diagram: [[4], [4], [5], [6], [6], [4]], pianoKeys: ['G#', 'C', 'D#'] },
    { name: 'A#', notes: ['A#', 'D', 'F'], diagram: [[1], [3], [3], [3], [1], [-1]], pianoKeys: ['A#', 'D', 'F'] },
  ],
  minor: [
    { name: 'Am', notes: ['A', 'C', 'E'], diagram: [[0], [1], [2], [2], [0], [-1]], pianoKeys: ['A', 'C', 'E'] },
    { name: 'Bm', notes: ['B', 'D', 'F#'], diagram: [[2], [3], [4], [4], [2], [-1]], pianoKeys: ['B', 'D', 'F#'] },
    { name: 'Cm', notes: ['C', 'Eb', 'G'], diagram: [[3], [4], [5], [5], [3], [-1]], pianoKeys: ['C', 'D#', 'G'] },
    { name: 'Dm', notes: ['D', 'F', 'A'], diagram: [[1], [3], [2], [0], [-1], [-1]], pianoKeys: ['D', 'F', 'A'] },
    { name: 'Em', notes: ['E', 'G', 'B'], diagram: [[0], [0], [0], [2], [2], [0]], pianoKeys: ['E', 'G', 'B'] },
    { name: 'Fm', notes: ['F', 'Ab', 'C'], diagram: [[1], [1], [1], [3], [3], [1]], pianoKeys: ['F', 'G#', 'C'] },
    { name: 'Gm', notes: ['G', 'Bb', 'D'], diagram: [[3], [3], [3], [5], [5], [3]], pianoKeys: ['G', 'A#', 'D'] },
    { name: 'C#m', notes: ['C#', 'E', 'G#'], diagram: [[4], [5], [6], [6], [4], [-1]], pianoKeys: ['C#', 'E', 'G#'] },
    { name: 'D#m', notes: ['D#', 'F#', 'A#'], diagram: [[6], [7], [8], [8], [6], [-1]], pianoKeys: ['D#', 'F#', 'A#'] },
    { name: 'F#m', notes: ['F#', 'A', 'C#'], diagram: [[2], [2], [2], [4], [4], [2]], pianoKeys: ['F#', 'A', 'C#'] },
    { name: 'G#m', notes: ['G#', 'B', 'D#'], diagram: [[4], [4], [4], [6], [6], [4]], pianoKeys: ['G#', 'B', 'D#'] },
    { name: 'A#m', notes: ['A#', 'C#', 'F'], diagram: [[1], [2], [3], [3], [1], [-1]], pianoKeys: ['A#', 'C#', 'F'] },
  ],
  seventh: [
    { name: 'C7', notes: ['C', 'E', 'G', 'Bb'], diagram: [[0], [1], [3], [2], [3], [-1]], pianoKeys: ['C', 'E', 'G', 'A#'] },
    { name: 'D7', notes: ['D', 'F#', 'A', 'C'], diagram: [[2], [1], [2], [0], [-1], [-1]], pianoKeys: ['D', 'F#', 'A', 'C'] },
    { name: 'E7', notes: ['E', 'G#', 'B', 'D'], diagram: [[0], [0], [1], [0], [2], [0]], pianoKeys: ['E', 'G#', 'B', 'D'] },
    { name: 'G7', notes: ['G', 'B', 'D', 'F'], diagram: [[1], [0], [0], [0], [2], [3]], pianoKeys: ['G', 'B', 'D', 'F'] },
    { name: 'A7', notes: ['A', 'C#', 'E', 'G'], diagram: [[0], [2], [0], [2], [0], [-1]], pianoKeys: ['A', 'C#', 'E', 'G'] },
    { name: 'B7', notes: ['B', 'D#', 'F#', 'A'], diagram: [[2], [0], [2], [1], [2], [-1]], pianoKeys: ['B', 'D#', 'F#', 'A'] },
    { name: 'Am7', notes: ['A', 'C', 'E', 'G'], diagram: [[0], [1], [0], [2], [0], [-1]], pianoKeys: ['A', 'C', 'E', 'G'] },
    { name: 'Bm7', notes: ['B', 'D', 'F#', 'A'], diagram: [[2], [3], [2], [4], [2], [-1]], pianoKeys: ['B', 'D', 'F#', 'A'] },
    { name: 'Dm7', notes: ['D', 'F', 'A', 'C'], diagram: [[1], [1], [2], [0], [-1], [-1]], pianoKeys: ['D', 'F', 'A', 'C'] },
    { name: 'Em7', notes: ['E', 'G', 'B', 'D'], diagram: [[0], [0], [0], [0], [2], [0]], pianoKeys: ['E', 'G', 'B', 'D'] },
    { name: 'Fmaj7', notes: ['F', 'A', 'C', 'E'], diagram: [[0], [1], [2], [2], [-1], [-1]], pianoKeys: ['F', 'A', 'C', 'E'] },
    { name: 'Gmaj7', notes: ['G', 'B', 'D', 'F#'], diagram: [[2], [0], [0], [0], [2], [3]], pianoKeys: ['G', 'B', 'D', 'F#'] },
  ],
  power: [
    { name: 'C5', notes: ['C', 'G'], diagram: [[-1], [-1], [5], [5], [3], [-1]], pianoKeys: ['C', 'G'] },
    { name: 'D5', notes: ['D', 'A'], diagram: [[-1], [-1], [7], [7], [5], [-1]], pianoKeys: ['D', 'A'] },
    { name: 'E5', notes: ['E', 'B'], diagram: [[-1], [-1], [2], [2], [0], [0]], pianoKeys: ['E', 'B'] },
    { name: 'F5', notes: ['F', 'C'], diagram: [[-1], [-1], [3], [3], [1], [-1]], pianoKeys: ['F', 'C'] },
    { name: 'G5', notes: ['G', 'D'], diagram: [[-1], [-1], [5], [5], [3], [3]], pianoKeys: ['G', 'D'] },
    { name: 'A5', notes: ['A', 'E'], diagram: [[-1], [-1], [2], [2], [0], [-1]], pianoKeys: ['A', 'E'] },
    { name: 'B5', notes: ['B', 'F#'], diagram: [[-1], [-1], [4], [4], [2], [-1]], pianoKeys: ['B', 'F#'] },
    { name: 'C#5', notes: ['C#', 'G#'], diagram: [[-1], [-1], [6], [6], [4], [-1]], pianoKeys: ['C#', 'G#'] },
    { name: 'D#5', notes: ['D#', 'A#'], diagram: [[-1], [-1], [8], [8], [6], [-1]], pianoKeys: ['D#', 'A#'] },
    { name: 'F#5', notes: ['F#', 'C#'], diagram: [[-1], [-1], [4], [4], [2], [2]], pianoKeys: ['F#', 'C#'] },
    { name: 'G#5', notes: ['G#', 'D#'], diagram: [[-1], [-1], [6], [6], [4], [4]], pianoKeys: ['G#', 'D#'] },
    { name: 'A#5', notes: ['A#', 'F'], diagram: [[-1], [-1], [3], [3], [1], [-1]], pianoKeys: ['A#', 'F'] },
  ]
}

const pianoKeys = [
  { note: 'C', type: 'white' },
  { note: 'C#', type: 'black' },
  { note: 'D', type: 'white' },
  { note: 'D#', type: 'black' },
  { note: 'E', type: 'white' },
  { note: 'F', type: 'white' },
  { note: 'F#', type: 'black' },
  { note: 'G', type: 'white' },
  { note: 'G#', type: 'black' },
  { note: 'A', type: 'white' },
  { note: 'A#', type: 'black' },
  { note: 'B', type: 'white' },
]

const categoryChords = computed(() => chordLibrary[category.value] || [])
const categoryName = computed(() => categories.find(c => c.id === category.value)?.name || 'Major')
const currentChord = computed(() => categoryChords.value[currentChordIndex.value] || categoryChords.value[0] || { name: 'C', notes: ['C', 'E', 'G'], diagram: [[0], [1], [0], [2], [3], [-1]] })
const progressPercent = computed(() => Math.min(100, (chordsCompleted.value / dailyGoal.value) * 100))

function setCategory(cat) {
  category.value = cat
  currentChordIndex.value = 0
}

function selectChord(chord) {
  const idx = categoryChords.value.findIndex(c => c.name === chord.name)
  if (idx !== -1) currentChordIndex.value = idx
}

function nextChord() {
  if (currentChordIndex.value < categoryChords.value.length - 1) {
    currentChordIndex.value++
  } else {
    currentChordIndex.value = 0
  }
}

function randomChord() {
  const newIdx = Math.floor(Math.random() * categoryChords.value.length)
  currentChordIndex.value = newIdx
}

function markComplete() {
  if (!completedChords.value.includes(currentChord.value.name)) {
    completedChords.value.push(currentChord.value.name)
    chordsCompleted.value++
    saveProgress()
    setTimeout(() => nextChord(), 500)
  }
}

function playChordSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const notes = currentChord.value.notes || ['C', 'E', 'G']
    
    const noteFreqs = {
      'C': 261.63, 'C#': 277.18, 'Db': 277.18,
      'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
      'E': 329.63, 'E#': 349.23,
      'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
      'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
      'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
      'B': 493.88
    }
    
    notes.forEach((note, i) => {
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      
      osc.type = 'triangle'
      osc.frequency.value = noteFreqs[note] || 440
      
      gain.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
      
      osc.connect(gain)
      gain.connect(audioContext.destination)
      
      osc.start(audioContext.currentTime + i * 0.05)
      osc.stop(audioContext.currentTime + 1.5)
    })
  } catch (e) {
    console.log('Audio not supported')
  }
}

function saveProgress() {
  try {
    const today = new Date().toDateString()
    const saved = JSON.parse(localStorage.getItem('fp_chord_progress') || '{}')
    saved[today] = { completed: completedChords.value, count: chordsCompleted.value }
    localStorage.setItem('fp_chord_progress', JSON.stringify(saved))
  } catch (e) {}
}

function loadProgress() {
  try {
    const today = new Date().toDateString()
    const saved = JSON.parse(localStorage.getItem('fp_chord_progress') || '{}')
    if (saved[today]) {
      completedChords.value = saved[today].completed || []
      chordsCompleted.value = saved[today].count || 0
    }
  } catch (e) {}
}

onMounted(() => {
  loadProgress()
})
</script>

<style scoped>
.chord-trainer { max-width: 900px; margin: 0 auto; padding: 24px; }
.trainer-header { text-align: center; margin-bottom: 32px; }
.trainer-header h1 { font-size: 2.5rem; margin: 0 0 8px; background: linear-gradient(135deg, #06c167, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { color: #8892a6; font-size: 1.1rem; margin: 0; }
.instrument-selector { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; flex-wrap: wrap; }
.instrument-btn { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; padding: 12px 24px; border-radius: 12px; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
.instrument-btn:hover { border-color: #06c167; }
.instrument-btn.active { background: linear-gradient(135deg, rgba(6, 193, 103, 0.2), rgba(0, 212, 255, 0.1)); border-color: #06c167; color: #fff; }
.chord-display { background: linear-gradient(135deg, #0f1424, #1a1f35); border: 2px solid #2a2a3e; border-radius: 20px; padding: 40px; text-align: center; margin-bottom: 24px; }
.chord-name { font-size: 4rem; font-weight: 700; color: #fff; margin-bottom: 24px; text-shadow: 0 0 30px rgba(6, 193, 103, 0.3); }
.fretboard { display: inline-block; background: linear-gradient(180deg, #3a3020, #2a2015); border-radius: 8px; padding: 20px; border: 3px solid #4a4030; }
.strings { display: flex; gap: 16px; }
.string { display: flex; flex-direction: column; }
.fret { width: 24px; height: 40px; border-bottom: 2px solid #666; border-right: 1px solid #888; position: relative; display: flex; align-items: center; justify-content: center; }
.fret:first-child { border-top: 4px solid #ddd; height: 30px; }
.finger-dot { width: 20px; height: 20px; background: linear-gradient(135deg, #06c167, #04a857); border-radius: 50%; box-shadow: 0 2px 8px rgba(6, 193, 103, 0.5); }
.open-string, .muted-string { font-size: 1.2rem; font-weight: bold; }
.open-string { color: #06c167; }
.muted-string { color: #ff6b6b; }
.fret-numbers { display: flex; justify-content: space-around; margin-top: 8px; color: #666; font-size: 0.8rem; }
.piano-keys { display: flex; justify-content: center; height: 150px; position: relative; }
.piano-key { position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; cursor: pointer; transition: all 0.2s; }
.piano-key.white { width: 40px; height: 150px; background: linear-gradient(180deg, #f5f5f5, #e0e0e0); border: 1px solid #999; border-radius: 0 0 4px 4px; z-index: 1; }
.piano-key.black { width: 28px; height: 100px; background: linear-gradient(180deg, #333, #111); border-radius: 0 0 3px 3px; margin: 0 -14px; z-index: 2; color: #fff; }
.piano-key.active { background: linear-gradient(180deg, #06c167, #04a857) !important; box-shadow: 0 0 20px rgba(6, 193, 103, 0.5); }
.piano-key.active .key-label { color: #fff; }
.key-label { font-size: 0.7rem; font-weight: 600; }
.chord-notes { color: #8892a6; font-size: 1rem; margin-top: 16px; }
.practice-controls { display: flex; justify-content: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
.btn-action { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; padding: 14px 28px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-action:hover { border-color: #06c167; transform: translateY(-2px); }
.btn-next { background: linear-gradient(135deg, #06c167, #04a857); border-color: #06c167; color: #fff; }
.progress-section { background: #0f1424; border: 1px solid #2a2a3e; border-radius: 16px; padding: 24px; margin-bottom: 32px; }
.progress-section h3 { margin: 0 0 16px; color: #fff; }
.progress-bar { height: 12px; background: #2a2a3e; border-radius: 6px; overflow: hidden; margin-bottom: 12px; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #06c167, #00d4ff); border-radius: 6px; transition: width 0.5s ease; }
.progress-stats { display: flex; justify-content: space-between; color: #8892a6; font-size: 0.9rem; }
.streak { color: #ff9500; font-weight: 600; }
.chord-categories h3, .quick-reference h3 { color: #fff; margin: 0 0 16px; }
.category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 32px; }
.category-btn { background: #1a1a2e; border: 2px solid #2a2a3e; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s; text-align: center; }
.category-btn:hover { border-color: #06c167; }
.category-btn.active { background: linear-gradient(135deg, rgba(6, 193, 103, 0.2), rgba(0, 212, 255, 0.1)); border-color: #06c167; }
.cat-icon { font-size: 1.5rem; display: block; margin-bottom: 8px; }
.cat-name { color: #fff; font-weight: 600; display: block; }
.cat-count { color: #666; font-size: 0.8rem; }
.chord-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; margin-bottom: 32px; }
.chord-btn { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; position: relative; }
.chord-btn:hover { border-color: #06c167; }
.chord-btn.current { background: linear-gradient(135deg, #06c167, #04a857); border-color: #06c167; color: #fff; }
.chord-btn.completed { background: rgba(6, 193, 103, 0.2); border-color: rgba(6, 193, 103, 0.5); }
.chord-btn .check { position: absolute; top: 2px; right: 4px; font-size: 0.7rem; color: #06c167; }
.complete-section { text-align: center; }
.btn-complete { background: linear-gradient(135deg, #06c167, #04a857); border: none; color: #fff; padding: 16px 48px; border-radius: 12px; font-size: 1.2rem; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 24px rgba(6, 193, 103, 0.3); }
.btn-complete:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(6, 193, 103, 0.4); }
.btn-complete:disabled { background: #2a2a3e; color: #06c167; cursor: default; }
@media (max-width: 768px) { .chord-trainer { padding: 16px; } .trainer-header h1 { font-size: 1.8rem; } .chord-name { font-size: 3rem; } .chord-display { padding: 24px 16px; } .instrument-btn { padding: 10px 16px; font-size: 0.9rem; } }
</style>
