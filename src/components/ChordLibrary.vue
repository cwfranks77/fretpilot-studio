<template>
  <div class="library-page">
    <img src="/images/chord-library.svg" alt="Chord Library" class="page-hero" />
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0;">
      <FeatureIcons icon="chord" :size="48" />
      <h2 style="margin: 0;">📚 Chord Library</h2>
    </div>
    <p class="subtitle">500+ chords with fingering diagrams</p>

    <div class="filters">
      <select v-model="rootFilter">
        <option value="">All Roots</option>
        <option v-for="note in notes" :key="note">{{ note }}</option>
      </select>
      
      <select v-model="typeFilter">
        <option value="">All Types</option>
        <option value="major">Major</option>
        <option value="minor">Minor</option>
        <option value="7th">7th Chords</option>
        <option value="sus">Suspended</option>
        <option value="extended">Extended</option>
      </select>

      <input v-model="searchQuery" placeholder="Search chords..." />
    </div>

    <div class="chord-grid">
      <div v-for="chord in filteredChords" :key="chord.name" class="chord-card" @click="selectChord(chord)">
        <h3>{{ chord.name }}</h3>
        <div class="chord-diagram">
          <div class="fretboard">
            <div v-for="s in 6" :key="s" class="string"></div>
            <div v-for="f in 5" :key="f" class="fret"></div>
          </div>
          <div class="fingers">
            <div v-for="(finger, i) in chord.fingers" :key="i" 
                 class="finger-dot"
                 :style="{left: `${finger.string * 16.6}%`, top: `${finger.fret * 20}%`}">
            </div>
          </div>
        </div>
        <button @click.stop="playChord(chord)" class="play-btn">🔊 Play</button>
      </div>
    </div>

    <div v-if="selectedChord" class="chord-detail-modal" @click="selectedChord = null">
      <div class="modal-content" @click.stop>
        <h2>{{ selectedChord.name }}</h2>
        <p class="formula">{{ selectedChord.formula }}</p>
        
        <div class="large-diagram">
          <!-- Detailed diagram would go here -->
          <p>Fingering: {{ selectedChord.fingering }}</p>
        </div>

        <div class="chord-info">
          <p><strong>Notes:</strong> {{ selectedChord.notes }}</p>
          <p><strong>Difficulty:</strong> {{ selectedChord.difficulty }}</p>
          <p><strong>Common in:</strong> {{ selectedChord.genres }}</p>
        </div>

        <button @click="playChord(selectedChord)" class="play-large">🔊 Play Chord</button>
        <button @click="selectedChord = null" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FeatureIcons from '../assets/logos/FeatureIcons.vue'

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const rootFilter = ref('')
const typeFilter = ref('')
const searchQuery = ref('')
const selectedChord = ref(null)

