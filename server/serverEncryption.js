/**
 * serverEncryption.js
 * Server-side encryption for sensitive JSON files
 * Uses Node.js crypto module with AES-256-GCM
 */

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits for GCM
const AUTH_TAG_LENGTH = 16

// Store encryption key in environment variable or generate on first run
const KEY_FILE = path.join(__dirname, 'data', '.encryption-key')

/**
 * Get or create server encryption key
 */
function getOrCreateKey() {
  const envKey = process.env.SERVER_ENCRYPTION_KEY
  if (envKey) {
    // Use environment key (base64 encoded)
    return Buffer.from(envKey, 'base64')
  }

  // Check for stored key file
  try {
    if (fs.existsSync(KEY_FILE)) {
      return fs.readFileSync(KEY_FILE)
    }
  } catch (e) {
    console.warn('Could not read encryption key file:', e.message)
  }

  // Generate new key
  const key = crypto.randomBytes(KEY_LENGTH)
  
  // Store key file (ensure directory exists)
  try {
    const dir = path.dirname(KEY_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(KEY_FILE, key, { mode: 0o600 }) // Restrict to owner only
    console.log('Generated new server encryption key')
  } catch (e) {
    console.error('Failed to save encryption key:', e.message)
  }

  return key
}

const ENCRYPTION_KEY = getOrCreateKey()

/**
 * Encrypt data
 * @param {string|Buffer} data - Data to encrypt
 * @returns {Buffer} Encrypted data with IV and auth tag prepended
 */
function encrypt(data) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
    
    const plaintext = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()])
    const authTag = cipher.getAuthTag()

    // Combine: IV + authTag + ciphertext
    return Buffer.concat([iv, authTag, encrypted])
  } catch (e) {
    console.error('Encryption failed:', e)
    throw e
  }
}

/**
 * Decrypt data
 * @param {Buffer} encryptedData - Encrypted data with IV and auth tag
 * @returns {Buffer} Decrypted plaintext
 */
function decrypt(encryptedData) {
  try {
    const iv = encryptedData.slice(0, IV_LENGTH)
    const authTag = encryptedData.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
    const ciphertext = encryptedData.slice(IV_LENGTH + AUTH_TAG_LENGTH)

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
    decipher.setAuthTag(authTag)

    return Buffer.concat([decipher.update(ciphertext), decipher.final()])
  } catch (e) {
    console.error('Decryption failed:', e)
    throw e
  }
}

/**
 * Encrypt and write JSON file
 * @param {string} filePath - Path to output file
 * @param {Object} data - Data to encrypt and save
 */
function writeEncryptedJSON(filePath, data) {
  const json = JSON.stringify(data, null, 2)
  const encrypted = encrypt(json)
  
  // Ensure directory exists
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(filePath, encrypted)
}

/**
 * Read and decrypt JSON file
 * @param {string} filePath - Path to encrypted file
 * @returns {Object} Decrypted parsed JSON
 */
function readEncryptedJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const encrypted = fs.readFileSync(filePath)
  
  // Check if file is actually encrypted (has minimum size)
  if (encrypted.length < IV_LENGTH + AUTH_TAG_LENGTH + 10) {
    // Might be legacy plaintext JSON - try parsing directly
    try {
      return JSON.parse(encrypted.toString('utf8'))
    } catch (e) {
      console.error('File appears corrupt or invalid:', filePath)
      return null
    }
  }
  
  try {
    const decrypted = decrypt(encrypted)
    return JSON.parse(decrypted.toString('utf8'))
  } catch (e) {
    // Fallback: attempt to read as plaintext (legacy migration)
    try {
      return JSON.parse(encrypted.toString('utf8'))
    } catch (parseError) {
      console.error('Failed to decrypt or parse file:', filePath, e.message)
      return null
    }
  }
}

module.exports = {
  encrypt,
  decrypt,
  writeEncryptedJSON,
  readEncryptedJSON,
  ENCRYPTION_KEY // Export for testing only - DO NOT USE IN PRODUCTION CODE
}
