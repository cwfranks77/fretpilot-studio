# Secrets Inventory

Store the following secrets securely. Do NOT commit real values to the repository.

## Payments

- Stripe API Keys
  - STRIPE_SECRET_KEY
  - STRIPE_PUBLIC_KEY
  - STRIPE_WEBHOOK_SECRET
- BTCPay Server
  - BTCPAY_SERVER_URL
  - BTCPAY_STORE_ID
  - BTCPAY_API_KEY
  - BTCPAY_WEBHOOK_SECRET

## Mobile Stores

- Google Play Console
  - Service Account JSON (for CI deployments)
  - App Signing Keystore (Android)
  - Keystore Passwords: KEYSTORE_PASSWORD, KEY_PASSWORD, KEY_ALIAS
- Apple Developer
  - Apple Distribution Certificate (.p12)
  - Provisioning Profiles (App Store)
  - App-specific Password (for Transporter, optional)

## Windows Code Signing

- PFX Certificate file (code signing)
- Certificate password

## Dropshipping & Shipping

- PRINTFUL_API_KEY
- SPOCKET_API_KEY
- SHIPSTATION_API_KEY
- SHIPSTATION_API_SECRET

## Hosting / CI

- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- ANDROID_KEYSTORE_BASE64 (GitHub Actions)
- WIN_CERT_BASE64 (GitHub Actions)
- WIN_CERT_PASSWORD (GitHub Actions)

## Frontend (.env.local)

- VITE_API_URL
- VITE_STRIPE_PUBLIC_KEY
- VITE_BTCPAY_SERVER_URL (optional)

