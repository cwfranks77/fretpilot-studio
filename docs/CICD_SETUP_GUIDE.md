# GitHub Actions CI/CD Setup Guide

This repository uses GitHub Actions to automate builds and releases for all platforms.

## Workflow Overview

The CI/CD pipeline (`build-release.yml`) automates:
- ✅ Android APK and AAB builds (signed)
- ✅ Windows Electron installer (optionally signed)
- ✅ GitHub Release creation with artifacts
- ✅ Google Play Store deployment (optional)
- ✅ Backend API deployment to Vercel

## Required Secrets

Configure these in GitHub: `Settings → Secrets and variables → Actions → New repository secret`

### Android Build Secrets

1. **ANDROID_KEYSTORE_BASE64**
   - Base64-encoded keystore file
   - Generate:
     ```powershell
     # Convert keystore to base64
     $bytes = [System.IO.File]::ReadAllBytes("android\app\keystore\release.keystore")
     $base64 = [System.Convert]::ToBase64String($bytes)
     $base64 | Out-File keystore.txt
     # Copy contents of keystore.txt to GitHub secret
     ```

2. **KEYSTORE_PASSWORD**
   - Password for the keystore
   - From: `android/app/keystore/keystore.properties` → `storePassword`

3. **KEY_ALIAS**
   - Key alias in keystore
   - From: `android/app/keystore/keystore.properties` → `keyAlias`

4. **KEY_PASSWORD**
   - Password for the key
   - From: `android/app/keystore/keystore.properties` → `keyPassword`

### Windows Code Signing (Optional)

5. **WIN_CERT_BASE64**
   - Base64-encoded PFX certificate
   - Generate:
     ```powershell
     $bytes = [System.IO.File]::ReadAllBytes("path\to\certificate.pfx")
     $base64 = [System.Convert]::ToBase64String($bytes)
     $base64 | Out-File cert.txt
     ```

6. **WIN_CERT_PASSWORD**
   - Password for PFX certificate

### Google Play Deployment (Optional)

7. **GOOGLE_PLAY_SERVICE_ACCOUNT_JSON**
   - Service account JSON for Google Play Console API
   - Setup:
     1. Google Cloud Console → Create Service Account
     2. Grant "Service Account User" role
     3. Download JSON key
     4. Play Console → Setup → API access → Grant access to service account
     5. Copy entire JSON content to this secret

### Vercel Deployment

8. **VERCEL_TOKEN**
   - Vercel authentication token
   - Get from: https://vercel.com/account/tokens

9. **VERCEL_ORG_ID**
   - Your Vercel organization/team ID
   - Get from project settings or:
     ```bash
     vercel whoami
     ```

10. **VERCEL_PROJECT_ID**
    - Your Vercel project ID
    - Get from project settings

## Triggering Builds

### Manual Build
1. Go to: `Actions → Build and Release → Run workflow`
2. Select branch: `main`
3. Click "Run workflow"

### Automatic Build on Tag
```powershell
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

The workflow automatically:
- Builds Android APK and AAB
- Builds Windows installer
- Creates GitHub Release with downloadable artifacts
- (Optional) Deploys AAB to Google Play production track
- (Optional) Deploys backend to Vercel

## Environment Variables

For backend deployment, set these in Vercel dashboard:

### Required for Stripe
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

### Required for BTCPay Server
- `BTCPAY_SERVER_URL` - Your BTCPay Server URL (e.g., https://btcpay.example.com)
- `BTCPAY_STORE_ID` - BTCPay store ID
- `BTCPAY_API_KEY` - BTCPay API key
- `BTCPAY_WEBHOOK_SECRET` - BTCPay webhook secret

### Required for Dropshipping
- `PRINTFUL_API_KEY` - Printful API key
- `SPOCKET_API_KEY` - Spocket API key

### Optional
- `SHIPSTATION_API_KEY` - ShipStation API key
- `SHIPSTATION_API_SECRET` - ShipStation API secret
- `SHIPSTATION_WEBHOOK_URL` - ShipStation webhook URL
- `APP_URL` - Frontend app URL (for redirects)

## Workflow Jobs

### build-android
- **Runs on:** Ubuntu latest
- **Outputs:** 
  - `fretpilot-android-apk` - Signed APK for direct distribution
  - `fretpilot-android-aab` - Signed AAB for Play Store

### build-windows
- **Runs on:** Windows latest
- **Outputs:** 
  - `fretpilot-windows-installer` - NSIS installer
  - `fretpilot-windows-portable` - Portable EXE

### create-release
- **Runs on:** Ubuntu latest
- **Triggers:** Only on version tags (v*)
- **Actions:**
  - Creates GitHub Release
  - Attaches APK and Windows installer
  - (Optional) Uploads AAB to Google Play

### deploy-server
- **Runs on:** Ubuntu latest
- **Triggers:** Main branch or version tags
- **Actions:**
  - Deploys backend API to Vercel production

## Testing the Workflow

1. **Fork or clone** this repository
2. **Add secrets** (at minimum: Android keystore secrets)
3. **Trigger workflow** manually or push a tag
4. **Monitor progress** in Actions tab
5. **Download artifacts** from workflow run or GitHub Release

## Troubleshooting

### Android build fails
- Verify keystore is correctly base64-encoded
- Check that passwords match keystore.properties
- Ensure JDK 17 is used (workflow sets this)

### Windows signing fails
- Verify certificate is valid (not expired)
- Check certificate password
- Ensure signtool.exe path is correct for Windows runner

### Google Play upload fails
- Verify service account has correct permissions
- Check that app is registered in Play Console
- Ensure bundle version code is incremented

### Vercel deployment fails
- Verify tokens are correct
- Check that project ID matches
- Ensure server dependencies are in package.json

## Build Artifacts

Each successful workflow run produces:

**Android:**
- `app-release.apk` - ~50MB, sideload ready
- `app-release.aab` - ~30MB, Play Store upload

**Windows:**
- `FretPilot Setup 1.0.0.exe` - ~200MB, NSIS installer
- `FretPilot 1.0.0.exe` - ~200MB, portable (no install)

## Release Notes

The workflow automatically generates release notes from commits between tags. Customize by editing the release after creation.

## Advanced: Multi-platform Matrix

To add iOS builds (requires macOS runner and paid GitHub plan):

```yaml
build-ios:
  name: Build iOS
  runs-on: macos-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm run build
    - run: npx cap sync ios
    - uses: apple-actions/import-codesign-certs@v2
      with:
        p12-file-base64: ${{ secrets.IOS_CERTIFICATE_P12 }}
        p12-password: ${{ secrets.IOS_CERTIFICATE_PASSWORD }}
    - run: xcodebuild -workspace ios/App/App.xcworkspace -scheme App archive
```

## Cost Considerations

- **GitHub Actions:** 2,000 minutes/month free for public repos; unlimited for public repos
- **Storage:** Artifacts retained for 90 days (configurable)
- **Vercel:** Free tier includes 100GB bandwidth/month
- **Google Play:** One-time $25 registration fee

## Security Best Practices

✅ Store all secrets in GitHub Secrets (never commit)
✅ Use environment-specific tokens (separate dev/prod)
✅ Rotate API keys regularly
✅ Enable branch protection on `main`
✅ Require PR reviews before merging
✅ Use signed commits (optional but recommended)

## Updating the Workflow

Edit `.github/workflows/build-release.yml` and push changes:

```powershell
git add .github/workflows/build-release.yml
git commit -m "Update CI/CD workflow"
git push origin main
```

Changes take effect on next workflow run.

---

**Need help?** Check the [GitHub Actions documentation](https://docs.github.com/en/actions) or open an issue.
