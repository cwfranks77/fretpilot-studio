# Firebase Authentication Setup Guide

## Overview
FretPilot Studio now uses Firebase Authentication for production-ready user management with multiple sign-in providers.

## Features Implemented
- ✅ Email/Password Authentication
- ✅ Google Sign-In
- ✅ Anonymous Guest Accounts
- ✅ Account Upgrade (Guest → Permanent)
- ✅ Password Reset
- ✅ Account Deletion (GDPR Compliant)
- ✅ Email Verification
- ✅ Encrypted Local Storage
- ✅ Firebase UID Integration with Stripe

## Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `FretPilot Studio`
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Authentication Providers

#### Email/Password
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. Toggle **Enable**
4. Click **Save**

#### Google Sign-In
1. In **Sign-in method**, click **Google**
2. Toggle **Enable**
3. Set **Project public-facing name**: `FretPilot Studio`
4. Set **Project support email**: `your-email@example.com`
5. Click **Save**

#### Anonymous
1. In **Sign-in method**, click **Anonymous**
2. Toggle **Enable**
3. Click **Save**

### 3. Get Firebase Configuration

1. In Firebase Console, click the **gear icon** → **Project settings**
2. Scroll to **Your apps** section
3. Click **Web** icon (`</>`)
4. Register app:
   - App nickname: `FretPilot Web`
   - **Do NOT** check Firebase Hosting
   - Click **Register app**
5. Copy the `firebaseConfig` object values

### 4. Configure Environment Variables

Create or update `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...your-api-key
VITE_FIREBASE_AUTH_DOMAIN=fretpilot-studio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fretpilot-studio
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456

# Stripe Configuration (existing)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (existing)
VITE_STRIPE_PRICE_MONTHLY=price_...
VITE_STRIPE_PRICE_YEARLY=price_...
VITE_STRIPE_PRICE_PRO=price_...
```

### 5. Configure Firebase for Android (Optional)

If deploying to Android via Capacitor:

1. In Firebase Console → **Project settings**
2. Scroll to **Your apps** → Click **Android** icon
3. Register Android app:
   - **Package name**: `com.fretpilotstudio.app` (from `capacitor.config.json`)
   - **App nickname**: `FretPilot Android`
   - Click **Register app**
4. Download `google-services.json`
5. Place file in: `android/app/google-services.json`

### 6. Configure Google Sign-In for Android

1. Get SHA-1 certificate fingerprint:
   ```bash
   cd android
   ./gradlew signingReport
   ```
2. Copy SHA-1 fingerprint from output
3. In Firebase Console → **Project settings** → **Your apps** → **Android app**
4. Click **Add fingerprint**
5. Paste SHA-1 fingerprint
6. Click **Save**

### 7. Test Authentication

1. Start development server:
   ```bash
   npm run dev
   ```
2. Open app in browser: `http://localhost:5173`
3. Test each authentication method:
   - ✅ Sign up with email/password
   - ✅ Sign in with email/password
   - ✅ Sign in with Google
   - ✅ Continue as Guest
   - ✅ Password reset
   - ✅ Account settings (click username in header)
   - ✅ Delete account

## Architecture Overview

### Client-Side (`src/services/firebaseAuth.js`)
- Lazy loads Firebase SDK (only when needed)
- Handles all authentication operations
- Syncs user data to encrypted storage
- Dispatches `fretpilot-auth-changed` event on auth state changes

### Encrypted Storage (`src/services/secureStorage.js`)
- Uses AES-256-GCM encryption
- Stores auth data in localStorage
- Automatically migrates legacy plaintext data

### App Integration (`src/App.vue`)
- Listens for `fretpilot-auth-changed` event
- Updates UI based on auth state
- Displays username (clickable for account settings)

### Payment Integration (`src/components/StripeCheckout.vue`)
- Sends Firebase UID (`userId`) with Stripe checkout
- Server stores user payments by UID (fallback to email)

### Server Integration (`server/index.js`)
- Accepts `userId` in checkout session metadata
- Uses UID as primary key in `users.json.enc`
- Webhook handler updates premium status by UID

### Account Management (`src/components/AccountSettings.vue`)
- Profile display with avatar/email/verification status
- Upgrade anonymous accounts to permanent
- Password reset
- Email verification
- Delete account (GDPR compliant)

## Security Features

### Encryption
- **Client**: AES-256-GCM via Web Crypto API
- **Server**: AES-256-GCM via Node.js crypto
- **Keys**: Device-specific client keys, auto-generated server key

