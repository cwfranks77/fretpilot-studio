Param(
  [switch]$BundleOnly,
  [switch]$SkipBuild
)

Write-Host "=== FretPilot Release Prep (v1.0.0) ===" -ForegroundColor Cyan

if(-not $SkipBuild){
  Write-Host "[1/5] Building web assets..." -ForegroundColor Yellow
  npm run build
  if($LASTEXITCODE -ne 0){ throw "Web build failed" }
  Write-Host "[2/5] Syncing Capacitor..." -ForegroundColor Yellow
  npx cap sync android
  if($LASTEXITCODE -ne 0){ throw "Capacitor sync failed" }
}

Push-Location android
Write-Host "[3/5] Cleaning Gradle..." -ForegroundColor Yellow
./gradlew clean
if($LASTEXITCODE -ne 0){ throw "Gradle clean failed" }

if($BundleOnly){
  Write-Host "[4/5] Generating bundleRelease (AAB only)..." -ForegroundColor Yellow
  ./gradlew bundleRelease
  if($LASTEXITCODE -ne 0){ throw "bundleRelease failed" }
} else {
  Write-Host "[4/5] Generating bundleRelease + assembleRelease..." -ForegroundColor Yellow
  ./gradlew bundleRelease assembleRelease
  if($LASTEXITCODE -ne 0){ throw "Android release build failed" }
}
Pop-Location

$releaseDir = Join-Path $PSScriptRoot 'release'
if(!(Test-Path $releaseDir)){ New-Item -ItemType Directory -Path $releaseDir | Out-Null }

$apkSrc = "android\app\build\outputs\apk\release\app-release.apk"
$aabSrc = "android\app\build\outputs\bundle\release\app-release.aab"
$apkDest = Join-Path $releaseDir 'FretPilot-1.0.0-release.apk'
$aabDest = Join-Path $releaseDir 'FretPilot-1.0.0-release.aab'

if(Test-Path $apkSrc -and -not $BundleOnly){ Copy-Item $apkSrc $apkDest -Force }
if(Test-Path $aabSrc){ Copy-Item $aabSrc $aabDest -Force }

Write-Host "[5/5] Artifact Summary:" -ForegroundColor Yellow
Get-ChildItem $releaseDir | Select-Object Name,@{Name='SizeMB';Expression={[math]::Round($_.Length/1MB,2)}} | Format-Table

Write-Host "\nUpload the AAB (preferred) to Google Play Console > Production > Create Release." -ForegroundColor Green
Write-Host "Complete Data Safety + Privacy Policy (link in footer) before final submission." -ForegroundColor Green
