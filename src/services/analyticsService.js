// analyticsService.js
import { getConsent } from './consentService'
import { API_BASE, postJSON } from './config'

let enabled = false

export function initAnalytics(force){
  const c = force ?? getConsent()
  enabled = c === true
}

export function log(event, data={}){
  if(!enabled) return
  try {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event, data)
    if (API_BASE) postJSON('/api/analytics', { event, data, ts: Date.now() }).catch(()=>{})
  } catch{}
}
