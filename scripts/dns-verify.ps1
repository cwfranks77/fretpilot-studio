#!/usr/bin/env pwsh
<#
Wait for DNS and SSL to be ready for a domain and optional www subdomain.
Usage:
  ./scripts/dns-verify.ps1 -Domain fretpilotstudio.com -CheckWWW -Expected 76.76.21.21 -TimeoutSec 1800 -IntervalSec 15
#>
param(
  [Parameter(Mandatory=$true)][string]$Domain,
  [string]$Expected = '76.76.21.21',
  [switch]$CheckWWW,
  [int]$TimeoutSec = 1800,
  [int]$IntervalSec = 15
)

function Resolve-A { param([string]$host)
  try {
    $res = Resolve-DnsName -Name $host -Type A -ErrorAction Stop | Where-Object { $_.Type -eq 'A' } | Select-Object -ExpandProperty IPAddress -ErrorAction Stop
    return ,$res
  } catch {
    try {
      $out = nslookup $host 2>$null | Out-String
      $ips = ($out -split "\r?\n") | Where-Object { $_ -match "Address:\s*(\d+\.\d+\.\d+\.\d+)" } | ForEach-Object { ($_ -split ':')[-1].Trim() }
      return ,$ips
    } catch { return @() }
  }
}

function Test-HttpHead { param([string]$url)
  try {
    $r = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 10
    return $true
  } catch { return $false }
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host "\n🔎 Waiting for DNS A record -> $Expected" -ForegroundColor Cyan

$targets = @($Domain)
if ($CheckWWW) { $targets += "www.$Domain" }

while ($stopwatch.Elapsed.TotalSeconds -lt $TimeoutSec) {
  $allOk = $true
  foreach ($t in $targets) {
    $ips = Resolve-A $t
    $ok = $ips -contains $Expected
    Write-Host ("{0,-28} {1} {2}" -f $t, (if ($ok) { '✅' } else { '❌' }), (if ($ips) { ($ips -join ', ') } else { '(no A record)' }))
    if (-not $ok) { $allOk = $false }
  }
  if ($allOk) { break }
  Start-Sleep -Seconds $IntervalSec
}

if (-not $allOk) { Write-Host "\n❌ DNS did not resolve to $Expected within timeout" -ForegroundColor Red; exit 1 }

Write-Host "\n🌐 Testing HTTPS reachability" -ForegroundColor Cyan
$httpAll = $true
foreach ($t in $targets) {
  $url = "https://$t"
  $ok = Test-HttpHead $url
  Write-Host ("{0,-28} {1}" -f $url, (if ($ok) { '✅' } else { '❌' }))
  if (-not $ok) { $httpAll = $false }
}

if ($httpAll) {
  Write-Host "\n✅ DNS and HTTPS look good!" -ForegroundColor Green
  foreach ($t in $targets) { Start-Process "https://$t" }
  exit 0
} else {
  Write-Host "\n⚠️ DNS ready, but HTTPS not responding yet (SSL may still be issuing). Re-run in a few minutes." -ForegroundColor Yellow
  exit 2
}
