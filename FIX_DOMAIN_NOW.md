# 🔧 IMMEDIATE FIX FOR fretpilotstudio.com

## The Problem
DNS lookup shows "Non-existent domain" - this means either:
1. Domain not added to Vercel project yet, OR
2. Domain purchased but DNS not configured

## ✅ SOLUTION: Add Domain to Vercel (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/cwfranks77/fretpilot-studio/settings/domains
2. You should see the Domains settings page

### Step 2: Add Your Domain
1. Click the **"Add"** or **"Add Domain"** button
2. Enter: `fretpilotstudio.com`
3. Click **"Add"**

### Step 3: Vercel Will Show You What To Do
Vercel will detect that you own the domain and show one of two options:

#### **Option A: Use Vercel Nameservers (RECOMMENDED - Easiest)**
If you purchased through Vercel, this should be automatic. Vercel will show:
```
✅ Using Vercel Nameservers
Your domain is configured correctly.
```

If not automatic, Vercel will show:
```
Update your nameservers to:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
```

**How to update nameservers:**
1. Go to: https://vercel.com/domains (your purchased domains)
2. Click on `fretpilotstudio.com`
3. Look for "Nameservers" section
4. Make sure they're set to Vercel's nameservers
5. If not, click "Use Vercel Nameservers" button

#### **Option B: Add DNS Records Manually**
If Vercel asks you to add DNS records manually, you'll see:
```
Add these DNS records at your domain registrar:
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### Step 4: Add www Subdomain
1. After adding `fretpilotstudio.com`, click **"Add"** again
2. Enter: `www.fretpilotstudio.com`
3. Vercel should automatically redirect www → apex (no extra config needed)

### Step 5: Wait for DNS Propagation (5-30 minutes)
After configuring, run this command to monitor DNS:
```powershell
npm run dns:wait
```

Or check manually:
```powershell
nslookup fretpilotstudio.com
nslookup www.fretpilotstudio.com
```

## 🎯 Expected Result
After DNS propagates:
- ✅ https://fretpilotstudio.com → Works
- ✅ https://www.fretpilotstudio.com → Redirects to apex
- ✅ https://fretpilotstudio.com/store → Shows store
- ✅ Green checkmark in Vercel domains tab

## 🚨 If Domain Is NOT In Vercel Domains List

This means the purchase didn't complete. Here's what to do:

### Check Your Vercel Billing
1. Go to: https://vercel.com/account/billing
2. Look for a charge for "fretpilotstudio.com"
3. Check your email for a purchase receipt

### If No Purchase Found
The domain was never purchased. You'll need to buy it:

1. **Option 1: Buy Through Vercel (Easiest)**
   - Go to: https://vercel.com/domains
   - Search for `fretpilotstudio.com`
   - Click "Buy" (~$15-20/year)
   - Auto-configures DNS ✅

2. **Option 2: Buy From Namecheap (Cheaper)**
   - Go to: https://www.namecheap.com
   - Search for `fretpilotstudio.com`
   - Buy for ~$9/year
   - Then manually add DNS records (see Option B above)

## 📞 Need Help?
Tell me what you see in Vercel dashboard and I'll walk you through the exact steps.

## 🔍 Quick Diagnostic Commands
```powershell
# Check if domain exists in DNS
nslookup fretpilotstudio.com

# Check Vercel deployment status
git status
git log -1 --oneline

# Test local build
npm run build
```

---

**Most likely fix: Just add the domain in Vercel dashboard. Should take 5 minutes.**
