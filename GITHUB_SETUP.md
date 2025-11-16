# FretPilot GitHub Setup Guide

## 1. Create GitHub Repository

1. Go to https://github.com/new
2. Name: `fretpilot-app` (or any name you like)
3. Set to **Private** (recommended for unreleased apps)
4. Click "Create repository"

## 2. Initialize Git and Push Code

Open PowerShell in your project folder and run:

```powershell
cd C:\Users\ninja\FretPilot

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial FretPilot commit with error boundary, images, and fixes"

# Set main branch
git branch -M main

# Add your GitHub repo as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fretpilot-app.git

# Push to GitHub
git push -u origin main
```

## 3. Set Up Email Secrets for Automated Builds

### A. Generate Gmail App Password (if using Gmail)

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)" → enter "FretPilot Builder"
5. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### B. Add Secrets to GitHub

1. Go to your repo: `https://github.com/YOUR_USERNAME/fretpilot-app`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these 3 secrets:

   **Secret 1:**
   - Name: `EMAIL_USERNAME`
   - Value: `your-email@gmail.com`

   **Secret 2:**
   - Name: `EMAIL_PASSWORD`
   - Value: `your 16-char app password`

   **Secret 3:**
   - Name: `EMAIL_TO`
   - Value: `your-email@gmail.com` (or different email to receive builds)

## 4. Test the Build

1. Go to your repo → **Actions** tab
2. Click on the "Build and Email FretPilot APK" workflow
3. Click **Run workflow** → **Run workflow** button
4. Wait 5-10 minutes
5. Check your email for the APK!

## 5. Automatic Builds on Every Push

From now on, every time you push code to `main` branch:
```powershell
git add .
git commit -m "Your changes"
git push
```

GitHub will automatically:
- Build the web assets
- Build the Android APK
- Email you the APK with build info

## 6. Download Past Builds

- Go to your repo → **Actions** → click any completed workflow
- Scroll to **Artifacts** section
- Download `FretPilot-APK` (available for 30 days)

## Troubleshooting

**Build fails:**
- Check the Actions logs in GitHub
- Make sure secrets are set correctly
- Verify Java 21 and Node 20 are compatible

**Email not received:**
- Check spam folder
- Verify Gmail app password is correct
- Make sure 2FA is enabled on Gmail

**Need help?**
- Open an issue in your repo
- Check workflow logs for detailed error messages

---

## Alternative: Use GitHub Releases Instead of Email

If you prefer to publish builds as GitHub Releases instead of email:

1. Replace the email step with:
```yaml
- name: Create Release
  uses: softprops/action-gh-release@v1
  with:
    files: android/app/build/outputs/apk/debug/FretPilot-debug.apk
    tag_name: build-${{ github.run_number }}
    name: Build ${{ github.run_number }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This will create a new release with the APK for every build.
