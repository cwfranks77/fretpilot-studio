# FretPilot Studio - Build Release AAB for Play Console
# This script builds the signed AAB file ready for Play Console upload

Write-Host "🏗️  Building Release AAB for FretPilot Studio" -ForegroundColor Cyan
Write-Host ""

$keystorePropsPath = "android\app\keystore\keystore.properties"

# Check if keystore.properties exists
if (-not (Test-Path $keystorePropsPath)) {
    Write-Host "❌ keystore.properties not found!" -ForegroundColor Red
    Write-Host "Please run: .\scripts\setup-keystore-properties.ps1 first" -ForegroundColor Yellow
    exit
}

Write-Host "Step 1: Building web assets..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Step 2: Syncing to Android..." -ForegroundColor Cyan
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Sync failed!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Step 3: Building release AAB..." -ForegroundColor Cyan
Push-Location android
.\gradlew clean bundleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ AAB built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Your AAB file is located at:" -ForegroundColor Cyan
    Write-Host "   android\app\build\outputs\bundle\release\app-release.aab" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://play.google.com/console" -ForegroundColor Yellow
    Write-Host "2. Create app (if not already created)" -ForegroundColor Yellow
    Write-Host "3. Upload the AAB file to Internal Testing" -ForegroundColor Yellow
    Write-Host "4. Complete store listing and submit for review" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ AAB build failed!" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
}

Pop-Location

