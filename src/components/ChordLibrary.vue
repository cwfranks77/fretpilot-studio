<template>
  <div class="chord-library">
    <div class="library-header">
      <h1>📚 Chord Library</h1>
      <p class="subtitle">Multi-instrument chord reference</p>
    </div>

    <div class="instrument-tabs">
      <button v-for="inst in instruments" :key="inst.id" :class="['tab-btn', { active: selectedInstrument === inst.id }]" @click="selectedInstrument = inst.id">{{ inst.icon }} {{ inst.name }}</button>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search chords (e.g., Am, G7)" class="search-input" />
      <span class="search-icon">🔍</span>
    </div>

    <div class="category-filter">
      <button v-for="cat in categories" :key="cat.id" :class="['filter-btn', { active: selectedCategory === cat.id }]" @click="selectedCategory = cat.id">{{ cat.name }}</button>
    </div>

    <div class="chord-grid">
      <div v-for="chord in filteredChords" :key="chord.name" :class="['chord-card', { selected: selectedChord?.name === chord.name }]" @click="selectChord(chord)">
        <div class="chord-name">{{ chord.name }}</div>
        <div class="chord-type">{{ chord.type }}</div>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="selectedChord" class="chord-detail">
        <div class="detail-header">
          <h2>{{ selectedChord.name }}</h2>
          <button class="close-btn" @click="selectedChord = null">✕</button>
        </div>
        <div class="chord-info">
          <div class="info-row"><span class="label">Notes:</span><span class="value">{{ selectedChord.notes?.join(' - ') }}</span></div>
          <div class="info-row"><span class="label">Type:</span><span class="value">{{ selectedChord.type }}</span></div>
        </div>
        <div class="chord-actions">
          <button class="action-btn" @click="playChord">🔊 Play Sound</button>
          <button class="action-btn" @click="addToFavorites">{{ isFavorite ? '★ Saved' : '☆ Save' }}</button>
        </div>
      </div>
    </Transition>

    <div v-if="favorites.length" class="favorites-section">
      <h3>⭐ Your Favorites</h3>
      <div class="favorites-grid">
        <button v-for="fav in favorites" :key="fav" class="favorite-btn" @click="selectChordByName(fav)">{{ fav }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const selectedInstrument = ref('guitar')
const selectedCategory = ref('all')
const searchQuery = ref('')
const selectedChord = ref(null)
const favorites = ref([])

const instruments = [
  { id: 'guitar', name: 'Guitar', icon: '🎸' },
  { id: 'piano', name: 'Piano', icon: '🎹' },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'major', name: 'Major' },
  { id: 'minor', name: 'Minor' },
  { id: 'seventh', name: '7th' },
]

const chordDatabase = {
  guitar: [
    { name: 'C', type: 'Major', notes: ['C', 'E', 'G'] },
    { name: 'D', type: 'Major', notes: ['D', 'F#', 'A'] },
    { name: 'E', type: 'Major', notes: ['E', 'G#', 'B'] },
    { name: 'F', type: 'Major', notes: ['F', 'A', 'C'] },
    { name: 'G', type: 'Major', notes: ['G', 'B', 'D'] },
    { name: 'A', type: 'Major', notes: ['A', 'C#', 'E'] },
    { name: 'B', type: 'Major', notes: ['B', 'D#', 'F#'] },
    { name: 'Am', type: 'Minor', notes: ['A', 'C', 'E'] },
    { name: 'Bm', type: 'Minor', notes: ['B', 'D', 'F#'] },
    { name: 'Cm', type: 'Minor', notes: ['C', 'Eb', 'G'] },
    { name: 'Dm', type: 'Minor', notes: ['D', 'F', 'A'] },
    { name: 'Em', type: 'Minor', notes: ['E', 'G', 'B'] },
    { name: 'Fm', type: 'Minor', notes: ['F', 'Ab', 'C'] },
    { name: 'Gm', type: 'Minor', notes: ['G', 'Bb', 'D'] },
    { name: 'C7', type: '7th', notes: ['C', 'E', 'G', 'Bb'] },
    { name: 'D7', type: '7th', notes: ['D', 'F#', 'A', 'C'] },
    { name: 'E7', type: '7th', notes: ['E', 'G#', 'B', 'D'] },
    { name: 'G7', type: '7th', notes: ['G', 'B', 'D', 'F'] },
    { name: 'A7', type: '7th', notes: ['A', 'C#', 'E', 'G'] },
    { name: 'Am7', type: '7th', notes: ['A', 'C', 'E', 'G'] },
    { name: 'Em7', type: '7th', notes: ['E', 'G', 'B', 'D'] },
    { name: 'Dm7', type: '7th', notes: ['D', 'F', 'A', 'C'] },
  ],
  piano: [
    { name: 'C', type: 'Major', notes: ['C', 'E', 'G'] },
    { name: 'D', type: 'Major', notes: ['D', 'F#', 'A'] },
    { name: 'E', type: 'Major', notes: ['E', 'G#', 'B'] },
    { name: 'F', type: 'Major', notes: ['F', 'A', 'C'] },
    { name: 'G', type: 'Major', notes: ['G', 'B', 'D'] },
    { name: 'A', type: 'Major', notes: ['A', 'C#', 'E'] },
    { name: 'Am', type: 'Minor', notes: ['A', 'C', 'E'] },
    { name: 'Dm', type: 'Minor', notes: ['D', 'F', 'A'] },
    { name: 'Em', type: 'Minor', notes: ['E', 'G', 'B'] },
  ]
}

