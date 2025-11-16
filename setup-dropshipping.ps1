# FretPilot Dropshipping Quick Setup Script
# Run this script to verify your dropshipping integration is ready

Write-Host "🎸 FretPilot Dropshipping Setup Verification" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📋 Creating .env from template..." -ForegroundColor Yellow
    
    if (Test-Path ".env.template") {
        Copy-Item ".env.template" ".env"
        Write-Host "✅ .env file created! Please edit it with your API keys." -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Required API Keys:" -ForegroundColor Yellow
        Write-Host "   1. Spocket API Key - https://www.spocket.co/integrations/api" -ForegroundColor White
        Write-Host "   2. Printful API Key - https://www.printful.com/dashboard/store" -ForegroundColor White
        Write-Host "   3. Stripe Public Key - https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
        Write-Host ""
        
        # Open .env file in default editor
        Write-Host "Opening .env file for editing..." -ForegroundColor Yellow
        Start-Process notepad.exe -ArgumentList ".env"
        
        Write-Host ""
        Write-Host "⚠️  After adding your API keys, run this script again to verify!" -ForegroundColor Yellow
        exit
    } else {
        Write-Host "❌ .env.template not found! Cannot create .env file." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

# Load .env file
Write-Host ""
Write-Host "🔍 Checking API Keys..." -ForegroundColor Cyan
Write-Host ""

$envContent = Get-Content ".env"
$hasSpocket = $false
$hasPrintful = $false
$hasStripe = $false

foreach ($line in $envContent) {
    if ($line -match "VITE_SPOCKET_API_KEY=(.+)" -and $Matches[1] -ne "your_spocket_api_key_here") {
        $hasSpocket = $true
        Write-Host "   ✅ Spocket API Key configured" -ForegroundColor Green
    }
    if ($line -match "VITE_PRINTFUL_API_KEY=(.+)" -and $Matches[1] -ne "your_printful_api_key_here") {
        $hasPrintful = $true
        Write-Host "   ✅ Printful API Key configured" -ForegroundColor Green
    }
    if ($line -match "VITE_STRIPE_PUBLIC_KEY=(.+)" -and $Matches[1] -ne "pk_test_your_stripe_public_key") {
        $hasStripe = $true
        Write-Host "   ✅ Stripe Public Key configured" -ForegroundColor Green
    }
}

if (-Not $hasSpocket) {
    Write-Host "   ⚠️  Spocket API Key not configured" -ForegroundColor Yellow
    Write-Host "      Get it at: https://www.spocket.co/integrations/api" -ForegroundColor White
}

if (-Not $hasPrintful) {
    Write-Host "   ⚠️  Printful API Key not configured" -ForegroundColor Yellow
    Write-Host "      Get it at: https://www.printful.com/dashboard/store" -ForegroundColor White
}

if (-Not $hasStripe) {
    Write-Host "   ⚠️  Stripe Public Key not configured" -ForegroundColor Yellow
    Write-Host "      Get it at: https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
}

Write-Host ""
Write-Host "🗂️  Checking Dropshipping Files..." -ForegroundColor Cyan
Write-Host ""

# Check if dropshipping service exists
if (Test-Path "src/services/dropshippingService.js") {
    Write-Host "   ✅ dropshippingService.js exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ dropshippingService.js not found!" -ForegroundColor Red
}

# Check if MusicStore component exists
if (Test-Path "src/components/MusicStore.vue") {
    Write-Host "   ✅ MusicStore.vue exists" -ForegroundColor Green
    
    # Check if MusicStore imports dropshipping service
    $storeContent = Get-Content "src/components/MusicStore.vue" -Raw
    if ($storeContent -match "dropshippingService") {
        Write-Host "   ✅ MusicStore integrated with dropshipping" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MusicStore not fully integrated with dropshipping" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ MusicStore.vue not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 Checking Dropship Products..." -ForegroundColor Cyan
Write-Host ""

# Count dropship products in MusicStore.vue
if (Test-Path "src/components/MusicStore.vue") {
    $storeContent = Get-Content "src/components/MusicStore.vue" -Raw
    $dropshipMatches = [regex]::Matches($storeContent, "fulfillment: 'dropship'")
    $dropshipCount = $dropshipMatches.Count
    
    if ($dropshipCount -gt 0) {
        Write-Host "   ✅ $dropshipCount dropship products configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No dropship products found in catalog" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan

# Summary
Write-Host ""
$readyCount = 0
if ($hasSpocket) { $readyCount++ }
if ($hasPrintful) { $readyCount++ }
if ($hasStripe) { $readyCount++ }

if ($readyCount -eq 3) {
    Write-Host "🎉 ALL SET! Your dropshipping integration is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Run: npm run dev" -ForegroundColor White
    Write-Host "   2. Navigate to Store (🛒 Store button)" -ForegroundColor White
    Write-Host "   3. Look for 'FretPilot Select' branded items (these are dropship products)" -ForegroundColor White
    Write-Host "   4. Test adding a dropship item to cart and checking out" -ForegroundColor White
    Write-Host "   5. Verify order appears in your Spocket/Printful dashboard" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Read DROPSHIPPING_SETUP_GUIDE.md for detailed information" -ForegroundColor Yellow
} elseif ($readyCount -gt 0) {
    Write-Host "⚠️  Partial Setup ($readyCount/3 API keys configured)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can still test the app, but dropshipping features require all API keys." -ForegroundColor White
    Write-Host "Add the missing keys to .env file and run this script again." -ForegroundColor White
} else {
    Write-Host "❌ Setup Incomplete - No API keys configured" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please add your API keys to the .env file:" -ForegroundColor White
    Write-Host "   1. Open .env in a text editor" -ForegroundColor White
    Write-Host "   2. Replace 'your_*_api_key_here' with actual keys" -ForegroundColor White
    Write-Host "   3. Run this script again to verify" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
