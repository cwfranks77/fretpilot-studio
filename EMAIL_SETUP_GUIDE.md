# FretPilot Studio Email Setup Guide
**Quick Reference for fretpilotstudio.com Professional Email**

---

## ✉️ Email Addresses & Their Purpose

### Primary Addresses (Create These)

**support@fretpilotstudio.com**
- Purpose: Public customer support, app help, general inquiries
- Use in: Play Console "Support email", website footer, app settings
- Reply-to: Shows as support@, forwards to cwfranks77@gmail.com

**admin@fretpilotstudio.com**
- Purpose: Owner/founder identity, internal operations, escalations
- Use in: Business correspondence, partnerships, high-priority issues
- Reply-to: Shows as admin@, forwards to cwfranks77@gmail.com

### Optional Addresses (Add Later via Aliases)

**privacy@fretpilotstudio.com**
- Purpose: GDPR/CPRA data requests, privacy policy inquiries
- Use in: Privacy policy footer, data safety disclosures

**partnerships@fretpilotstudio.com**
- Purpose: Affiliate programs, influencer outreach, B2B deals

**orders@fretpilotstudio.com**
- Purpose: E-commerce order confirmations, shipping notifications

**no-reply@fretpilotstudio.com**
- Purpose: System-generated emails (password resets, notifications)

**review@fretpilotstudio.com**
- Purpose: App store review coordination, tester feedback

**dmarc@fretpilotstudio.com**
- Purpose: Automated DMARC aggregate reports (monitoring)

### Catch-All Configuration
**Anything@fretpilotstudio.com → cwfranks77@gmail.com**
- Catches typos (e.g., supprot@, suport@, helo@)
- Captures exploratory emails (e.g., info@, contact@, hello@)
- Ensures zero missed messages

---

## 🚀 Implementation: ImprovMX (Simplest Setup)

### Why ImprovMX?
- ✅ Free forever for unlimited aliases
- ✅ Catch-all forwarding built-in
- ✅ No credit card required
- ✅ 2-minute setup
- ⚠️ Outbound requires separate SMTP (use SendGrid free tier)

### Step 1: Sign Up & Add Domain
1. Go to: https://improvmx.com/
2. Click "Add Domain"
3. Enter: fretpilotstudio.com
4. Verify: cwfranks77@gmail.com (click confirmation link)

### Step 2: Update DNS Records (Namecheap)
Go to: Namecheap → Domain List → fretpilotstudio.com → Advanced DNS

**Add MX Records** (delete old MX if any):
```
Type: MX Record
Host: @
Value: mx1.improvmx.com
Priority: 10
TTL: Automatic

Type: MX Record
Host: @
Value: mx2.improvmx.com
Priority: 20
TTL: Automatic
```

**Add SPF Record** (TXT):
```
Type: TXT Record
Host: @
Value: v=spf1 include:spf.improvmx.com include:sendgrid.net ~all
TTL: Automatic
```

**Add DMARC Record** (TXT):
```
Type: TXT Record
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@fretpilotstudio.com; pct=100
TTL: Automatic
```

**Save all changes.** DNS propagation: 5-60 minutes.

### Step 3: Create Aliases in ImprovMX
In ImprovMX dashboard:
1. Click "Add Alias"
2. Create:
   - support@fretpilotstudio.com → cwfranks77@gmail.com
   - admin@fretpilotstudio.com → cwfranks77@gmail.com
   - privacy@fretpilotstudio.com → cwfranks77@gmail.com
3. Enable Catch-All:
   - Click "Catch-All"
   - Forward to: cwfranks77@gmail.com
   - Save

### Step 4: Set Up Outbound SMTP (SendGrid)
**Sign up: https://sendgrid.com/ (free tier: 100 emails/day)**

1. Create account (use cwfranks77@gmail.com)
2. **Sender Authentication**:
   - Settings → Sender Authentication → Authenticate Your Domain
   - Enter: fretpilotstudio.com
   - SendGrid shows 3 CNAME records — **copy them**

3. **Add SendGrid CNAME Records to Namecheap**:
```
Type: CNAME Record
Host: s1._domainkey
Value: s1.domainkey.u12345.wl.sendgrid.net (use exact value SendGrid shows)
TTL: Automatic

Type: CNAME Record
Host: s2._domainkey
Value: s2.domainkey.u12345.wl.sendgrid.net
TTL: Automatic

Type: CNAME Record
Host: em1234
Value: u12345.wl.sendgrid.net
TTL: Automatic
```

