// consentService.js
const KEY = 'fretpilot-consent'

export function getConsent(){
  try { const v = localStorage.getItem(KEY); return v === null ? null : v === 'true' } catch { return null }
}
export function setConsent(v){
  try { localStorage.setItem(KEY, v ? 'true' : 'false') } catch {}
}
