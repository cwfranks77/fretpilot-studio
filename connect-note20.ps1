param(
  [switch]$DownloadTools,
  [switch]$InstallApk
)

Write-Host "\n== FretPilot: Connect Note 20 (ADB) ==" -ForegroundColor Cyan

function Find-AdbPath {
  $c = Get-Command adb -ErrorAction SilentlyContinue
  if ($c) { return $c.Source }
  $cands = @(
    "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    "C:\\Android\\platform-tools\\adb.exe",
    "C:\\Program Files (x86)\\Android\\android-sdk\\platform-tools\\adb.exe",
    "C:\\Program Files\\Android\\android-sdk\\platform-tools\\adb.exe"
  )
  foreach ($p in $cands) { if (Test-Path $p) { return $p } }
  return $null
}

$adb = Find-AdbPath
if (-not $adb) {
  Write-Host "ADB not found in PATH." -ForegroundColor Yellow
  if ($DownloadTools) {
    try {
      $zip = "$env:USERPROFILE\Downloads\platform-tools-latest-windows.zip"
      $dest = "C:\\Android"
      if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }
      Write-Host "Downloading Android Platform-Tools from Google..." -ForegroundColor Yellow
      $url = "https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
      Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
      Write-Host "Extracting..." -ForegroundColor Yellow
      Expand-Archive -Path $zip -DestinationPath $dest -Force
      $adb = "C:\\Android\\platform-tools\\adb.exe"
      if (-not (Test-Path $adb)) { $adb = Get-ChildItem -Path $dest -Recurse -Filter adb.exe | Select-Object -First 1 | ForEach-Object FullName }
      if ($adb) { Write-Host "ADB ready at: $adb" -ForegroundColor Green } else { Write-Host "Failed to locate adb.exe after extract." -ForegroundColor Red }
    } catch {
      Write-Host "Failed to download/extract Platform-Tools. Download manually: https://developer.android.com/studio/releases/platform-tools" -ForegroundColor Red
    }
  } else {
    Write-Host "Run again with -DownloadTools to auto-download Platform-Tools." -ForegroundColor Yellow
    Write-Host "Or install Android SDK Platform-Tools and add to PATH." -ForegroundColor Yellow
  }
}

if (-not $adb) {
  Write-Host "Cannot continue without adb." -ForegroundColor Red
  Write-Host "Phone steps: Enable Developer options (tap Build number 7 times), enable USB debugging, set USB to File Transfer, then re-run." -ForegroundColor Gray
  exit 1
}

Write-Host "Restarting adb server..." -ForegroundColor Gray
& $adb kill-server | Out-Null
& $adb start-server | Out-Null

Write-Host "Checking devices..." -ForegroundColor Gray
$devOut = & $adb devices
$listed = $devOut | Select-String "\tdevice$"
if (-not $listed) {
  Write-Host "No authorized devices detected." -ForegroundColor Yellow
  Write-Host "On your Note 20:" -ForegroundColor White
  Write-Host "  1) Settings > About phone > Software information > tap Build number 7 times" -ForegroundColor White
  Write-Host "  2) Settings > Developer options > enable USB debugging" -ForegroundColor White
  Write-Host "  3) Connect via USB, set USB mode to File Transfer (MTP)" -ForegroundColor White
  Write-Host "  4) When prompted on phone, tap 'Allow' for RSA fingerprint" -ForegroundColor White
  Write-Host "If still not listed, install Samsung USB Driver and replug cable." -ForegroundColor White
  Write-Host "Download: https://developer.samsung.com/mobile/android-usb-driver.html" -ForegroundColor Gray
  Write-Host "Then re-run this script." -ForegroundColor Yellow
  exit 2
}

Write-Host "Device connected: " -ForegroundColor Green
$devOut | ForEach-Object { Write-Host "  $_" -ForegroundColor Green }

$apk = "$env:USERPROFILE\Downloads\FretPilot-release.apk"
if (-not (Test-Path $apk)) {
  $apk = "$env:USERPROFILE\Downloads\FretPilot-debug.apk"
}

if ($InstallApk) {
  if (Test-Path $apk) {
    Write-Host "Installing: $apk" -ForegroundColor Cyan
    # -r replace, -d allow version downgrade, -g grant all runtime permissions
    & $adb install -r -d -g "$apk"
  } else {
    Write-Host "APK not found in Downloads. Expected FretPilot-release.apk or FretPilot-debug.apk" -ForegroundColor Yellow
  }
} else {
  Write-Host "To install the APK now, re-run with: .\\connect-note20.ps1 -InstallApk" -ForegroundColor Gray
}
