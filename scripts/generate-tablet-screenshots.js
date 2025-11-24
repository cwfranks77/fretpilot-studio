// Generate Tablet Screenshots for Google Play Console
// 7" tablet: 1200x1920px (portrait) or 1920x1200px (landscape)
// 10" tablet: 2560x1600px (landscape)
// Chromebook: 1920x1080px (landscape)
// Android XR: 1440x1440px (square for AR/VR)

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const baseDir = path.join(__dirname, '..', 'resources', 'playstore');
const downloadsBase = path.join(process.env.USERPROFILE, 'Downloads');

// Device configurations
const devices = [
  { name: '7-inch', width: 1920, height: 1200, folder: 'Tablet-7inch' },
  { name: '10-inch', width: 2560, height: 1600, folder: 'Tablet-10inch' },
  { name: 'chromebook', width: 1920, height: 1080, folder: 'Chromebook' },
  { name: 'androidxr', width: 1440, height: 1440, folder: 'AndroidXR' }
];

// Ensure all output directories exist
devices.forEach(device => {
  const resourceDir = path.join(baseDir, device.folder);
  const downloadDir = path.join(downloadsBase, `PlayStore-${device.folder}`);
  [resourceDir, downloadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});

// Generate SVG for each device
function generateScreenshot1(device) {
  const { width, height, name } = device;
  const isSquare = width === height;
  const scale = width / 1920;
  
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg1-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg1-${name})"/>
  
  <!-- Top bar -->
  <rect width="${width}" height="${Math.round(100 * scale)}" fill="#0f3460"/>
  <text x="${width / 2}" y="${Math.round(65 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#00ff88">FretPilot Studio</text>
  
  <!-- Main content area -->
  <text x="${width / 2}" y="${Math.round(250 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(72 * scale)}" font-weight="bold" fill="#ffffff">AI-Powered Guitar Training</text>
  <text x="${width / 2}" y="${Math.round(330 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(36 * scale)}" fill="#ffffff" opacity="0.8">Master the fretboard with intelligent practice tools</text>
  
  <!-- Split layout for landscape -->
  ${!isSquare ? `
  <!-- Left panel - Features -->
  <rect x="${Math.round(80 * scale)}" y="${Math.round(420 * scale)}" width="${Math.round(800 * scale)}" height="${Math.round(height - 520 * scale)}" fill="#0f3460" opacity="0.4" rx="${Math.round(20 * scale)}"/>
  <text x="${Math.round(480 * scale)}" y="${Math.round(500 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(40 * scale)}" font-weight="bold" fill="#00ff88">Features</text>
  <text x="${Math.round(150 * scale)}" y="${Math.round(580 * scale)}" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">✓ Interactive Lessons</text>
  <text x="${Math.round(150 * scale)}" y="${Math.round(640 * scale)}" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">✓ Practice Analytics</text>
  <text x="${Math.round(150 * scale)}" y="${Math.round(700 * scale)}" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">✓ Mistake Heatmap</text>
  <text x="${Math.round(150 * scale)}" y="${Math.round(760 * scale)}" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">✓ 500+ Chord Library</text>
  <text x="${Math.round(150 * scale)}" y="${Math.round(820 * scale)}" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">✓ Jam Companion</text>
  <text x="${Math.round(150 * scale)}" y="${Math.round(880 * scale)}" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">✓ Metronome and Tuner</text>
  
  <!-- Right panel - Fretboard -->
  <rect x="${width - Math.round(880 * scale)}" y="${Math.round(420 * scale)}" width="${Math.round(800 * scale)}" height="${Math.round(height - 520 * scale)}" fill="#1a1a2e" rx="${Math.round(20 * scale)}"/>
  <text x="${width - Math.round(480 * scale)}" y="${Math.round(500 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff" opacity="0.8">Interactive Fretboard</text>
  
  <!-- Fretboard lines -->
  <line x1="${width - Math.round(800 * scale)}" y1="${Math.round(580 * scale)}" x2="${width - Math.round(160 * scale)}" y2="${Math.round(580 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  <line x1="${width - Math.round(800 * scale)}" y1="${Math.round(660 * scale)}" x2="${width - Math.round(160 * scale)}" y2="${Math.round(660 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  <line x1="${width - Math.round(800 * scale)}" y1="${Math.round(740 * scale)}" x2="${width - Math.round(160 * scale)}" y2="${Math.round(740 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  <line x1="${width - Math.round(800 * scale)}" y1="${Math.round(820 * scale)}" x2="${width - Math.round(160 * scale)}" y2="${Math.round(820 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  <line x1="${width - Math.round(800 * scale)}" y1="${Math.round(900 * scale)}" x2="${width - Math.round(160 * scale)}" y2="${Math.round(900 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  
  <!-- Dots on fretboard -->
  <circle cx="${width - Math.round(600 * scale)}" cy="${Math.round(660 * scale)}" r="${Math.round(20 * scale)}" fill="#00ff88"/>
  <circle cx="${width - Math.round(400 * scale)}" cy="${Math.round(740 * scale)}" r="${Math.round(20 * scale)}" fill="#00ff88"/>
  <circle cx="${width - Math.round(250 * scale)}" cy="${Math.round(820 * scale)}" r="${Math.round(20 * scale)}" fill="#00ff88"/>
  ` : `
  <!-- Square layout for XR -->
  <rect x="${Math.round(120 * scale)}" y="${Math.round(420 * scale)}" width="${width - Math.round(240 * scale)}" height="${Math.round(600 * scale)}" fill="#1a1a2e" rx="${Math.round(20 * scale)}"/>
  <text x="${width / 2}" y="${Math.round(500 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff" opacity="0.8">Immersive Learning Experience</text>
  
  <!-- Fretboard -->
  <line x1="${Math.round(200 * scale)}" y1="${Math.round(620 * scale)}" x2="${width - Math.round(200 * scale)}" y2="${Math.round(620 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  <line x1="${Math.round(200 * scale)}" y1="${Math.round(720 * scale)}" x2="${width - Math.round(200 * scale)}" y2="${Math.round(720 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  <line x1="${Math.round(200 * scale)}" y1="${Math.round(820 * scale)}" x2="${width - Math.round(200 * scale)}" y2="${Math.round(820 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  <line x1="${Math.round(200 * scale)}" y1="${Math.round(920 * scale)}" x2="${width - Math.round(200 * scale)}" y2="${Math.round(920 * scale)}" stroke="#00ff88" stroke-width="${Math.round(4 * scale)}" opacity="0.6"/>
  
  <circle cx="${width / 2 - Math.round(200 * scale)}" cy="${Math.round(720 * scale)}" r="${Math.round(20 * scale)}" fill="#00ff88"/>
  <circle cx="${width / 2}" cy="${Math.round(820 * scale)}" r="${Math.round(20 * scale)}" fill="#00ff88"/>
  <circle cx="${width / 2 + Math.round(200 * scale)}" cy="${Math.round(920 * scale)}" r="${Math.round(20 * scale)}" fill="#00ff88"/>
  
  <!-- Features below -->
  <text x="${width / 2}" y="${Math.round(1100 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#00ff88">Interactive • Analytics • Chords</text>
  `}
</svg>
`;
}

function generateScreenshot2(device) {
  const { width, height, name } = device;
  const isSquare = width === height;
  const scale = width / 1920;
  
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg2-${name})"/>
  
  <!-- Top bar -->
  <rect width="${width}" height="${Math.round(100 * scale)}" fill="#0f3460"/>
  <text x="${width / 2}" y="${Math.round(65 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#00ff88">Practice Analytics</text>
  
  <!-- Stats row -->
  <rect x="${Math.round(100 * scale)}" y="${Math.round(180 * scale)}" width="${Math.round((width - 300 * scale) / 3)}" height="${Math.round(180 * scale)}" fill="#0f3460" opacity="0.6" rx="${Math.round(20 * scale)}"/>
  <text x="${Math.round(100 * scale + (width - 300 * scale) / 6)}" y="${Math.round(250 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#00ff88">127</text>
  <text x="${Math.round(100 * scale + (width - 300 * scale) / 6)}" y="${Math.round(310 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">Sessions</text>
  
  <rect x="${Math.round(width / 2 - (width - 300 * scale) / 6)}" y="${Math.round(180 * scale)}" width="${Math.round((width - 300 * scale) / 3)}" height="${Math.round(180 * scale)}" fill="#0f3460" opacity="0.6" rx="${Math.round(20 * scale)}"/>
  <text x="${width / 2}" y="${Math.round(250 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#00ff88">95%</text>
  <text x="${width / 2}" y="${Math.round(310 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">Accuracy</text>
  
  <rect x="${width - Math.round(100 * scale + (width - 300 * scale) / 3)}" y="${Math.round(180 * scale)}" width="${Math.round((width - 300 * scale) / 3)}" height="${Math.round(180 * scale)}" fill="#0f3460" opacity="0.6" rx="${Math.round(20 * scale)}"/>
  <text x="${width - Math.round(100 * scale + (width - 300 * scale) / 6)}" y="${Math.round(250 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#00ff88">45m</text>
  <text x="${width - Math.round(100 * scale + (width - 300 * scale) / 6)}" y="${Math.round(310 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(28 * scale)}" fill="#ffffff">Today</text>
  
  <!-- Progress chart -->
  <rect x="${Math.round(100 * scale)}" y="${Math.round(420 * scale)}" width="${width - Math.round(200 * scale)}" height="${Math.round(height - 520 * scale)}" fill="#0f3460" opacity="0.3" rx="${Math.round(20 * scale)}"/>
  <text x="${width / 2}" y="${Math.round(490 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(40 * scale)}" font-weight="bold" fill="#ffffff">Weekly Progress</text>
  
  <!-- Bar chart -->
  ${[0, 1, 2, 3, 4, 5, 6].map((i, idx) => {
    const barWidth = Math.round((width - 400 * scale) / 10);
    const spacing = Math.round((width - 200 * scale - barWidth * 7) / 8);
    const x = Math.round(100 * scale + spacing + (barWidth + spacing) * i);
    const heights = [80, 130, 200, 160, 120, 180, 150];
    const barHeight = Math.round(heights[i] * scale);
    const maxChartHeight = Math.round((height - 620 * scale));
    const y = Math.round(420 * scale + maxChartHeight - barHeight);
    const opacity = [0.6, 0.7, 1.0, 0.8, 0.7, 0.9, 0.75][i];
    return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#00ff88" opacity="${opacity}"/>`;
  }).join('\n  ')}
  
  <!-- Bottom text -->
  <text x="${width / 2}" y="${height - Math.round(60 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff" opacity="0.8">Track your improvement with data-driven insights</text>
