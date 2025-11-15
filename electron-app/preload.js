// Preload script to capture renderer errors and expose a minimal API
const { contextBridge } = require('electron')

window.addEventListener('error', (e) => {
  console.log('[renderer error]', e.message, e.filename, e.lineno)
})
window.addEventListener('unhandledrejection', (e) => {
  console.log('[renderer unhandledrejection]', e.reason && e.reason.message)
})

contextBridge.exposeInMainWorld('fretpilot', {
  ping: () => '[fretpilot-preload] OK'
})
