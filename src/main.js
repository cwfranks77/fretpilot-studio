import { createApp } from 'vue'
import App from './App.vue'
import { quickEnableCreatorAccess } from './services/featureFlags'

// Make creator access function available globally
if (typeof window !== 'undefined') {
  window.enableFretPilotCreator = quickEnableCreatorAccess
}

// Mount the Vue app
createApp(App).mount('#app')
