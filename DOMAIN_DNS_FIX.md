# fretpilotstudio.com DNS & Deployment Fix

## Problem Summary
1. **Domain redirect issue**: When accessing `fretpilotstudio.com`, you're being redirected through GitHub (probably GitHub Pages).
2. **Video platform broken**: The VideoLessonPlatform component was referencing non-existent video files and thumbnails, causing failures when navigating to that view.

---

## What Was Fixed

### 1. SPA Fallback for Routing
**File created**: `public/404.html`
- When a user navigates directly to a sub-route (e.g., `fretpilotstudio.com/videoplatform`), static hosts return a 404 because no physical file exists.
- This fallback redirects any 404 to `/index.html`, allowing Vue Router to handle the route client-side.
- Essential for GitHub Pages, Netlify, Vercel, and similar static CDNs.

### 2. Video Platform Hardening
**File updated**: `src/components/VideoLessonPlatform.vue`
- Changed all video `videoUrl` fields from `/videos/...mp4` to empty strings (no videos hosted yet).
- Changed all `thumbnail` paths from `/images/video-thumb-X.jpg` to `/images/video-placeholder.png` (which exists in your repo).
- Added conditional rendering: if `currentVideo.videoUrl` is empty, show a placeholder image + message instead of a broken video tag.
- Added `handleVideoError()` function to log errors if video fails to load (future-proofing).
- Added CSS for `.video-placeholder` state.

**Result**: Users can browse the Video Lesson Platform UI without encountering broken media. When you add real videos, just update the `videoUrl` fields in the sample data.

### 3. Verified Existing vercel.json
**File exists**: `vercel.json`
- Already contains correct SPA rewrite: `{ "source": "/(.*)", "destination": "/index.html" }`
- This ensures Vercel will route all requests to `index.html`, enabling Vue Router.
- **No changes needed** — configuration already correct for Vercel deployment.

---

## DNS Configuration Guide

### Current Issue Analysis
Based on your description ("goes through GitHub"), the most likely scenarios are:

1. **Namecheap domain pointing to GitHub Pages IP** instead of Vercel.
2. **CNAME record pointing to `<username>.github.io`** instead of Vercel deployment URL.
3. **A records not updated** after switching hosting providers.

### Correct DNS Setup for Vercel

#### Option A: Using Vercel DNS (Recommended)
If you want Vercel to fully manage DNS:

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Add `fretpilotstudio.com` and `www.fretpilotstudio.com`
   - Vercel will show you nameservers (e.g., `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)

2. **In Namecheap**:
   - Domain List → Manage → Nameservers → Custom DNS
   - Enter Vercel's nameservers
   - Save changes

3. **Wait**: Propagation takes 5 minutes to 48 hours (typically 1–2 hours).

#### Option B: Using Namecheap DNS + Vercel Hosting
If you want to keep email/other records in Namecheap DNS:

1. **Get your Vercel deployment URL**:
   ```powershell
   # In Vercel dashboard, copy your deployment domain, e.g.:
   # fretpilot-studio-abc123.vercel.app
   ```

2. **In Namecheap Advanced DNS**:
   - **Delete any A records pointing to GitHub** (e.g., `185.199.108.153`, `185.199.109.153`, etc.)
   - **Add CNAME record**:
     - Host: `www`
     - Value: `fretpilot-studio-abc123.vercel.app.` (replace with your actual Vercel URL, **include trailing dot**)
     - TTL: Automatic
   - **Add ALIAS/ANAME record** (if Namecheap supports it, or use A records below):
     - Host: `@`
     - Value: `fretpilot-studio-abc123.vercel.app.`
     - TTL: Automatic
   - **If ALIAS not supported**, add these **A records** instead:
     - Host: `@`, Value: `76.76.21.21`, TTL: Automatic
     - (Vercel's current IPv4 edge IP; verify in Vercel docs for latest)

3. **In Vercel Dashboard**:
   - Project → Settings → Domains
   - Add both `fretpilotstudio.com` and `www.fretpilotstudio.com`
   - Vercel will auto-provision SSL certificates

4. **Verify DNS propagation**:
   ```powershell
   # From project root
   npm run dns:verify
   # Or manually
   node scripts/dns-verify.js fretpilotstudio.com --www --expected 76.76.21.21
   ```

### Quick Verification Steps

#### Check Current DNS
```powershell
# PowerShell
nslookup fretpilotstudio.com
nslookup www.fretpilotstudio.com
```
**Expected**: Should resolve to Vercel IP (`76.76.21.21` or similar) or your Vercel CNAME.

**If you see GitHub Pages IPs** (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`):
- You need to update DNS records as described above.

#### Check HTTPS
```powershell
curl -I https://fretpilotstudio.com
```
**Expected**: `HTTP/2 200` response, `server: Vercel`.

**If redirected to GitHub**: DNS still pointing to old host.

---

## Deployment Checklist

