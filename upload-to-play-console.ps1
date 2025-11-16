# ===================================================================
# FretPilot Studio & School - Play Console Upload Script
# ===================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FretPilot Studio & School v1.0.0" -ForegroundColor Yellow
Write-Host "  Google Play Console Upload Helper" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$releaseAAB = "release\FretPilot-1.0.0-release.aab"
$releaseAPK = "release\FretPilot-1.0.0-release.apk"

# Verify artifacts exist
if(!(Test-Path $releaseAAB)){
    Write-Host "ERROR: Release AAB not found!" -ForegroundColor Red
    Write-Host "Run: .\prepare-release.ps1" -ForegroundColor Yellow
    exit 1
}

# Show artifact info
Write-Host "[OK] Release Artifacts Ready:" -ForegroundColor Green
$aabFile = Get-Item $releaseAAB
$apkFile = Get-Item $releaseAPK
Write-Host "  AAB: $($aabFile.Name) - $([math]::Round($aabFile.Length/1MB,2)) MB" -ForegroundColor White
Write-Host "  APK: $($apkFile.Name) - $([math]::Round($apkFile.Length/1MB,2)) MB" -ForegroundColor White

Write-Host "`n[INFO] App Information:" -ForegroundColor Cyan
Write-Host "  Package ID: com.fretpilot.app" -ForegroundColor White
Write-Host "  Version Code: 2" -ForegroundColor White
Write-Host "  Version Name: 1.0.0" -ForegroundColor White
Write-Host "  Min SDK: Check gradle" -ForegroundColor White

Write-Host "`n[STEPS] Upload Steps:" -ForegroundColor Yellow
Write-Host "  1. Opening Google Play Console..." -ForegroundColor White
Write-Host "  2. Navigate to: Production > Create Release" -ForegroundColor White
Write-Host "  3. Upload the AAB file (PREFERRED)" -ForegroundColor White
Write-Host "  4. Fill out Release Notes" -ForegroundColor White
Write-Host "  5. Complete Data Safety form" -ForegroundColor White
Write-Host "  6. Add Privacy Policy URL" -ForegroundColor White
Write-Host "  7. Review and Start Rollout" -ForegroundColor White

Write-Host "`n[REQUIRED] Required Information:" -ForegroundColor Cyan
Write-Host "  Privacy Policy: https://yourdomain.com/privacy.html" -ForegroundColor White
Write-Host "  Terms of Service: https://yourdomain.com/terms.html" -ForegroundColor White
Write-Host "  Support Email: support@fretpilot.com" -ForegroundColor White

Write-Host "`n[WARNING] Data Safety Declaration:" -ForegroundColor Yellow
Write-Host "  - RECORD_AUDIO: For multiplayer jam sessions" -ForegroundColor White
Write-Host "  - INTERNET: For online features" -ForegroundColor White
Write-Host "  - AdMob: Optional advertising (declare if enabled)" -ForegroundColor White

Write-Host "`n[TEMPLATE] Release Notes Template:" -ForegroundColor Cyan
Write-Host @"
First public release (1.0.0)

Features:
• Multiplayer jam sessions with real-time audio
• AI-powered lesson generator
• Practice analyzer with mistake heatmap
• Smart session matchmaking
• Achievement system with 6 achievements
• Metronome & tuner tools
• Chord library with 500+ chords
• Jam companion backing tracks
• Professional animated UI with custom icons

What's New:
• Complete redesign with badass gradient logos
• Feature-specific animated icons
• Enhanced audio processing
• Cloud sync ready (backend pending)
"@ -ForegroundColor White

Write-Host "`n[WEB] Opening Play Console..." -ForegroundColor Green
Start-Sleep -Seconds 2

# Open Play Console
Start-Process "https://play.google.com/console"

Write-Host "`n[FOLDER] Opening release folder..." -ForegroundColor Green
explorer.exe (Resolve-Path "release").Path

Write-Host "`n[CHECK] Ready to Upload!" -ForegroundColor Green
Write-Host "  Drag and drop the AAB file to Play Console" -ForegroundColor Yellow
Write-Host "  Or use the Choose file button`n" -ForegroundColor Yellow

# Copy AAB to desktop for easy access
$desktopPath = [Environment]::GetFolderPath("Desktop")
$desktopAAB = Join-Path $desktopPath "FretPilot-1.0.0-UPLOAD-TO-PLAY.aab"
Copy-Item $releaseAAB $desktopAAB -Force
Write-Host "[OK] AAB copied to Desktop for easy upload!" -ForegroundColor Green
Write-Host "  Location: $desktopAAB`n" -ForegroundColor Cyan

Write-Host "Press any key when upload is complete..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`n[SUCCESS] Upload Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Wait for Play Console processing (5-10 mins)" -ForegroundColor White
Write-Host "  2. Review pre-launch report" -ForegroundColor White
Write-Host "  3. Start rollout (10% staged recommended)" -ForegroundColor White
Write-Host "  4. Monitor crashes in Android Vitals`n" -ForegroundColor White