</svg>
`;
}

function generateScreenshot3(device) {
  const { width, height, name } = device;
  const scale = width / 1920;
  
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg3-${name})"/>
  
  <!-- Top bar -->
  <rect width="${width}" height="${Math.round(100 * scale)}" fill="#0f3460"/>
  <text x="${width / 2}" y="${Math.round(65 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(56 * scale)}" font-weight="bold" fill="#00ff88">Chord Library</text>
  
  <!-- Search bar -->
  <rect x="${Math.round(100 * scale)}" y="${Math.round(160 * scale)}" width="${width - Math.round(200 * scale)}" height="${Math.round(80 * scale)}" fill="#0f3460" opacity="0.6" rx="${Math.round(40 * scale)}"/>
  <text x="${Math.round(150 * scale)}" y="${Math.round(215 * scale)}" font-family="Arial" font-size="${Math.round(32 * scale)}" fill="#ffffff" opacity="0.6">Search 500+ chords...</text>
  
  <!-- Chord grid - 4 columns for tablets -->
  ${[
    { chord: 'C', type: 'Major', x: 0, y: 0 },
    { chord: 'G', type: 'Major', x: 1, y: 0 },
    { chord: 'Am', type: 'Minor', x: 2, y: 0 },
    { chord: 'D', type: 'Major', x: 3, y: 0 },
    { chord: 'Em', type: 'Minor', x: 0, y: 1 },
    { chord: 'F', type: 'Major', x: 1, y: 1 },
    { chord: 'Dm', type: 'Minor', x: 2, y: 1 },
    { chord: 'A', type: 'Major', x: 3, y: 1 }
  ].map(({ chord, type, x, y }) => {
    const cardWidth = Math.round((width - 300 * scale) / 4);
    const cardHeight = Math.round((height - 400 * scale) / 2);
    const margin = Math.round(20 * scale);
    const startX = Math.round(100 * scale);
    const startY = Math.round(300 * scale);
    const posX = startX + x * (cardWidth + margin);
    const posY = startY + y * (cardHeight + margin);
    
    return `
    <rect x="${posX}" y="${posY}" width="${cardWidth}" height="${cardHeight}" fill="#0f3460" opacity="0.6" rx="${Math.round(20 * scale)}"/>
    <text x="${posX + cardWidth / 2}" y="${posY + Math.round(60 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(48 * scale)}" font-weight="bold" fill="#00ff88">${chord}</text>
    <text x="${posX + cardWidth / 2}" y="${posY + Math.round(105 * scale)}" text-anchor="middle" font-family="Arial" font-size="${Math.round(24 * scale)}" fill="#ffffff">${type}</text>
    <line x1="${posX + Math.round(30 * scale)}" y1="${posY + Math.round(140 * scale)}" x2="${posX + cardWidth - Math.round(30 * scale)}" y2="${posY + Math.round(140 * scale)}" stroke="#00ff88" stroke-width="${Math.round(3 * scale)}"/>
    <line x1="${posX + Math.round(30 * scale)}" y1="${posY + Math.round(170 * scale)}" x2="${posX + cardWidth - Math.round(30 * scale)}" y2="${posY + Math.round(170 * scale)}" stroke="#00ff88" stroke-width="${Math.round(3 * scale)}"/>
    <line x1="${posX + Math.round(30 * scale)}" y1="${posY + Math.round(200 * scale)}" x2="${posX + cardWidth - Math.round(30 * scale)}" y2="${posY + Math.round(200 * scale)}" stroke="#00ff88" stroke-width="${Math.round(3 * scale)}"/>
    <circle cx="${posX + Math.round(60 * scale)}" cy="${posY + Math.round(155 * scale)}" r="${Math.round(10 * scale)}" fill="#00ff88"/>
    <circle cx="${posX + cardWidth / 2}" cy="${posY + Math.round(170 * scale)}" r="${Math.round(10 * scale)}" fill="#00ff88"/>
    <circle cx="${posX + cardWidth - Math.round(60 * scale)}" cy="${posY + Math.round(185 * scale)}" r="${Math.round(10 * scale)}" fill="#00ff88"/>
    `;
  }).join('\n')}
</svg>
`;
}

