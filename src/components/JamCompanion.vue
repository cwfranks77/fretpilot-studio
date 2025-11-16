<template>
  <section class="jam-companion">
    <img class="top-illustration" src="/images/jam-session.svg" alt="Jam session" />
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0;">
      <FeatureIcons icon="jam" :size="48" />
      <h2 style="margin: 0;">Jam Companion (Prototype)</h2>
    </div>
    <p class="subtitle">Generate a backing groove to practice over. (AI audio generation placeholder)</p>
    <form class="controls" @submit.prevent="generate">
      <label>Key
        <select v-model="key">
          <option>C</option><option>G</option><option>D</option><option>A</option><option>E</option>
        </select>
      </label>
      <label>Tempo
        <input type="number" v-model="tempo" min="60" max="240" />
      </label>
      <label>Style
        <select v-model="style">
          <option>Rock</option><option>Blues</option><option>Funk</option><option>Jazz</option><option>Metal</option>
        </select>
      </label>
      <button type="submit" :disabled="loading">{{ loading? 'Working…' : 'Generate Track' }}</button>
    </form>

    <div v-if="track" class="player">
      <h3>Generated Track</h3>
      <audio :src="track.url" controls />
      <p class="notes">Chord Progression: {{ track.progression.join(' - ') }}</p>
      <button @click="saveTrack">Save Progression</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import FeatureIcons from '../assets/logos/FeatureIcons.vue'
import { generateJamTrack } from '../services/aiService'
import { saveJamTrack } from '../services/progressService'

const key = ref('C')
const tempo = ref(100)
const style = ref('Rock')
const loading = ref(false)
const track = ref(null)

async function generate() {
  loading.value = true
  track.value = null
  try {
    track.value = await generateJamTrack({ key: key.value, tempo: tempo.value, style: style.value })
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
  }
}

function saveTrack() {
  if (track.value) {
    saveJamTrack(track.value)
    alert('Saved progression!')
  }
}
</script>

<style scoped>
.jam-companion { padding:16px; background:#000; color:#e1e7f2; min-height:100% }
.page-hero { width: 100%; max-width: 600px; height: auto; margin: 0 auto 16px; display: block; border-radius: 12px; }
.top-illustration { width:100%; max-width:800px; display:block; margin:0 auto 10px; border-radius:12px; border:1px solid #1a1a1a; background:#0a0a0a; animation: floatSlow 9s ease-in-out infinite }
@keyframes floatSlow { 0%{ transform:translateY(0)} 50%{ transform:translateY(-6px)} 100%{ transform:translateY(0)} }
.subtitle { color:#96a3bb }
.controls { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin:12px 0 }
select,input { width:100%; padding:8px; border-radius:8px; border:1px solid #1a1a1a; background:#0a0a0a; color:#e1e7f2 }
button { background:#6a5bff; border:none; color:#fff; padding:10px 14px; border-radius:8px; cursor:pointer }
.player { margin-top:16px; background:#0a0a0a; padding:14px; border-radius:12px; border:1px solid #1a1a1a }
.notes { color:#b1bccf }
</style>
