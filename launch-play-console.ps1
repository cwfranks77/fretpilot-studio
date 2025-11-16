#!/usr/bin/env pwsh
# Quick launcher for Google Play Console

Write-Host "`n🚀 Opening Google Play Console...`n" -ForegroundColor Cyan

# Direct link to create new app
$playConsoleUrl = "https://play.google.com/console/developers"

# Open in default browser
Start-Process $playConsoleUrl

Write-Host "📱 Play Console opened in browser" -ForegroundColor Green
Write-Host "`n📋 Quick Reference:" -ForegroundColor Yellow
Write-Host "   • Create app: Click 'Create app' button" -ForegroundColor White
Write-Host "   • Package name: com.fretpilot.app" -ForegroundColor Cyan
Write-Host "   • App name: FretPilot" -ForegroundColor Cyan
Write-Host "`n💡 Need help? Check PLAY_STORE_GUIDE.md`n" -ForegroundColor Gray
