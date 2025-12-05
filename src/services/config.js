// API configuration - handles missing backend gracefully
export const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5175'
  : ''

// Check if API is available
export async function isApiAvailable() {
  if (!API_BASE) return false
  try {
    const response = await fetch(`${API_BASE}/health`, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
    return response.ok
  } catch {
    return false
  }
}