// Generate all screenshots for all devices
const allPromises = [];

devices.forEach(device => {
  const screenshots = [
    { svg: generateScreenshot1(device), name: '1-lessons.png' },
    { svg: generateScreenshot2(device), name: '2-analytics.png' },
    { svg: generateScreenshot3(device), name: '3-chords.png' }
  ];
  
  screenshots.forEach(({ svg, name }) => {
    const resourcePath = path.join(baseDir, device.folder, name);
    const downloadPath = path.join(downloadsBase, `PlayStore-${device.folder}`, name);
    
    const promise = sharp(Buffer.from(svg))
      .resize(device.width, device.height)
      .png()
      .toFile(resourcePath)
      .then(() => {
        // Ensure download directory exists
        const downloadDir = path.dirname(downloadPath);
        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir, { recursive: true });
        }
        return sharp(resourcePath).toFile(downloadPath);
      })
      .then(() => ({ device: device.name, name, success: true }))
      .catch(err => ({ device: device.name, name, success: false, error: err.message }));
    
    allPromises.push(promise);
  });
});

Promise.all(allPromises)
  .then(results => {
    console.log('✅ All tablet screenshots generated!\n');
    
    devices.forEach(device => {
      const deviceResults = results.filter(r => r.device === device.name);
      const downloadDir = path.join(downloadsBase, `PlayStore-${device.folder}`);
      
      console.log(`📱 ${device.folder} (${device.width}x${device.height}px):`);
      console.log(`   📁 ${downloadDir}`);
      deviceResults.forEach(r => {
        if (r.success) {
          console.log(`   ✓ ${r.name}`);
        } else {
          console.log(`   ✗ ${r.name} - ${r.error}`);
        }
      });
      console.log('');
    });
    
    console.log('📝 Upload to Play Console:');
    console.log('   → Store presence → Main store listing');
    console.log('   → Separate sections for each device type:');
    console.log('      • 7" tablet screenshots');
    console.log('      • 10" tablet screenshots');
    console.log('      • Chromebook screenshots');
    console.log('      • Android XR screenshots');
    console.log('\n💡 Minimum 2 screenshots per device type');
  })
  .catch(err => {
    console.error('❌ Error generating screenshots:', err);
    process.exit(1);
  });
