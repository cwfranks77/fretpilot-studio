<template>
  <div class="login-wrapper">
    <div class="panel">
      <h1>🔐 FretPilot Login</h1>
      <p class="tagline">Enter a username to personalize your session.</p>
      <form @submit.prevent="doLogin">
        <input v-model.trim="username" placeholder="Username" autocomplete="username" />
        <button :disabled="!username">Continue</button>
      </form>
      <p class="foot">No password needed (local only). Future cloud sync coming soon.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')

function doLogin() {
  if(!username.value) return
  const payload = { user: username.value, ts: Date.now() }
  localStorage.setItem('fretpilot-auth', JSON.stringify(payload))
  // Dispatch a custom event so App shell can react immediately
  window.dispatchEvent(new CustomEvent('fretpilot-auth-changed', { detail: payload }))
}
</script>

<style scoped>
.login-wrapper { display:flex; align-items:center; justify-content:center; min-height:calc(100vh - 60px); padding:20px; }
.panel { background:#0a0a0a; padding:40px 32px; border-radius:18px; width:100%; max-width:420px; box-shadow:0 12px 28px -8px rgba(0,0,0,0.45); color:#fff; border:1px solid #1a1a1a; }
h1 { margin:0 0 10px; font-size:32px; }
.tagline { margin:0 0 25px; color:#99a7bc; }
form { display:flex; gap:12px; }
input { flex:1; padding:12px 14px; border-radius:10px; border:1px solid #1a1a1a; background:#000; color:#fff; font-size:16px; }
button { padding:12px 22px; border:none; border-radius:10px; background:#06c167; color:#0d2818; font-weight:600; cursor:pointer; font-size:16px; }
button:disabled { opacity:0.45; cursor:not-allowed; }
.foot { margin-top:30px; font-size:12px; color:#6f7d91; }
</style>