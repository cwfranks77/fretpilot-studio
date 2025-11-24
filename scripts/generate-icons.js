#!/usr/bin/env node
/**
 * generate-icons.js
 * Convert the SVG app icon into multiple PNG sizes for Android/iOS/Web.
 * Requires: sharp (already in dependencies)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SVG_INPUT = path.join(__dirname, '..', 'resources', 'icon', 'fretpilot-icon.svg');
const OUT_DIR = path.join(__dirname, '..', 'resources', 'icon', 'generated');

// Common web/Android icon sizes (added 144 for xxhdpi mapping)
const sizes = [48, 72, 96, 128, 144, 192, 256, 384, 512, 1024];

// iOS asset catalog target sizes (flattened explicit pixel outputs)
// Mapping to existing AppIcon.appiconset naming convention
const iosIconSpecs = [
  { size: 20, scale: 1 }, { size: 20, scale: 2 }, { size: 20, scale: 3 },
  { size: 29, scale: 1 }, { size: 29, scale: 2 }, { size: 29, scale: 3 },
  { size: 40, scale: 1 }, { size: 40, scale: 2 }, { size: 40, scale: 3 },
  { size: 60, scale: 2 }, { size: 60, scale: 3 },
  { size: 76, scale: 1 }, { size: 76, scale: 2 },
  { size: 83.5, scale: 2 },
  // App Store marketing (1024x1024) represented as 512@2x in existing naming
  { size: 512, scale: 2 }
];

const IOS_APPICON_DIR = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
const ANDROID_RES_DIR = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Favicon target sizes
const faviconSizes = [16, 32, 48, 64, 128, 256];

(async () => {
  try {
    if (!fs.existsSync(SVG_INPUT)) {
      console.error('SVG icon not found at', SVG_INPUT);
      process.exit(1);
    }
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    console.log('[icons] Generating PNG renditions from SVG...');
    const svgData = fs.readFileSync(SVG_INPUT);

    for (const size of sizes) {
      const outFile = path.join(OUT_DIR, `icon-${size}x${size}.png`);
      await sharp(svgData, { density: 512 })
        .resize(size, size)
        .png({ quality: 95, compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outFile);
      let stats = fs.statSync(outFile);
      const kb = (stats.size / 1024).toFixed(1) + 'KB';
      console.log('  ✔', path.basename(outFile), kb);
    }

    // Generate iOS icons directly into the iOS asset catalog if it exists
    if (fs.existsSync(IOS_APPICON_DIR)) {
      console.log('\n[iOS] Generating iOS AppIcon set…');
      for (const spec of iosIconSpecs) {
        const px = Math.round(spec.size * spec.scale);
        // Normalize filename to existing convention (size with original point size and @Nx)
        // Example: 20x20@2x => AppIcon-20x20@2x.png
        const baseName = `AppIcon-${spec.size}x${spec.size}@${spec.scale}x.png`;
        const targetPath = path.join(IOS_APPICON_DIR, baseName);
        await sharp(svgData, { density: 512 })
          .resize(px, px)
          .png({ quality: 95, compressionLevel: 9 })
          .toFile(targetPath);
        const kb = (fs.statSync(targetPath).size / 1024).toFixed(1) + 'KB';
        console.log('  ✔', baseName, px + 'px', kb);
      }
    } else {
      console.log('[iOS] Skipped (asset catalog directory not found):', IOS_APPICON_DIR);
    }

    // Monochrome adaptive icon foreground (grayscale) for Android 13+ themed icons
    const monoOut = path.join(OUT_DIR, 'android-adaptive-foreground-mono.png');
    await sharp(svgData)
      .resize(432, 432)
      .png({ quality: 95 })
      .toBuffer()
      .then(buf => sharp(buf).grayscale().toFile(monoOut));
    console.log('  ✔', path.basename(monoOut), '(adaptive mono foreground)');

    // If Android drawable directory exists, copy mono foreground for monochrome attribute usage
    const drawableDir = path.join(ANDROID_RES_DIR, 'drawable');
    if (fs.existsSync(drawableDir)) {
      const targetMono = path.join(drawableDir, 'ic_launcher_monochrome.png');
      fs.copyFileSync(monoOut, targetMono);
      console.log('  ✔ copied monochrome foreground to', 'res/drawable/ic_launcher_monochrome.png');
    }

    // Generate feature graphic (1024x500) - center icon over branded dark background + subtle gradient
    // Must be EXACTLY 1024x500, RGB (no alpha). Avoid legacy "& School" to keep brand consistent.
    const featureGraphic = path.join(OUT_DIR, 'feature-graphic-1024x500.png');
    const baseFeature = sharp({
      create: { width: 1024, height: 500, channels: 3, background: '#0A0F18' } // 24-bit RGB
    });
    const gradientSvg = `<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#0A0F18"/><stop offset="100%" stop-color="#11283A"/></linearGradient></defs><rect width="1024" height="500" fill="url(#g)"/></svg>`;
    const gradientBuf = Buffer.from(gradientSvg);
    const iconBuf = await sharp(svgData).resize(380, 380).png().toBuffer();
    const textSvg = `<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg"><text x="560" y="250" font-size="90" font-family="Segoe UI, Arial, sans-serif" fill="#00d4ff" font-weight="700">FretPilot</text><text x="560" y="320" font-size="42" font-family="Segoe UI, Arial, sans-serif" fill="#cfefff">Studio</text></svg>`;
    const textBuf = Buffer.from(textSvg);
    await baseFeature
      .composite([
        { input: gradientBuf },
        { input: iconBuf, left: 80, top: 60 },
        { input: textBuf }
      ])
      .png({ quality: 95 })
      .toFile(featureGraphic);
    console.log('  ✔ feature graphic:', path.basename(featureGraphic));

    // Favicons
    if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    console.log('\n[web] Generating favicons…');
    for (const fsize of faviconSizes) {
      const fOut = path.join(PUBLIC_DIR, `favicon-${fsize}.png`);
      await sharp(svgData)
        .resize(fsize, fsize)
        .png({ quality: 95 })
        .toFile(fOut);
      console.log('  ✔', path.basename(fOut));
    }
    // Simple ICO (32x32)
    const icoBuf = await sharp(svgData).resize(32, 32).png().toBuffer();
    const icoOut = path.join(PUBLIC_DIR, 'favicon.ico');
    // Convert PNG buffer to ICO via embedding single image (basic approach)
    fs.writeFileSync(icoOut, icoBuf); // Accept PNG favicon (modern browsers) even if not true ICO
    console.log('  ✔ favicon.ico (PNG fallback)');

    // Generate web manifest
    const manifest = {
      name: 'FretPilot Studio',
      short_name: 'FretPilot Studio',
      display: 'standalone',
      start_url: '/',
      background_color: '#000000',
      theme_color: '#00d4ff',
      icons: faviconSizes.map(s => ({ src: `favicon-${s}.png`, sizes: `${s}x${s}`, type: 'image/png' }))
    };
    fs.writeFileSync(path.join(PUBLIC_DIR, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
    console.log('  ✔ manifest.webmanifest');

    // Zip all store assets (requires adm-zip, fallback to plain no-op if missing)
    let zipOk = false; let zipPath = path.join(OUT_DIR, 'fretpilot-store-assets.zip');
    try {
      const AdmZip = require('adm-zip');
      const zip = new AdmZip();
      // Include key generated files
      const includeFiles = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'));
      includeFiles.forEach(f => zip.addLocalFile(path.join(OUT_DIR, f)));
      // Include manifest & favicons
      faviconSizes.forEach(s => zip.addLocalFile(path.join(PUBLIC_DIR, `favicon-${s}.png`)));
      if (fs.existsSync(icoOut)) zip.addLocalFile(icoOut);
      zip.addLocalFile(path.join(PUBLIC_DIR, 'manifest.webmanifest'));
      zip.writeZip(zipPath);
      zipOk = true;
      console.log('  ✔ zipped assets:', path.basename(zipPath));
    } catch (e) {
      console.warn('[icons] Zip step skipped (adm-zip not installed):', e.message);
    }

    // Compliance check for 512x512 (<1MB requirement)
    const mainPng = path.join(OUT_DIR, 'icon-512x512.png');
    let mainStats = fs.statSync(mainPng);
    if (mainStats.size > 1_000_000) {
      console.warn('[icons] 512x512 PNG exceeds 1MB, creating optimized JPEG fallback...');
      const jpgOut = path.join(OUT_DIR, 'icon-512x512-optimized.jpg');
      await sharp(mainPng)
        .jpeg({ quality: 85, progressive: true, chromaSubsampling: '4:4:4' })
        .toFile(jpgOut);
      const jpgStats = fs.statSync(jpgOut);
      console.log('  ✔ optimized JPEG size:', (jpgStats.size/1024).toFixed(1)+'KB');
    }

    // Copy primary 512 asset to canonical name for store submission
    const canonical = path.join(OUT_DIR, 'app-icon-512.png');
    fs.copyFileSync(mainPng, canonical);
    console.log('  ✔ canonical copy:', path.basename(canonical));

    // Android adaptive icon suggestion (foreground)
    const fgOut = path.join(OUT_DIR, 'android-adaptive-foreground.png');
    await sharp(svgData)
      .resize(432, 432) // foreground layer size inside 108x108dp viewport
      .png({ quality: 95 })
      .toFile(fgOut);
    console.log('  ✔', path.basename(fgOut), '(adaptive foreground)');

    console.log('\nCompleted. Copy sizes to:');
    console.log('  Android mipmap: android/app/src/main/res/mipmap-*/');
    console.log('  iOS AppIcon: ios/App/App/Assets.xcassets/AppIcon.appiconset/ (auto-updated)');
    console.log('  Web favicon & manifest: public/');
    console.log('  Feature graphic: resources/icon/generated/feature-graphic-1024x500.png');
    console.log('\nPrimary store asset: resources/icon/generated/app-icon-512.png (verify <1MB)');
    console.log('Monochrome adaptive: android/app/src/main/res/drawable/ic_launcher_monochrome.png');
    console.log('Store asset zip:', 'resources/icon/generated/fretpilot-store-assets.zip');
  } catch (e) {
    console.error('[icons] generation failed:', e);
    process.exit(1);
  }
})();
