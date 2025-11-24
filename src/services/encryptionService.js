/**
 * encryptionService.js
 * Client-side encryption using Web Crypto API (AES-GCM)
 * Generates a device-specific key stored in localStorage (first-time setup)
 */

const KEY_STORAGE = 'fretpilot-enc-key'
const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256

/**
 * Generate or retrieve the encryption key
 */
async function getOrCreateKey() {
  try {
    // Check if key already exists
    const stored = localStorage.getItem(KEY_STORAGE)
    if (stored) {
      const keyData = JSON.parse(atob(stored))
      return await crypto.subtle.importKey(
        'raw',
        new Uint8Array(keyData),
        ALGORITHM,
        true,
        ['encrypt', 'decrypt']
      )
    }

    // Generate new key
    const key = await crypto.subtle.generateKey(
      { name: ALGORITHM, length: KEY_LENGTH },
      true,
      ['encrypt', 'decrypt']
    )

    // Store key (exported as raw bytes)
    const exported = await crypto.subtle.exportKey('raw', key)
    const keyArray = Array.from(new Uint8Array(exported))
    localStorage.setItem(KEY_STORAGE, btoa(JSON.stringify(keyArray)))

    return key
  } catch (e) {
    console.error('Encryption key setup failed:', e)
    throw e
  }
}

/**
 * Encrypt a string value
 * @param {string} plaintext - Data to encrypt
 * @returns {Promise<string>} Base64-encoded encrypted data with IV
 */
export async function encrypt(plaintext) {
  if (!plaintext || typeof plaintext !== 'string') return plaintext

  try {
    const key = await getOrCreateKey()
    const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for GCM
    const encoded = new TextEncoder().encode(plaintext)

    const ciphertext = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      encoded
    )

    // Combine IV + ciphertext for storage
    const combined = new Uint8Array(iv.length + ciphertext.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(ciphertext), iv.length)

    // Return as base64
    return btoa(String.fromCharCode(...combined))
  } catch (e) {
    console.error('Encryption failed:', e)
    return plaintext // Fallback to plaintext on error
  }
}

/**
 * Decrypt an encrypted string
 * @param {string} ciphertext - Base64-encoded encrypted data
 * @returns {Promise<string>} Decrypted plaintext
 */
export async function decrypt(ciphertext) {
  if (!ciphertext || typeof ciphertext !== 'string') return ciphertext

  try {
    const key = await getOrCreateKey()
    
    // Decode from base64
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0))
    
    // Extract IV (first 12 bytes) and encrypted data
    const iv = combined.slice(0, 12)
    const data = combined.slice(12)

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    )

    return new TextDecoder().decode(decrypted)
  } catch (e) {
    console.error('Decryption failed:', e)
    return ciphertext // Return as-is if decryption fails
  }
}

/**
 * Check if a value appears to be encrypted (base64 with sufficient length)
 */
export function isEncrypted(value) {
  if (!value || typeof value !== 'string') return false
  // Encrypted values are base64, minimum length ~24 chars
  return /^[A-Za-z0-9+/]+=*$/.test(value) && value.length > 20
}
