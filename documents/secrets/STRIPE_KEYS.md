# Stripe Keys

Store these in your secret manager and in GitHub/Vercel secrets.

- STRIPE_SECRET_KEY: Backend server key (sk_live...)
- STRIPE_PUBLIC_KEY: Frontend key (pk_live...)
- STRIPE_WEBHOOK_SECRET: Used to verify Stripe webhooks

Where to get:
- https://dashboard.stripe.com/apikeys
- Webhooks: https://dashboard.stripe.com/webhooks

Rotation:
- Rotate quarterly or if exposed
- Update both backend env and GitHub Actions secrets
