<template>
  <div v-if="visible" class="capture-wrapper">
    <div class="panel">
      <h2>📸 Automated Screenshot Capture</h2>
      <p>Click start to cycle through core views and download PNG screenshots automatically to your browser Downloads folder.</p>
      <ol class="steps">
        <li v-for="(v,i) in views" :key="v" :class="{active: currentView===v}">{{ i+1 }}. {{ v }}</li>
      </ol>
      <div class="actions">
        <button @click="startCapture" :disabled="running">{{ running ? 'Capturing…' : 'Start Capture' }}</button>
        <button @click="visible=false" :disabled="running">Close</button>
      </div>
      <p v-if="status" class="status">{{ status }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import html2canvas from 'html2canvas'

// List of internal view keys matching App.vue routing logic
const views = ['home','ai','trainer','videolessons','practice','jam','pricing']
const currentView = ref('')
const running = ref(false)
const status = ref('')
const visible = ref(true)

function delay(ms){ return new Promise(r=>setTimeout(r, ms)) }

async function captureCurrent(view){
  // Wait a bit for layout & async content
  await delay(600)
  const el = document.querySelector('.content') || document.body
  const canvas = await html2canvas(el, {backgroundColor: '#000'})
  const dataURL = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = dataURL
  a.download = `fretpilot-${view}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function startCapture(){
  if(running.value) return
  running.value = true
  status.value = 'Starting…'
  for(const v of views){
    currentView.value = v
    status.value = `Loading view: ${v}`
    // Change global view via event so App.vue can react (or direct hack)
    try {
      window.dispatchEvent(new CustomEvent('fretpilot-set-view',{detail:{view:v}}))
      // Fallback: if App doesn't listen, attempt direct set on global Vue instance pattern.
      const appRoot = document.querySelector('#app')
    } catch(_) {}
    await delay(300)
    status.value = `Capturing: ${v}`
    await captureCurrent(v)
  }
  status.value = 'Done. Check your Downloads folder.'
  running.value = false
}
</script>
<style scoped>
.capture-wrapper { position: fixed; top: 30px; right: 30px; z-index: 9999; font-family: system-ui, sans-serif; }
.panel { background:#121820; color:#fff; padding:20px 22px; border:1px solid #1e3147; border-radius:14px; width:300px; box-shadow:0 8px 30px rgba(0,0,0,0.6); }
.panel h2 { margin:0 0 10px; font-size:18px; background:linear-gradient(90deg,#00d4ff,#0066ff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.steps { list-style:none; margin:0 0 12px; padding:0; max-height:140px; overflow:auto; font-size:13px; }
.steps li { padding:4px 6px; border-radius:6px; }
.steps li.active { background:#0d2b3d; color:#58d8ff; }
.actions { display:flex; gap:10px; margin-bottom:8px; }
button { flex:1; background:#163042; color:#cfefff; border:1px solid #25516b; padding:8px 10px; border-radius:8px; cursor:pointer; font-weight:600; font-size:13px; }
button:disabled { opacity:0.5; cursor:not-allowed; }
button:hover:not(:disabled) { background:#1e4259; }
.status { font-size:12px; color:#7fcfff; min-height:18px; }
</style>
