<template>
  <div>
    <slot v-if="!hasError" />
    <div v-else class="error-fallback">
      <h2>Something went wrong</h2>
      <p class="msg">An error occurred while rendering this section.</p>
      <pre class="details" v-if="showDetails">{{ errorMessage }}</pre>
      <button @click="reset">Try Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const emit = defineEmits(['reset'])
const hasError = ref(false)
const errorMessage = ref('')
const showDetails = ref(false)

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = String(err?.stack || err?.message || err)
  // prevent further propagation so we can show fallback instead of white screen
  return false
})

function reset(){
  hasError.value = false
  errorMessage.value = ''
  emit('reset')
}
</script>

<style scoped>
.error-fallback { 
  padding: 24px; 
  background: #0a0a0a; 
  color: #e7ecf7; 
  border: 1px solid #1a1a1a; 
  border-radius: 12px; 
  max-width: 720px; 
  margin: 40px auto; 
  text-align: center;
}
.msg { color:#a4aec5; margin: 6px 0 14px }
.details { 
  text-align: left; 
  background: #000; 
  color: #c7d2ea; 
  padding: 12px; 
  border-radius: 8px; 
  overflow:auto; 
  max-height: 200px; 
  margin: 0 auto 12px;
}
button { background:#06c167; border:none; color:#0b1c12; padding:10px 14px; border-radius:8px; cursor:pointer }
</style>
