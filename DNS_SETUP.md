# DNS Setup for fretpilotstudio.com

To make fretpilotstudio.com resolve to your Vercel deployment, add these DNS records at your domain registrar (Namecheap/GoDaddy/etc.). This keeps DNS at your registrar and is the quickest path.

## Required Records

- A: `@` → `76.76.21.21` (Apex/root domain)
- CNAME: `www` → `cname.vercel-dns.com`

Propagation typically completes within minutes but may take up to 1–2 hours.

## Verify DNS

Windows PowerShell:

```powershell
nslookup fretpilotstudio.com
nslookup www.fretpilotstudio.com
```

Vercel CLI:

```bash
vercel domains inspect fretpilotstudio.com
vercel domains inspect www.fretpilotstudio.com
```

Once DNS is correct, Vercel will automatically issue SSL certificates for both the apex and www domains.

## Optional: Use Vercel Nameservers

If you prefer Vercel to manage DNS entirely, set your nameservers at your registrar to:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Then you can create A/CNAME/redirects inside Vercel. This is more flexible but requires changing nameservers.

## Namecheap Steps (example)

1. Namecheap Dashboard → Domain List → `fretpilotstudio.com` → Manage
2. Advanced DNS → Host Records:
   - Add A Record: Host `@`, Value `76.76.21.21`
   - Add CNAME Record: Host `www`, Value `cname.vercel-dns.com`
3. Save All Changes.

## GoDaddy Steps (example)

1. GoDaddy → My Products → DNS → `fretpilotstudio.com` → Manage DNS
2. Add Records:
   - Type A, Name `@`, Value `76.76.21.21`
   - Type CNAME, Name `www`, Value `cname.vercel-dns.com`
3. Save. Remove any conflicting parked/forwarding records if present.
