import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
	// Log gracefully to avoid hard crashes that look like a white screen
	console.error('FretPilot runtime error:', err, info)
}
app.mount('#app')
