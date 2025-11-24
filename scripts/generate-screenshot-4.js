// Generate 4th screenshot for Phone, 7", 10", and Chromebook
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const baseDir = path.join(__dirname, '..', 'resources', 'playstore');
const downloadsBase = path.join(process.env.USERPROFILE, 'Downloads');

// Device configurations (excluding Android XR)
const devices = [
  { name: 'phone', width: 1080, height: 1920, folder: 'Screenshots' },
  { name: '7-inch', width: 1920, height: 1200, folder: 'Tablet-7inch' },
  { name: '10-inch', width: 2560, height: 1600, folder: 'Tablet-10inch' },
  { name: 'chromebook', width: 1920, height: 1080, folder: 'Chromebook' }
];

// Screenshot 4: Metronome & Tuner
function generateScreenshot4(device) {
  const { width, height, name } = device;
  const isPortrait = height > width;
  const scale = isPortrait ? width / 1080 : width / 1920;
  
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg4-${name}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow-${name}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#00ff88;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#00ff88;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg4-${name})"/>
  
  <!-- Top bar -->
  <rect width="${width}" height="${Math.round(100 * scale)}" fill="#0f3460"/>
  <text x="${width / 2}" y="${Math.round(65 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(isPortrait ? 48 : 56) * scale}" font-weight="bold" fill="#00ff88">Metronome &amp; Tuner</text>
  
  ${isPortrait ? `
  <!-- Portrait layout (phone) -->
  <!-- Metronome section -->
  <rect x="${Math.round(80 * scale)}" y="${Math.round(200 * scale)}" width="${width - Math.round(160 * scale)}" height="${Math.round(500 * scale)}" fill="#0f3460" opacity="0.4" rx="${Math.round(20 * scale)}"/>
  <text x="${width / 2}" y="${Math.round(280 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(40 * scale)}" font-weight="bold" fill="#00ff88">Metronome</text>
  
  <!-- Glow effect -->
  <circle cx="${width / 2}" cy="${Math.round(450 * scale)}" r="${Math.round(200 * scale)}" fill="url(#glow-${name})"/>
  
  <!-- BPM display -->
  <circle cx="${width / 2}" cy="${Math.round(450 * scale)}" r="${Math.round(120 * scale)}" fill="none" stroke="#00ff88" stroke-width="${Math.round(6 * scale)}" opacity="0.6"/>
  <text x="${width / 2}" y="${Math.round(430 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(64 * scale)}" font-weight="bold" fill="#00ff88">120</text>
  <text x="${width / 2}" y="${Math.round(485 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff" opacity="0.8">BPM</text>
  
  <!-- Time signature -->
  <text x="${width / 2}" y="${Math.round(630 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(36 * scale)}" fill="#ffffff">Time: 4/4</text>
  
  <!-- Tuner section -->
  <rect x="${Math.round(80 * scale)}" y="${Math.round(780 * scale)}" width="${width - Math.round(160 * scale)}" height="${Math.round(480 * scale)}" fill="#0f3460" opacity="0.4" rx="${Math.round(20 * scale)}"/>
  <text x="${width / 2}" y="${Math.round(860 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(40 * scale)}" font-weight="bold" fill="#00ff88">Tuner</text>
  
  <!-- Tuner display -->
  <circle cx="${width / 2}" cy="${Math.round(1020 * scale)}" r="${Math.round(100 * scale)}" fill="none" stroke="#00ff88" stroke-width="${Math.round(6 * scale)}" opacity="0.6"/>
  <text x="${width / 2}" y="${Math.round(1040 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(72 * scale)}" font-weight="bold" fill="#00ff88">E</text>
  
  <!-- Frequency -->
  <text x="${width / 2}" y="${Math.round(1170 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff" opacity="0.8">329.63 Hz</text>
  
  <!-- Tuning indicator -->
  <rect x="${Math.round(200 * scale)}" y="${Math.round(1210 * scale)}" width="${width - Math.round(400 * scale)}" height="${Math.round(8 * scale)}" fill="#0f3460" rx="${Math.round(4 * scale)}"/>
  <rect x="${width / 2 - Math.round(4 * scale)}" y="${Math.round(1200 * scale)}" width="${Math.round(8 * scale)}" height="${Math.round(28 * scale)}" fill="#00ff88"/>
  <text x="${width / 2}" y="${Math.round(1180 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(20 * scale)}" fill="#00ff88">In Tune</text>
  
  <!-- Bottom features -->
  <text x="${width / 2}" y="${Math.round(1380 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" font-weight="bold" fill="#ffffff">Essential Practice Tools</text>
  <text x="${width / 2}" y="${Math.round(1450 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#ffffff" opacity="0.8">Keep perfect time and pitch</text>
  
  <rect x="${Math.round(100 * scale)}" y="${Math.round(1520 * scale)}" width="${width - Math.round(200 * scale)}" height="${Math.round(200 * scale)}" fill="#0f3460" opacity="0.3" rx="${Math.round(15 * scale)}"/>
  <text x="${width / 2}" y="${Math.round(1590 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">• Adjustable tempo</text>
  <text x="${width / 2}" y="${Math.round(1640 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">• Chromatic tuner</text>
  <text x="${width / 2}" y="${Math.round(1690 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">• Multiple time signatures</text>
  ` : `
  <!-- Landscape layout (tablets/chromebook) -->
  <!-- Left: Metronome -->
  <rect x="${Math.round(80 * scale)}" y="${Math.round(180 * scale)}" width="${Math.round((width - 240 * scale) / 2)}" height="${Math.round(height - 280 * scale)}" fill="#0f3460" opacity="0.4" rx="${Math.round(20 * scale)}"/>
  <text x="${Math.round(80 * scale + (width - 240 * scale) / 4)}" y="${Math.round(260 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(44 * scale)}" font-weight="bold" fill="#00ff88">Metronome</text>
  
  <!-- Glow -->
  <circle cx="${Math.round(80 * scale + (width - 240 * scale) / 4)}" cy="${Math.round((height + 180 * scale) / 2)}" r="${Math.round(180 * scale)}" fill="url(#glow-${name})"/>
  
  <!-- BPM -->
  <circle cx="${Math.round(80 * scale + (width - 240 * scale) / 4)}" cy="${Math.round((height + 180 * scale) / 2)}" r="${Math.round(110 * scale)}" fill="none" stroke="#00ff88" stroke-width="${Math.round(6 * scale)}" opacity="0.6"/>
  <text x="${Math.round(80 * scale + (width - 240 * scale) / 4)}" y="${Math.round((height + 140 * scale) / 2)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(68 * scale)}" font-weight="bold" fill="#00ff88">120</text>
  <text x="${Math.round(80 * scale + (width - 240 * scale) / 4)}" y="${Math.round((height + 230 * scale) / 2)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff" opacity="0.8">BPM</text>
  
  <!-- Time signature -->
  <text x="${Math.round(80 * scale + (width - 240 * scale) / 4)}" y="${height - Math.round(140 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff">Time: 4/4</text>
  <text x="${Math.round(80 * scale + (width - 240 * scale) / 4)}" y="${height - Math.round(100 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">• Adjustable tempo</text>
  <text x="${Math.round(80 * scale + (width - 240 * scale) / 4)}" y="${height - Math.round(65 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">• Multiple signatures</text>
  
  <!-- Right: Tuner -->
  <rect x="${width / 2 + Math.round(40 * scale)}" y="${Math.round(180 * scale)}" width="${Math.round((width - 240 * scale) / 2)}" height="${Math.round(height - 280 * scale)}" fill="#0f3460" opacity="0.4" rx="${Math.round(20 * scale)}"/>
  <text x="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4)}" y="${Math.round(260 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(44 * scale)}" font-weight="bold" fill="#00ff88">Tuner</text>
  
  <!-- Tuner display -->
  <circle cx="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4)}" cy="${Math.round((height + 180 * scale) / 2)}" r="${Math.round(110 * scale)}" fill="none" stroke="#00ff88" stroke-width="${Math.round(6 * scale)}" opacity="0.6"/>
  <text x="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4)}" y="${Math.round((height + 200 * scale) / 2)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(80 * scale)}" font-weight="bold" fill="#00ff88">E</text>
  
  <!-- Frequency -->
  <text x="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4)}" y="${height - Math.round(220 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff" opacity="0.8">329.63 Hz</text>
  
  <!-- Tuning indicator -->
  <rect x="${width / 2 + Math.round(200 * scale)}" y="${height - Math.round(160 * scale)}" width="${Math.round((width - 240 * scale) / 2 - 240 * scale)}" height="${Math.round(8 * scale)}" fill="#0f3460" rx="${Math.round(4 * scale)}"/>
  <rect x="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4 - 4 * scale)}" y="${height - Math.round(170 * scale)}" width="${Math.round(8 * scale)}" height="${Math.round(28 * scale)}" fill="#00ff88"/>
  <text x="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4)}" y="${height - Math.round(180 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">In Tune</text>
  
  <!-- Features -->
  <text x="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4)}" y="${height - Math.round(100 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">• Chromatic tuning</text>
  <text x="${width / 2 + Math.round(40 * scale + (width - 240 * scale) / 4)}" y="${height - Math.round(65 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#00ff88">• Precision detection</text>
  `}
</svg>
`;
}

// Generate all screenshots
const allPromises = [];

devices.forEach(device => {
  const svg = generateScreenshot4(device);
  const resourcePath = path.join(baseDir, device.folder, '4-tools.png');
  const downloadPath = path.join(downloadsBase, `PlayStore-${device.folder}`, '4-tools.png');
  
  const promise = sharp(Buffer.from(svg))
    .resize(device.width, device.height)
    .png()
    .toFile(resourcePath)
    .then(() => {
      const downloadDir = path.dirname(downloadPath);
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }
      return sharp(resourcePath).toFile(downloadPath);
    })
    .then(() => ({ device: device.name, success: true }))
    .catch(err => ({ device: device.name, success: false, error: err.message }));
  
  allPromises.push(promise);
});

Promise.all(allPromises)
  .then(results => {
    console.log('✅ 4th screenshot generated for all devices!\n');
    
    devices.forEach(device => {
      const result = results.find(r => r.device === device.name);
      const downloadDir = path.join(downloadsBase, `PlayStore-${device.folder}`);
      
      console.log(`📱 ${device.folder} (${device.width}x${device.height}px):`);
      console.log(`   📁 ${downloadDir}`);
      if (result.success) {
        console.log(`   ✓ 4-tools.png`);
      } else {
        console.log(`   ✗ 4-tools.png - ${result.error}`);
      }
      console.log('');
    });
    
    console.log('📝 Now you have 4 screenshots for:');
    console.log('   • Phone (1080x1920)');
    console.log('   • 7" Tablet (1920x1200)');
    console.log('   • 10" Tablet (2560x1600)');
    console.log('   • Chromebook (1920x1080)');
    console.log('\n💡 All ready for Play Console upload!');
  })
  .catch(err => {
    console.error('❌ Error generating screenshots:', err);
    process.exit(1);
  });
