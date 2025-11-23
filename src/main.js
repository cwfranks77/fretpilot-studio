import { createApp } from 'vue'
import App from './App.vue'
import { initializeBilling } from './services/googlePlayBilling'
// Crashlytics (Firebase) placeholder integration for future use
// Requires google-services.json in android/app/ and Firebase config env vars
let crashlytics
async function initCrashlytics() {
	try {
		// Lazy load only if Firebase config present
		const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
		if (!apiKey) {
			console.log('[Crashlytics] Firebase config missing, skipping init')
			return
		}
		const [{ initializeApp }, { getAnalytics }] = await Promise.all([
			import('firebase/app'),
			import('firebase/analytics')
		])
		const appFb = initializeApp({
			apiKey,
			authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
			projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
			appId: import.meta.env.VITE_FIREBASE_APP_ID,
			measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
		})
		try { getAnalytics(appFb) } catch (_) {}
		// Web crashlytics not generally available; placeholder for native plugin
		// Placeholder; native Crashlytics will capture crashes. Web fallback throws synthetic error.
		crashlytics = { testCrash: () => { throw new Error('Test Crashlytics crash (web placeholder)') } }
		console.log('[Crashlytics] Initialized placeholder (web). Native will use plugin.')
	} catch (e) {
		console.warn('[Crashlytics] Init failed:', e.message)
	}
}

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
	// Log gracefully to avoid hard crashes that look like a white screen
	console.error('FretPilot runtime error:', err, info)
	
	// Track critical errors to GA4
	if (window.trackEvent) {
		window.trackEvent('error_report', {
			error_message: err?.message || String(err),
			error_info: info,
			component: instance?.$options?.name || 'unknown',
			platform: 'web'
		});
	}
}
app.mount('#app')

// Expose a global test crash trigger for internal QA
window.fretpilotTestCrash = () => {
	console.log('[Crashlytics] Triggering test crash')
	if (crashlytics?.testCrash) {
		crashlytics.testCrash()
	} else {
		throw new Error('Synthetic test crash: Crashlytics placeholder')
	}
}

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

// Initialize Crashlytics after billing attempt
initCrashlytics()
