# Google Play Store Listing Asset Guide

This guide maps each generated asset in the repository to its place in the Google Play Console (Default Store Listing) and provides a fast upload checklist.

## 1. Core Paths
| Asset Purpose | File Path (Workspace) | Downloads Copy | Notes |
|---------------|-----------------------|----------------|-------|
| App Icon (512×512 PNG) | resources/icon/generated/app-icon-512.png | %USERPROFILE%/Downloads/app-icon-512.png & google-play-icon.png | Required. Must be exactly 512×512 <1MB (✓ ~14KB) |
| Feature Graphic (1024×500 PNG) | resources/icon/generated/feature-graphic-1024x500.png | (Optionally copy manually) | Highly recommended. Show brand + value proposition |
| Screenshot Set | %USERPROFILE%/Downloads/FretPilotScreenshots/*.png | same | Capture with in‑app panel; ensure variety |
| Adaptive Icon Foreground | resources/icon/generated/android-adaptive-foreground.png | N/A | Used internally by Android build, not uploaded directly |
| Adaptive Icon Monochrome | android/app/src/main/res/drawable/ic_launcher_monochrome.png | N/A | For Android 13+ themed icons (console auto-detect) |
| Asset Bundle (ZIP) | resources/icon/generated/fretpilot-store-assets.zip | %USERPROFILE%/Downloads/fretpilot-store-assets.zip | Convenience archive |
| Favicons / Manifest | public/favicon-*.png / public/manifest.webmanifest | N/A | Web/PWA only, not Play Console |

## 2. Upload Sequence (Google Play Console)
1. Sign in: https://play.google.com/console
2. Select your app.
3. Navigate: Grow → Store presence → Main store listing (or "Store listing").
4. App Icon: Click Upload, choose `%USERPROFILE%/Downloads/app-icon-512.png`.
5. Feature Graphic: Upload `feature-graphic-1024x500.png`.
6. Screenshots: Click Add, select images from `%USERPROFILE%/Downloads/FretPilotScreenshots/`.
   - Include: Home, Trainer, AI Lesson Generator, Practice Analyzer, Jam Companion, Pricing, Account/Settings (if allowed).
7. Save draft (top right). Review warnings.
8. Submit with production release once all policy sections are satisfied (Data Safety, Privacy Policy link, etc.).

## 3. Screenshot Recommendations
| Category | Suggestion | Notes |
|----------|------------|-------|
| Primary value | Trainer + Practice Analyzer | Shows improvement & analytics |
| AI features | AI Lesson Generator | Emphasize personalization |
| Engagement | Jam Companion / Multiplayer | Social or creative angle |
| Monetization | Pricing / Upgrade screen | Show clear tiers |
| Identity | Home / Branding | Cohesive color + logo |

Capture flow can be automated using the `ScreenshotCapturer` panel in-app. Ensure stable data (logged-in, premium if needed) before starting capture.

## 4. Adaptive Icon Notes
- Already configured background color (#0A0F18) and monochrome asset.
- Console does not need a separate monochrome upload; Android build artifacts provide it.
- Verify final APK/AAB includes correct adaptive icon layers (open built app or inspect AAB with bundletool).

## 5. Common Rejection Causes & Checks
| Issue | Prevention |
|-------|------------|
| Wrong icon size | Verified at 512×512 via script (sharp metadata) |
| Oversized file (>1MB) | Current PNG ~14KB |
| Blank/low-contrast feature graphic | Use current branded gradient + logo/text |
| Misleading screenshots | Represent actual in‑app UI only |
| Missing privacy policy | Link to `/privacy.html` (ensure hosted and accessible) |

## 6. Optional Automation (Fastlane Supply)
Install & use Fastlane for repeatable icon updates:
```bash
fastlane supply --json_key play-service-account.json --package_name your.package.name --app_icon resources/icon/generated/app-icon-512.png
```
(Requires service account JSON & Fastlane setup.)

## 7. Updating Assets
Run the comprehensive asset build:
```bash
npm run build:store-assets
```
Outputs updated icons, feature graphic, favicons, manifest, zip bundle.

## 8. Next Possible Enhancements
- Add 1280×720 promo graphic (YouTube/video placeholder).
- Localize screenshots (if multi-language support added).
- Add short Play Store video trailer.
- Generate dark/light feature graphic variants.

## 9. Verification Snippets (PowerShell)
```powershell
# Icon dimensions
Add-Type -AssemblyName System.Drawing
[System.Drawing.Image]::FromFile("$env:USERPROFILE\Downloads\app-icon-512.png").Size

# Feature graphic dimensions
[System.Drawing.Image]::FromFile("resources\icon\generated\feature-graphic-1024x500.png").Size
```
Expected outputs: `{Width=512, Height=512}` and `{Width=1024, Height=500}`.

---
Prepared by GitHub Copilot asset automation. Adjust text as needed before sharing internally.