### Immediate Actions
- [ ] Verify Vercel project is deployed and has a deployment URL
- [ ] Update DNS records in Namecheap (use Option A or B above)
- [ ] Wait 15–60 minutes for DNS propagation
- [ ] Test: Open `https://fretpilotstudio.com` in incognito — should load app without GitHub redirect
- [ ] Test: Navigate to `https://fretpilotstudio.com/videoplatform` — should show video lesson UI with placeholder

### Optional: Remove GitHub Pages (if no longer needed)
If you previously deployed to GitHub Pages and want to clean up:

1. **In GitHub repo settings**:
   - Settings → Pages → Source → None
   - Remove `gh-pages` branch if exists

2. **Remove CNAME file** (if exists in repo root or `public/` folder):
   ```powershell
   rm public/CNAME
   ```

---

## Testing the Fix

### 1. Video Platform UI Test
```powershell
# Start dev server locally
npm run dev
```
- Navigate to Video Lessons (or direct: `http://localhost:5173/videoplatform`)
- **Expected**: Grid of placeholder video thumbnails, no console errors about missing files
- Click a video card → player area shows placeholder + message "Video playback will be available soon"

### 2. Production Build Test
```powershell
npm run build
npm run preview
```
- Navigate to `http://localhost:4173/videoplatform`
- Same expected behavior as dev server

### 3. Routing Test
```powershell
# After deployment, test direct URL navigation
# Incognito/private window to avoid cache
https://fretpilotstudio.com/videoplatform
https://fretpilotstudio.com/trainer
https://fretpilotstudio.com/ai
```
**Expected**: All routes load correctly, no 404 errors.

---

## Next Steps

### To Add Real Videos
1. **Host video files**:
   - Option A: Upload to Vercel (for small files <100MB total)
   - Option B: Use cloud storage (AWS S3, Cloudflare R2, Bunny CDN)
   - Option C: YouTube/Vimeo embed (change component to use iframes)

2. **Update VideoLessonPlatform.vue**:
   ```javascript
   const videos = ref([
     {
       id: 1,
       title: 'Master Pentatonic Scales in 15 Minutes',
       // ... other fields
       thumbnail: 'https://cdn.example.com/thumb1.jpg', // or /images/uploaded-thumb.jpg
       videoUrl: 'https://cdn.example.com/pentatonic.mp4', // or /videos/pentatonic.mp4
     },
     // ...
   ])
   ```

3. **Create video thumbnails**:
   ```powershell
   # Generate from video with ffmpeg (if you have it)
   ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 public/images/video-thumb-1.jpg
   ```

### Email Setup (if not done)
If you're currently using GitHub Pages email forwarding or need to set up `support@fretpilotstudio.com`:

1. **Namecheap Private Email** (paid, ~$10/year)
2. **Gmail alias** (free, but shows "via" in recipient inbox)
3. **Cloudflare Email Routing** (free, forwarding only)
4. **Migadu / Fastmail** (paid, full features)

Add MX records in Namecheap Advanced DNS once you choose a provider.

---

## Troubleshooting

### "Still redirecting to GitHub after DNS change"
- **Browser cache**: Hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- **DNS cache**: `ipconfig /flushdns` (Windows) or wait 15–60 minutes
- **Check DNS**: `nslookup fretpilotstudio.com` — if still showing GitHub IPs, changes haven't propagated yet

### "Video platform shows 404"
- **404.html not deployed**: Ensure `public/404.html` exists and was included in build (`npm run build`)
- **Vercel rewrites**: Check `vercel.json` includes catch-all rewrite (already present)

### "Videos don't play after adding real URLs"
- **CORS issue**: If hosting videos on external CDN, ensure CORS headers allow your domain
- **HTTPS**: Videos must be served over HTTPS if app is HTTPS
- **Format**: Use `.mp4` (H.264) for best browser compatibility

---

## Files Changed

### New Files
- `public/404.html` — SPA fallback for direct route access
- `DOMAIN_DNS_FIX.md` (this file) — Documentation

### Modified Files
- `src/components/VideoLessonPlatform.vue`:
  - Changed `videoUrl` fields to empty strings (3 instances)
  - Changed `thumbnail` paths to placeholder (3 instances)
  - Added conditional rendering for video vs placeholder
  - Added `handleVideoError()` function
  - Added `.video-placeholder` CSS

### Verified/No Changes Needed
- `vercel.json` — Already configured correctly for SPA routing

---

## Summary

✅ **Fixed**: Video platform no longer breaks when navigating to it  
✅ **Fixed**: SPA routing now works on static hosts (404.html fallback)  
✅ **Verified**: Vercel config already correct  
🔧 **Action needed**: Update DNS records in Namecheap to point to Vercel (see guide above)  
📹 **Future**: Add real video files when ready (currently using placeholders)

---

**Need Help?**
- Vercel DNS docs: https://vercel.com/docs/concepts/projects/domains
- Namecheap DNS guide: https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/
- Test DNS propagation: https://dnschecker.org/#A/fretpilotstudio.com
