# Quick DNS check for fretpilotstudio.com
Write-Host "Checking DNS for fretpilotstudio.com..." -ForegroundColor Cyan
nslookup fretpilotstudio.com | Out-String | Write-Output
nslookup www.fretpilotstudio.com | Out-String | Write-Output
Write-Host "If results show 76.76.21.21 for apex and cname.vercel-dns.com for www, DNS is correct." -ForegroundColor Green