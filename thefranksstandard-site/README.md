# The Franks Standard Landing

Static landing page for https://www.thefranksstandard.com deployed on Vercel.

## Structure
- `index.html` – Brand landing (no FretPilot metadata leakage)
- `vercel.json` – Cache policy: short for HTML (60s), long immutable for temple logo
- Uses shared image `/images/temple-logo-2025.jpeg` at project root (add if missing when deploying)

## Deploy (Vercel CLI)
```powershell
# From PowerShell
npm i -g vercel
vercel login
cd C:\Users\ninja\Fretquest\thefranksstandard-site
# First deploy (choose scope, project name: thefranksstandard)
vercel
# Production deploy
vercel --prod
```
Attach domain:
1. Open Vercel dashboard → Project → Settings → Domains.
2. Add `thefranksstandard.com` (already on Vercel DNS) and optionally `www.thefranksstandard.com`.
3. Vercel auto‑provisions TLS.

## Updating Logo
Replace `/images/temple-logo-2025.jpeg` and bump filename (e.g. `temple-logo-2025-v2.jpeg`) then update references in:
- `index.html`
- `vercel.json` (header section for long cache)
Redeploy with `vercel --prod`.

## Accessibility & SEO
- Descriptive alt text for logo.
- Canonical + OG/Twitter tags specific to brand (no FretPilot leakage).
- Dark theme color.

## Future Enhancements
- Add dedicated OG preview image (1200x630) separate from logo.
- Add `privacy.html` and `terms.html` pages.
- Analytics (simple GA4 or privacy‑friendly solution) abstracted behind env variables.
