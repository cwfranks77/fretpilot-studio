#!/usr/bin/env pwsh
<#
Sign Windows executables produced by electron-builder using a PFX certificate.
Prerequisites:
  - signtool.exe available (Windows SDK)
  - Set environment variables or pass params

Environment Variables (preferred):
  WINDOWS_CERT_PATH   Path to code-signing certificate (.pfx)
  WINDOWS_CERT_PASSWORD  Password for the PFX
  TIMESTAMP_URL   Optional (default: http://timestamp.digicert.com)

Usage examples:
  $env:WINDOWS_CERT_PATH="C:\certs\codesign.pfx"; $env:WINDOWS_CERT_PASSWORD="pass"; ./sign-windows.ps1
  ./sign-windows.ps1 -CertPath C:\certs\codesign.pfx -Password pass -Files dist-electron\FretPilot*Setup*.exe
#>
param(
  [string]$CertPath = $env:WINDOWS_CERT_PATH,
  [string]$Password = $env:WINDOWS_CERT_PASSWORD,
  [string]$TimestampUrl = $(if ($env:TIMESTAMP_URL) { $env:TIMESTAMP_URL } else { 'http://timestamp.digicert.com' }),
  [string]$Files = 'dist-electron\FretPilot*.exe'
)

Write-Host "\n🔐 Windows Code Signing" -ForegroundColor Cyan

if (-not $CertPath -or -not (Test-Path $CertPath)) { Write-Host "❌ Certificate path invalid: $CertPath" -ForegroundColor Red; exit 1 }
if (-not $Password) { Write-Host "❌ Certificate password missing" -ForegroundColor Red; exit 1 }

# Locate signtool
$possible = @(
  "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe",
  "C:\Program Files (x86)\Windows Kits\10\bin\x64\signtool.exe"
) | Where-Object { Test-Path $_ }

if (-not $possible) { Write-Host "❌ signtool.exe not found. Install Windows 10/11 SDK." -ForegroundColor Red; exit 1 }
$signtool = $possible[0]
Write-Host "Using signtool: $signtool" -ForegroundColor Yellow

# Expand file pattern
$filesToSign = Get-ChildItem -Path $Files -ErrorAction SilentlyContinue
if (-not $filesToSign) { Write-Host "❌ No files matched pattern: $Files" -ForegroundColor Red; exit 1 }

foreach ($f in $filesToSign) {
  Write-Host "Signing $($f.FullName)" -ForegroundColor Green
  & $signtool sign /f $CertPath /p $Password /fd SHA256 /tr $TimestampUrl /td SHA256 "$($f.FullName)"
  if ($LASTEXITCODE -ne 0) { Write-Host "❌ Failed signing $($f.Name)" -ForegroundColor Red; exit 1 }
}

Write-Host "\n✅ All files signed successfully" -ForegroundColor Green
