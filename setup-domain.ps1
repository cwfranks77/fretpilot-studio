# FretPilot - Developer Domain Setup Script
# This script helps you set up a custom domain for your app

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "   DEVELOPER DOMAIN SETUP" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Choose your domain option:" -ForegroundColor Yellow
Write-Host "1. Buy a premium domain (.com, .net, .app)" -ForegroundColor White
Write-Host "2. Use free GitHub Pages domain" -ForegroundColor White
Write-Host "3. Use free Netlify/Vercel domain" -ForegroundColor White
Write-Host "`nEnter your choice (1, 2, or 3): " -ForegroundColor Cyan -NoNewline
$choice = Read-Host

if ($choice -eq "1") {
    Write-Host "`n=== OPTION 1: BUY PREMIUM DOMAIN ===" -ForegroundColor Yellow
    Write-Host "`nRecommended Registrars:" -ForegroundColor White
    Write-Host "- Namecheap: https://www.namecheap.com" -ForegroundColor Cyan
    Write-Host "- Google Domains: https://domains.google" -ForegroundColor Cyan
    Write-Host "- GoDaddy: https://www.godaddy.com" -ForegroundColor Cyan
    Write-Host "`nSuggested domains for FretPilot:" -ForegroundColor White
    Write-Host "  - fretpilot.com ($10-15/year)" -ForegroundColor Gray
    Write-Host "  - fretpilot.app ($15-20/year)" -ForegroundColor Gray
    Write-Host "  - fretpilot.net ($10-15/year)" -ForegroundColor Gray
    Write-Host "  - getfretpilot.com" -ForegroundColor Gray
    Write-Host "`nWhat domain did you purchase? (e.g., fretpilot.com): " -ForegroundColor Cyan -NoNewline
    $domain = Read-Host
    $domainType = "premium"
}
elseif ($choice -eq "2") {
    Write-Host "`n=== OPTION 2: FREE GITHUB PAGES ===" -ForegroundColor Yellow
    Write-Host "`nYour GitHub Pages domain will be:" -ForegroundColor White
    Write-Host "  https://YOUR-USERNAME.github.io/fretpilot-app" -ForegroundColor Cyan
    Write-Host "`nWhat is your GitHub username?: " -ForegroundColor Cyan -NoNewline
    $username = Read-Host
    $domain = "$username.github.io/fretpilot-app"
    $domainType = "github"
}
elseif ($choice -eq "3") {
    Write-Host "`n=== OPTION 3: FREE NETLIFY/VERCEL ===" -ForegroundColor Yellow
    Write-Host "`nYour free domain options:" -ForegroundColor White
    Write-Host "  - Netlify: https://fretpilot.netlify.app" -ForegroundColor Cyan
    Write-Host "  - Vercel: https://fretpilot.vercel.app" -ForegroundColor Cyan
    Write-Host "`nWhich service (netlify or vercel)?: " -ForegroundColor Cyan -NoNewline
    $service = Read-Host
    $domain = "fretpilot.$service.app"
    $domainType = $service
}
else {
    Write-Host "`nInvalid choice. Exiting." -ForegroundColor Red
    exit
}

Write-Host "`n`n================================" -ForegroundColor Cyan
Write-Host "   YOUR DOMAIN SETUP" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Domain: " -ForegroundColor Yellow -NoNewline
Write-Host "$domain" -ForegroundColor White

Write-Host "Type: " -ForegroundColor Yellow -NoNewline
Write-Host "$domainType" -ForegroundColor White

# Generate configuration
$config = @"
# FretPilot Developer Domain Configuration
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Domain Information
Domain: $domain
Type: $domainType

## Next Steps Based on Your Choice

"@

