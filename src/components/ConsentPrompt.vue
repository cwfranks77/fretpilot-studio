<template>
  <div v-if="visible" class="consent" role="dialog" aria-modal="true">
    <div class="box">
      <h4>Privacy & Analytics</h4>
      <p>We use minimal analytics to improve FretPilot and show relevant ads on mobile. Do you consent?</p>
      <div class="actions">
        <button @click="accept">Accept</button>
        <button class="secondary" @click="decline">Decline</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getConsent, setConsent } from '../services/consentService'
import { initAnalytics } from '../services/analyticsService'

const visible = ref(false)
onMounted(() => {
  const c = getConsent()
  visible.value = c == null
})

// Lock body scroll when modal is visible
watch(visible, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function accept(){ setConsent(true); initAnalytics(true); visible.value = false }
function decline(){ setConsent(false); initAnalytics(false); visible.value = false }
</script>

<style scoped>
.consent { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:10 }
.box { width:min(520px, 96%); background:#0a0a0a; color:#e7ecf7; padding:16px; border-radius:12px; border:1px solid #1a1a1a }
.actions { margin-top:12px; display:flex; gap:10px }
button { background:#5b74ff; color:#fff; border:none; border-radius:8px; padding:8px 12px; cursor:pointer }
.secondary { background:#1a1a1a; color:#cfdaec; border:1px solid #2a2a2a }
</style>