### Data Storage
- Auth data encrypted in localStorage
- Server user data encrypted in `users.json.enc`
- Firebase UIDs used as primary keys (more secure than email)

### Authentication Flow
1. User signs in via Firebase
2. Firebase returns user object with UID
3. User data synced to encrypted storage
4. App dispatches auth-changed event
5. UI updates automatically

### Payment Flow
1. User initiates checkout
2. Client extracts Firebase UID from encrypted storage
3. UID sent to server with Stripe checkout
4. Stripe webhook stores premium status by UID
5. Client checks premium status by UID

## Troubleshooting

### "Firebase not configured" Error
- Check `.env` file has all Firebase variables
- Verify variables start with `VITE_` prefix
- Restart dev server after `.env` changes

### Google Sign-In Not Working
- Verify Google provider enabled in Firebase Console
- Check authorized domains in Firebase Console → **Authentication** → **Settings**
- Add your domain to authorized list

### "Auth domain is not configured" Error
- Verify `VITE_FIREBASE_AUTH_DOMAIN` in `.env`
- Should match format: `project-id.firebaseapp.com`

### Anonymous Accounts Not Creating
- Verify Anonymous provider enabled in Firebase Console
- Check browser console for errors

### Stripe Integration Not Working
- User must be authenticated before checkout
- Check browser DevTools → Network → Payload for `userId` field
- Verify server receives `userId` in webhook metadata

## Migration from Local Auth

The app automatically migrates from old local-only auth:

1. Old auth data in `fretpilot-auth` (plaintext)
2. New auth data in `fretpilot-auth` (encrypted)
3. Firebase user synced on every auth state change
4. Premium status migrated by email → UID lookup

## Production Deployment

### Environment Variables
Set these in production hosting (Vercel, Netlify, etc.):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

### Firebase Security Rules
Default rules are secure (allow authenticated users only).

### Domain Authorization
Add production domain to Firebase Console:
1. **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Enter domain: `fretpilotstudio.com`

### Google Play Store Requirements
✅ Data Safety: "Encrypted at rest" ✅
✅ Data Safety: "Encrypted in transit" ✅
✅ Account deletion: Available in Account Settings ✅
✅ Account recovery: Password reset implemented ✅

## API Reference

### `firebaseAuth.js` Methods

```javascript
// Sign up with email/password
signUpWithEmail(email, password, displayName)
  → { success: boolean, message?: string, error?: string }

// Sign in with email/password
signInWithEmail(email, password)
  → { success: boolean, message?: string, error?: string }

// Sign in with Google popup
signInWithGoogle()
  → { success: boolean, message?: string, error?: string }

// Sign in anonymously (guest)
signInAnonymously()
  → { success: boolean, message?: string, error?: string }

// Upgrade anonymous account
upgradeAnonymousAccount(email, password, displayName)
  → { success: boolean, message?: string, error?: string }

// Send password reset email
sendPasswordReset(email)
  → { success: boolean, message?: string, error?: string }

// Delete current user account
deleteAccount()
  → { success: boolean, message?: string, error?: string }

// Get current user from encrypted storage
getCurrentUser()
  → { uid, email, displayName, photoURL, emailVerified, isAnonymous, ... } | null
```

### Server Endpoints

```javascript
// Create Stripe checkout session
POST /api/create-checkout-session
Body: { priceId, mode, successUrl, cancelUrl, userId, userEmail }
Response: { id: string } // Stripe session ID

// Get premium status
GET /api/premium/status?userId=<uid>&email=<email>
Response: { ok: boolean, premium: boolean, plan: string, updatedAt: string }

// Stripe webhook (internal)
POST /api/stripe/webhook
Headers: { stripe-signature: string }
Body: Stripe event payload
```

## Next Steps

1. **Configure Firebase** (follow setup instructions above)
2. **Test authentication** (all sign-in methods)
3. **Test payment flow** (verify UID in Stripe metadata)
4. **Test account management** (profile, upgrade, delete)
5. **Deploy to production** (set environment variables)
6. **Submit to Google Play** (data safety compliance met ✅)

## Support

For issues or questions:
- **Firebase**: [Firebase Documentation](https://firebase.google.com/docs/auth)
- **Stripe**: [Stripe Documentation](https://stripe.com/docs)
- **App Support**: cwfranks77@gmail.com
