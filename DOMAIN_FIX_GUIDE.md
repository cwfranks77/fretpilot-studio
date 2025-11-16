# FretPilot Domain DNS Configuration

## Current Status
- Domain: `fretpilotstudio.com` 
- Already attached to Vercel project: `fretpilot-studio`
- Status: **DNS Not Configured** (needs external registrar setup)

## Required DNS Records

Configure these at your domain registrar (Namecheap, GoDaddy, etc.):

### Option A: A Record (Recommended)
```
Type: A
Host/Name: @
Value/Points to: 76.76.21.21
TTL: 3600 (or Auto)
```

### For www subdomain
```
Type: CNAME
Host/Name: www
Value/Points to: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### Option B: Use Vercel Nameservers (Alternative)
If you want Vercel to manage all DNS:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## Steps to Configure

### If domain is at Namecheap:
1. Go to: https://ap.www.namecheap.com/domains/list
2. Find `fretpilotstudio.com` → Click "Manage"
3. Go to "Advanced DNS" tab
4. Add A record: `@ → 76.76.21.21`
5. Add CNAME record: `www → cname.vercel-dns.com`
6. Save and wait 5-30 minutes for propagation

### If domain is at GoDaddy:
1. Go to: https://dcc.godaddy.com/domains
2. Find `fretpilotstudio.com` → Click DNS
3. Add A record: `@ → 76.76.21.21`
4. Add CNAME record: `www → cname.vercel-dns.com`
5. Save and wait 5-30 minutes

### If domain is at another registrar:
1. Login to your domain registrar
2. Find DNS management for `fretpilotstudio.com`
3. Add the A and CNAME records above
4. Save changes

## Verification

After DNS propagates (5-30 minutes), run:

```powershell
nslookup fretpilotstudio.com
# Should return: 76.76.21.21

nslookup www.fretpilotstudio.com
# Should return CNAME to Vercel
```

Then test in browser:
```powershell
Start-Process "https://fretpilotstudio.com"
```

## Current State
✅ Domain attached to Vercel project
✅ SSL certificates ready to issue (once DNS configured)
❌ DNS not pointing to Vercel yet (registrar configuration needed)

Once DNS is configured, Vercel will automatically:
- Detect the A record
- Issue SSL certificates
- Make your app live at https://fretpilotstudio.com
