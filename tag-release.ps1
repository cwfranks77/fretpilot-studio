#!/usr/bin/env pwsh
<#
Tag and push a new semantic version release. Usage examples:
  ./tag-release.ps1 -Level patch
  ./tag-release.ps1 -Version 1.1.0
The script will:
  1. Validate clean working tree
  2. Determine new version (bump or explicit)
  3. Update package.json version
  4. Commit the change
  5. Create annotated git tag
  6. Push commit & tag (origin)
Ensure you have permissions. Trigger CI workflow on tag push.
#>
param(
  [ValidateSet('major','minor','patch')]
  [string]$Level = 'patch',
  [string]$Version,
  [switch]$NoPush
)

Write-Host "\n🚀 FretPilot Release Tagger" -ForegroundColor Cyan

# 1. Ensure clean tree
$changes = git status --porcelain
if ($changes) {
  Write-Host "❌ Working tree not clean. Commit or stash changes first." -ForegroundColor Red
  exit 1
}

# 2. Read current version
$pkgPath = Join-Path $PSScriptRoot 'package.json'
if (!(Test-Path $pkgPath)) { Write-Host "❌ package.json not found" -ForegroundColor Red; exit 1 }
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$cur = $pkg.version
Write-Host "Current version: $cur" -ForegroundColor Yellow

function BumpVersion($v,$level){
  $parts = $v.Split('.')
  if ($parts.Length -lt 3){ throw "Invalid version $v" }
  [int]$maj=[int]$parts[0]; [int]$min=[int]$parts[1]; [int]$pat=[int]$parts[2]
  switch ($level) {
    'major' { $maj++; $min=0; $pat=0 }
    'minor' { $min++; $pat=0 }
    'patch' { $pat++ }
  }
  return "$maj.$min.$pat"
}

$newVersion = if ($Version) { $Version } else { BumpVersion $cur $Level }
Write-Host "New version: $newVersion" -ForegroundColor Green

if ($newVersion -eq $cur) { Write-Host "❌ New version equals current; aborting." -ForegroundColor Red; exit 1 }

# 3. Update package.json
$pkg.version = $newVersion
$pkg | ConvertTo-Json -Depth 10 | Out-File $pkgPath -Encoding utf8

# 4. Commit
git add package.json
git commit -m "chore(release): v$newVersion"

# 5. Tag
$tag = "v$newVersion"
Write-Host "Creating tag $tag" -ForegroundColor Cyan
git tag -a $tag -m "FretPilot release $tag"

# 6. Push
if (-not $NoPush) {
  git push origin HEAD
  git push origin $tag
  Write-Host "✅ Pushed commit and tag $tag" -ForegroundColor Green
} else {
  Write-Host "ℹ️ Skipped push (NoPush specified)" -ForegroundColor Yellow
}

Write-Host "\nDone. CI should build and publish artifacts." -ForegroundColor Cyan