if ($domainType -eq "premium") {
    $config += @"

### PREMIUM DOMAIN SETUP ($domain)

1. **DNS Configuration** (In your registrar's dashboard):
   - Add A Record: @ → 185.199.108.153
   - Add A Record: @ → 185.199.109.153
   - Add A Record: @ → 185.199.110.153
   - Add A Record: @ → 185.199.111.153
   - Add CNAME Record: www → YOUR-USERNAME.github.io

2. **GitHub Repository Settings**:
   - Go to: Settings → Pages
   - Custom domain: $domain
   - Enforce HTTPS: ✓

3. **Create CNAME file** in your repo root:
   echo "$domain" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push

4. **Privacy Policy URL**:
   https://$domain/privacy-policy.html

5. **Support Email**:
   Setup: support@$domain (recommended)
   Or use: your-email@gmail.com

"@
}
elseif ($domainType -eq "github") {
    $config += @"

### GITHUB PAGES SETUP ($domain)

1. **Enable GitHub Pages**:
   - Go to repository: Settings → Pages
   - Source: Deploy from branch
   - Branch: main (or master)
   - Folder: / (root)
   - Click Save

2. **Create Landing Page** (index.html):
   Create a simple landing page in your repo root with:
   - App description
   - Download link to latest APK
   - Screenshots
   - Contact information

3. **Privacy Policy**:
   Create privacy-policy.html in repo root
   URL will be: https://$domain/privacy-policy.html

4. **Support Contact**:
   Add to index.html: your-email@gmail.com

5. **Deploy**:
   git add .
   git commit -m "Setup GitHub Pages"
   git push

   Site will be live at: https://$domain

"@
}
else {
    $config += @"

### $domainType.toUpper() SETUP ($domain)

1. **Create Account**:
   - Go to: https://$domainType.com
   - Sign up with GitHub

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub: YOUR-USERNAME/fretpilot-app
   - Framework: Static HTML or Vue
   - Build command: npm run build
   - Output directory: dist

3. **Custom Domain** (Optional - costs money):
   - Settings → Domain → Add custom domain
   - Follow DNS configuration instructions

4. **Privacy Policy**:
   Add privacy-policy.html to your project
   URL: https://$domain/privacy-policy.html

5. **Auto Deploy**:
   Every git push to main will auto-deploy!

"@
}

$config += @"

## Privacy Policy Template
Create a file: privacy-policy.html

Use this template:
- https://www.privacypolicygenerator.info/
- Or copy from: https://app-privacy-policy-generator.firebaseapp.com/

## Google Play Console Settings

After domain setup, update Play Console:

1. **App Contact Details**:
   - Website: https://$domain
   - Email: support@$domain (or your email)
   - Privacy Policy: https://$domain/privacy-policy.html

2. **Store Listing**:
   - Add domain to app description
   - Link to privacy policy (REQUIRED)

"@

$configFile = "DOMAIN_SETUP.txt"
$config | Out-File -FilePath $configFile -Encoding UTF8

Write-Host "`n✓ Configuration saved to: $configFile" -ForegroundColor Green

# Create simple privacy policy template
$privacyPolicy = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FretPilot - Privacy Policy</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; line-height: 1.6; }
        h1 { color: #5b74ff; }
        h2 { color: #333; margin-top: 30px; }
        p { margin: 15px 0; }
    </style>
</head>
<body>
    <h1>FretPilot Privacy Policy</h1>
    <p><strong>Last Updated:</strong> $(Get-Date -Format "MMMM dd, yyyy")</p>
    
    <h2>Information Collection and Use</h2>
    <p>FretPilot is committed to protecting your privacy. We collect minimal information to provide our services:</p>
    <ul>
        <li>Device information for app functionality</li>
        <li>Usage analytics (anonymous)</li>
        <li>Progress data stored locally on your device</li>
    </ul>

    <h2>Data Storage</h2>
    <p>All your practice data, chord progress, and settings are stored locally on your device. We do not transmit or store this data on external servers.</p>

    <h2>Third-Party Services</h2>
    <p>FretPilot uses the following third-party services:</p>
    <ul>
        <li><strong>Google AdMob:</strong> For displaying advertisements. See <a href="https://policies.google.com/privacy">Google Privacy Policy</a></li>
        <li><strong>Firebase Analytics:</strong> For anonymous usage statistics</li>
    </ul>

    <h2>Children's Privacy</h2>
    <p>FretPilot is suitable for users of all ages. We do not knowingly collect personal information from children under 13.</p>

    <h2>Changes to This Policy</h2>
    <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

    <h2>Contact Us</h2>
    <p>If you have questions about this privacy policy, please contact us at:</p>
    <p>Email: support@$domain</p>
    <p>Website: https://$domain</p>
</body>
</html>
"@

$privacyFile = "privacy-policy.html"
$privacyPolicy | Out-File -FilePath $privacyFile -Encoding UTF8

Write-Host "✓ Privacy policy template created: $privacyFile" -ForegroundColor Green

Write-Host "`n`n================================" -ForegroundColor Cyan
Write-Host "   SETUP SUMMARY" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Your domain: " -ForegroundColor Yellow -NoNewline
Write-Host "https://$domain" -ForegroundColor Cyan

Write-Host "`nFiles created:" -ForegroundColor White
Write-Host "  - $configFile (setup instructions)" -ForegroundColor Gray
Write-Host "  - $privacyFile (ready to upload)" -ForegroundColor Gray

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Read $configFile for detailed setup instructions" -ForegroundColor White
Write-Host "2. Upload $privacyFile to your domain" -ForegroundColor White
Write-Host "3. Update Google Play Console with domain URLs" -ForegroundColor White

if ($domainType -eq "github") {
    Write-Host "`n4. Enable GitHub Pages in your repo settings" -ForegroundColor White
    Write-Host "5. Upload privacy-policy.html to your repository" -ForegroundColor White
    Write-Host "6. Your site will be live at: https://$domain" -ForegroundColor Cyan
}

Write-Host "`n✓ DOMAIN SETUP COMPLETE!`n" -ForegroundColor Green
