# BTCPay Server Setup Guide

## Overview

BTCPay Server is a free, self-hosted Bitcoin payment processor that allows you to accept Bitcoin payments without third-party fees or KYC requirements.

## Deployment Options

### Option 1: One-Click Cloud Deployment (Recommended for Beginners)

**LunaNode VPS:**
1. Visit https://launchbtcpay.lunanode.com
2. Create LunaNode account
3. Follow wizard (15 minutes setup)
4. Cost: ~$10/month
5. Includes: BTCPay + Bitcoin full node + Lightning

**Voltage Cloud:**
1. Visit https://voltage.cloud
2. Sign up for account
3. Create BTCPay instance
4. Cost: Starting at $10/month
5. Managed service (no maintenance)

### Option 2: Self-Hosted (Advanced)

**Docker on VPS:**

Requirements:
- Ubuntu 22.04 LTS
- 4GB RAM minimum (8GB recommended)
- 500GB storage (for full Bitcoin node)
- Static IP address

```bash
# Install BTCPay Server
cd /tmp
git clone https://github.com/btcpayserver/btcpayserver-docker
cd btcpayserver-docker

# Set domain and email
export BTCPAY_HOST="btcpay.yourdomain.com"
export REVERSEPROXY_DEFAULT_HOST="$BTCPAY_HOST"
export LETSENCRYPT_EMAIL="your@email.com"
export BTCPAY_ENABLE_SSH=true

# Run setup
./btcpay-setup.sh -i

# Wait 30-60 minutes for Bitcoin blockchain sync
```

**DNS Configuration:**
- Point `btcpay.yourdomain.com` → Your VPS IP
- Wait for DNS propagation (5-15 minutes)

### Option 3: Third-Party Node (Easiest)

Use BTCPay Server hosted by a third party (free tiers available):

1. **OpenNode** - https://opennode.com
   - Free tier: 1,000 transactions/month
   - Instant setup, no server needed
   
2. **BTCPay Jungle** - https://btcpayjungle.com
   - Community-hosted free instance
   - Good for testing

## Initial Configuration

### 1. Create Account

1. Access your BTCPay Server URL
2. Click "Register"
3. Create admin account
4. Save credentials securely

### 2. Create Store

1. Click "Stores" → "Create a new store"
2. Store Name: `FretPilot Premium`
3. Default Currency: `USD`
4. Click "Create"

### 3. Connect Bitcoin Wallet

**Option A: Use BTCPay Wallet (Recommended)**
1. Stores → Settings → Wallet
2. Click "Setup a wallet" → "Create a new wallet"
3. Select "Import wallet" → "Create a new seed"
4. **IMPORTANT:** Write down 12-word seed phrase
5. Store seed phrase securely (never digital, only paper)
6. Confirm wallet creation

**Option B: Connect External Wallet**
1. Get xpub from your hardware wallet (Ledger/Trezor)
2. Stores → Settings → Wallet
3. Click "Setup a wallet" → "Import wallet"
4. Paste xpub key
5. Save

### 4. Get Store ID and API Key

**Store ID:**
1. Stores → Settings → General
2. Copy "Store ID" (looks like: `ABC123...`)
3. Save for environment variable: `BTCPAY_STORE_ID`

**API Key:**
1. Account → Manage Account → API Keys
2. Click "Generate Key"
3. Label: `FretPilot Backend`
4. Permissions:
   - ✅ View invoices
   - ✅ Create invoice
   - ✅ Modify invoices
   - ✅ Modify stores webhooks
   - ✅ View your stores
5. Click "Generate"
6. Copy API Key (shown once!)
7. Save for environment variable: `BTCPAY_API_KEY`

### 5. Configure Webhook

1. Stores → Settings → Webhooks
2. Click "Create Webhook"
3. Payload URL: `https://your-backend.vercel.app/api/bitcoin/webhook`
4. Secret: Generate random string (save as `BTCPAY_WEBHOOK_SECRET`)
5. Events:
   - ✅ InvoiceCreated
   - ✅ InvoiceReceivedPayment
   - ✅ InvoiceProcessing
   - ✅ InvoiceSettled
   - ✅ InvoiceExpired
   - ✅ InvoiceInvalid
6. Click "Add webhook"

### 6. Test Setup

**Create test invoice:**

```bash
curl -X POST https://your-btcpay-server.com/api/v1/stores/YOUR_STORE_ID/invoices \
  -H "Authorization: token YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10,
    "currency": "USD",
    "checkout": {
      "speedPolicy": "HighSpeed"
    }
  }'
```

Expected response:
```json
{
  "id": "invoice_id_here",
  "checkoutLink": "https://your-btcpay-server.com/i/invoice_id"
}
```

## Environment Variables

Add to your backend (Vercel/server):