4. **Create API Key**:
   - Settings → API Keys → Create API Key
   - Name: FretPilot Gmail SMTP
   - Permissions: Full Access (or just Mail Send)
   - Copy key: `SG.xxxxxxxxxxxxxxxxx` (save securely!)

### Step 5: Configure Gmail "Send Mail As"
In Gmail (cwfranks77@gmail.com):
1. Settings (⚙️) → See all settings → Accounts and Import
2. **Send mail as** → Add another email address
3. Fill form:
   - Name: FretPilot Admin
   - Email: admin@fretpilotstudio.com
   - ☐ Treat as alias (unchecked)
   - Next

4. SMTP settings:
   - SMTP Server: smtp.sendgrid.net
   - Port: 587
   - Username: apikey
   - Password: SG.xxxxxxxxxxxxxxxxx (your API key)
   - ☑ Secured connection using TLS
   - Add Account

5. **Verify**: SendGrid sends code to admin@ → ImprovMX forwards to Gmail → enter code → Done

6. **Repeat for support@** (optional, same steps)

7. **Set default**: Make admin@ or support@ reply-from default if desired

---

## 🧪 Testing & Verification

### DNS Check (wait 15-30 min after changes)
```powershell
nslookup -type=MX fretpilotstudio.com
# Should show: mx1.improvmx.com, mx2.improvmx.com

nslookup -type=TXT fretpilotstudio.com
# Should show: v=spf1 include:spf.improvmx.com include:sendgrid.net ~all

nslookup -type=TXT _dmarc.fretpilotstudio.com
# Should show: v=DMARC1...

nslookup -type=CNAME s1._domainkey.fretpilotstudio.com
# Should show: s1.domainkey.u12345.wl.sendgrid.net
```

### Inbound Test
1. Send email from any external account to: test@fretpilotstudio.com
2. Check cwfranks77@gmail.com inbox (should arrive in <1 min)
3. Verify "To:" shows test@fretpilotstudio.com

### Outbound Test
1. In Gmail, compose new email
2. From: admin@fretpilotstudio.com (select from dropdown)
3. To: your personal email (or a test account)
4. Subject: FretPilot Email Test
5. Send
6. Check received email:
   - From: should show admin@fretpilotstudio.com
   - Reply-To: should be admin@fretpilotstudio.com
   - View original → headers show SPF: PASS, DKIM: PASS

### Deliverability Test
Send test emails to:
- Gmail: Check spam folder, view original headers
- Outlook.com: Check junk folder
- ProtonMail: Check spam
All should pass SPF/DKIM and land in inbox.

---

## 📋 Play Console Email Updates

### Where to Use These Emails

**Developer Account Settings**:
- Developer email: support@fretpilotstudio.com
- Contact email: support@fretpilotstudio.com

**App Store Listing** (Main store listing):
- Email: support@fretpilotstudio.com
- Privacy policy: https://fretpilotstudio.com/privacy

**App Content → Data Safety**:
- Privacy policy: https://fretpilotstudio.com/privacy
- Contact email: support@fretpilotstudio.com (or privacy@)

**Release Notes/Tester Communication**:
- Use: admin@fretpilotstudio.com (more personal for internal testing)

---

## 🔒 Security & Credentials

