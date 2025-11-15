// config.js
export const API_BASE = localStorage.getItem('fretpilot-api') || 'http://localhost:5175'

export function isApiConfigured() {
  return !!API_BASE
}

export async function postJSON(path, body) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
