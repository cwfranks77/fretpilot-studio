// Generate Phone Screenshots for Google Play Console
// Required: Minimum 2 screenshots, 16:9 or 9:16 aspect ratio
// Recommended: 1080x1920px (portrait) or 1920x1080px (landscape)

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'resources', 'playstore', 'screenshots');
const downloadsDir = path.join(process.env.USERPROFILE, 'Downloads', 'PlayStore-Screenshots');

// Ensure output directories exist
[outputDir, downloadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const width = 1080;
const height = 1920;

// Screenshot 1: Home/Lessons View
const screenshot1 = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg1)"/>
  
  <!-- Status bar -->
  <rect width="${width}" height="100" fill="#000000" opacity="0.5"/>
  <text x="60" y="65" font-family="Arial" font-size="32" fill="#ffffff">9:41</text>
  
  <!-- Top bar -->
  <rect y="100" width="${width}" height="140" fill="#0f3460"/>
  <text x="540" y="185" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#00ff88">FretPilot</text>
  
  <!-- Main content -->
  <text x="540" y="380" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#ffffff">Smart Lessons</text>
  <text x="540" y="460" text-anchor="middle" font-family="Arial" font-size="32" fill="#ffffff" opacity="0.8">AI-powered guitar training</text>
  
  <!-- Fretboard visualization -->
  <rect x="140" y="580" width="800" height="600" fill="#1a1a2e" rx="20"/>
  <line x1="180" y1="680" x2="900" y2="680" stroke="#00ff88" stroke-width="4" opacity="0.6"/>
  <line x1="180" y1="780" x2="900" y2="780" stroke="#00ff88" stroke-width="4" opacity="0.6"/>
  <line x1="180" y1="880" x2="900" y2="880" stroke="#00ff88" stroke-width="4" opacity="0.6"/>
  <line x1="180" y1="980" x2="900" y2="980" stroke="#00ff88" stroke-width="4" opacity="0.6"/>
  <line x1="180" y1="1080" x2="900" y2="1080" stroke="#00ff88" stroke-width="4" opacity="0.6"/>
  
  <circle cx="350" cy="880" r="25" fill="#00ff88"/>
  <circle cx="550" cy="780" r="25" fill="#00ff88"/>
  <circle cx="750" cy="980" r="25" fill="#00ff88"/>
  
  <text x="540" y="640" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff" opacity="0.7">Interactive Fretboard</text>
  
  <!-- Bottom buttons -->
  <rect x="140" y="1320" width="340" height="120" fill="#00ff88" rx="15"/>
  <text x="310" y="1395" text-anchor="middle" font-family="Arial" font-size="38" font-weight="bold" fill="#000000">Start Lesson</text>
  
  <rect x="600" y="1320" width="340" height="120" fill="#0f3460" rx="15"/>
  <text x="770" y="1395" text-anchor="middle" font-family="Arial" font-size="38" font-weight="bold" fill="#ffffff">Practice</text>
  
  <!-- Feature badges -->
  <rect x="140" y="1500" width="800" height="280" fill="#0f3460" opacity="0.3" rx="20"/>
  <text x="540" y="1580" text-anchor="middle" font-family="Arial" font-size="28" fill="#00ff88">• Progress Tracking</text>
  <text x="540" y="1650" text-anchor="middle" font-family="Arial" font-size="28" fill="#00ff88">• Mistake Heatmap</text>
  <text x="540" y="1720" text-anchor="middle" font-family="Arial" font-size="28" fill="#00ff88">• Jam Companion</text>
