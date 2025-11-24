// Generate additional Android XR screenshot (4th)
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const width = 1440;
const height = 1440;
const scale = width / 1920;

const outputDir = path.join(__dirname, '..', 'resources', 'playstore', 'AndroidXR');
const downloadsDir = path.join(process.env.USERPROFILE, 'Downloads', 'PlayStore-AndroidXR');

[outputDir, downloadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Screenshot 4: Jam Companion / Practice Mode
const screenshot4 = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#00ff88;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#00ff88;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg4)"/>
  
  <!-- Glowing effect in center -->
  <circle cx="${width / 2}" cy="${height / 2}" r="${Math.round(400 * scale)}" fill="url(#glow)"/>
  
  <!-- Top bar -->
  <rect width="${width}" height="${Math.round(100 * scale)}" fill="#0f3460" opacity="0.8"/>
  <text x="${width / 2}" y="${Math.round(65 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(48 * scale)}" font-weight="bold" fill="#00ff88">Jam Companion</text>
  
  <!-- Main content -->
  <text x="${width / 2}" y="${Math.round(180 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#ffffff">Practice in AR/VR</text>
  
  <!-- Central metronome display -->
  <circle cx="${width / 2}" cy="${height / 2}" r="${Math.round(180 * scale)}" fill="none" stroke="#00ff88" stroke-width="${Math.round(8 * scale)}" opacity="0.6"/>
  <circle cx="${width / 2}" cy="${height / 2}" r="${Math.round(150 * scale)}" fill="none" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.4"/>
  
  <!-- BPM display -->
  <text x="${width / 2}" y="${height / 2 - Math.round(20 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(72 * scale)}" font-weight="bold" fill="#00ff88">120</text>
  <text x="${width / 2}" y="${height / 2 + Math.round(40 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff" opacity="0.8">BPM</text>
  
  <!-- Corner UI elements -->
  <!-- Top left - Tuner -->
  <rect x="${Math.round(80 * scale)}" y="${Math.round(140 * scale)}" width="${Math.round(280 * scale)}" height="${Math.round(140 * scale)}" fill="#0f3460" opacity="0.7" rx="${Math.round(15 * scale)}"/>
  <text x="${Math.round(220 * scale)}" y="${Math.round(190 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#00ff88">Tuner</text>
  <text x="${Math.round(220 * scale)}" y="${Math.round(240 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(48 * scale)}" font-weight="bold" fill="#ffffff">E</text>
  
  <!-- Top right - Key -->
  <rect x="${width - Math.round(360 * scale)}" y="${Math.round(140 * scale)}" width="${Math.round(280 * scale)}" height="${Math.round(140 * scale)}" fill="#0f3460" opacity="0.7" rx="${Math.round(15 * scale)}"/>
  <text x="${width - Math.round(220 * scale)}" y="${Math.round(190 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#00ff88">Key</text>
  <text x="${width - Math.round(220 * scale)}" y="${Math.round(240 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(48 * scale)}" font-weight="bold" fill="#ffffff">C Major</text>
  
  <!-- Bottom left - Chord progression -->
  <rect x="${Math.round(80 * scale)}" y="${height - Math.round(280 * scale)}" width="${Math.round(280 * scale)}" height="${Math.round(200 * scale)}" fill="#0f3460" opacity="0.7" rx="${Math.round(15 * scale)}"/>
  <text x="${Math.round(220 * scale)}" y="${height - Math.round(240 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">Next Chord</text>
  <text x="${Math.round(220 * scale)}" y="${height - Math.round(180 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#ffffff">G</text>
  <text x="${Math.round(220 * scale)}" y="${height - Math.round(130 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(20 * scale)}" fill="#ffffff" opacity="0.7">in 2 beats</text>
  
  <!-- Bottom right - Progress -->
  <rect x="${width - Math.round(360 * scale)}" y="${height - Math.round(280 * scale)}" width="${Math.round(280 * scale)}" height="${Math.round(200 * scale)}" fill="#0f3460" opacity="0.7" rx="${Math.round(15 * scale)}"/>
  <text x="${width - Math.round(220 * scale)}" y="${height - Math.round(240 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">Accuracy</text>
  <text x="${width - Math.round(220 * scale)}" y="${height - Math.round(180 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#ffffff">92%</text>
  <text x="${width - Math.round(220 * scale)}" y="${height - Math.round(130 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(20 * scale)}" fill="#ffffff" opacity="0.7">Keep going!</text>
  
  <!-- Animated circles around metronome -->
  <circle cx="${width / 2}" cy="${height / 2 - Math.round(220 * scale)}" r="${Math.round(12 * scale)}" fill="#00ff88" opacity="0.8"/>
  <circle cx="${width / 2 + Math.round(190 * scale)}" cy="${height / 2 - Math.round(110 * scale)}" r="${Math.round(12 * scale)}" fill="#00ff88" opacity="0.6"/>
  <circle cx="${width / 2 + Math.round(190 * scale)}" cy="${height / 2 + Math.round(110 * scale)}" r="${Math.round(12 * scale)}" fill="#00ff88" opacity="0.4"/>
  <circle cx="${width / 2}" cy="${height / 2 + Math.round(220 * scale)}" r="${Math.round(12 * scale)}" fill="#00ff88" opacity="0.3"/>
  
  <!-- Bottom text -->
  <text x="${width / 2}" y="${height - Math.round(30 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff" opacity="0.8">Immersive practice environment</text>
</svg>
`;

const outputPath = path.join(outputDir, '4-jam.png');
const downloadPath = path.join(downloadsDir, '4-jam.png');

sharp(Buffer.from(screenshot4))
  .resize(width, height)
  .png()
  .toFile(outputPath)
  .then(() => sharp(outputPath).toFile(downloadPath))
  .then(() => {
    console.log('✅ Android XR screenshot generated!');
    console.log(`📁 ${downloadsDir}`);
    console.log('   ✓ 4-jam.png');
    console.log(`\n📐 Size: ${width}x${height}px (square)`);
    console.log('📝 Upload to Play Console:');
    console.log('   → Store presence → Main store listing');
    console.log('   → Android XR screenshots section');
    console.log('\n💡 Now you have 4 screenshots for Android XR');
  })
  .catch(err => {
    console.error('❌ Error generating screenshot:', err);
    process.exit(1);
  });
