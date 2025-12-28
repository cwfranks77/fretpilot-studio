<template>
  <div class="admin-dashboard">
    <div class="admin-container">
      <header class="admin-header">
        <h1>🛠️ Developer Dashboard</h1>
        <p class="admin-subtitle">FretPilot Studio Admin Panel</p>
      </header>

      <!-- Quick Stats -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ testerCount }}</span>
            <span class="stat-label">Beta Testers</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" :style="{ width: (testerCount / maxTesters * 100) + '%' }"></div>
          </div>
          <span class="stat-detail">{{ maxTesters - testerCount }} spots remaining</span>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <span class="stat-value">{{ premiumStatus }}</span>
            <span class="stat-label">Your Status</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔧</div>
          <div class="stat-info">
            <span class="stat-value">{{ devModeStatus }}</span>
            <span class="stat-label">Developer Mode</span>
          </div>
        </div>
      </section>

      <!-- Tester Signup Link -->
      <section class="admin-section">
        <h2>📋 Tester Signup Link</h2>
        <p class="section-desc">Share this link with beta testers to give them free lifetime access:</p>
        <div class="link-box">
          <input type="text" :value="testerSignupUrl" readonly class="link-input" ref="linkInput" />
          <button @click="copyLink" class="copy-btn">{{ copied ? '✓ Copied!' : '📋 Copy' }}</button>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="admin-section">
        <h2>⚡ Quick Actions</h2>
        <div class="actions-grid">
          <button @click="toggleDevMode" class="action-btn">
            {{ isDeveloperMode ? '🔴 Disable Dev Mode' : '🟢 Enable Dev Mode' }}
          </button>
          <button @click="resetTesterCount" class="action-btn warning">
            🔄 Reset Tester Count
          </button>
          <button @click="clearAllData" class="action-btn danger">
            🗑️ Clear All Local Data
          </button>
        </div>
      </section>

      <!-- Registered Testers -->
      <section class="admin-section">
        <h2>👥 Registered Testers</h2>
        <div class="testers-list" v-if="testers.emails.length > 0 || testers.ids.length > 0">
          <div class="tester-item" v-for="email in testers.emails" :key="email">
            <span class="tester-icon">📧</span>
            <span class="tester-email">{{ email }}</span>
          </div>
          <div class="tester-item" v-for="id in testers.ids" :key="id">
            <span class="tester-icon">🆔</span>
            <span class="tester-id">{{ id }}</span>
          </div>
        </div>
        <p v-else class="no-testers">No testers registered yet.</p>
      </section>

      <!-- Creator Info -->
      <section class="admin-section">
        <h2>👤 Creator Account</h2>
        <div class="creator-info">
          <p><strong>Email:</strong> {{ creatorEmail }}</p>
          <p><strong>Current User:</strong> {{ currentUserEmail || 'Not signed in' }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  getTesterCount, 
  MAX_TESTERS, 
  getTesterSignupUrl, 
  getTesters,
  isDeveloperMode as checkDevMode,
  enableDeveloperMode,
  disableDeveloperMode,
  isPremium,
  CREATOR_EMAIL
} from '../services/featureFlags'

const testerCount = ref(0)
const maxTesters = ref(MAX_TESTERS)
const testerSignupUrl = ref('')
const testers = ref({ emails: [], ids: [] })
const copied = ref(false)
const isDeveloperMode = ref(false)
const creatorEmail = ref(CREATOR_EMAIL)
const currentUserEmail = ref('')

const premiumStatus = computed(() => isPremium() ? 'Premium' : 'Free')
const devModeStatus = computed(() => isDeveloperMode.value ? 'Enabled' : 'Disabled')

onMounted(() => {
  loadData()
})

function loadData() {
  testerCount.value = getTesterCount()
  testerSignupUrl.value = getTesterSignupUrl()
  testers.value = getTesters()
  isDeveloperMode.value = checkDevMode()
  currentUserEmail.value = localStorage.getItem('fretpilot-user-email') || ''
}

function copyLink() {
  navigator.clipboard.writeText(testerSignupUrl.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function toggleDevMode() {
  if (isDeveloperMode.value) {
    disableDeveloperMode()
  } else {
    enableDeveloperMode()
  }
  loadData()
}

function resetTesterCount() {
  if (confirm('Are you sure you want to reset the tester count to 0?')) {
    localStorage.setItem('fp_tester_count', '0')
    loadData()
  }
}

function clearAllData() {
  if (confirm('This will clear ALL FretPilot data from this browser. Are you sure?')) {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('fp_') || key.startsWith('fretpilot'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    loadData()
    alert('All FretPilot data cleared.')
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(180deg, #0a0a0f 0%, #0b0d15 100%);
}

.admin-container {
  max-width: 900px;
  margin: 0 auto;
}

.admin-header {
  text-align: center;
  margin-bottom: 40px;
}

.admin-header h1 {
  font-size: 2.5em;
  color: #fff;
  margin: 0 0 8px;
}

.admin-subtitle {
  color: #8892a6;
  font-size: 1.1em;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
}

.stat-icon {
  font-size: 2em;
  margin-bottom: 12px;
}

.stat-value {
  display: block;
  font-size: 2em;
  font-weight: 700;
  color: #06c167;
}

.stat-label {
  display: block;
  color: #8892a6;
  font-size: 0.9em;
  margin-top: 4px;
}

.stat-progress {
  background: #1a1a1a;
  border-radius: 4px;
  height: 8px;
  margin-top: 12px;
  overflow: hidden;
}

.progress-bar {
  background: #06c167;
  height: 100%;
  transition: width 0.3s;
}

.stat-detail {
  display: block;
  color: #666;
  font-size: 0.85em;
  margin-top: 8px;
}

.admin-section {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.admin-section h2 {
  color: #fff;
  font-size: 1.3em;
  margin: 0 0 12px;
}

.section-desc {
  color: #8892a6;
  margin: 0 0 16px;
}

.link-box {
  display: flex;
  gap: 12px;
}

.link-input {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9em;
  font-family: monospace;
}

.copy-btn {
  background: #06c167;
  border: none;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.copy-btn:hover {
  background: #05a557;
}

.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action-btn {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.action-btn.warning {
  border-color: #ffa500;
  color: #ffa500;
}

.action-btn.warning:hover {
  background: rgba(255, 165, 0, 0.1);
}

.action-btn.danger {
  border-color: #ff3366;
  color: #ff3366;
}

.action-btn.danger:hover {
  background: rgba(255, 51, 102, 0.1);
}

.testers-list {
  max-height: 200px;
  overflow-y: auto;
}

.tester-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #1a1a1a;
}

.tester-item:last-child {
  border-bottom: none;
}

.tester-icon {
  font-size: 1.2em;
}

.tester-email, .tester-id {
  color: #cfd6e6;
  font-family: monospace;
  font-size: 0.9em;
}

.no-testers {
  color: #666;
  font-style: italic;
}

.creator-info {
  color: #cfd6e6;
}

.creator-info p {
  margin: 8px 0;
}

.creator-info strong {
  color: #06c167;
}

@media (max-width: 600px) {
  .link-box {
    flex-direction: column;
  }
  
  .actions-grid {
    flex-direction: column;
  }
}
</style>

