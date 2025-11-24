/**
 * test-encryption.js
 * Verify client-side and server-side encryption functionality
 */

// Test client-side encryption (browser environment simulation)
async function testClientEncryption() {
  console.log('\n=== Testing Client-Side Encryption (Web Crypto API) ===\n')
  
  try {
    // Import encryption service
    const { encrypt, decrypt, isEncrypted } = require('../src/services/encryptionService')
    
    const testData = 'Test sensitive data: user@example.com'
    console.log('Original:', testData)
    
    const encrypted = await encrypt(testData)
    console.log('Encrypted:', encrypted)
    console.log('Is encrypted format:', isEncrypted(encrypted))
    console.log('Encrypted length:', encrypted.length)
    
    const decrypted = await decrypt(encrypted)
    console.log('Decrypted:', decrypted)
    
    if (decrypted === testData) {
      console.log('✅ Client-side encryption: PASS')
      return true
    } else {
      console.error('❌ Client-side encryption: FAIL - Data mismatch')
      return false
    }
  } catch (e) {
    console.error('❌ Client-side encryption: ERROR -', e.message)
    console.log('Note: Web Crypto API requires browser environment')
    return false
  }
}

// Test server-side encryption
function testServerEncryption() {
  console.log('\n=== Testing Server-Side Encryption (Node.js Crypto) ===\n')
  
  try {
    const { encrypt, decrypt, writeEncryptedJSON, readEncryptedJSON } = require('../server/serverEncryption')
    const fs = require('fs')
    const path = require('path')
    
    // Test 1: Raw encryption/decryption
    const testData = 'Sensitive server data'
    console.log('Original:', testData)
    
    const encrypted = encrypt(testData)
    console.log('Encrypted buffer length:', encrypted.length)
    console.log('Encrypted (hex preview):', encrypted.slice(0, 32).toString('hex') + '...')
    
    const decrypted = decrypt(encrypted)
    console.log('Decrypted:', decrypted.toString('utf8'))
    
    if (decrypted.toString('utf8') === testData) {
      console.log('✅ Server encryption/decryption: PASS')
    } else {
      console.error('❌ Server encryption/decryption: FAIL')
      return false
    }
    
    // Test 2: JSON file encryption
    const testFile = path.join(__dirname, '..', 'server', 'data', 'test-encrypted.json.enc')
    const testJSON = {
      users: {
        'test@example.com': { premium: true, plan: 'pro' }
      },
      timestamp: new Date().toISOString()
    }
    
    console.log('\nTest JSON:', JSON.stringify(testJSON, null, 2))
    writeEncryptedJSON(testFile, testJSON)
    console.log('✅ Encrypted JSON written to:', testFile)
    
    const readBack = readEncryptedJSON(testFile)
    console.log('Read back:', JSON.stringify(readBack, null, 2))
    
    if (JSON.stringify(readBack) === JSON.stringify(testJSON)) {
      console.log('✅ Server JSON encryption: PASS')
      
      // Cleanup
      fs.unlinkSync(testFile)
      console.log('Cleaned up test file')
      return true
    } else {
      console.error('❌ Server JSON encryption: FAIL - Data mismatch')
      return false
    }
  } catch (e) {
    console.error('❌ Server encryption: ERROR -', e.message)
    console.error(e.stack)
    return false
  }
}

// Test storage wrapper (requires browser environment)
async function testSecureStorage() {
  console.log('\n=== Testing Secure Storage Wrapper ===\n')
  
  try {
    // This requires browser localStorage - will fail in Node
    console.log('Note: Secure storage requires browser environment')
    console.log('Run this test in the browser console or with a DOM simulator')
    return null
  } catch (e) {
    console.error('Secure storage test requires browser environment')
    return null
  }
}

// Run all tests
async function runTests() {
  console.log('╔════════════════════════════════════════════════════╗')
  console.log('║       FretPilot Encryption Verification Test      ║')
  console.log('╚════════════════════════════════════════════════════╝')
  
  const results = {
    client: await testClientEncryption(),
    server: testServerEncryption(),
    storage: await testSecureStorage()
  }
  
  console.log('\n' + '='.repeat(54))
  console.log('Test Summary:')
  console.log('='.repeat(54))
  console.log('Client-side encryption:', results.client ? '✅ PASS' : '❌ FAIL (browser required)')
  console.log('Server-side encryption:', results.server ? '✅ PASS' : '❌ FAIL')
  console.log('Secure storage wrapper:', results.storage === null ? '⚠️  SKIP (browser required)' : results.storage ? '✅ PASS' : '❌ FAIL')
  
  const passed = Object.values(results).filter(r => r === true).length
  const total = Object.values(results).filter(r => r !== null).length
  
  console.log('\nResult:', `${passed}/${total} tests passed`)
  
  if (results.server) {
    console.log('\n✅ Server-side encryption is working correctly!')
    console.log('   All sensitive server data will be encrypted at rest.')
  }
  
  if (results.client === false) {
    console.log('\n⚠️  Client-side encryption requires browser Web Crypto API')
    console.log('   Test in browser console or run: npm run dev (then open browser)')
  }
  
  console.log('\n' + '='.repeat(54))
}

// Run tests
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testClientEncryption, testServerEncryption, testSecureStorage }
