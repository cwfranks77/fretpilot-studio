// config.js
// Resolution order for API base (first non-empty):
// 1. Vite build-time env: import.meta.env.VITE_API_BASE
// 2. LocalStorage override: fretpilot-api (user/dev override)
// 3. Fallback: http://localhost:5175
const viteBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : ''
export const API_BASE = viteBase || localStorage.getItem('fretpilot-api') || 'http://localhost:5175'

export function isApiConfigured() {
  return !!API_BASE
}

export async function postJSON(path, body) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
