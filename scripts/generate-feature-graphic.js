// Generate Feature Graphic for Google Play Store
// Required size: 1024x500px (PNG or JPEG)

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'resources', 'playstore');
const outputFile = path.join(outputDir, 'feature-graphic.png');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create feature graphic with FretPilot branding
const width = 1024;
const height = 500;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
    </linearGradient>
    
    <!-- Glow effect -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  
  <!-- Decorative fretboard lines -->
  <line x1="50" y1="150" x2="350" y2="150" stroke="#00ff88" stroke-width="2" opacity="0.3"/>
  <line x1="50" y1="200" x2="350" y2="200" stroke="#00ff88" stroke-width="2" opacity="0.3"/>
  <line x1="50" y1="250" x2="350" y2="250" stroke="#00ff88" stroke-width="2" opacity="0.3"/>
  <line x1="50" y1="300" x2="350" y2="300" stroke="#00ff88" stroke-width="2" opacity="0.3"/>
  <line x1="50" y1="350" x2="350" y2="350" stroke="#00ff88" stroke-width="2" opacity="0.3"/>
  
  <!-- Fret markers -->
  <circle cx="100" cy="250" r="6" fill="#00ff88" opacity="0.5"/>
  <circle cx="150" cy="250" r="6" fill="#00ff88" opacity="0.5"/>
  <circle cx="200" cy="250" r="6" fill="#00ff88" opacity="0.5"/>
  <circle cx="250" cy="250" r="6" fill="#00ff88" opacity="0.5"/>
  <circle cx="300" cy="250" r="6" fill="#00ff88" opacity="0.5"/>
  
  <!-- Main title -->
  <text x="420" y="160" 
        font-family="Arial, sans-serif" 
        font-size="72" 
        font-weight="bold" 
        fill="#00ff88" 
        filter="url(#glow)">FretPilot</text>
  
  <!-- Subtitle -->
  <text x="420" y="220" 
        font-family="Arial, sans-serif" 
        font-size="36" 
        fill="#ffffff" 
        opacity="0.9">Studio and School</text>
  
  <!-- Tagline -->
  <text x="420" y="280" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        fill="#ffffff" 
        opacity="0.7">AI-Powered Guitar Training</text>
  
  <!-- Features -->
  <text x="420" y="330" 
        font-family="Arial, sans-serif" 
        font-size="18" 
        fill="#00ff88" 
        opacity="0.8">• Smart Lessons  • Practice Analytics  • Jam Companion</text>
  
  <!-- Accent line -->
  <rect x="420" y="350" width="550" height="3" fill="#00ff88" opacity="0.6"/>
  
  <!-- Rating stars -->
  <text x="420" y="400" 
        font-family="Arial, sans-serif" 
        font-size="32" 
        fill="#ffd700">*****</text>
  
  <text x="590" y="400" 
        font-family="Arial, sans-serif" 
        font-size="20" 
        fill="#ffffff" 
        opacity="0.7">Premium Music Education</text>
</svg>
`;

// Convert SVG to PNG
sharp(Buffer.from(svg))
  .resize(1024, 500)
  .png()
  .toFile(outputFile)
  .then(() => {
    console.log('✅ Feature graphic created successfully!');
    console.log(`📁 Location: ${outputFile}`);
    console.log('📐 Size: 1024x500px (Google Play requirement)');
    console.log('\n📝 Upload this to Play Console:');
    console.log('   → Store presence → Main store listing → Graphics');
    console.log('   → Feature graphic section');
  })
  .catch(err => {
    console.error('❌ Error creating feature graphic:', err);
    process.exit(1);
  });