```bash
BTCPAY_SERVER_URL=https://your-btcpay-server.com
BTCPAY_STORE_ID=your_store_id_here
BTCPAY_API_KEY=your_api_key_here
BTCPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

For local development (`.env.local`):
```
BTCPAY_SERVER_URL=https://your-btcpay-server.com
BTCPAY_STORE_ID=ABC123...
BTCPAY_API_KEY=your_api_key
BTCPAY_WEBHOOK_SECRET=random_secret_string
```

## Payment Flow

1. User selects Bitcoin payment
2. Frontend calls `/api/bitcoin/create-invoice`
3. Backend creates BTCPay invoice
4. User sees Bitcoin address + QR code
5. User sends Bitcoin
6. BTCPay detects payment
7. Webhook notifies backend
8. Backend grants premium access

## Invoice Lifecycle

```
New → Processing → Settled
  ↓       ↓
Expired  Invalid
```

- **New:** Invoice created, awaiting payment
- **Processing:** Payment detected, waiting for confirmations
- **Settled:** Payment confirmed, funds secured
- **Expired:** Invoice timeout (default 15 minutes)
- **Invalid:** Payment issue (wrong amount, double-spend)

## Lightning Network (Optional)

Enable instant Bitcoin payments:

1. Stores → Settings → Lightning
2. Choose setup:
   - **LND:** Full control, requires technical knowledge
   - **Lightning Address:** Simple setup
3. Follow wizard
4. Lightning payments confirm instantly (no blockchain wait)

Cost: Free, but requires Lightning node setup

## Security Best Practices

✅ **Enable Two-Factor Authentication:**
- Account → Security → 2FA
- Use authenticator app (Google/Authy)

✅ **Restrict API Key Permissions:**
- Only grant necessary permissions
- Create separate keys for different services

✅ **Secure Webhook Endpoint:**
- Always verify webhook signatures
- Use HTTPS only

✅ **Backup Seed Phrase:**
- Write on paper (never digital)
- Store in fireproof safe
- Consider metal backup plate

✅ **Monitor Invoices:**
- Set up email notifications
- Check BTCPay dashboard regularly

## Maintenance

**Update BTCPay (Docker):**
```bash
cd /var/lib/docker/volumes/generated_btcpay_datadir/_data
btcpay-update.sh
```

**Check Bitcoin Sync Status:**
1. Server Settings → Services → Bitcoin
2. View sync percentage
3. Full sync takes 1-3 days initially

**Backup Wallet:**
1. Settings → Wallet → Export
2. Save backup file securely
3. Store seed phrase separately

## Troubleshooting

### Invoice not created
- Verify API key has "Create invoice" permission
- Check store ID matches environment variable
- Test API key with curl command

### Webhook not received
- Verify webhook URL is publicly accessible
- Check webhook secret matches environment
- Review webhook logs in BTCPay dashboard

### Payment not detecting
- Ensure Bitcoin node is fully synced
- Check wallet is properly connected
- Verify transaction sent to correct address

### Slow confirmations
- Normal: 10-60 minutes for first confirmation
- Use Lightning Network for instant payments
- Set `speedPolicy: "HighSpeed"` for 0-conf

## Cost Breakdown

**Self-Hosted:**
- VPS: $10-30/month (LunaNode, DigitalOcean, Hetzner)
- Domain: $10-15/year
- Total: ~$12-32/month

**Managed (Voltage):**
- Basic: $10/month
- Pro: $50/month (Lightning included)
- Enterprise: Custom pricing

**Third-Party (OpenNode):**
- Free: 1,000 txs/month
- Premium: 1% fee + $29/month

## Recommended Setup for FretPilot

**Production:**
- **Host:** Voltage Cloud ($10/month managed)
- **Lightning:** Enabled (instant payments)
- **Wallet:** BTCPay integrated wallet
- **Backup:** Automated daily backups

**Development:**
- **Host:** BTCPay Jungle (free)
- **Network:** Bitcoin Testnet
- **Wallet:** Testnet wallet (no real funds)

## Support Resources

- **Official Docs:** https://docs.btcpayserver.org
- **Community:** https://chat.btcpayserver.org (Mattermost)
- **GitHub:** https://github.com/btcpayserver/btcpayserver
- **Video Guides:** https://www.youtube.com/c/BTCPayServer

## Alternative: Coinbase Commerce

Simpler option (but with KYC requirements):

1. Sign up: https://commerce.coinbase.com
2. Create API key
3. Accept: BTC, ETH, LTC, USDC
4. Fees: 1% per transaction
5. Payouts: Automatic to Coinbase account

**When to use:**
- ✅ Want simplest setup
- ✅ Need multi-crypto support
- ✅ Don't mind KYC/custody
- ❌ Want full self-custody
- ❌ Need zero fees

---

**Current Status:**
- ✅ Backend endpoints ready (`/api/bitcoin/*`)
- ✅ Client service integrated
- ⚠️ Needs BTCPay Server instance
- ⚠️ Needs environment variables configured

**Next Step:** Choose deployment option and configure credentials.
