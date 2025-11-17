# Vercel Domain Setup Guide for fretpilotstudio.com

## Current Issue
❌ www.fretpilotstudio.com and fretpilotstudio.com are not resolving (DNS: ERR_NAME_NOT_RESOLVED)

## Root Cause
The domain is not yet configured in Vercel, or DNS records are not pointing to Vercel's infrastructure.

---

## Solution: Complete Vercel Domain Setup

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in to your account (cwfranks77)
3. Find your **fretpilot-studio** project and click on it

### Step 2: Add Custom Domain
1. Click **Settings** in the top navigation
2. Click **Domains** in the left sidebar
3. Click **Add** or **Add Domain** button
4. Enter: `fretpilotstudio.com`
5. Click **Add**

**Vercel will show you one of two options:**

#### Option A: Use Vercel Nameservers (RECOMMENDED - Easiest)
Vercel will display:
```
To use this domain, update your nameservers at your domain registrar to:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
```

**Action Required:**
1. Go to your domain registrar (GoDaddy/Namecheap/Google Domains/etc.)
2. Find the DNS or Nameserver settings
3. Replace existing nameservers with Vercel's nameservers
4. Save changes
5. Return to Vercel and click **Verify** or **Refresh**

✅ **Benefits:**
- Vercel manages all DNS automatically
- SSL certificates auto-issued
- www redirect handled automatically
- Fastest propagation

#### Option B: Use Registrar DNS (Keep Current Nameservers)
Vercel will display specific DNS records to add:
```
Add these records at your domain registrar:
A Record:  @ → 76.76.21.21
CNAME:     www → cname.vercel-dns.com
```

**Action Required:**
1. Keep your current nameservers at your registrar
2. Add the **A record** shown by Vercel:
   - Type: `A`
   - Name/Host: `@` (or blank for root)
   - Value: `76.76.21.21`
   - TTL: `300` (or leave default)
3. Add the **CNAME record** shown by Vercel:
   - Type: `CNAME`
   - Name/Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `300` (or leave default)
4. Remove any conflicting A/AAAA/CNAME records for `@` and `www`
5. Return to Vercel and click **Verify** or **Refresh**

### Step 3: Add www Subdomain
After adding `fretpilotstudio.com`, add the www version:
1. In Vercel Domains settings, click **Add** again
2. Enter: `www.fretpilotstudio.com`
3. Click **Add**

Vercel will automatically:
- Detect it's a subdomain of your existing domain
- Configure the redirect from www → apex (already in your vercel.json)
- Issue SSL for both domains

### Step 4: Set Primary Domain
1. In the Domains list, find `fretpilotstudio.com`
2. Click the **⋯** menu next to it
3. Select **Set as Primary Domain**

This ensures:
- Vercel optimizes routing for this domain
- Preview URLs redirect properly
- Analytics track the correct domain

### Step 5: Verify SSL Certificate
Once DNS propagates (5-30 minutes typically):
1. Vercel will automatically issue SSL certificates
2. You'll see a green checkmark ✅ next to both domains
3. Status will change from "Pending" → "Valid"

---

## DNS Propagation Timeline
- **Immediate**: Changes saved at registrar
- **5-15 minutes**: Vercel detects changes
- **15-30 minutes**: Most global DNS servers updated
- **Up to 48 hours**: Maximum propagation time (rare)

---

## Verify Setup (Automated)

### Quick Check
Run this command after updating DNS:
```powershell
node scripts/dns-verify.js fretpilotstudio.com --www --wait 30 --interval 5
```

### Continuous Monitoring
Run this to poll until both domains are live:
```powershell
npm run dns:wait
```

This will:
- Check A record for fretpilotstudio.com → 76.76.21.21
- Check A record for www.fretpilotstudio.com → 76.76.21.21
- Test HTTPS connectivity for both
- Open both URLs in your browser when ready

---

## Troubleshooting

### "Invalid Configuration" Error
**Problem:** Vercel shows "Invalid Configuration" for www subdomain
**Solution:** 
- Make sure apex domain (fretpilotstudio.com) is added first
- www should be added second
- Verify CNAME points to `cname.vercel-dns.com` (not the A record)

