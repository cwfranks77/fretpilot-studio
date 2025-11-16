# FretPilot Studio Play Store Upload Instructions

## What You Have Ready

✅ **Release AAB**: `C:\Users\ninja\Downloads\FretPilotStudio.aab` (for Play Store)
✅ **Release APK**: `C:\Users\ninja\Downloads\FretPilotStudio.apk` (for direct distribution)

Both files are signed with your production keystore and include:
- Full navigation (Store, AI Lessons, Trainer, etc.)
- Sign up/Login with optional email for receipts
- Working shopping cart and Stripe checkout
- Serverless API deployed on Vercel

## Upload to Google Play Console

### 1. Access Play Console
The browser should have opened: https://play.google.com/console/developers

### 2. Create or Select App
- If first time: Click **"Create app"**
  - App name: **FretPilot Studio**
  - Package name: **com.fretpilot.app**
  - Default language: English (United States)
  - App or game: App
  - Free or paid: Free
- If app exists: Select **FretPilot** from your app list

### 3. Fill App Details (if new)
**Store Listing:**
- Short description: (from `release/PLAY_LISTING.md`)
  ```
  Your AI-powered guitar trainer, practice coach, and music store.
  ```
- Full description: (copy from `release/PLAY_LISTING.md`)
- Screenshots: Upload 5–8 phone screenshots (1080×1920 or similar)
- App icon: 512×512 PNG

**Content Rating:**
- Complete questionnaire (select "Music" category, no violence/adult content)

**Privacy Policy:**
- URL: `https://fretpilot-studio.vercel.app/privacy.html`

### 4. Upload AAB
1. Go to **Production → Releases**
2. Click **Create new release**
3. Upload `FretPilotStudio.aab`
4. Release name: **1.0.0**
5. Release notes:
   ```
   - First public release
   - AI lesson generator and trainer tools
   - Music store with secure checkout
   - Performance improvements and UI polish
   ```
6. Click **Save** → **Review release** → **Start rollout to Production**

### 5. Submit for Review
- Review all sections (Store listing, Content rating, etc.)
- Submit app for review
- Typical review time: 1–3 days

## Alternative: Internal Testing (faster)
If you want to test before public release:
1. Go to **Internal testing → Testers**
2. Create email list of testers
3. Upload AAB to internal testing track
4. Share link with testers
5. Once validated, promote to Production

## Post-Upload
- **Monitor status**: Check Play Console for review status
- **Update DNS**: Add DNS records for `fretpilotstudio.com` (see `DNS_SETUP.md`)
- **Test**: Install from Play Store on device once live

## Need Help?
- Play Console Help: https://support.google.com/googleplay/android-developer
- FretPilot Support: support@fretpilot.com
