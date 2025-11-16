param(
  [string]$Code,
  [switch]$FetchLatest,
  [int]$Top = 1
)

function Get-NamecheapCoupons {
  param([int]$Max = 5)
  $url = "https://www.namecheap.com/promos/coupons/"
  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
    $html = $resp.Content

    # Try to capture patterns like "Use code ABC123" or data-code attributes
    $codes = New-Object System.Collections.Generic.List[string]
    $rx1 = [regex]'(?i)(?:use\s+code|promo\s+code|coupon\s+code)[:\s]*([A-Z0-9][A-Z0-9\-]{4,15})'
    foreach ($m in $rx1.Matches($html)) {
      $c = $m.Groups[1].Value.Trim().ToUpper()
      if ($c -and -not $codes.Contains($c)) { $codes.Add($c) }
    }

    if ($codes.Count -eq 0) {
      $rx2 = [regex]'data-code\s*=\s*"([A-Z0-9\-]{5,15})"'
      foreach ($m in $rx2.Matches($html)) {
        $c = $m.Groups[1].Value.Trim().ToUpper()
        if ($c -and -not $codes.Contains($c)) { $codes.Add($c) }
      }
    }

    return $codes | Select-Object -First $Max
  } catch {
    return @()
  }
}

Write-Host "`nOpening Namecheap coupons and cart..." -ForegroundColor Cyan
$couponsUrl = "https://www.namecheap.com/promos/coupons/"
$cartUrl    = "https://www.namecheap.com/checkout/cart/"

if ($FetchLatest -and -not $Code) {
  $found = Get-NamecheapCoupons -Max ([Math]::Max(1, $Top))
  if ($found -and $found.Count -gt 0) {
    Write-Host "`nFound coupon codes (top $($found.Count)):" -ForegroundColor Green
    $i = 1
    foreach ($c in $found) { Write-Host ("  {0}. {1}" -f $i, $c) -ForegroundColor Yellow; $i++ }
    $Code = $found[0]
  } else {
    Write-Host "`nWarning: No coupon codes detected on the page. Opening coupons and cart anyway." -ForegroundColor Yellow
  }
}

Start-Process $couponsUrl
Start-Process $cartUrl

if ($Code) {
  try {
    Set-Clipboard -Value $Code
    Write-Host "`nCopied promo code to clipboard:" -ForegroundColor Green
    Write-Host "   $Code" -ForegroundColor Yellow
  } catch {
    Write-Host "`nWarning: Could not copy to clipboard. Paste manually: $Code" -ForegroundColor Yellow
  }
}

Write-Host "`nWhere to paste the code:" -ForegroundColor Yellow
Write-Host "   - In the Cart/Checkout, find the 'Promo code' field on the right." -ForegroundColor White
Write-Host "   - Paste the code and click 'Apply'." -ForegroundColor White

Write-Host "`nTips:" -ForegroundColor Yellow
Write-Host "   - Auto-fetch then open: .\\open-namecheap.ps1 -FetchLatest" -ForegroundColor Gray
Write-Host "   - Use your own code: .\\open-namecheap.ps1 -Code 'YOURCODE'" -ForegroundColor Gray
Write-Host "   - Fetch top 3:       .\\open-namecheap.ps1 -FetchLatest -Top 3`n" -ForegroundColor Gray
