// Generate YouTube Channel Banner
// Required size: 2560x1440px (safe area: 1546x423px centered)

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'resources', 'youtube');
const outputFile = path.join(outputDir, 'channel-banner.png');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// YouTube banner dimensions
const width = 2560;
const height = 1440;
const safeX = (width - 1546) / 2;
const safeY = (height - 423) / 2;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#0f3460;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
    </linearGradient>
    
    <!-- Glow effect -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Text shadow -->
    <filter id="shadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  
  <!-- Decorative guitar strings (full width) -->
  <line x1="0" y1="600" x2="${width}" y2="600" stroke="#00ff88" stroke-width="3" opacity="0.15"/>
  <line x1="0" y1="680" x2="${width}" y2="680" stroke="#00ff88" stroke-width="3" opacity="0.15"/>
  <line x1="0" y1="760" x2="${width}" y2="760" stroke="#00ff88" stroke-width="3" opacity="0.15"/>
  <line x1="0" y1="840" x2="${width}" y2="840" stroke="#00ff88" stroke-width="3" opacity="0.15"/>
  
  <!-- Fret markers (decorative pattern) -->
  <circle cx="400" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="600" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="800" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="1000" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="1200" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="1400" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="1600" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="1800" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="2000" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  <circle cx="2200" cy="720" r="12" fill="#00ff88" opacity="0.2"/>
  
  <!-- Safe area guide (comment out for final) -->
  <!-- <rect x="${safeX}" y="${safeY}" width="1546" height="423" fill="none" stroke="red" stroke-width="2" opacity="0.3"/> -->
  
  <!-- Main content (centered in safe area) -->
  <g transform="translate(${width/2}, ${height/2 - 60})">
    
    <!-- Main title -->
    <text x="0" y="0" 
          text-anchor="middle"
          font-family="Arial, sans-serif" 
          font-size="140" 
          font-weight="bold" 
          fill="#00ff88" 
          filter="url(#glow)">FretPilot</text>
    
    <!-- Subtitle -->
    <text x="0" y="90" 
          text-anchor="middle"
          font-family="Arial, sans-serif" 
          font-size="52" 
          fill="#ffffff" 
          opacity="0.95"
          filter="url(#shadow)">Studio and School</text>
    
    <!-- Tagline -->
    <text x="0" y="160" 
          text-anchor="middle"
          font-family="Arial, sans-serif" 
          font-size="36" 
          fill="#ffffff" 
          opacity="0.8">Master Guitar with AI-Powered Lessons</text>
    
    <!-- Call to action -->
    <text x="0" y="230" 
          text-anchor="middle"
          font-family="Arial, sans-serif" 
          font-size="28" 
          fill="#00ff88" 
          opacity="0.9">Subscribe for Weekly Guitar Tips and Tutorials</text>
  </g>
  
  <!-- Bottom accent bar -->
  <rect x="${safeX}" y="${safeY + 400}" width="1546" height="4" fill="#00ff88" opacity="0.4"/>
  
  <!-- Social icons placeholders (text based) -->
  <g transform="translate(${width/2 - 200}, ${height - 150})">
    <text x="0" y="0" 
          font-family="Arial, sans-serif" 
          font-size="24" 
          fill="#ffffff" 
          opacity="0.6">fretpilotstudio.com</text>
  </g>
  
  <g transform="translate(${width/2 + 50}, ${height - 150})">
    <text x="0" y="0" 
          font-family="Arial, sans-serif" 
          font-size="24" 
          fill="#ffffff" 
          opacity="0.6">@fretpilotstudio</text>
  </g>
</svg>
`;

// Convert SVG to PNG
sharp(Buffer.from(svg))
  .resize(2560, 1440)
  .png()
  .toFile(outputFile)
  .then(() => {
    console.log('✅ YouTube banner created successfully!');
    console.log(`📁 Location: ${outputFile}`);
    console.log('📐 Size: 2560x1440px (YouTube requirement)');
    console.log('📱 Safe area: 1546x423px (all content within this zone)');
    console.log('\n📝 Upload this to YouTube Studio:');
    console.log('   → Customization → Branding');
    console.log('   → Banner image section');
    console.log('\n💡 Tips:');
    console.log('   - Desktop displays center 1546x423px');
    console.log('   - TV displays full 2560x1440px');
    console.log('   - Mobile crops to center area');
  })
  .catch(err => {
    console.error('❌ Error creating YouTube banner:', err);
    process.exit(1);
  });
