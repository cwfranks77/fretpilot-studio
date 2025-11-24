// consentService.js
import { getSecure, setSecure } from './secureStorage'

const KEY = 'fretpilot-consent'

export async function getConsent(){
  try { 
    const v = await getSecure(KEY)
    return v === null ? null : v === 'true' 
  } catch { return null }
}

export async function setConsent(v){
  try { await setSecure(KEY, v ? 'true' : 'false') } catch {}
}
