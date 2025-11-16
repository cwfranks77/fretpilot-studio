# DNS Setup Instructions for fretpilotstudio.com

## Current Status
- Domain shows "Non-existent" in public DNS (as of check)
- Vercel project is configured and waiting for DNS
- SSL will auto-issue once DNS propagates

## Required Action: Configure Nameservers at Your Registrar

You have **two options** to get your domain working:

---

## Option 1: Use Vercel Nameservers (Recommended)

Set these nameservers at your registrar:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Steps by Registrar:

#### GoDaddy
1. Go to: https://dcc.godaddy.com/domains
2. Click your domain → DNS / Nameservers
3. Click "Change Nameservers"
4. Select "Custom"
5. Enter:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
6. Save

#### Namecheap
1. Go to: https://www.namecheap.com/myaccount/domain-list/
2. Click "Manage" next to fretpilotstudio.com
3. Under "Nameservers", select "Custom DNS"
4. Enter:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
5. Click the checkmark to save

#### Cloudflare
1. Go to: https://dash.cloudflare.com
2. Select your domain
3. In the Overview tab, scroll to "Nameservers"
4. Change to:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
5. Save

#### Squarespace / Google Domains
1. Go to: https://domains.squarespace.com or https://domains.google.com
2. Select fretpilotstudio.com
3. Go to DNS settings
4. Change nameservers to:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
5. Save changes

---

## Option 2: Add DNS Records at Your Current Provider

If you prefer to keep your current nameservers, add these records in your registrar's DNS panel:

### A Record (Apex/Root)
- **Type:** A
- **Name/Host:** @ (or leave blank for root)
- **Value:** 76.76.21.21
- **TTL:** 3600 (or Auto)

### CNAME Record (WWW)
- **Type:** CNAME
- **Name/Host:** www
- **Value:** cname.vercel-dns.com
- **TTL:** 3600 (or Auto)

**Important:** 
- For the A record, use "@" or blank for the apex/root domain
- Do NOT enter "76.76.21.21" in a CNAME field (that causes the "should match ipv4" error)
- The www record must be Type CNAME pointing to the hostname cname.vercel-dns.com

---

## After Making Changes

### Propagation Time
- Nameserver changes: 15 minutes to 48 hours (usually 1-4 hours)
- DNS record changes: 5 minutes to 24 hours (usually under 1 hour)

### Verify DNS Propagation

From your project folder, run:

```powershell
npm run dns:verify
```

Or use the auto-wait script (checks every 15 seconds and opens the site when ready):

```powershell
npm run dns:wait
```

### Manual Check

```powershell
nslookup fretpilotstudio.com 8.8.8.8
```

You should see an answer with an IP address (not "Non-existent domain").

### Check HTTPS

Once DNS resolves, Vercel will automatically issue SSL certificates (usually within 5-15 minutes). You can verify by visiting:
- https://fretpilotstudio.com
- https://www.fretpilotstudio.com

---

## Troubleshooting

### "Non-existent domain" persists
- Verify nameservers are saved at your registrar
- Wait 1-4 hours for propagation
- Clear your local DNS cache: `ipconfig /flushdns`

### SSL certificate not issuing
- Confirm DNS resolves correctly first (use nslookup)
- Check Vercel Dashboard → Domains → fretpilotstudio.com for SSL status
- SSL typically issues within 15 minutes of correct DNS

### Still seeing errors
- Double-check you entered nameservers exactly: ns1.vercel-dns.com and ns2.vercel-dns.com
- Ensure no typos in DNS records if using Option 2
- Contact your registrar support if nameserver changes won't save

---

## Quick Links

- **Vercel Domain Dashboard:** https://vercel.com/dashboard/domains/fretpilotstudio.com
- **Check DNS Globally:** https://www.whatsmydns.net/#NS/fretpilotstudio.com
- **Check SSL:** https://www.ssllabs.com/ssltest/analyze.html?d=fretpilotstudio.com

---

**Need Help?** Tell me which registrar you're using and I can provide exact click-by-click steps.