</svg>
`;

// Screenshot 2: Practice Analytics
const screenshot2 = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg2)"/>
  
  <!-- Status bar -->
  <rect width="${width}" height="100" fill="#000000" opacity="0.5"/>
  <text x="60" y="65" font-family="Arial" font-size="32" fill="#ffffff">9:41</text>
  
  <!-- Top bar -->
  <rect y="100" width="${width}" height="140" fill="#0f3460"/>
  <text x="540" y="185" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#00ff88">Practice Analytics</text>
  
  <!-- Stats cards -->
  <rect x="100" y="320" width="880" height="200" fill="#0f3460" opacity="0.6" rx="20"/>
  <text x="540" y="390" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#00ff88">127</text>
  <text x="540" y="460" text-anchor="middle" font-family="Arial" font-size="32" fill="#ffffff">Practice Sessions</text>
  
  <rect x="100" y="580" width="420" height="180" fill="#0f3460" opacity="0.6" rx="20"/>
  <text x="310" y="650" text-anchor="middle" font-family="Arial" font-size="44" font-weight="bold" fill="#00ff88">95%</text>
  <text x="310" y="710" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff">Accuracy</text>
  
  <rect x="560" y="580" width="420" height="180" fill="#0f3460" opacity="0.6" rx="20"/>
  <text x="770" y="650" text-anchor="middle" font-family="Arial" font-size="44" font-weight="bold" fill="#00ff88">45 min</text>
  <text x="770" y="710" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff">Today</text>
  
  <!-- Progress chart placeholder -->
  <rect x="100" y="820" width="880" height="400" fill="#0f3460" opacity="0.3" rx="20"/>
  <text x="540" y="900" text-anchor="middle" font-family="Arial" font-size="36" fill="#ffffff" opacity="0.8">Weekly Progress</text>
  
  <!-- Bar chart -->
  <rect x="180" y="1100" width="80" height="80" fill="#00ff88" opacity="0.6"/>
  <rect x="300" y="1050" width="80" height="130" fill="#00ff88" opacity="0.6"/>
  <rect x="420" y="980" width="80" height="200" fill="#00ff88"/>
  <rect x="540" y="1020" width="80" height="160" fill="#00ff88" opacity="0.8"/>
  <rect x="660" y="1060" width="80" height="120" fill="#00ff88" opacity="0.7"/>
  <rect x="780" y="1000" width="80" height="180" fill="#00ff88" opacity="0.9"/>
  
  <!-- Bottom feature -->
  <rect x="100" y="1280" width="880" height="180" fill="#1a1a2e" rx="20"/>
  <text x="540" y="1360" text-anchor="middle" font-family="Arial" font-size="32" fill="#ffffff">Mistake Heatmap</text>
  <text x="540" y="1420" text-anchor="middle" font-family="Arial" font-size="24" fill="#ffffff" opacity="0.7">See exactly where to improve</text>
  
  <!-- Bottom text -->
  <text x="540" y="1600" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#00ff88">Track Your Growth</text>
  <text x="540" y="1680" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff" opacity="0.8">Data-driven practice insights</text>
</svg>
`;

