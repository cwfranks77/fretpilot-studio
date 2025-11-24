/**
 * secureStorage.js
 * Encrypted wrapper around localStorage
 * Automatically encrypts on write, decrypts on read
 */

import { encrypt, decrypt, isEncrypted } from './encryptionService'

/**
 * Store encrypted data in localStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to encrypt and store
 */
export async function setSecure(key, value) {
  if (!value) {
    localStorage.removeItem(key)
    return
  }
  
  try {
    const encrypted = await encrypt(value)
    localStorage.setItem(key, encrypted)
  } catch (e) {
    console.error('Secure storage write failed:', e)
    // Fallback to unencrypted if encryption fails
    localStorage.setItem(key, value)
  }
}

/**
 * Retrieve and decrypt data from localStorage
 * @param {string} key - Storage key
 * @returns {Promise<string|null>} Decrypted value or null
 */
export async function getSecure(key) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return null

    // Check if value is encrypted
    if (isEncrypted(stored)) {
      return await decrypt(stored)
    }
    
    // Handle legacy unencrypted data
    // Automatically upgrade to encrypted on next write
    return stored
  } catch (e) {
    console.error('Secure storage read failed:', e)
    return localStorage.getItem(key) // Fallback to raw value
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function removeSecure(key) {
  localStorage.removeItem(key)
}

/**
 * Store encrypted JSON object
 * @param {string} key - Storage key
 * @param {Object} obj - Object to encrypt and store
 */
export async function setSecureJSON(key, obj) {
  await setSecure(key, JSON.stringify(obj))
}

/**
 * Retrieve and decrypt JSON object
 * @param {string} key - Storage key
 * @returns {Promise<Object|null>} Decrypted parsed object or null
 */
export async function getSecureJSON(key) {
  const value = await getSecure(key)
  if (!value) return null
  
  try {
    return JSON.parse(value)
  } catch (e) {
    console.error('JSON parse failed for secure storage:', e)
    return null
  }
}