const filteredChords = computed(() => {
  let chords = chordDatabase[selectedInstrument.value] || []
  if (selectedCategory.value !== 'all') {
    const typeMap = { 'major': 'Major', 'minor': 'Minor', 'seventh': '7th' }
    chords = chords.filter(c => c.type === typeMap[selectedCategory.value])
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    chords = chords.filter(c => c.name.toLowerCase().includes(query))
  }
  return chords
})

const isFavorite = computed(() => selectedChord.value && favorites.value.includes(selectedChord.value.name))

function selectChord(chord) { selectedChord.value = chord }
function selectChordByName(name) {
  const chord = (chordDatabase[selectedInstrument.value] || []).find(c => c.name === name)
  if (chord) selectedChord.value = chord
}

function playChord() {
  if (!selectedChord.value?.notes) return
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const noteFreqs = { 'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'Eb': 311.13, 'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'Ab': 415.30, 'A': 440.00, 'A#': 466.16, 'Bb': 466.16, 'B': 493.88 }
    selectedChord.value.notes.forEach((note, i) => {
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.type = 'triangle'
      osc.frequency.value = noteFreqs[note] || 440
      gain.gain.setValueAtTime(0.25, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
      osc.connect(gain)
      gain.connect(audioContext.destination)
      osc.start(audioContext.currentTime + i * 0.03)
      osc.stop(audioContext.currentTime + 1.5)
    })
  } catch (e) {}
}

function addToFavorites() {
  if (!selectedChord.value) return
  const name = selectedChord.value.name
  if (favorites.value.includes(name)) favorites.value = favorites.value.filter(f => f !== name)
  else favorites.value.push(name)
  saveFavorites()
}

function saveFavorites() { try { localStorage.setItem('fp_chord_favorites', JSON.stringify(favorites.value)) } catch (e) {} }
function loadFavorites() { try { const saved = localStorage.getItem('fp_chord_favorites'); if (saved) favorites.value = JSON.parse(saved) } catch (e) {} }

onMounted(() => { loadFavorites() })
</script>

<style scoped>
.chord-library { max-width: 1000px; margin: 0 auto; padding: 24px; }
.library-header { text-align: center; margin-bottom: 32px; }
.library-header h1 { font-size: 2.5rem; margin: 0 0 8px; background: linear-gradient(135deg, #06c167, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { color: #8892a6; font-size: 1.1rem; margin: 0; }
.instrument-tabs { display: flex; justify-content: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.tab-btn { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; padding: 12px 24px; border-radius: 12px; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
.tab-btn:hover { border-color: #06c167; }
.tab-btn.active { background: linear-gradient(135deg, rgba(6, 193, 103, 0.2), rgba(0, 212, 255, 0.1)); border-color: #06c167; color: #fff; }
.search-bar { position: relative; max-width: 400px; margin: 0 auto 24px; }
.search-input { width: 100%; padding: 14px 20px 14px 48px; background: #1a1a2e; border: 2px solid #2a2a3e; border-radius: 12px; color: #fff; font-size: 1rem; outline: none; transition: border-color 0.3s; }
.search-input:focus { border-color: #06c167; }
.search-input::placeholder { color: #666; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.2rem; }
.category-filter { display: flex; justify-content: center; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; }
.filter-btn { background: #1a1a2e; border: 1px solid #2a2a3e; color: #8892a6; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
.filter-btn:hover { border-color: #06c167; color: #fff; }
.filter-btn.active { background: #06c167; border-color: #06c167; color: #fff; }
.chord-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; margin-bottom: 32px; }
.chord-card { background: #1a1a2e; border: 2px solid #2a2a3e; border-radius: 12px; padding: 16px; text-align: center; cursor: pointer; transition: all 0.2s; }
.chord-card:hover { border-color: #06c167; transform: translateY(-2px); }
.chord-card.selected { background: linear-gradient(135deg, rgba(6, 193, 103, 0.2), rgba(0, 212, 255, 0.1)); border-color: #06c167; }
.chord-card .chord-name { font-size: 1.5rem; font-weight: 700; color: #fff; }
.chord-card .chord-type { font-size: 0.8rem; color: #666; margin-top: 4px; }
.chord-detail { background: linear-gradient(135deg, #0f1424, #1a1f35); border: 2px solid #2a2a3e; border-radius: 20px; padding: 32px; margin-bottom: 32px; }
.detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.detail-header h2 { font-size: 2.5rem; margin: 0; color: #fff; }
.close-btn { background: none; border: none; color: #666; font-size: 1.5rem; cursor: pointer; padding: 8px; }
.close-btn:hover { color: #fff; }
.chord-info { margin-bottom: 24px; }
.info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #2a2a3e; }
.info-row .label { color: #666; width: 80px; }
.info-row .value { color: #fff; font-weight: 500; }
.chord-actions { display: flex; gap: 12px; justify-content: center; }
.action-btn { background: #1a1a2e; border: 2px solid #2a2a3e; color: #cfd6e6; padding: 12px 24px; border-radius: 10px; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: #06c167; }
.favorites-section { background: #0f1424; border: 1px solid #2a2a3e; border-radius: 16px; padding: 24px; }
.favorites-section h3 { color: #fff; margin-bottom: 16px; }
.favorites-grid { display: flex; gap: 8px; flex-wrap: wrap; }
.favorite-btn { background: #1a1a2e; border: 1px solid #2a2a3e; color: #cfd6e6; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.favorite-btn:hover { border-color: #06c167; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
