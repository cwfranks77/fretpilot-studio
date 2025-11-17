# Quick Script to Help Fix Vercel Domain Issue
param(
    [switch]$OpenVercel,
    [switch]$CheckDNS,
    [switch]$All
)

Write-Host "`n🔧 VERCEL DOMAIN FIX HELPER" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

if ($All -or $CheckDNS) {
    Write-Host "📡 Checking DNS Status..." -ForegroundColor Yellow
    Write-Host "`nChecking fretpilotstudio.com:"
    nslookup fretpilotstudio.com 8.8.8.8
    
    Write-Host "`nChecking www.fretpilotstudio.com:"
    nslookup www.fretpilotstudio.com 8.8.8.8
    
    Write-Host "`nChecking Vercel deployment URL:"
    nslookup fretpilot-studio.vercel.app
}

if ($All -or $OpenVercel) {
    Write-Host "`n🌐 Opening Vercel Dashboard..." -ForegroundColor Yellow
    
    Start-Process "https://vercel.com/cwfranks77/fretpilot-studio/settings/domains"
    Start-Sleep -Seconds 2
    Start-Process "https://vercel.com/domains"
    Start-Sleep -Seconds 2
    Start-Process "https://vercel.com/cwfranks77/fretpilot-studio"
    
    Write-Host "✅ Opened:" -ForegroundColor Green
    Write-Host "   1. Your project domains page"
    Write-Host "   2. Vercel domains (purchased domains)"
    Write-Host "   3. Your project dashboard"
}

Write-Host "`n📋 WHAT TO DO:" -ForegroundColor Cyan
Write-Host "1. Look at the Vercel Domains page that just opened" -ForegroundColor White
Write-Host "2. Check if 'fretpilotstudio.com' is listed" -ForegroundColor White
Write-Host "3. If NOT listed → Click 'Add Domain' and add it" -ForegroundColor White
Write-Host "4. If listed with red X → Click on it to see DNS instructions" -ForegroundColor White
Write-Host "5. Follow the instructions in FIX_DOMAIN_NOW.md" -ForegroundColor White

Write-Host "`n🎯 EXPECTED RESULT:" -ForegroundColor Cyan
Write-Host "   After adding domain and waiting 5-30 min for DNS:" -ForegroundColor White
Write-Host "   ✅ https://fretpilotstudio.com → Your site" -ForegroundColor Green
Write-Host "   ✅ https://www.fretpilotstudio.com → Redirects to apex" -ForegroundColor Green
Write-Host "   ✅ https://fretpilotstudio.com/store → Your store" -ForegroundColor Green

Write-Host "`n💡 Quick Commands:" -ForegroundColor Yellow
Write-Host "   .\fix-vercel-domain.ps1 -All        # Open Vercel + check DNS"
Write-Host "   .\fix-vercel-domain.ps1 -CheckDNS   # Just check DNS status"
Write-Host "   .\fix-vercel-domain.ps1 -OpenVercel # Just open Vercel pages"
Write-Host ""

# If no parameters, show help
if (-not ($All -or $CheckDNS -or $OpenVercel)) {
    Write-Host "💡 Run with -All to do everything:" -ForegroundColor Yellow
    Write-Host "   .\fix-vercel-domain.ps1 -All`n" -ForegroundColor White
}
