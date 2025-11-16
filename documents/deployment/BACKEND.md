# Backend Deployment (Vercel)

## Steps

1. Install Vercel CLI and login
2. Deploy `server/` directory to production
3. Configure environment variables in Vercel dashboard
4. Test endpoints: `/api/health`, `/api/bitcoin/*`, `/api/stripe/*`, `/api/dropship/*`

## Env Vars (Vercel)
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- BTCPAY_SERVER_URL, BTCPAY_STORE_ID, BTCPAY_API_KEY, BTCPAY_WEBHOOK_SECRET
- PRINTFUL_API_KEY, SPOCKET_API_KEY
- SHIPSTATION_API_KEY, SHIPSTATION_API_SECRET
- APP_URL