// Screenshot 3: Chord Library
const screenshot3 = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg3)"/>
  
  <!-- Status bar -->
  <rect width="${width}" height="100" fill="#000000" opacity="0.5"/>
  <text x="60" y="65" font-family="Arial" font-size="32" fill="#ffffff">9:41</text>
  
  <!-- Top bar -->
  <rect y="100" width="${width}" height="140" fill="#0f3460"/>
  <text x="540" y="185" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#00ff88">Chord Library</text>
  
  <!-- Search bar -->
  <rect x="100" y="300" width="880" height="100" fill="#0f3460" opacity="0.6" rx="50"/>
  <text x="150" y="365" font-family="Arial" font-size="32" fill="#ffffff" opacity="0.6">Search chords...</text>
  
  <!-- Chord cards -->
  <rect x="100" y="480" width="400" height="300" fill="#0f3460" opacity="0.6" rx="20"/>
  <text x="300" y="560" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#00ff88">C</text>
  <text x="300" y="620" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff">Major</text>
  <line x1="160" y1="670" x2="440" y2="670" stroke="#00ff88" stroke-width="3"/>
  <line x1="160" y1="710" x2="440" y2="710" stroke="#00ff88" stroke-width="3"/>
  <line x1="160" y1="750" x2="440" y2="750" stroke="#00ff88" stroke-width="3"/>
  <circle cx="200" cy="690" r="12" fill="#00ff88"/>
  <circle cx="280" cy="710" r="12" fill="#00ff88"/>
  <circle cx="360" cy="730" r="12" fill="#00ff88"/>
  
  <rect x="580" y="480" width="400" height="300" fill="#0f3460" opacity="0.6" rx="20"/>
  <text x="780" y="560" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#00ff88">G</text>
  <text x="780" y="620" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff">Major</text>
  <line x1="640" y1="670" x2="920" y2="670" stroke="#00ff88" stroke-width="3"/>
  <line x1="640" y1="710" x2="920" y2="710" stroke="#00ff88" stroke-width="3"/>
  <line x1="640" y1="750" x2="920" y2="750" stroke="#00ff88" stroke-width="3"/>
  <circle cx="680" cy="690" r="12" fill="#00ff88"/>
  <circle cx="760" cy="710" r="12" fill="#00ff88"/>
  <circle cx="840" cy="690" r="12" fill="#00ff88"/>
  
  <rect x="100" y="840" width="400" height="300" fill="#0f3460" opacity="0.6" rx="20"/>
  <text x="300" y="920" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#00ff88">Am</text>
  <text x="300" y="980" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff">Minor</text>
  <line x1="160" y1="1030" x2="440" y2="1030" stroke="#00ff88" stroke-width="3"/>
  <line x1="160" y1="1070" x2="440" y2="1070" stroke="#00ff88" stroke-width="3"/>
  <line x1="160" y1="1110" x2="440" y2="1110" stroke="#00ff88" stroke-width="3"/>
  <circle cx="200" cy="1050" r="12" fill="#00ff88"/>
  <circle cx="280" cy="1070" r="12" fill="#00ff88"/>
  <circle cx="360" cy="1090" r="12" fill="#00ff88"/>
  
  <rect x="580" y="840" width="400" height="300" fill="#0f3460" opacity="0.6" rx="20"/>
  <text x="780" y="920" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#00ff88">D</text>
  <text x="780" y="980" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff">Major</text>
  <line x1="640" y1="1030" x2="920" y2="1030" stroke="#00ff88" stroke-width="3"/>
  <line x1="640" y1="1070" x2="920" y2="1070" stroke="#00ff88" stroke-width="3"/>
  <line x1="640" y1="1110" x2="920" y2="1110" stroke="#00ff88" stroke-width="3"/>
  <circle cx="680" cy="1050" r="12" fill="#00ff88"/>
  <circle cx="760" cy="1030" r="12" fill="#00ff88"/>
  <circle cx="840" cy="1070" r="12" fill="#00ff88"/>
  
  <!-- Bottom text -->
  <text x="540" y="1320" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#00ff88">500+ Chords</text>
  <text x="540" y="1400" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff" opacity="0.8">Complete chord reference</text>
  <text x="540" y="1470" text-anchor="middle" font-family="Arial" font-size="28" fill="#ffffff" opacity="0.8">with fingering diagrams</text>
</svg>
`;

const screenshots = [
  { svg: screenshot1, name: '1-lessons.png' },
  { svg: screenshot2, name: '2-analytics.png' },
  { svg: screenshot3, name: '3-chords.png' }
];

Promise.all(screenshots.map(({ svg, name }) => {
  const outputPath = path.join(outputDir, name);
  const downloadPath = path.join(downloadsDir, name);
  
  return sharp(Buffer.from(svg))
    .resize(1080, 1920)
    .png()
    .toFile(outputPath)
    .then(() => sharp(outputPath).toFile(downloadPath))
    .then(() => ({ name, success: true }))
    .catch(err => ({ name, success: false, error: err.message }));
}))
.then(results => {
  console.log('✅ Phone screenshots generated!');
  console.log(`📁 Saved to: ${downloadsDir}`);
  console.log('\n📸 Screenshots created:');
  results.forEach(r => {
    if (r.success) {
      console.log(`   ✓ ${r.name}`);
    } else {
      console.log(`   ✗ ${r.name} - ${r.error}`);
    }
  });
  console.log('\n📐 Size: 1080x1920px (9:16 portrait)');
  console.log('📝 Upload to Play Console:');
  console.log('   → Store presence → Main store listing');
  console.log('   → Phone screenshots section');
  console.log('   → Minimum 2, maximum 8 screenshots');
  console.log('\n💡 Tip: Upload in order (1, 2, 3) for best presentation');
})
.catch(err => {
  console.error('❌ Error generating screenshots:', err);
  process.exit(1);
});
