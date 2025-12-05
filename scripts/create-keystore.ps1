# FretPilot Studio - Keystore Creation Script
# This script creates the release keystore for Play Console publishing

Write-Host "🔐 Creating Release Keystore for FretPilot Studio" -ForegroundColor Cyan
Write-Host ""

$keystoreDir = "android\app\keystore"
$keystorePath = "$keystoreDir\fretpilot-release.keystore"

# Create keystore directory if it doesn't exist
if (-not (Test-Path $keystoreDir)) {
    New-Item -ItemType Directory -Path $keystoreDir -Force | Out-Null
    Write-Host "✅ Created keystore directory" -ForegroundColor Green
}

# Check if keystore already exists
if (Test-Path $keystorePath) {
    Write-Host "⚠️  Keystore already exists at: $keystorePath" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "❌ Keystore creation cancelled" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "You'll be prompted to enter:" -ForegroundColor Yellow
Write-Host "  - A strong password (save it securely!)" -ForegroundColor Yellow
Write-Host "  - Your name: Charles Franks" -ForegroundColor Yellow
Write-Host "  - Organization: The Franks Standard" -ForegroundColor Yellow
Write-Host "  - City, State, Country (US)" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Ready to create keystore? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Keystore creation cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Creating keystore..." -ForegroundColor Cyan

# Change to keystore directory
Push-Location $keystoreDir

# Generate keystore
keytool -genkeypair -v -keystore fretpilot-release.keystore -alias fretpilot -keyalg RSA -keysize 2048 -validity 10000

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Keystore created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create keystore.properties file with your password" -ForegroundColor Yellow
    Write-Host "2. Run: .\scripts\setup-keystore-properties.ps1" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Keystore creation failed" -ForegroundColor Red
}

Pop-Location

