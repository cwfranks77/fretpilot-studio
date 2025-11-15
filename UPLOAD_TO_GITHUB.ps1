# ========================================
# FRETPILOT GITHUB UPLOAD SCRIPT
# Copy and paste this entire script into PowerShell
# ========================================

# Step 1: Navigate to project folder
cd C:\Users\ninja\Fretquest

Write-Host "`n🎸 FretPilot GitHub Setup Starting..." -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Step 2: Get your GitHub username
$username = Read-Host "Enter your GitHub username"

# Step 3: Initialize Git (if needed)
if (-not (Test-Path ".git")) {
    Write-Host "✓ Initializing Git..." -ForegroundColor Green
    git init
    git branch -M main
} else {
    Write-Host "✓ Git already initialized" -ForegroundColor Green
}

# Step 4: Configure Git (if needed)
$gitUser = git config user.name
if (-not $gitUser) {
    $name = Read-Host "Enter your name for Git commits"
    $email = Read-Host "Enter your email for Git commits"
    git config user.name "$name"
    git config user.email "$email"
}

# Step 5: Add all files
Write-Host "✓ Staging all files..." -ForegroundColor Green
git add .

# Step 6: Create commit
Write-Host "✓ Creating commit..." -ForegroundColor Green
git commit -m "FretPilot v1.0 - Multi-instrument music mastery platform with AI lessons, practice analyzer, and premium features"

# Step 7: Add GitHub remote
$repoUrl = "https://github.com/$username/fretpilot-app.git"
Write-Host "✓ Setting up remote repository..." -ForegroundColor Green

try {
    git remote remove origin 2>$null
} catch {}

git remote add origin $repoUrl

# Step 8: Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository: $repoUrl`n" -ForegroundColor White

git push -u origin main

# Step 9: Success message
Write-Host "`n✅ SUCCESS! FretPilot is now on GitHub!`n" -ForegroundColor Green
Write-Host "📍 Your repository: https://github.com/$username/fretpilot-app" -ForegroundColor Cyan
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/$username/fretpilot-app/settings/secrets/actions" -ForegroundColor White
Write-Host "2. Add 3 secrets for automated builds:" -ForegroundColor White
Write-Host "   • EMAIL_USERNAME (your Gmail)" -ForegroundColor White
Write-Host "   • EMAIL_PASSWORD (Gmail app password from myaccount.google.com/apppasswords)" -ForegroundColor White
Write-Host "   • EMAIL_TO (email to receive build notifications)" -ForegroundColor White
Write-Host "3. Go to Actions tab and run 'Build and Email FretPilot APK' workflow" -ForegroundColor White
Write-Host "`n💡 Every git push will now automatically build and email you the APK!`n" -ForegroundColor Cyan