### "DNS Record Not Found"
**Problem:** Vercel can't verify DNS records
**Solution:**
- Wait 5-10 more minutes for propagation
- Check records at your registrar are exactly as Vercel specified
- Use [whatsmydns.net](https://www.whatsmydns.net) to check global propagation
- Remove any conflicting CAA records

### "SSL Certificate Pending"
**Problem:** Domains show as valid but no SSL certificate
**Solution:**
- Wait 5-10 minutes; Let's Encrypt certificates take time to issue
- Click "Refresh" in Vercel Domains
- Check for CAA DNS records that might block Let's Encrypt

### Redirect Not Working
**Problem:** www doesn't redirect to apex
**Solution:**
- Verify `vercel.json` has the redirect rule (✅ already confirmed in your repo)
- Ensure www domain is added in Vercel Domains
- Clear browser cache (Ctrl+Shift+R)
- Try incognito mode

---

## Current Repository Configuration

✅ **vercel.json is correctly configured:**
```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "www.fretpilotstudio.com" }],
      "destination": "https://fretpilotstudio.com/$1",
      "permanent": true
    }
  ],
  "rewrites": [
    { "source": "/store", "destination": "/store.html" },
    { "source": "/store/(.*)", "destination": "/store.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This means once DNS is set up:
- ✅ www.fretpilotstudio.com → redirects to https://fretpilotstudio.com
- ✅ /store and /store/* → serve standalone store (store.html)
- ✅ All other routes → serve main app (index.html)

---

## Quick Reference: Domain Registrar Instructions

### GoDaddy
1. Log in → My Products → Domains → fretpilotstudio.com → DNS
2. **Option A (Nameservers):** Change Nameservers → Custom → Enter Vercel nameservers
3. **Option B (DNS):** Add Records → A record (@, 76.76.21.21) + CNAME (www, cname.vercel-dns.com)

### Namecheap
1. Domain List → Manage → Advanced DNS
2. **Option A:** Domain → Nameservers → Custom DNS → Enter Vercel nameservers
3. **Option B:** Add New Record → A Record + CNAME Record as specified

### Google Domains
1. My domains → fretpilotstudio.com → DNS
2. **Option A:** Name servers → Use custom name servers → Add Vercel nameservers
3. **Option B:** Resource records → Create new record → Add A + CNAME records

### Cloudflare
1. Select domain → DNS → Records
2. **Option A:** Overview → Change nameservers (if moving to Vercel)
3. **Option B:** Add A record + CNAME record, set Proxy status to "DNS only" (gray cloud)

---

## Expected Timeline to Go Live

| Time | Action | Status |
|------|--------|--------|
| **Now** | Update DNS at registrar | 🔄 You do this |
| **+5 min** | DNS propagation begins | 🔄 Automatic |
| **+15 min** | Vercel detects DNS | 🔄 Automatic |
| **+20 min** | SSL certificate issued | 🔄 Automatic |
| **+25 min** | Site live on custom domain | ✅ Complete |

---

## After Domain is Live

Once you see both domains with green checkmarks in Vercel:

1. **Test both URLs:**
   - https://fretpilotstudio.com
   - https://www.fretpilotstudio.com (should redirect to apex)

2. **Test standalone store:**
   - https://fretpilotstudio.com/store
   - https://www.fretpilotstudio.com/store (should redirect, then show store)

3. **Deploy latest code:**
   ```powershell
   git push origin main
   ```
   Vercel will auto-deploy to your custom domain

4. **Update punch list:**
   - ✅ Verify domain and SSL → Complete
   - Move to next: Deploy latest to Vercel

---

## Need Help?

**Can't find your registrar settings?**
Tell me your registrar name and I'll provide exact click-by-click instructions.

**Want me to monitor DNS for you?**
After you update DNS, let me know and I'll run the verification script and report status every 5 minutes.

**Ready to proceed?**
Confirm your registrar or that you've updated DNS, and I'll verify the setup and proceed to deploy the latest code.
