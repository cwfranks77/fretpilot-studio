<template>
  <div class="account-settings">
    <div class="settings-panel">
      <h1>⚙️ Account Settings</h1>

      <!-- User Profile -->
      <section class="profile-section">
        <h2>Profile</h2>
        <div class="profile-info">
          <div v-if="user.photoURL" class="avatar">
            <img :src="user.photoURL" :alt="user.displayName" />
          </div>
          <div v-else class="avatar-placeholder">
            {{ (user.displayName || 'U')[0].toUpperCase() }}
          </div>
          <div class="user-details">
            <p class="display-name">{{ user.displayName || 'User' }}</p>
            <p class="email">{{ user.email || 'No email' }}</p>
            <p v-if="user.isAnonymous" class="anonymous-badge">🎸 Guest Account</p>
            <p v-else-if="user.emailVerified" class="verified-badge">✅ Email Verified</p>
            <p v-else class="unverified-badge">⚠️ Email Not Verified</p>
          </div>
        </div>

        <!-- Upgrade Anonymous Account -->
        <div v-if="user.isAnonymous" class="upgrade-section">
          <h3>Upgrade to Permanent Account</h3>
          <p>Convert your guest account to a permanent account with email and password.</p>
          <button @click="showUpgradeModal = true" class="btn-upgrade">
            Upgrade Account
          </button>
        </div>

        <!-- Send Verification Email -->
        <div v-if="!user.isAnonymous && !user.emailVerified" class="verification-section">
          <p>Verify your email to enable account recovery.</p>
          <button @click="handleSendVerification" :disabled="loading">
            Send Verification Email
          </button>
        </div>
      </section>

      <!-- Account Actions -->
      <section class="actions-section">
        <h2>Account Actions</h2>
        
        <button @click="handlePasswordReset" class="btn-reset" :disabled="loading || user.isAnonymous">
          🔑 Reset Password
        </button>

        <button @click="showDeleteModal = true" class="btn-danger">
          🗑️ Delete Account
        </button>
      </section>

      <!-- Messages -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <!-- Upgrade Anonymous Account Modal -->
      <div v-if="showUpgradeModal" class="modal-overlay" @click="showUpgradeModal = false">
        <div class="modal" @click.stop>
          <h3>Upgrade Your Account</h3>
          <p>Create a permanent account with email and password to keep your progress safe.</p>
          
          <form @submit.prevent="handleUpgradeAccount">
            <input 
              v-model.trim="upgradeEmail" 
              placeholder="Email" 
              type="email"
              required
              :disabled="loading"
            />
            <input 
              v-model="upgradePassword" 
              placeholder="Password (min 6 chars)" 
              type="password"
              required
              minlength="6"
              :disabled="loading"
            />
            <input 
              v-model.trim="upgradeDisplayName" 
              placeholder="Display Name (optional)" 
              :disabled="loading"
            />
            
            <div class="modal-actions">
              <button type="submit" :disabled="!upgradeEmail || !upgradePassword || loading">
                {{ loading ? 'Upgrading...' : 'Upgrade Account' }}
              </button>
              <button type="button" @click="showUpgradeModal = false" class="cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Account Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal danger" @click.stop>
          <h3>⚠️ Delete Account</h3>
          <p>This action <strong>cannot be undone</strong>. All your data will be permanently deleted.</p>
          
          <div class="confirmation">
            <label>
              <input type="checkbox" v-model="deleteConfirmed" />
              I understand this action is permanent
            </label>
          </div>
          
          <div class="modal-actions">
            <button 
              @click="handleDeleteAccount" 
              class="btn-danger" 
              :disabled="!deleteConfirmed || loading"
            >
              {{ loading ? 'Deleting...' : 'Delete My Account' }}
            </button>
            <button @click="showDeleteModal = false" class="cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <button @click="$emit('close')" class="btn-back">
        ← Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  getCurrentUser, 
  upgradeAnonymousAccount, 
  sendPasswordReset, 
  deleteAccount 
} from '../services/firebaseAuth'

const emit = defineEmits(['close'])

const user = ref({
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  emailVerified: false,
  isAnonymous: false
})

const loading = ref(false)
const message = ref('')
const messageType = ref('info')

// Upgrade modal
const showUpgradeModal = ref(false)
const upgradeEmail = ref('')
const upgradePassword = ref('')
const upgradeDisplayName = ref('')

// Delete modal
const showDeleteModal = ref(false)
const deleteConfirmed = ref(false)

onMounted(async () => {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    user.value = currentUser
  }
})

function showMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

async function handleSendVerification() {
  loading.value = true
  try {
    const { sendEmailVerification } = await import('firebase/auth')
    const { getAuth } = await import('firebase/auth')
    const auth = getAuth()
    
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
      showMessage('Verification email sent! Check your inbox.', 'success')
    }
  } catch (error) {
    showMessage('Failed to send verification email. Try again later.', 'error')
  } finally {
    loading.value = false
  }
}

