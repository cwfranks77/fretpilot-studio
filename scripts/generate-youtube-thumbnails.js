// Generate YouTube Thumbnails (1280x720px)
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'youtube', 'thumbnails');
const downloadsDir = path.join(process.env.USERPROFILE, 'Downloads', 'YouTube-Thumbnails');

[outputDir, downloadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const width = 1280;
const height = 720;

const thumbnails = [
  {
    name: '1-master-guitar-30-days',
    title: 'MASTER GUITAR',
    subtitle: 'IN 30 DAYS WITH AI',
    gradient: ['#ff0844', '#ffb199']
  },
  {
    name: '2-record-first-song',
    title: 'RECORD YOUR',
    subtitle: 'FIRST SONG TODAY',
    gradient: ['#4158D0', '#C850C0']
  },
  {
    name: '3-backing-tracks',
    title: '500+ BACKING',
    subtitle: 'TRACKS INCLUDED',
    gradient: ['#0093E9', '#80D0C7']
  },
  {
    name: '4-ai-finds-mistakes',
    title: 'AI FINDS YOUR',
    subtitle: 'MISTAKES AND FIXES THEM',
    gradient: ['#8EC5FC', '#E0C3FC']
  },
  {
    name: '5-free-alternative',
    title: 'FREE ALTERNATIVE',
    subtitle: 'TO $50/HOUR LESSONS',
    gradient: ['#FBAB7E', '#F7CE68']
  },
  {
    name: '6-beginner-to-pro',
    title: 'BEGINNER TO',
    subtitle: 'GIGGING MUSICIAN',
    gradient: ['#FA8BFF', '#2BD2FF']
  },
  {
    name: '7-complete-guide',
    title: 'COMPLETE',
    subtitle: 'FEATURE GUIDE 2025',
    gradient: ['#52ACFF', '#FFE32C']
  },
  {
    name: '8-practice-smarter',
    title: 'PRACTICE SMARTER',
    subtitle: 'NOT HARDER',
    gradient: ['#21D4FD', '#B721FF']
  }
];

function generateThumbnail({ name, title, subtitle, gradient }) {
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient[1]};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="overlay-${name}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.6" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <!-- Background gradient -->
  <rect width="${width}" height="${height}" fill="url(#bg-${name})"/>
  
  <!-- Dark overlay -->
  <rect width="${width}" height="${height}" fill="url(#overlay-${name})"/>
  
  <!-- Guitar strings pattern -->
  <line x1="0" y1="150" x2="${width}" y2="150" stroke="#ffffff" stroke-width="3" opacity="0.15"/>
  <line x1="0" y1="250" x2="${width}" y2="250" stroke="#ffffff" stroke-width="3" opacity="0.15"/>
  <line x1="0" y1="350" x2="${width}" y2="350" stroke="#ffffff" stroke-width="3" opacity="0.15"/>
  <line x1="0" y1="450" x2="${width}" y2="450" stroke="#ffffff" stroke-width="3" opacity="0.15"/>
  <line x1="0" y1="550" x2="${width}" y2="550" stroke="#ffffff" stroke-width="3" opacity="0.15"/>
  
  <!-- FretPilot logo area -->
  <rect x="30" y="30" width="300" height="80" fill="#00ff88" rx="10" filter="url(#shadow)"/>
  <text x="180" y="85" text-anchor="middle" font-family="Arial" font-size="42" font-weight="bold" fill="#000000">FretPilot</text>
  
  <!-- Main title -->
  <text x="${width / 2}" y="280" text-anchor="middle" font-family="Arial" font-size="110" font-weight="bold" fill="#ffffff" filter="url(#shadow)" letter-spacing="2">${title}</text>
  
  <!-- Subtitle -->
  <text x="${width / 2}" y="390" text-anchor="middle" font-family="Arial" font-size="72" font-weight="bold" fill="#ffffff" filter="url(#shadow)" letter-spacing="1">${subtitle}</text>
  
  <!-- Bottom badge -->
  <rect x="${width - 250}" y="${height - 110}" width="220" height="80" fill="#000000" opacity="0.7" rx="10"/>
  <text x="${width - 140}" y="${height - 50}" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#00ff88">WATCH NOW</text>
  
  <!-- Decorative elements -->
  <circle cx="120" cy="540" r="30" fill="#00ff88" opacity="0.3"/>
  <circle cx="${width - 150}" cy="180" r="40" fill="#ffffff" opacity="0.2"/>
  <circle cx="200" cy="650" r="25" fill="#ffffff" opacity="0.25"/>
</svg>
`;
}

const promises = thumbnails.map(config => {
  const svg = generateThumbnail(config);
  const outputPath = path.join(outputDir, `${config.name}.png`);
  const downloadPath = path.join(downloadsDir, `${config.name}.png`);
  
  return sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toFile(outputPath)
    .then(() => sharp(outputPath).toFile(downloadPath))
    .then(() => ({ name: config.name, success: true }))
    .catch(err => ({ name: config.name, success: false, error: err.message }));
});

Promise.all(promises)
  .then(results => {
    console.log('✅ YouTube thumbnails generated!\n');
    console.log(`📁 ${downloadsDir}\n`);
    
    results.forEach(r => {
      if (r.success) {
        console.log(`   ✓ ${r.name}.png`);
      } else {
        console.log(`   ✗ ${r.name}.png - ${r.error}`);
      }
    });
    
    console.log('\n📐 Size: 1280x720px (16:9)');
    console.log('📝 Upload to YouTube Studio when creating videos');
    console.log('💡 Eye-catching gradients optimized for mobile viewing');
  })
  .catch(err => {
    console.error('❌ Error generating thumbnails:', err);
    process.exit(1);
  });
