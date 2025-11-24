/**
 * firebaseAuth.js
 * Firebase Authentication service with multiple providers
 * Supports: Email/Password, Google Sign-In, Anonymous Auth
 */

import { getSecureJSON, setSecureJSON, removeSecure } from './secureStorage'

let auth = null
let firebaseInitialized = false

/**
 * Initialize Firebase Auth
 */
async function initFirebaseAuth() {
  if (firebaseInitialized) return auth

  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    const appId = import.meta.env.VITE_FIREBASE_APP_ID

    if (!apiKey || !authDomain || !projectId) {
      console.warn('[Firebase Auth] Configuration missing - using fallback local auth')
      return null
    }

    // Lazy load Firebase modules
    const [{ initializeApp, getApps }, { getAuth, onAuthStateChanged }] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth')
    ])

    // Initialize Firebase app if not already done
    if (getApps().length === 0) {
      initializeApp({
        apiKey,
        authDomain,
        projectId,
        appId
      })
    }

    auth = getAuth()
    firebaseInitialized = true

    // Set up auth state observer
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncUserToStorage(user)
      } else {
        await removeSecure('fretpilot-auth')
      }
      window.dispatchEvent(new Event('fretpilot-auth-changed'))
    })

    return auth
  } catch (e) {
    console.error('[Firebase Auth] Initialization failed:', e)
    return null
  }
}

/**
 * Sync Firebase user to encrypted storage
 */
async function syncUserToStorage(user) {
  const authData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    provider: user.providerData[0]?.providerId || 'anonymous',
    createdAt: user.metadata.creationTime,
    lastLogin: user.metadata.lastSignInTime
  }
  
  await setSecureJSON('fretpilot-auth', authData)
  return authData
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email, password, displayName) {
  try {
    const authInstance = await initFirebaseAuth()
    if (!authInstance) {
      throw new Error('Firebase not configured - using local auth')
    }

    const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth')
    
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password)
    
    // Update display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }

    // Send verification email
    await sendEmailVerification(userCredential.user)

    return {
      success: true,
      user: await syncUserToStorage(userCredential.user),
      message: 'Account created! Check your email for verification link.'
    }
  } catch (error) {
    console.error('[Firebase Auth] Sign up error:', error)
    return {
      success: false,
      error: formatAuthError(error)
    }
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
  try {
    const authInstance = await initFirebaseAuth()
    if (!authInstance) {
      throw new Error('Firebase not configured')
    }

    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password)

    return {
      success: true,
      user: await syncUserToStorage(userCredential.user)
    }
  } catch (error) {
    console.error('[Firebase Auth] Sign in error:', error)
    return {
      success: false,
      error: formatAuthError(error)
    }
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const authInstance = await initFirebaseAuth()
    if (!authInstance) {
      throw new Error('Firebase not configured')
    }

    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')

    const userCredential = await signInWithPopup(authInstance, provider)

    return {
      success: true,
      user: await syncUserToStorage(userCredential.user)
    }
  } catch (error) {
    console.error('[Firebase Auth] Google sign in error:', error)
    return {
      success: false,
      error: formatAuthError(error)
    }
  }
}

/**
 * Sign in anonymously (for trial/guest access)
 */
export async function signInAnonymously() {
  try {
    const authInstance = await initFirebaseAuth()
    if (!authInstance) {
      // Fallback to local anonymous auth
      const anonUser = {
        user: 'Guest',
        email: '',
        isAnonymous: true,
        uid: 'local-' + Date.now(),
        ts: Date.now()
      }
      await setSecureJSON('fretpilot-auth', anonUser)
      window.dispatchEvent(new Event('fretpilot-auth-changed'))
      return { success: true, user: anonUser }
    }

    const { signInAnonymously: firebaseSignInAnon } = await import('firebase/auth')
    const userCredential = await firebaseSignInAnon(authInstance)

    return {
      success: true,
      user: await syncUserToStorage(userCredential.user),
      isAnonymous: true
    }
  } catch (error) {
    console.error('[Firebase Auth] Anonymous sign in error:', error)
    return {
      success: false,
      error: formatAuthError(error)
    }
  }
}

/**
 * Upgrade anonymous account to permanent account
 */
export async function upgradeAnonymousAccount(email, password, displayName) {
  try {
    const authInstance = await initFirebaseAuth()
    if (!authInstance || !authInstance.currentUser) {
      throw new Error('No anonymous user to upgrade')
    }

    if (!authInstance.currentUser.isAnonymous) {
      throw new Error('User is not anonymous')
    }

    const { EmailAuthProvider, linkWithCredential, updateProfile } = await import('firebase/auth')
    
    const credential = EmailAuthProvider.credential(email, password)
    const userCredential = await linkWithCredential(authInstance.currentUser, credential)

    // Update display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }

    return {
      success: true,
      user: await syncUserToStorage(userCredential.user),
      message: 'Account upgraded successfully!'
    }
  } catch (error) {
    console.error('[Firebase Auth] Upgrade error:', error)
    return {
      success: false,
      error: formatAuthError(error)
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    const authInstance = await initFirebaseAuth()
    if (authInstance) {
      const { signOut: firebaseSignOut } = await import('firebase/auth')
      await firebaseSignOut(authInstance)
    }
    
    await removeSecure('fretpilot-auth')
    window.dispatchEvent(new Event('fretpilot-auth-changed'))
    
    return { success: true }
  } catch (error) {
    console.error('[Firebase Auth] Sign out error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email) {
  try {
    const authInstance = await initFirebaseAuth()
    if (!authInstance) {
      throw new Error('Firebase not configured')
    }

    const { sendPasswordResetEmail } = await import('firebase/auth')
    await sendPasswordResetEmail(authInstance, email)

    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.'
    }
  } catch (error) {
    console.error('[Firebase Auth] Password reset error:', error)
    return {
      success: false,
      error: formatAuthError(error)
    }
  }
}

/**
 * Get current user from encrypted storage
 */
export async function getCurrentUser() {
  try {
    // First check Firebase auth state
    const authInstance = await initFirebaseAuth()
    if (authInstance?.currentUser) {
      return await syncUserToStorage(authInstance.currentUser)
    }

    // Fallback to encrypted storage
    return await getSecureJSON('fretpilot-auth')
  } catch (error) {
    console.error('[Firebase Auth] Get current user error:', error)
    return null
  }
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Delete user account (GDPR compliance)
 */
export async function deleteAccount() {
  try {
    const authInstance = await initFirebaseAuth()
    if (!authInstance?.currentUser) {
      throw new Error('No user logged in')
    }

    const { deleteUser } = await import('firebase/auth')
    await deleteUser(authInstance.currentUser)
    
    await removeSecure('fretpilot-auth')
    window.dispatchEvent(new Event('fretpilot-auth-changed'))

    return {
      success: true,
      message: 'Account deleted successfully'
    }
  } catch (error) {
    console.error('[Firebase Auth] Delete account error:', error)
    return {
      success: false,
      error: formatAuthError(error)
    }
  }
}

/**
 * Format Firebase auth errors to user-friendly messages
 */
function formatAuthError(error) {
  const errorMap = {
    'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Try again or reset your password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/requires-recent-login': 'This action requires recent login. Please sign in again.'
  }

  return errorMap[error.code] || error.message || 'Authentication failed. Please try again.'
}

// Initialize on module load
initFirebaseAuth().catch(console.error)
