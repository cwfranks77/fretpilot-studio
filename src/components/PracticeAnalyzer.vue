<template>
  <section class="practice-analyzer">
    <img class="top-illustration" src="/images/practice-tips.svg" alt="Practice tips" />
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0;">
      <FeatureIcons icon="practice" :size="48" />
      <h2 style="margin: 0;">Practice Analyzer (Beta)</h2>
    </div>
    <p class="subtitle">Record a short riff (up to 20s). We analyze timing & consistency and suggest micro-drills.</p>

    <div class="controls">
      <button @click="toggleRecording" :disabled="processing">{{ recording? 'Stop Recording' : 'Start Recording' }}</button>
      <button @click="analyze" :disabled="!blob || processing">Analyze</button>
    </div>

    <p v-if="processing">Processing audio…</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="result" class="result">
      <h3>Results</h3>
      <ul>
        <li><strong>Estimated Tempo:</strong> {{ result.tempo }} BPM</li>
        <li><strong>Timing Stability:</strong> {{ result.stability }}%</li>
        <li><strong>Suggested Focus:</strong> {{ result.focus }}</li>
      </ul>
      <h4>Micro-Drills</h4>
      <ol>
        <li v-for="(d,i) in result.drills" :key="i">{{ d }}</li>
      </ol>
      <MistakeHeatmap v-if="result.heatmap" :heatmap="result.heatmap" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { analyzePractice } from '../services/aiService'
import { log } from '../services/analyticsService'
import MistakeHeatmap from './MistakeHeatmap.vue'

let mediaRecorder
const chunks = []
const recording = ref(false)
const blob = ref(null)
const processing = ref(false)
const error = ref('')
const result = ref(null)

async function toggleRecording() {
  if (!recording.value) {
    error.value = ''
    result.value = null
    blob.value = null
    chunks.length = 0
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.ondataavailable = e => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        blob.value = new Blob(chunks, { type: 'audio/webm' })
      }
      mediaRecorder.start()
      recording.value = true
      setTimeout(() => { if(recording.value) toggleRecording() }, 20000) // auto-stop after 20s
    } catch (e) {
      error.value = 'Mic access denied.'
      console.warn(e)
    }
  } else {
    mediaRecorder && mediaRecorder.stop()
    recording.value = false
  }
}

async function analyze() {
  if (!blob.value) return
  processing.value = true
  error.value = ''
  try {
    result.value = await analyzePractice(blob.value)
    log('practice_analyzed', { tempo: result.value.tempo, stability: result.value.stability })
  } catch (e) {
    error.value = 'Analysis failed.'
    console.warn(e)
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
.practice-analyzer { padding:16px; background:#000; color:#e6ebf5; min-height:100% }
.page-hero { width: 100%; max-width: 800px; height: auto; margin: 0 auto 16px; display: block; border-radius: 12px; }
.top-illustration { width:100%; max-width:800px; display:block; margin:0 auto 10px; border-radius:12px; border:1px solid #1a1a1a; background:#0a0a0a; animation: floatSlow 10s ease-in-out infinite }
@keyframes floatSlow { 0%{ transform:translateY(0)} 50%{ transform:translateY(-6px)} 100%{ transform:translateY(0)} }
.subtitle { color:#9ba9c0 }
.controls { display:flex; gap:12px; margin:12px 0 }
button { background:#4d89ff; border:none; color:#fff; padding:10px 14px; border-radius:8px; cursor:pointer }
.error { color:#ff7b7b }
.result { margin-top:16px; background:#0a0a0a; padding:14px; border:1px solid #1a1a1a; border-radius:12px }
</style>
