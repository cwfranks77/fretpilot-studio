/**
 * Upload Screenshots to Google Play Console
 * 
 * After capturing all screenshots, run this script to:
 * 1. Verify all files exist
 * 2. Check file sizes and dimensions
 * 3. Generate upload instructions
 */

const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'release', 'assets', 'screenshots');

const requiredScreenshots = [
  'screenshot_01_home.png',
  'screenshot_02_ai_lessons.png',
  'screenshot_03_heatmap.png',
  'screenshot_04_jam_companion.png',
  'screenshot_05_tuner_metronome.png',
  'screenshot_06_practice_analyzer.png',
  'screenshot_07_chord_library.png',
  'screenshot_08_progress.png'
];

console.log('\n📋 SCREENSHOT VERIFICATION\n');
console.log('='.repeat(60));

let readyCount = 0;
let missingCount = 0;

requiredScreenshots.forEach((filename, index) => {
  const filePath = path.join(screenshotsDir, filename);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`✅ ${index + 1}. ${filename} (${sizeMB} MB)`);
    readyCount++;
  } else {
    console.log(`❌ ${index + 1}. ${filename} - MISSING`);
    missingCount++;
  }
});

console.log('='.repeat(60));
console.log(`\n📊 Status: ${readyCount} ready, ${missingCount} missing (minimum 2 required)\n`);

if (readyCount >= 2) {
  console.log('✅ You have enough screenshots to proceed!\n');
  console.log('📤 UPLOAD TO GOOGLE PLAY CONSOLE:\n');
  console.log('1. Open: https://play.google.com/console');
  console.log('2. Select your app: FretPilot Studio & School');
  console.log('3. Navigate: Grow → Store presence → Main store listing');
  console.log('4. Scroll to: Screenshots → Phone');
  console.log('5. Click: "Add images"');
  console.log(`6. Browse to: ${screenshotsDir}`);
  console.log('7. Select all PNG files');
  console.log('8. Click Open/Upload');
  console.log('9. Drag screenshots to reorder (first = primary display)');
  console.log('10. Click "Save" at bottom of page\n');
  
  console.log('💡 BEST PRACTICES:');
  console.log('   • First screenshot should be most compelling (AI Lessons or Heatmap)');
  console.log('   • Showcase variety of features');
  console.log('   • Keep order logical (Home → Features → Advanced)');
  console.log('   • Add text overlays in Figma/Canva if desired (optional)\n');
} else {
  console.log('⚠️  Please capture at least 2 screenshots before uploading.\n');
  console.log('📱 Quick capture instructions:');
  console.log('   1. Open the app in browser');
  console.log('   2. Press Win + Shift + S');
  console.log('   3. Capture the screen');
  console.log(`   4. Save to: ${screenshotsDir}\n`);
}

// Open screenshots folder in Explorer
if (process.platform === 'win32') {
  console.log(`📁 Opening screenshots folder...\n`);
  require('child_process').exec(`explorer "${screenshotsDir}"`);
}