### Store Securely (DO NOT COMMIT)
Add to `.env` (already in `.gitignore`):
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO=support@fretpilotstudio.com
```

### Password Manager Entry
Save in 1Password/Bitwarden:
- Service: SendGrid FretPilot
- Username: apikey
- Password: SG.xxxxx
- Notes: Used for Gmail SMTP and contact form backend

---

## 📊 Email Address Cheat Sheet

| Address | Forwards To | Purpose | Use In |
|---------|-------------|---------|--------|
| support@ | cwfranks77@gmail.com | Customer support | Play Console, website, app |
| admin@ | cwfranks77@gmail.com | Owner correspondence | Business, partnerships |
| privacy@ | cwfranks77@gmail.com | Data requests | Privacy policy footer |
| partnerships@ | cwfranks77@gmail.com | B2B, affiliates | Marketing materials |
| orders@ | cwfranks77@gmail.com | Order notifications | E-commerce receipts |
| no-reply@ | (send-only) | System emails | Automated notifications |
| review@ | cwfranks77@gmail.com | App reviews | Internal review process |
| dmarc@ | cwfranks77@gmail.com | Email monitoring | DMARC reports |
| *@ (catch-all) | cwfranks77@gmail.com | Everything else | Typos, exploratory |

---

## ⚡ Quick Start Checklist

- [ ] Sign up for ImprovMX (https://improvmx.com/)
- [ ] Add fretpilotstudio.com to ImprovMX
- [ ] Update Namecheap DNS: MX records (mx1/mx2.improvmx.com)
- [ ] Update Namecheap DNS: SPF TXT record
- [ ] Update Namecheap DNS: DMARC TXT record
- [ ] Create aliases in ImprovMX: support@, admin@, privacy@
- [ ] Enable catch-all forwarding in ImprovMX
- [ ] Sign up for SendGrid (https://sendgrid.com/)
- [ ] Authenticate domain in SendGrid
- [ ] Add SendGrid CNAME records to Namecheap (3 records)
- [ ] Create SendGrid API key
- [ ] Configure Gmail "Send mail as" for admin@
- [ ] Test inbound: send to test@fretpilotstudio.com
- [ ] Test outbound: send from admin@ via Gmail
- [ ] Verify SPF/DKIM headers in test emails
- [ ] Update Play Console: support@fretpilotstudio.com
- [ ] Store SendGrid API key in .env
- [ ] Update contact form SMTP config (if needed)

---

## 🆘 Troubleshooting

**Inbound not working (emails not forwarding)**:
- Check MX records: `nslookup -type=MX fretpilotstudio.com`
- Wait 30-60 min for DNS propagation
- Check ImprovMX dashboard for delivery logs
- Verify Gmail isn't filtering to spam

**Outbound fails (can't send from admin@)**:
- Verify SendGrid CNAME records added and propagated
- Check SendGrid dashboard for authentication status (should be green)
- Re-verify API key is correct in Gmail SMTP settings
- Try port 465 (SSL) instead of 587 (TLS)

**Emails land in spam**:
- Check SPF: should include both improvmx.com and sendgrid.net
- Verify DKIM: SendGrid CNAMEs must resolve correctly
- Warm up: start with low volume (5-10 emails/day), increase gradually
- After 2 weeks stable: change DMARC policy to p=reject

**Gmail won't verify admin@**:
- Check ImprovMX catch-all or alias is active
- Resend verification from Gmail settings
- Check spam folder in cwfranks77@gmail.com
- Try manual verification: Settings → Accounts → Edit → Confirm

---

## 🎯 What Google Sees

When Google (Play Console) emails you:
1. They send to: support@fretpilotstudio.com
2. ImprovMX receives on MX servers
3. ImprovMX forwards to: cwfranks77@gmail.com
4. You receive in Gmail with "To: support@fretpilotstudio.com" header
5. You reply in Gmail using "From: admin@fretpilotstudio.com" or "support@"
6. SendGrid sends your reply via authenticated SMTP
7. Google receives from: admin@fretpilotstudio.com with proper SPF/DKIM
8. Appears professional, passes spam filters, builds sender reputation

---

## 📈 Future Enhancements

**After Launch**:
- Monitor DMARC reports (weekly check of dmarc@ forwarded XML)
- Add BIMI (brand logo in Gmail) after 90 days stable DMARC
- Consider Google Workspace if team grows (5+ users)
- Implement automated DMARC report parser (dmarcian.com or similar)

**For High Volume** (>100 emails/day):
- Upgrade SendGrid tier or add AWS SES
- Implement dedicated IP (better reputation control)
- Add email signature with logo/social links

**For Multiple Team Members**:
- Migrate to Google Workspace ($6/user/month)
- Each person gets firstname@fretpilotstudio.com
- Shared support@ inbox with team access

---

## 💰 Cost Summary

**Current Setup (Recommended)**:
- ImprovMX: $0/month (unlimited forwarding)
- SendGrid: $0/month (100 emails/day)
- **Total: FREE** ✅

**Paid Alternatives** (if you want full mailboxes):
- Google Workspace: $6/user/month ($72/year)
- Namecheap Private Email: $9.88/year
- Fastmail: $5/user/month ($60/year)
- Migadu: $19/year (unlimited users)

**Current choice maximizes flexibility at zero cost until volume grows.**

---

**Next Step**: Copy the DNS records from Steps 2 & 4, add them to Namecheap, then set up ImprovMX aliases and SendGrid authentication. Takes ~15 minutes total.
