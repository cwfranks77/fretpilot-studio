# FretPilot Studio - Keystore Properties Setup
# This script helps you create the keystore.properties file

Write-Host "🔐 Setting up keystore.properties" -ForegroundColor Cyan
Write-Host ""

$keystorePropsPath = "android\app\keystore\keystore.properties"
$keystorePath = "android\app\keystore\fretpilot-release.keystore"

# Check if keystore exists
if (-not (Test-Path $keystorePath)) {
    Write-Host "❌ Keystore not found at: $keystorePath" -ForegroundColor Red
    Write-Host "Please run: .\scripts\create-keystore.ps1 first" -ForegroundColor Yellow
    exit
}

# Check if properties file already exists
if (Test-Path $keystorePropsPath) {
    Write-Host "⚠️  keystore.properties already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "❌ Setup cancelled" -ForegroundColor Red
        exit
    }
}

Write-Host "Enter your keystore password (it will be saved in plain text in keystore.properties)" -ForegroundColor Yellow
Write-Host "⚠️  Keep this file secure and never commit it to git!" -ForegroundColor Red
Write-Host ""

$storePassword = Read-Host "Enter store password" -AsSecureString
$storePasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePassword))

$keyPassword = Read-Host "Enter key password (usually same as store password)" -AsSecureString
$keyPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))

$propsContent = @"
storeFile=keystore/fretpilot-release.keystore
storePassword=$storePasswordPlain
keyAlias=fretpilot
keyPassword=$keyPasswordPlain
"@

$propsContent | Out-File -FilePath $keystorePropsPath -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✅ keystore.properties created!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  SECURITY WARNING:" -ForegroundColor Red
Write-Host "   - This file contains your password in plain text" -ForegroundColor Yellow
Write-Host "   - Make sure android/app/keystore/ is in .gitignore" -ForegroundColor Yellow
Write-Host "   - Never commit this file to version control!" -ForegroundColor Yellow
Write-Host ""

