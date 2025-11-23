# Domain Setup Guide - FretPilot Studio on Vercel

## Current State
- **Production URL**: https://fretpilot-studio-13brwwv8p-charles-franks-projects.vercel.app ✅ LIVE
- **Desired Domains**: 
  - fretpilotstudio.com (primary)
  - www.fretpilotstudio.com (www redirect)
  - thefranksstandard.com (store)
- **Registrar**: Namecheap
- **Hosting**: Vercel

---

## Step 1: Add Domains in Vercel (3 min)

### For fretpilotstudio.com
1. Open Vercel Dashboard: https://vercel.com/charles-franks-projects/fretpilot-studio
2. Go to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `fretpilotstudio.com`
5. Click **Add**
6. Vercel will show DNS configuration required

### For www subdomain
1. Click **Add Domain** again
2. Enter: `www.fretpilotstudio.com`
3. Vercel will recommend redirecting www → apex (or vice versa)
4. Choose: **Redirect www.fretpilotstudio.com to fretpilotstudio.com** (recommended)

### For thefranksstandard.com (store)
1. Click **Add Domain**
2. Enter: `thefranksstandard.com`
3. This will serve the store.html version (already configured in vercel.json rewrites)

---

## Step 2: Get DNS Records from Vercel

After adding domains, Vercel displays required DNS records. They typically look like:

### For Apex Domain (fretpilotstudio.com)
**Type**: `A`  
**Name**: `@`  
**Value**: `76.76.21.21` (Vercel's IP - **check your actual value in Vercel dashboard**)

**Type**: `AAAA` (optional IPv6)  
**Name**: `@`  
**Value**: `2606:4700:4700::1111` (example - **use Vercel's value**)

### For WWW Subdomain (www.fretpilotstudio.com)
**Type**: `CNAME`  
**Name**: `www`  
**Value**: `cname.vercel-dns.com.` (or specific project CNAME shown by Vercel)

### For Store Domain (thefranksstandard.com)
Same as apex domain above (A + AAAA records).

---

## Step 3: Configure DNS in Namecheap (5 min)

1. **Login to Namecheap**: https://www.namecheap.com/myaccount/login/
2. Go to **Domain List** → Click **Manage** next to fretpilotstudio.com
3. Select **Advanced DNS** tab
4. **Remove any existing A/CNAME records** for `@` and `www` hosts (if present)
5. Click **Add New Record** for each DNS entry:

### Add Apex Domain Records
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.21.21 | Automatic |
| CNAME Record | www | cname.vercel-dns.com. | Automatic |

(Replace IP/CNAME with actual values from Vercel dashboard)

### Add Store Domain (Repeat for thefranksstandard.com)
Manage → Advanced DNS → Add same A + CNAME records

6. Click **Save All Changes** (green checkmark)

---

## Step 4: Wait for DNS Propagation (5-30 min)

### Check Propagation Status
Use these tools to verify DNS updates:

```powershell
# Check A record
nslookup fretpilotstudio.com

# Check CNAME
nslookup www.fretpilotstudio.com

# Or use online tool:
# https://www.whatsmydns.net/#A/fretpilotstudio.com
```

Expected results:
- `fretpilotstudio.com` → Points to Vercel IP (76.76.21.21 or similar)
- `www.fretpilotstudio.com` → Points to `cname.vercel-dns.com`

Propagation typically takes:
- 5-15 minutes (fast)
- Up to 48 hours (worst case, but rare)

---

## Step 5: Verify in Vercel Dashboard

1. Go back to Vercel → **Settings** → **Domains**
2. Wait for domain status to change:
   - ❌ Invalid Configuration (red) → ⏳ Pending → ✅ Valid (green)
3. When green checkmark appears, SSL certificate auto-provisions (1-2 min)
4. Test HTTPS:
   - https://fretpilotstudio.com
   - https://www.fretpilotstudio.com (should redirect to non-www)

---

## Step 6: Update Environment Variables (Optional)

If you use absolute URLs in code, update `.env.production`:

```env
VITE_APP_URL=https://fretpilotstudio.com
VITE_STORE_URL=https://thefranksstandard.com
```

Then rebuild + redeploy:
```powershell
npm run build
vercel --prod
```

---

## Troubleshooting

### Issue: "Invalid Configuration" in Vercel after 30 min
**Cause**: DNS not updated or incorrect values  
**Fix**:
1. Verify DNS records match exactly (no typos)
2. Check for conflicting records (remove old A/CNAME)
3. Disable Namecheap's "Parking Page" if enabled
4. Flush DNS cache:
   ```powershell
   ipconfig /flushdns
   Clear-DnsClientCache
   ```

### Issue: HTTPS not working (mixed content errors)
**Cause**: SSL not provisioned yet  
**Fix**: Wait 5-10 min after DNS validation; Vercel auto-provisions Let's Encrypt cert

### Issue: www subdomain not redirecting
**Cause**: CNAME misconfigured  
**Fix**: Ensure CNAME points to Vercel's CNAME value (ends with `.vercel-dns.com.` - note trailing dot)

### Issue: Old cached site still showing
**Cause**: Browser cache or CDN cache  
**Fix**:
```powershell
# Hard refresh in browser
Ctrl + Shift + R  # Windows/Linux
Cmd + Shift + R   # Mac

# Or open incognito/private window
```

---

## DNS Record Examples (Copy-Paste Template for Namecheap)

### For fretpilotstudio.com
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com.
TTL: Automatic
```

### For thefranksstandard.com
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com.
TTL: Automatic
```

(🔴 **Important**: Get actual IP and CNAME from your Vercel dashboard - these are examples!)

---

## Post-Setup Checklist

- [ ] Domains added in Vercel
- [ ] DNS A records configured in Namecheap
- [ ] DNS CNAME records configured in Namecheap
- [ ] DNS propagated (check with nslookup or whatsmydns.net)
- [ ] Vercel shows green ✅ for all domains
- [ ] HTTPS works for primary domain
- [ ] www redirects to non-www (or vice versa)
- [ ] Store domain (thefranksstandard.com) serves store.html
- [ ] No mixed content warnings in browser console
- [ ] Privacy policy accessible at /privacy.html
- [ ] Google Analytics tracking (after getting real GA4 ID)

---

## Quick Test Commands

```powershell
# Test primary domain
curl -I https://fretpilotstudio.com

# Test www redirect
curl -I https://www.fretpilotstudio.com

# Test store domain
curl -I https://thefranksstandard.com

# All should return: HTTP/2 200 OK (or 301/308 for redirects)
```

---

## Next Steps After Domain Setup

1. **Update Play Store listing**: Use https://fretpilotstudio.com as website URL
2. **Update Privacy Policy**: Link from app should use custom domain
3. **Set up email**: Configure info@fretpilotstudio.com forwarding in Namecheap
4. **Social media**: Update bio links to custom domain
5. **Google Search Console**: Add property for new domain and submit sitemap

---

## Email Setup (Bonus)

Namecheap includes email forwarding:
1. Domain List → Manage → **Email Forwarding**
2. Add catch-all or specific aliases:
   - `info@fretpilotstudio.com` → your Gmail
   - `support@fretpilotstudio.com` → your Gmail
3. Professional emails ready at no extra cost!

---

## Estimated Timeline

| Step | Time |
|------|------|
| Add domains in Vercel | 3 min |
| Configure DNS in Namecheap | 5 min |
| DNS propagation wait | 5-30 min |
| SSL certificate provisioning | 1-2 min |
| **Total** | **15-45 min** |

Most users see domains live within 20 minutes!

---

## Support Resources

- **Vercel Domains Docs**: https://vercel.com/docs/concepts/projects/domains
- **Namecheap DNS Guide**: https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/
- **DNS Checker**: https://www.whatsmydns.net/
- **SSL Test**: https://www.ssllabs.com/ssltest/

Need help? Check Vercel support or DM @vercel on Twitter.