async function handleUpgradeAccount() {
  if (!upgradeEmail.value || !upgradePassword.value) return
  
  loading.value = true
  try {
    const result = await upgradeAnonymousAccount(
      upgradeEmail.value, 
      upgradePassword.value, 
      upgradeDisplayName.value
    )
    
    if (result.success) {
      showMessage('Account upgraded successfully!', 'success')
      showUpgradeModal.value = false
      // Refresh user data
      const updatedUser = await getCurrentUser()
      if (updatedUser) user.value = updatedUser
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Failed to upgrade account. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

async function handlePasswordReset() {
  if (!user.value.email) {
    showMessage('No email associated with this account.', 'error')
    return
  }
  
  loading.value = true
  try {
    const result = await sendPasswordReset(user.value.email)
    
    if (result.success) {
      showMessage(result.message, 'success')
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Failed to send password reset email.', 'error')
  } finally {
    loading.value = false
  }
}

async function handleDeleteAccount() {
  if (!deleteConfirmed.value) return
  
  loading.value = true
  try {
    const result = await deleteAccount()
    
    if (result.success) {
      showMessage('Account deleted. Goodbye!', 'success')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Failed to delete account. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.account-settings {
  min-height: calc(100vh - 60px);
  padding: 40px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
}

.settings-panel {
  max-width: 700px;
  margin: 0 auto;
  background: rgba(15, 15, 15, 0.95);
  padding: 40px 32px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
}

h1 {
  font-size: 2em;
  margin-bottom: 30px;
  text-align: center;
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

section {
  margin-bottom: 40px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

h2 {
  font-size: 1.4em;
  margin-bottom: 20px;
  color: #00d4ff;
}

h3 {
  font-size: 1.2em;
  margin-bottom: 15px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #00d4ff;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
  color: #fff;
}

.user-details {
  flex: 1;
}

.display-name {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 5px;
}

.email {
  color: #8892a6;
  margin-bottom: 8px;
}

.anonymous-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 165, 0, 0.2);
  border: 1px solid rgba(255, 165, 0, 0.4);
  border-radius: 999px;
  font-size: 0.9em;
  color: #ffa500;
}

.verified-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 999px;
  font-size: 0.9em;
  color: #06c167;
}

.unverified-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 0, 0.1);
  border: 1px solid rgba(255, 255, 0, 0.3);
  border-radius: 999px;
  font-size: 0.9em;
  color: #ffcc00;
}

.upgrade-section,
.verification-section {
  margin-top: 20px;
  padding: 20px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
}

.upgrade-section h3 {
  color: #00d4ff;
  margin-bottom: 10px;
}

.upgrade-section p,
.verification-section p {
  margin-bottom: 15px;
  color: #b0bac9;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-upgrade {
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  color: #fff;
}

.btn-upgrade:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
}

.btn-reset {
  background: #1a1a2e;
  color: #00d4ff;
  border: 1px solid #00d4ff;
  margin-right: 10px;
}

.btn-reset:hover:not(:disabled) {
  background: rgba(0, 212, 255, 0.1);
}

.btn-danger {
  background: rgba(220, 38, 38, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(220, 38, 38, 0.4);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.3);
  border-color: rgba(220, 38, 38, 0.6);
}

.btn-back {
  background: #1a1a2e;
  color: #8892a6;
  margin-top: 20px;
}

.btn-back:hover {
  background: #252540;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-weight: 500;
}

.message.success {
  background: rgba(6, 193, 103, 0.15);
  border: 1px solid rgba(6, 193, 103, 0.4);
  color: #06c167;
}

.message.error {
  background: rgba(220, 38, 38, 0.15);
  border: 1px solid rgba(220, 38, 38, 0.4);
  color: #ff6b6b;
}

.message.info {
  background: rgba(0, 212, 255, 0.15);
  border: 1px solid rgba(0, 212, 255, 0.4);
  color: #00d4ff;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: rgba(20, 20, 30, 0.98);
  padding: 32px;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal.danger {
  border-color: rgba(220, 38, 38, 0.4);
}

.modal h3 {
  color: #fff;
  margin-bottom: 15px;
}

.modal p {
  color: #b0bac9;
  margin-bottom: 20px;
  line-height: 1.6;
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal input {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1em;
}

.modal input:focus {
  outline: none;
  border-color: #00d4ff;
  background: rgba(255, 255, 255, 0.08);
}

.confirmation {
  margin: 20px 0;
}

.confirmation label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #b0bac9;
  cursor: pointer;
}

.confirmation input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
}

.modal-actions .cancel {
  background: #2a2a3e;
  color: #8892a6;
}

.modal-actions .cancel:hover {
  background: #35354f;
}

@media (max-width: 768px) {
  .settings-panel {
    padding: 24px 20px;
  }

  .profile-info {
    flex-direction: column;
    text-align: center;
  }

  .actions-section button {
    width: 100%;
  }
}
</style>
