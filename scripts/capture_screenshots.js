/**
 * Screenshot Capture Helper for Google Play Console
 * 
 * This script guides you through capturing and organizing screenshots
 * for Play Console submission.
 * 
 * Usage: node scripts/capture_screenshots.js
 */

const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'release', 'assets', 'screenshots');

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('✅ Created directory:', screenshotsDir);
}

const screenshots = [
  {
    number: 1,
    name: 'screenshot_01_home',
    feature: 'Home Page / Navigation',
    description: 'Main landing page showing all features',
    calloutText: 'Your Complete Guitar Practice Studio',
    instructions: [
      '1. Open http://localhost:5173',
      '2. Wait for home page to load',
      '3. Press Win + Shift + S (Windows Snipping Tool)',
      '4. Capture full browser window',
      '5. Save as: screenshot_01_home.png'
    ]
  },
  {
    number: 2,
    name: 'screenshot_02_ai_lessons',
    feature: 'AI Lesson Generator',
    description: 'Adaptive practice sequences',
    calloutText: 'AI-Curated Lessons Tailored to Your Progress',
    instructions: [
      '1. Click "AI Lesson Generator" in navigation',
      '2. Wait for lesson list to generate',
      '3. Capture the screen showing drill list',
      '4. Save as: screenshot_02_ai_lessons.png'
    ]
  },
  {
    number: 3,
    name: 'screenshot_03_heatmap',
    feature: 'Mistake Heatmap',
    description: 'Fretboard error density visualization',
    calloutText: 'See Exactly Where You Struggle',
    instructions: [
      '1. Click "Mistake Heatmap" in navigation',
      '2. Wait for fretboard visualization to render',
      '3. Capture screen showing color-coded frets',
      '4. Save as: screenshot_03_heatmap.png'
    ]
  },
  {
    number: 4,
    name: 'screenshot_04_jam_companion',
    feature: 'Jam Companion',
    description: 'Adaptive backing tracks',
    calloutText: 'Jam Along with Tempo-Responsive Tracks',
    instructions: [
      '1. Click "Jam Companion" in navigation',
      '2. Show tempo slider and genre selector',
      '3. Capture the interface',
      '4. Save as: screenshot_04_jam_companion.png'
    ]
  },
  {
    number: 5,
    name: 'screenshot_05_tuner_metronome',
    feature: 'Metronome + Tuner',
    description: 'Unified timing and pitch tools',
    calloutText: 'Integrated Tuner & Metronome – One Tap Away',
    instructions: [
      '1. Click "Metronome/Tuner" in navigation',
      '2. Show BPM control and pitch visualization',
      '3. Capture the interface',
      '4. Save as: screenshot_05_tuner_metronome.png'
    ]
  },
  {
    number: 6,
    name: 'screenshot_06_practice_analyzer',
    feature: 'Practice Analyzer',
    description: 'Performance metrics dashboard',
    calloutText: 'Track Mastery Velocity Over Time',
    instructions: [
      '1. Click "Practice Analyzer" in navigation',
      '2. Show charts with timing accuracy and streaks',
      '3. Capture the dashboard',
      '4. Save as: screenshot_06_practice_analyzer.png'
    ]
  },
  {
    number: 7,
    name: 'screenshot_07_chord_library',
    feature: 'Chord Library',
    description: 'Structured chord explorer',
    calloutText: 'Explore 500+ Chords with Inversions',
    instructions: [
      '1. Click "Chord Library" in navigation',
      '2. Show chord grid with diagrams',
      '3. Capture the library view',
      '4. Save as: screenshot_07_chord_library.png'
    ]
  },
  {
    number: 8,
    name: 'screenshot_08_progress',
    feature: 'Progress Dashboard',
    description: 'Streak tracking and milestones',
    calloutText: 'Celebrate Your Progress – Streaks & Mastery',
    instructions: [
      '1. Navigate to Progress/Stats section',
      '2. Show streak counter and completion percentage',
      '3. Capture the progress screen',
      '4. Save as: screenshot_08_progress.png'
    ]
  }
];

console.log('\n🎯 SCREENSHOT CAPTURE GUIDE FOR GOOGLE PLAY CONSOLE\n');
console.log('='.repeat(60));
console.log(`\n📁 Save all screenshots to:\n   ${screenshotsDir}\n`);
console.log('='.repeat(60));

screenshots.forEach(screenshot => {
  console.log(`\n📸 Screenshot ${screenshot.number}: ${screenshot.feature}`);
  console.log(`   File: ${screenshot.name}.png`);
  console.log(`   Callout Text: "${screenshot.calloutText}"`);
  console.log(`   Description: ${screenshot.description}\n`);
  console.log('   Steps:');
  screenshot.instructions.forEach(step => console.log(`   ${step}`));
  console.log('');
});

console.log('='.repeat(60));
console.log('\n💡 TIPS:');
console.log('   • Use consistent browser window size (1920x1080 or 1440x900)');
console.log('   • Capture in light mode (unless app has dark theme)');
console.log('   • Remove browser chrome (use F11 fullscreen if needed)');
console.log('   • Add callout text overlays later in Figma/Photoshop');
console.log('   • Minimum 2 screenshots required, 5-8 recommended');
console.log('\n📤 UPLOAD TO PLAY CONSOLE:');
console.log('   1. Go to: Play Console → Store presence → Main store listing');
console.log('   2. Scroll to: Screenshots → Phone');
console.log('   3. Click: Add images');
console.log('   4. Select all PNG files from screenshots folder');
console.log('   5. Drag to reorder (first screenshot is primary)');
console.log('\n✅ Ready to capture! App is running at http://localhost:5173\n');

// Check existing screenshots
const existingFiles = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
if (existingFiles.length > 0) {
  console.log(`📋 Existing screenshots (${existingFiles.length}):`);
  existingFiles.forEach(file => console.log(`   • ${file}`));
  console.log('');
}
