import { createApp } from 'vue'
import App from './App.vue'
import { initializeBilling } from './services/googlePlayBilling'

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
	// Log gracefully to avoid hard crashes that look like a white screen
	console.error('FretPilot runtime error:', err, info)
}
app.mount('#app')

// Initialize Google Play Billing after app mounts
if (window.cordova) {
	document.addEventListener('deviceready', () => {
		console.log('[App] Device ready, initializing billing...')
		initializeBilling().then(result => {
			if (result.success) {
				console.log('[App] Billing initialized successfully')
			} else {
				console.warn('[App] Billing initialization failed:', result.error)
			}
		})
	})
} else {
	// For web platform, try to initialize anyway (will use fallback)
	setTimeout(() => {
		initializeBilling().then(result => {
			console.log('[App] Billing check:', result.success ? 'ready' : 'not available')
		})
	}, 1000)
}
