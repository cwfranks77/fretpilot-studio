# FretPilot Studio - Screenshot Capture Automation
# Run this script to generate all required Play Store screenshots

param(
    [string]$OutputDir = "screenshots",
    [string]$DeviceSerial = "",
    [switch]$Help
)

if ($Help) {
    Write-Host @"
FretPilot Screenshot Capture Tool

Usage:
  .\capture-screenshots.ps1 [-OutputDir <path>] [-DeviceSerial <serial>]

Parameters:
  -OutputDir     Output directory for screenshots (default: screenshots/)
  -DeviceSerial  Specific device serial if multiple connected
  -Help          Show this help message

Examples:
  .\capture-screenshots.ps1
  .\capture-screenshots.ps1 -OutputDir "play-store-assets"
  .\capture-screenshots.ps1 -DeviceSerial emulator-5554

Requirements:
  - ADB installed and in PATH
  - Android device/emulator connected
  - FretPilot app installed and running
"@
    exit 0
}

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
    Write-Host "✓ Created output directory: $OutputDir" -ForegroundColor Green
}

# Check ADB
try {
    $null = adb version
    Write-Host "✓ ADB found" -ForegroundColor Green
} catch {
    Write-Host "✗ ADB not found. Install Android SDK Platform Tools." -ForegroundColor Red
    exit 1
}

# Device selection
$adbDevice = if ($DeviceSerial) { "-s $DeviceSerial" } else { "" }

# Check device connection
$devices = adb devices | Select-String "device$"
if ($devices.Count -eq 0) {
    Write-Host "✗ No devices connected. Start emulator or connect device." -ForegroundColor Red
    exit 1
}

Write-Host "`n📸 Starting screenshot capture sequence..." -ForegroundColor Cyan
Write-Host "   Follow prompts to navigate app screens`n"

# Screenshot definitions
$screenshots = @(
    @{
        Name = "01_home_dashboard"
        Description = "Home screen with navigation buttons"
        Instructions = "Ensure you're on the home screen with all nav buttons visible"
    },
    @{
        Name = "02_canvas_lesson"
        Description = "Canvas lesson with fretboard"
        Instructions = "Navigate to Lessons → Click any lesson to show canvas fretboard"
    },
    @{
        Name = "03_practice_analyzer"
        Description = "Practice analyzer / heatmap"
        Instructions = "Navigate to Practice Analyzer (or show mock if not ready)"
    },
    @{
        Name = "04_metronome_tuner"
        Description = "Metronome & Tuner combo"
        Instructions = "Navigate to Tools → Show metronome and tuner"
    },
    @{
        Name = "05_pricing_page"
        Description = "Subscription pricing tiers"
        Instructions = "Navigate to Pricing page showing all 3 tiers"
    },
    @{
        Name = "06_login_onboarding"
        Description = "Login/onboarding screen"
        Instructions = "Log out if needed, show login/welcome screen"
    },
    @{
        Name = "07_jam_companion"
        Description = "Jam companion feature (beta)"
        Instructions = "Navigate to Jam Companion (or skip if not implemented)"
    },
    @{
        Name = "08_settings_profile"
        Description = "Settings or user profile"
        Instructions = "Open settings/profile page"
    }
)

$capturedCount = 0

foreach ($screenshot in $screenshots) {
    Write-Host "`n[$($capturedCount + 1)/$($screenshots.Count)] " -NoNewline -ForegroundColor Yellow
    Write-Host $screenshot.Description -ForegroundColor White
    Write-Host "    → $($screenshot.Instructions)" -ForegroundColor Gray
    
    Write-Host "`n    Press ENTER when ready (or 's' to skip)..." -NoNewline -ForegroundColor Cyan
    $input = Read-Host
    
    if ($input -eq 's') {
        Write-Host "    ⊗ Skipped" -ForegroundColor Yellow
        continue
    }
    
    # Capture screenshot
    $filename = "$OutputDir/$($screenshot.Name).png"
    
    try {
        # Execute ADB screencap
        if ($DeviceSerial) {
            adb -s $DeviceSerial exec-out screencap -p > $filename
        } else {
            adb exec-out screencap -p > $filename
        }
        
        # Verify file created
        if (Test-Path $filename) {
            $fileSize = (Get-Item $filename).Length
            if ($fileSize -gt 1000) {
                Write-Host "    ✓ Captured: $filename ($([math]::Round($fileSize/1KB, 1)) KB)" -ForegroundColor Green
                $capturedCount++
            } else {
                Write-Host "    ✗ Failed: File too small (corrupted?)" -ForegroundColor Red
            }
        } else {
            Write-Host "    ✗ Failed: File not created" -ForegroundColor Red
        }
    } catch {
        Write-Host "    ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "📊 Capture Summary" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Captured: $capturedCount / $($screenshots.Count)" -ForegroundColor $(if ($capturedCount -eq $screenshots.Count) { "Green" } else { "Yellow" })
Write-Host "Location: $((Resolve-Path $OutputDir).Path)" -ForegroundColor White

if ($capturedCount -ge 2) {
    Write-Host "`n✓ Minimum 2 screenshots captured (Play Store requirement met)" -ForegroundColor Green
} else {
    Write-Host "`n⚠ Need at least 2 screenshots for Play Store submission" -ForegroundColor Yellow
}

# Post-processing suggestions
Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review screenshots in: $OutputDir" -ForegroundColor White
Write-Host "2. (Optional) Crop/resize for consistency:" -ForegroundColor White
Write-Host "   magick mogrify -resize 1080x1920^ -gravity center -extent 1080x1920 $OutputDir/*.png" -ForegroundColor Gray
Write-Host "3. Upload to Play Console → Store Listing → Graphics" -ForegroundColor White
Write-Host "4. Add captions in Play Console description if needed" -ForegroundColor White

Write-Host "`n✅ Screenshot capture complete!" -ForegroundColor Green
