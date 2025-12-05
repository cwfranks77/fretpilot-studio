# Namecheap Email Forwarding Setup Guide

## ✅ Correct Format for Namecheap Email Forwarding

### How to Set Up Each Email Forward:

In Namecheap's "Email Forwarding" section, use this format:

| **Alias Field** (left) | **Forward To Field** (right) |
|------------------------|------------------------------|
| `support` | `cwfranks77@gmail.com` |
| `info` | `cwfranks77@gmail.com` |
| `hello` | `cwfranks77@gmail.com` |
| `contact` | `cwfranks77@gmail.com` |

### Important Notes:

1. **Alias** = Just the name (no @, no domain)
   - ✅ Correct: `support`
   - ❌ Wrong: `support@fretpilotstudio.com`
   - ❌ Wrong: `support.fretpilotstudio.com`

2. **Forward To** = Your full email address
   - ✅ Correct: `cwfranks77@gmail.com`

3. **Result:** 
   - Emails to `support@fretpilotstudio.com` → Forward to `cwfranks77@gmail.com`
   - Emails to `info@fretpilotstudio.com` → Forward to `cwfranks77@gmail.com`

---

## 🔧 Step-by-Step Instructions:

1. Go to **Namecheap.com** → Sign In
2. Click **"Domain List"** (left sidebar)
3. Click **"Manage"** next to `fretpilotstudio.com`
4. Click **"Email Forwarding"** (left menu)
5. For each email, click **"+ Add New"** or the **"+"** button
6. Enter:
   - **Alias:** `support` (type just "support")
   - **Forward To:** `cwfranks77@gmail.com` (your full Gmail address)
7. Click **Save** or the **✓** checkmark
8. Repeat for: `info`, `hello`, `contact`

---

## 🌟 Catch-All Setup (Optional):

If you want ALL emails (any-name@fretpilotstudio.com) to forward:

1. Add a new forward with:
   - **Alias:** `*` (asterisk = catch-all)
   - **Forward To:** `cwfranks77@gmail.com`

This forwards everything like: `anything@fretpilotstudio.com` → your Gmail

---

## ✅ Verify It's Working:

After setup, wait 5-10 minutes, then:
1. Send a test email from a different account to: `support@fretpilotstudio.com`
2. Check your Gmail inbox (and spam folder)
3. Should arrive within a few minutes!

---

## ⚠️ Troubleshooting:

- **Email not arriving?** Check spam folder first
- **Still not working?** Wait up to 24 hours for DNS propagation
- **Format issues?** Make sure you're using:
  - Alias = just the name (e.g., `support`)
  - Forward To = full email (e.g., `cwfranks77@gmail.com`)






