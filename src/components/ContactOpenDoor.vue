<template>
  <div class="contact-wrapper">
    <h2>📨 Direct Contact</h2>
    <p class="intro">Reach me personally. Constructive feedback, feature ideas, bugs, or just a hello — all welcome. I read every message.</p>
    <form @submit.prevent="submit" novalidate>
      <div class="field">
        <label for="c_name">Name</label>
        <input id="c_name" v-model="form.name" required maxlength="80" placeholder="Your name" />
      </div>
      <div class="field">
        <label for="c_email">Email</label>
        <input id="c_email" v-model="form.email" required type="email" maxlength="120" placeholder="you@example.com" />
      </div>
      <div class="field">
        <label for="c_subject">Subject</label>
        <input id="c_subject" v-model="form.subject" maxlength="120" placeholder="(Optional) Short subject" />
      </div>
      <div class="field">
        <label for="c_message">Message</label>
        <textarea id="c_message" v-model="form.message" required minlength="5" maxlength="5000" rows="8" placeholder="Share your thoughts..." />
      </div>
      <!-- Honeypot -->
      <input v-model="form._hp" class="hp" autocomplete="off" tabindex="-1" aria-hidden="true" />

      <div class="actions">
        <button :disabled="sending" class="send-btn">{{ sending ? 'Sending…' : 'Send Message' }}</button>
        <button type="button" class="cancel-btn" @click="$emit('close')">Cancel</button>
      </div>
    </form>

    <div v-if="error" class="alert error">
      <strong>Error:</strong> {{ error }}
    </div>
    <div v-if="success" class="alert success">
      <strong>✅ Delivered.</strong> Thank you! I usually respond within 24–48 hours.
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { sendContact } from '../services/contactService'

const form = reactive({ name: '', email: '', subject: '', message: '', _hp: '' })
const sending = ref(false)
const error = ref('')
const success = ref(false)

async function submit() {
  error.value = ''
  success.value = false
  if (sending.value) return
  try {
    // Basic front-end validation
    if (!form.name || !form.email || !form.message) {
      error.value = 'Please fill required fields.'
      return
    }
    sending.value = true
    const res = await sendContact({ ...form })
    sending.value = false
    if (res.ok) {
      success.value = true
      Object.assign(form, { name: '', email: '', subject: '', message: '', _hp: '' })
    } else {
      error.value = res.error || 'Failed to send.'
    }
  } catch (e) {
    sending.value = false
    error.value = 'Network or server error.'
  }
}
</script>

<style scoped>
.contact-wrapper { max-width: 680px; margin: 30px auto; background:#101214; padding:28px 30px; border-radius:16px; color:#fff; border:1px solid #1f2226; box-shadow:0 4px 16px rgba(0,0,0,0.4); }
.contact-wrapper h2 { margin:0 0 10px; font-size:1.9em; }
.intro { margin:0 0 20px; color:#9aa5b5; line-height:1.4; }
.field { display:flex; flex-direction:column; margin-bottom:16px; }
.field label { font-size:0.85em; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#b7c3d4; margin-bottom:6px; }
.field input, .field textarea { background:#1b1f24; border:1px solid #2a3139; color:#e8edf3; padding:10px 12px; border-radius:8px; font-size:14px; font-family:inherit; resize:vertical; }
.field input:focus, .field textarea:focus { outline:2px solid #3b82f6; border-color:#3b82f6; }
.actions { display:flex; gap:12px; align-items:center; margin-top:4px; }
.send-btn { background:#06c167; color:#fff; border:none; padding:12px 20px; border-radius:10px; cursor:pointer; font-weight:600; font-size:14px; }
.send-btn:disabled { opacity:0.5; cursor:not-allowed; }
.cancel-btn { background:#1b1f24; color:#cfd6e3; border:1px solid #2a3139; padding:12px 16px; border-radius:10px; cursor:pointer; font-size:14px; }
.alert { margin-top:20px; padding:14px 16px; border-radius:10px; font-size:14px; }
.alert.error { background:#2b1b1b; color:#ffb4b4; border:1px solid #5e2a2a; }
.alert.success { background:#132b1b; color:#9ae6b4; border:1px solid #1e5e3a; }
.hp { position:absolute; left:-9999px; width:1px; height:1px; opacity:0; }
</style>
