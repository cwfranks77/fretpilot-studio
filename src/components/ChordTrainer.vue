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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { initAudio, playChord, playChordNotes, setInstrument, disposeAudio } from '../services/audioService'

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

async function playChordSound() {
  try {
    // Set instrument based on current selection
    setInstrument(instrument.value)
    
    // Try to play the chord by name first (for realistic strumming)
    const chordName = currentChord.value.name
    if (chordName) {
      await playChord(chordName, 'medium', 'down')
    } else {
      // Fallback to playing individual notes
      const notes = currentChord.value.notes || ['C', 'E', 'G']
      await playChordNotes(notes)
    }
  } catch (e) {
    console.log('Audio error:', e)
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

// Watch for instrument changes
watch(instrument, (newInstrument) => {
  setInstrument(newInstrument)
})

onMounted(async () => {
  loadProgress()
  // Initialize audio system
  await initAudio()
  setInstrument(instrument.value)
})

onUnmounted(() => {
  disposeAudio()
})
</script>

<style scoped>
.chord-trainer { 
  max-width: 900px; 
  margin: 0 auto; 
  padding: 32px 24px; 
}

.trainer-header { 
  text-align: center; 
  margin-bottom: 40px; 
}

.trainer-header h1 { 
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 2.8rem; 
  font-weight: 400;
  margin: 0 0 12px; 
  color: #fafaf9;
}

.subtitle { 
  color: #78716c; 
  font-size: 1.1rem; 
  margin: 0; 
}

.instrument-selector { 
  display: flex; 
  justify-content: center; 
  gap: 12px; 
  margin-bottom: 40px; 
  flex-wrap: wrap; 
}

.instrument-btn { 
  background: rgba(250, 250, 249, 0.03); 
  border: 1px solid rgba(250, 250, 249, 0.08); 
  color: #a8a29e; 
  padding: 14px 28px; 
  border-radius: 14px; 
  font-size: 1rem; 
  font-weight: 500;
  cursor: pointer; 
  transition: all 0.3s ease; 
}

.instrument-btn:hover { 
  border-color: rgba(249, 115, 22, 0.3);
  color: #fafaf9;
}

.instrument-btn.active { 
  background: rgba(249, 115, 22, 0.1); 
  border-color: rgba(249, 115, 22, 0.4); 
  color: #f97316; 
}

.chord-display { 
  background: linear-gradient(180deg, rgba(250, 250, 249, 0.02), rgba(250, 250, 249, 0.01)); 
  border: 1px solid rgba(250, 250, 249, 0.06); 
  border-radius: 24px; 
  padding: 48px 40px; 
  text-align: center; 
  margin-bottom: 32px; 
}

.chord-name { 
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 5rem; 
  font-weight: 400;
  font-style: italic;
  color: #f97316; 
  margin-bottom: 32px; 
  text-shadow: 0 0 60px rgba(249, 115, 22, 0.3); 
}

.fretboard { 
  display: inline-block; 
  background: linear-gradient(180deg, #44403c, #292524); 
  border-radius: 12px; 
  padding: 24px; 
  border: 2px solid #57534e; 
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
}

.strings { 
  display: flex; 
  gap: 18px; 
}

.string { 
  display: flex; 
  flex-direction: column; 
}

.fret { 
  width: 26px; 
  height: 44px; 
  border-bottom: 2px solid #78716c; 
  border-right: 1px solid #a8a29e; 
  position: relative; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.fret:first-child { 
  border-top: 5px solid #d6d3d1; 
  height: 34px; 
}

.finger-dot { 
  width: 22px; 
  height: 22px; 
  background: linear-gradient(135deg, #f97316, #ea580c); 
  border-radius: 50%; 
  box-shadow: 0 3px 12px rgba(249, 115, 22, 0.5); 
}

.open-string, .muted-string { 
  font-size: 1.3rem; 
  font-weight: bold; 
}

.open-string { 
  color: #22c55e; 
}

.muted-string { 
  color: #ef4444; 
}

.fret-numbers { 
  display: flex; 
  justify-content: space-around; 
  margin-top: 12px; 
  color: #78716c; 
  font-size: 0.85rem; 
}

.piano-keys { 
  display: flex; 
  justify-content: center; 
  height: 160px; 
  position: relative; 
}

.piano-key { 
  position: relative; 
  display: flex; 
  align-items: flex-end; 
  justify-content: center; 
  padding-bottom: 10px; 
  cursor: pointer; 
  transition: all 0.2s ease; 
}

.piano-key.white { 
  width: 44px; 
  height: 160px; 
  background: linear-gradient(180deg, #fafaf9, #e7e5e4); 
  border: 1px solid #a8a29e; 
  border-radius: 0 0 6px 6px; 
  z-index: 1; 
}

.piano-key.black { 
  width: 30px; 
  height: 105px; 
  background: linear-gradient(180deg, #292524, #0c0a09); 
  border-radius: 0 0 4px 4px; 
  margin: 0 -15px; 
  z-index: 2; 
  color: #a8a29e; 
}

.piano-key.active { 
  background: linear-gradient(180deg, #f97316, #ea580c) !important; 
  box-shadow: 0 0 24px rgba(249, 115, 22, 0.5); 
}

.piano-key.active .key-label { 
  color: #fff; 
}

.key-label { 
  font-size: 0.75rem; 
  font-weight: 600; 
}

.chord-notes { 
  color: #78716c; 
  font-size: 1rem; 
  margin-top: 20px; 
  letter-spacing: 0.02em;
}

.practice-controls { 
  display: flex; 
  justify-content: center; 
  gap: 16px; 
  margin-bottom: 40px; 
  flex-wrap: wrap; 
}

.btn-action { 
  background: rgba(250, 250, 249, 0.03); 
  border: 1px solid rgba(250, 250, 249, 0.08); 
  color: #d6d3d1; 
  padding: 16px 32px; 
  border-radius: 14px; 
  font-size: 1rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}

.btn-action:hover { 
  border-color: rgba(249, 115, 22, 0.3); 
  transform: translateY(-2px); 
}

.btn-next { 
  background: linear-gradient(135deg, #f97316, #ea580c); 
  border-color: transparent; 
  color: #fff; 
  box-shadow: 0 8px 24px -8px rgba(249, 115, 22, 0.4);
}

.btn-next:hover {
  box-shadow: 0 12px 32px -8px rgba(249, 115, 22, 0.5);
}

.progress-section { 
  background: rgba(250, 250, 249, 0.02); 
  border: 1px solid rgba(250, 250, 249, 0.06); 
  border-radius: 20px; 
  padding: 28px; 
  margin-bottom: 40px; 
}

.progress-section h3 { 
  margin: 0 0 20px; 
  color: #fafaf9; 
  font-size: 1.1rem;
  font-weight: 600;
}

.progress-bar { 
  height: 10px; 
  background: #292524; 
  border-radius: 5px; 
  overflow: hidden; 
  margin-bottom: 16px; 
}

.progress-fill { 
  height: 100%; 
  background: linear-gradient(90deg, #f97316, #fb923c); 
  border-radius: 5px; 
  transition: width 0.5s ease; 
}

.progress-stats { 
  display: flex; 
  justify-content: space-between; 
  color: #78716c; 
  font-size: 0.9rem; 
}

.streak { 
  color: #fbbf24; 
  font-weight: 600; 
}

.chord-categories h3, .quick-reference h3 { 
  color: #fafaf9; 
  margin: 0 0 20px; 
  font-size: 1.1rem;
  font-weight: 600;
}

.category-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); 
  gap: 14px; 
  margin-bottom: 40px; 
}

.category-btn { 
  background: rgba(250, 250, 249, 0.02); 
  border: 1px solid rgba(250, 250, 249, 0.06); 
  border-radius: 16px; 
  padding: 20px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  text-align: center; 
}

.category-btn:hover { 
  border-color: rgba(249, 115, 22, 0.3);
  transform: translateY(-2px);
}

.category-btn.active { 
  background: rgba(249, 115, 22, 0.1); 
  border-color: rgba(249, 115, 22, 0.4); 
}

.cat-icon { 
  font-size: 1.8rem; 
  display: block; 
  margin-bottom: 10px; 
}

.cat-name { 
  color: #fafaf9; 
  font-weight: 600; 
  display: block; 
}

.cat-count { 
  color: #78716c; 
  font-size: 0.8rem; 
  margin-top: 4px;
  display: block;
}

.chord-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(85px, 1fr)); 
  gap: 10px; 
  margin-bottom: 40px; 
}

.chord-btn { 
  background: rgba(250, 250, 249, 0.02); 
  border: 1px solid rgba(250, 250, 249, 0.06); 
  color: #d6d3d1; 
  padding: 14px; 
  border-radius: 10px; 
  font-size: 1rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.2s ease; 
  position: relative; 
}

.chord-btn:hover { 
  border-color: rgba(249, 115, 22, 0.3); 
}

.chord-btn.current { 
  background: linear-gradient(135deg, #f97316, #ea580c); 
  border-color: transparent; 
  color: #fff; 
}

.chord-btn.completed { 
  background: rgba(34, 197, 94, 0.1); 
  border-color: rgba(34, 197, 94, 0.3); 
  color: #22c55e;
}

.chord-btn .check { 
  position: absolute; 
  top: 4px; 
  right: 6px; 
  font-size: 0.7rem; 
  color: #22c55e; 
}

.complete-section { 
  text-align: center; 
  padding-bottom: 40px;
}

.btn-complete { 
  background: linear-gradient(135deg, #22c55e, #16a34a); 
  border: none; 
  color: #fff; 
  padding: 18px 56px; 
  border-radius: 14px; 
  font-size: 1.2rem; 
  font-weight: 700; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  box-shadow: 0 8px 32px -8px rgba(34, 197, 94, 0.4); 
}

.btn-complete:hover:not(:disabled) { 
  transform: translateY(-3px); 
  box-shadow: 0 12px 40px -8px rgba(34, 197, 94, 0.5); 
}

.btn-complete:disabled { 
  background: rgba(34, 197, 94, 0.2); 
  color: #22c55e; 
  cursor: default; 
  box-shadow: none;
}

@media (max-width: 768px) { 
  .chord-trainer { 
    padding: 20px 16px; 
  } 
  .trainer-header h1 { 
    font-size: 2rem; 
  } 
  .chord-name { 
    font-size: 3.5rem; 
  } 
  .chord-display { 
    padding: 32px 20px; 
  } 
  .instrument-btn { 
    padding: 12px 20px; 
    font-size: 0.9rem; 
  } 
}
</style>
