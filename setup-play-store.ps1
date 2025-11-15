# FretPilot - Play Store Launch Setup Script
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "   FRETPILOT PLAY STORE SETUP" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: AdMob Account
Write-Host "STEP 1: CREATE ADMOB ACCOUNT" -ForegroundColor Yellow
Write-Host "---------------------------------------"
Write-Host "1. Go to: https://admob.google.com"
Write-Host "2. Sign in with your Google account"
Write-Host "3. Click 'Get Started' or 'Sign Up'"
Write-Host "`nPress Enter when you've created your AdMob account..." -ForegroundColor Cyan
Read-Host

# Step 2: Register App
Write-Host "`nSTEP 2: REGISTER APP IN ADMOB" -ForegroundColor Yellow
Write-Host "---------------------------------------"
Write-Host "1. In AdMob dashboard, click 'Apps' then 'Add App'"
Write-Host "2. Select 'Android'"
Write-Host "3. App name: FretPilot"
Write-Host "4. Package name: com.fretpilot.app"
Write-Host "5. Click 'Add'"
Write-Host "`nPress Enter when app is registered..." -ForegroundColor Cyan
Read-Host

# Step 3: Get App ID
Write-Host "`nSTEP 3: COPY YOUR APP ID" -ForegroundColor Yellow
Write-Host "---------------------------------------"
Write-Host "After registering, AdMob shows your App ID"
Write-Host "Format: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
Write-Host "`nPaste your AdMob App ID here: " -ForegroundColor Cyan -NoNewline
$appId = Read-Host

# Step 4: Create Ad Units
Write-Host "`nSTEP 4: CREATE AD UNITS" -ForegroundColor Yellow
Write-Host "---------------------------------------"
Write-Host "1. In your app, click 'Ad units' then 'Add ad unit'"
Write-Host "2. Select 'Banner'"
Write-Host "3. Name: FretPilot Banner"
Write-Host "4. Click 'Create ad unit'"
Write-Host "5. Copy the Ad unit ID"
Write-Host "`nPaste your Banner Ad Unit ID: " -ForegroundColor Cyan -NoNewline
$bannerId = Read-Host

Write-Host "`n6. Create another ad unit: Select 'Interstitial'"
Write-Host "7. Name: FretPilot Interstitial"
Write-Host "`nPaste your Interstitial Ad Unit ID: " -ForegroundColor Cyan -NoNewline
$interstitialId = Read-Host

Write-Host "`n8. Create one more: Select 'Rewarded'"
Write-Host "9. Name: FretPilot Reward"
Write-Host "`nPaste your Rewarded Ad Unit ID: " -ForegroundColor Cyan -NoNewline
$rewardedId = Read-Host

# Summary
Write-Host "`n`n================================" -ForegroundColor Cyan
Write-Host "   YOUR ADMOB CREDENTIALS" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "App ID: $appId" -ForegroundColor Yellow
Write-Host "Banner ID: $bannerId" -ForegroundColor Yellow
Write-Host "Interstitial ID: $interstitialId" -ForegroundColor Yellow
Write-Host "Rewarded ID: $rewardedId" -ForegroundColor Yellow

# Save to file
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$credentials = @"
# FretPilot AdMob Production Credentials
# Generated: $timestamp

## AdMob App ID
$appId

## Ad Unit IDs
Banner: $bannerId
Interstitial: $interstitialId
Rewarded: $rewardedId

## Integration Steps
1. Replace test IDs in android/app/src/main/AndroidManifest.xml (line 40)
2. Replace test IDs in src/services/adService.js (lines 31, 46, 59)
3. Build release AAB: cd android && .\gradlew.bat bundleRelease
4. Upload to Play Console: android/app/build/outputs/bundle/release/app-release.aab
"@

$credFile = "ADMOB_CREDENTIALS.txt"
$credentials | Out-File -FilePath $credFile -Encoding UTF8
Write-Host "`nCredentials saved to: $credFile" -ForegroundColor Green

# Generate email template
$emailBody = @"
FretPilot App - AdMob Production IDs

APP DETAILS:
- App Name: FretPilot
- Package: com.fretpilot.app
- Platform: Android

ADMOB CREDENTIALS:
- App ID: $appId
- Banner Ad Unit: $bannerId
- Interstitial Ad Unit: $interstitialId
- Rewarded Ad Unit: $rewardedId

NEXT STEPS:
1. Replace test AdMob IDs in codebase with production IDs above
2. Build signed release AAB bundle
3. Complete Play Console app listing
4. Upload AAB and submit for review
"@

$emailFile = "PLAY_STORE_EMAIL.txt"
$emailBody | Out-File -FilePath $emailFile -Encoding UTF8
Write-Host "Email template saved to: $emailFile" -ForegroundColor Green

Write-Host "`n`nQUICK REFERENCE - UPDATE THESE FILES:" -ForegroundColor Yellow
Write-Host "---------------------------------------"
Write-Host "1. android/app/src/main/AndroidManifest.xml (line 40)"
Write-Host "   Change App ID to: $appId"
Write-Host "`n2. src/services/adService.js"
Write-Host "   Line 31 - Banner: $bannerId"
Write-Host "   Line 46 - Interstitial: $interstitialId"
Write-Host "   Line 59 - Rewarded: $rewardedId"

Write-Host "`n`nSETUP COMPLETE!" -ForegroundColor Green
Write-Host "`nNext: Update the code files above, then run:" -ForegroundColor Yellow
Write-Host "  cd android"
Write-Host "  .\gradlew.bat bundleRelease"
Write-Host "`nUpload the AAB file to Google Play Console`n"