// Sample chord data
const chords = [
  { name: 'C Major', root: 'C', type: 'major', formula: '1-3-5', fingering: '032010', notes: 'C-E-G', difficulty: 'Beginner', genres: 'Pop, Rock, Folk', fingers: [{string:2,fret:0},{string:3,fret:2},{string:4,fret:0},{string:5,fret:1}] },
  { name: 'G Major', root: 'G', type: 'major', formula: '1-3-5', fingering: '320003', notes: 'G-B-D', difficulty: 'Beginner', genres: 'Pop, Rock, Country', fingers: [{string:1,fret:3},{string:2,fret:2},{string:5,fret:3}] },
  { name: 'D Major', root: 'D', type: 'major', formula: '1-3-5', fingering: 'xx0232', notes: 'D-F#-A', difficulty: 'Beginner', genres: 'Folk, Rock, Country', fingers: [{string:1,fret:2},{string:2,fret:3},{string:3,fret:2}] },
  { name: 'A Minor', root: 'A', type: 'minor', formula: '1-♭3-5', fingering: 'x02210', notes: 'A-C-E', difficulty: 'Beginner', genres: 'Pop, Rock, Classical', fingers: [{string:2,fret:2},{string:3,fret:2},{string:4,fret:1}] },
  { name: 'E Minor', root: 'E', type: 'minor', formula: '1-♭3-5', fingering: '022000', notes: 'E-G-B', difficulty: 'Beginner', genres: 'Rock, Metal, Folk', fingers: [{string:4,fret:2},{string:5,fret:2}] },
  { name: 'F Major', root: 'F', type: 'major', formula: '1-3-5', fingering: '133211', notes: 'F-A-C', difficulty: 'Intermediate', genres: 'Pop, Jazz, Classical', fingers: [{string:0,fret:1},{string:1,fret:1},{string:2,fret:2},{string:3,fret:3},{string:4,fret:3},{string:5,fret:1}] },
  { name: 'C7', root: 'C', type: '7th', formula: '1-3-5-♭7', fingering: '032310', notes: 'C-E-G-B♭', difficulty: 'Intermediate', genres: 'Blues, Jazz, Rock', fingers: [{string:1,fret:3},{string:2,fret:2},{string:3,fret:3},{string:5,fret:1}] },
  { name: 'G7', root: 'G', type: '7th', formula: '1-3-5-♭7', fingering: '320001', notes: 'G-B-D-F', difficulty: 'Intermediate', genres: 'Blues, Country, Rock', fingers: [{string:0,fret:1},{string:1,fret:3},{string:2,fret:2}] },
  { name: 'Dsus4', root: 'D', type: 'sus', formula: '1-4-5', fingering: 'xx0233', notes: 'D-G-A', difficulty: 'Beginner', genres: 'Rock, Pop, Folk', fingers: [{string:1,fret:3},{string:2,fret:3},{string:3,fret:2}] },
  { name: 'Asus2', root: 'A', type: 'sus', formula: '1-2-5', fingering: 'x02200', notes: 'A-B-E', difficulty: 'Beginner', genres: 'Rock, Pop, Alternative', fingers: [{string:3,fret:2},{string:4,fret:2}] },
  { name: 'Cmaj7', root: 'C', type: 'extended', formula: '1-3-5-7', fingering: 'x32000', notes: 'C-E-G-B', difficulty: 'Intermediate', genres: 'Jazz, Pop, Soul', fingers: [{string:2,fret:3},{string:4,fret:2}] },
  { name: 'Em7', root: 'E', type: '7th', formula: '1-♭3-5-♭7', fingering: '022030', notes: 'E-G-B-D', difficulty: 'Intermediate', genres: 'Jazz, Soul, R&B', fingers: [{string:1,fret:3},{string:4,fret:2},{string:5,fret:2}] },
]

const filteredChords = computed(() => {
  return chords.filter(c => {
    if (rootFilter.value && c.root !== rootFilter.value) return false
    if (typeFilter.value && c.type !== typeFilter.value) return false
    if (searchQuery.value && !c.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    return true
  })
})

function selectChord(chord) {
  selectedChord.value = chord
}

function playChord(chord) {
  console.log('Playing chord:', chord.name)
  // Audio playback would be implemented here
}
</script>

<style scoped>
.library-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
}

.page-hero { width: 100%; max-width: 600px; height: auto; margin: 0 auto 20px; display: block; border-radius: 12px; }

h2 { text-align: center; margin-bottom: 5px; }
.subtitle { text-align: center; color: #8892a6; margin-bottom: 20px; }

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.filters select,
.filters input {
  flex: 1;
  padding: 12px;
  background: #0a0a0a;
  color: #cfd6e6;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
  font-size: 1em;
}

.chord-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.chord-card {
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.chord-card:hover {
  transform: translateY(-5px);
  border-color: #06c167;
}

.chord-card h3 {
  text-align: center;
  margin: 0 0 10px 0;
  color: #fff;
}

.chord-diagram {
  position: relative;
  height: 120px;
  margin-bottom: 10px;
  background: #000;
  border-radius: 8px;
}

.fretboard {
  position: absolute;
  inset: 10px;
}

.string {
  position: absolute;
  width: 2px;
  height: 100%;
  background: #3a4358;
  left: calc(16.6% * var(--string));
}

.fret {
  position: absolute;
  width: 100%;
  height: 2px;
  background: #3a4358;
  top: calc(20% * var(--fret));
}

.play-btn {
  width: 100%;
  padding: 8px;
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  cursor: pointer;
}

.chord-detail-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
}

.modal-content h2 {
  margin-top: 0;
}

.formula {
  text-align: center;
  color: #06c167;
  font-size: 1.2em;
  margin-bottom: 20px;
}

.large-diagram {
  background: #000;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
}

.chord-info {
  background: #000;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.chord-info p {
  margin: 8px 0;
  color: #cfd6e6;
}

.play-large {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #06c167 0%, #09a557 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 700;
  margin-bottom: 10px;
}

.close-btn {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  cursor: pointer;
}
</style>
