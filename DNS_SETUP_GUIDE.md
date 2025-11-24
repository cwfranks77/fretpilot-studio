# Namecheap DNS Configuration for fretpilotstudio.com
**Created: November 23, 2025**

## Current Problem
Vercel shows "Invalid Configuration" for `fretpilotstudio.com` because the DNS records don't point to Vercel's servers.

## What You Need To Do
You're in Namecheap → Domain List → Manage → **Advanced DNS** tab.
Look for the section titled "HOST RECORDS" (it's a table with columns: Type, Host, Value, TTL).

---

## STEP 1: Remove Old/Conflicting Records

Look through your HOST RECORDS table and **DELETE** these if they exist:

### Records to DELETE:
- ❌ Any **URL Redirect Record** with Host `@` or `www`
- ❌ Any **A Record** with Host `@` that points to parking IPs like:
  - 198.54.*.*
  - 192.64.*.*
  - Any IP that is NOT `76.76.21.21`
- ❌ Any **A Record** with Host `www` (www should use CNAME, not A)
- ❌ Any **CNAME Record** with Host `@` (apex can't use CNAME on Namecheap)

**How to delete:**
- Click the trash/bin icon on the right side of each unwanted record
- Confirm deletion

---

## STEP 2: Add/Edit the ROOT (Apex) Record

### What to Create/Edit:
Find or create an **A Record** for the root domain.

**Click "ADD NEW RECORD"** (big button above the table) and select **A Record**, then fill in:

```
┌─────────────────────────────────────────────────┐
│ Type:  A Record                                 │
│ Host:  @                                        │
│ Value: 76.76.21.21                             │
│ TTL:   Automatic                                │
└─────────────────────────────────────────────────┘
```

**Explanation:**
- **Type:** Must be "A Record" (selectable from dropdown)
- **Host:** The `@` symbol means "the root domain" (fretpilotstudio.com)
- **Value:** This is Vercel's IP address that your domain must point to
- **TTL:** Leave as "Automatic" (or you can set 300-600 seconds)

**After filling, click the GREEN CHECKMARK** ✓ to save.

---

## STEP 3: Add/Edit the WWW Subdomain Record

### What to Create/Edit:
Find or create a **CNAME Record** for www subdomain.

**Click "ADD NEW RECORD"** and select **CNAME Record**, then fill in:

```
┌─────────────────────────────────────────────────┐
│ Type:  CNAME Record                             │
│ Host:  www                                      │
│ Value: cname.vercel-dns.com                    │
│ TTL:   Automatic                                │
└─────────────────────────────────────────────────┘
```

**OR if Vercel shows a specific target in your domain settings, use that instead:**
```
Value: fretpilot-studio-XXXXX.vercel-dns.com
```
(Check Vercel → Project Settings → Domains → click on www entry to see recommended CNAME)

**Explanation:**
- **Type:** Must be "CNAME Record"
- **Host:** `www` (this creates www.fretpilotstudio.com)
- **Value:** Vercel's DNS endpoint (this tells www to follow Vercel's servers)
- **TTL:** Automatic

**After filling, click the GREEN CHECKMARK** ✓ to save.

---

## STEP 4: Keep These Records (Don't Touch)

**LEAVE ALONE** if they exist:
- ✅ **MX Records** (for email) - keep all of them
- ✅ **TXT Records** for SPF, DKIM, DMARC, or domain verification - keep them
- ✅ Any other **A** or **CNAME** records for OTHER subdomains (like mail, blog, etc.) - keep them

---

## STEP 5: Save and Wait

1. **Scroll to bottom** of the page
2. Look for a **"SAVE ALL CHANGES"** button (might be green)
3. Click it to confirm
4. **Wait 5-15 minutes** for DNS propagation

---

## VISUAL REFERENCE - What Your Table Should Look Like After:

```
┌──────────┬──────┬─────────────────────────┬───────────┐
│ Type     │ Host │ Value                   │ TTL       │
├──────────┼──────┼─────────────────────────┼───────────┤
│ A Record │ @    │ 76.76.21.21            │ Automatic │
│ CNAME    │ www  │ cname.vercel-dns.com   │ Automatic │
│ MX       │ @    │ (your email server)    │ Automatic │
│ TXT      │ @    │ (verification codes)   │ Automatic │
└──────────┴──────┴─────────────────────────┴───────────┘
```

---

## Verification After Changes

### Test 1: Check DNS Propagation
Open PowerShell on your computer and run:

```powershell
nslookup fretpilotstudio.com
```

**Expected result:**
```
Address: 76.76.21.21
```

```powershell
nslookup www.fretpilotstudio.com
```

**Expected result:**
```
(shows CNAME chain leading to Vercel)
```

### Test 2: Check Vercel Dashboard
1. Go to Vercel → fretpilot-studio → Settings → Domains
2. Look at `fretpilotstudio.com` - should now say **"Valid Configuration"** (green)
3. Look at `www.fretpilotstudio.com` - should say **"Valid Configuration"** or just green checkmark

### Test 3: Test Website
1. Open Incognito browser
2. Go to: https://fretpilotstudio.com
3. Should load your site (not parking page)
4. Go to: https://www.fretpilotstudio.com
5. Should redirect to https://fretpilotstudio.com (after redeploy)

---

## Common Mistakes to Avoid

❌ **WRONG:** Using CNAME for Host `@`  
✅ **RIGHT:** Use A Record for Host `@`

❌ **WRONG:** Leaving old parking IP addresses  
✅ **RIGHT:** Only 76.76.21.21 for apex

❌ **WRONG:** Using A Record for `www`  
✅ **RIGHT:** Use CNAME for `www`

❌ **WRONG:** Typo in IP: `76.76.21.12` or `76.76.12.21`  
✅ **RIGHT:** Exactly `76.76.21.21`

---

## If You're Still Stuck

Take a screenshot of your HOST RECORDS table (make sure no sensitive info visible) and describe what you see. Common issues:

1. **"I don't see ADD NEW RECORD button"**  
   → Make sure you're on "Advanced DNS" tab, not "Basic DNS" or "Domain" tab

2. **"It won't let me use @ for Host"**  
   → Some interfaces show this as blank or "Root" - try leaving Host field blank

3. **"There's already an A Record for @ but with different IP"**  
   → Edit that record (pencil icon) and change the Value to 76.76.21.21

4. **"I see 'URL Redirect' records"**  
   → Delete those - they conflict with direct DNS pointing

5. **"Changes not saving"**  
   → Look for error message at top of page; might say "invalid format" if typo in IP

---

## After DNS is Fixed - Next Steps

1. **Redeploy on Vercel**  
   → Deployments tab → click "Redeploy" button on latest

2. **Test the site**  
   → https://fretpilotstudio.com/?view=videolessons  
   → Check for canvas (no video element)

3. **Test Stripe checkout**  
   → Go to /pricing → click subscribe → use test card 4242 4242 4242 4242

4. **Verify deploy-bust**  
   → View page source → search for `2025-11-23TLaunchCommit`

---

## Need Help?

If any step is unclear:
1. Tell me exactly what you see in the HOST RECORDS table (types and hosts)
2. Tell me what error message appears when you try to save
3. Send screenshot if possible (blur/hide any private info)

Once DNS propagates, all the code changes we made (redirect, Stripe metadata, canvas lessons) will be live!
