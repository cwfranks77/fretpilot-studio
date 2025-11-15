# FretPilot GitHub Quick Setup Script
# Run this after creating your GitHub repo

Write-Host "`n🎸 FretPilot GitHub Setup" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "`n✓ Initializing Git repository..." -ForegroundColor Green
    git init
} else {
    Write-Host "`n✓ Git already initialized" -ForegroundColor Green
}

# Add all files
Write-Host "✓ Adding files..." -ForegroundColor Green
git add .

# Commit
Write-Host "✓ Creating initial commit..." -ForegroundColor Green
git commit -m "Initial FretPilot commit - error boundary, images, multi-feature app"

# Set main branch
Write-Host "✓ Setting main branch..." -ForegroundColor Green
git branch -M main

# Add remote
$repoUrl = "https://github.com/$username/fretpilot-app.git"
Write-Host "✓ Adding remote: $repoUrl" -ForegroundColor Green

try {
    git remote remove origin 2>$null
} catch {}

git remote add origin $repoUrl

# Push
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "(You may be prompted for GitHub credentials)`n" -ForegroundColor Yellow

git push -u origin main

Write-Host "`n✅ SUCCESS! Your code is on GitHub!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/$username/fretpilot-app/settings/secrets/actions" -ForegroundColor White
Write-Host "2. Add these 3 secrets:" -ForegroundColor White
Write-Host "   - EMAIL_USERNAME (your Gmail address)" -ForegroundColor White
Write-Host "   - EMAIL_PASSWORD (Gmail app password from myaccount.google.com/apppasswords)" -ForegroundColor White
Write-Host "   - EMAIL_TO (email to receive builds)" -ForegroundColor White
Write-Host "3. Go to Actions tab and run the workflow!" -ForegroundColor White
Write-Host "`n📖 See GITHUB_SETUP.md for detailed instructions`n" -ForegroundColor Cyan
