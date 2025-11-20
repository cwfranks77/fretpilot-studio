#!/usr/bin/env node
/**
 * FretPilot Studio & School v1.0.0 Release Notes (APK-only internal testing)
 * Usage:
 *   node scripts/release_notes_1_0_0_apk.js          # full markdown
 *   node scripts/release_notes_1_0_0_apk.js text     # condensed text
 *   node scripts/release_notes_1_0_0_apk.js json     # JSON manifest
 * Focus: References only the fretpilotstudio APK distribution (not AAB).
 */

const notes = {
  versionName: '1.0.0',
  versionCode: 2,
  packageId: 'com.fretpilot.app',
  artifact: 'app-release.apk', // expected local filename
  distribution: 'Direct internal APK install (adb / share)',
  description: 'FretPilot Studio & School unifies AI-guided lesson generation, mistake visualization, adaptive jam tracks, and precision analytics for focused guitar skill acceleration.',
  features: [
    'AI Lesson Generator',
    'Mistake Heatmap',
    'Practice Analyzer',
    'Jam Companion adaptive tracks',
    'Metronome + Tuner hub',
    'Progress streak & mastery tracking',
    'Chord Library explorer',
    'Premium Gate scaffold',
    'Consent-based analytics'
  ],
  permissions: [
    { name: 'RECORD_AUDIO', rationale: 'Real-time tuner pitch analysis; no audio stored.' },
    { name: 'INTERNET', rationale: 'Future lesson expansion + optional analytics (opt-in).' },
    { name: 'ACCESS_NETWORK_STATE', rationale: 'Graceful offline fallbacks.' }
  ],
  installation: {
    adb: 'adb install app-release.apk',
    manual: 'Share APK file to tester device and open to install (after allowing unknown sources).'
  },
  knownIssues: [
    { id: 'KI-001', area: 'Tuner', symptom: 'Latency spike on very low frequencies (<60Hz)', severity: 'Low', workaround: 'Retune higher string then octave adjust' },
    { id: 'KI-002', area: 'Heatmap', symptom: 'Rare fret offset mismatch after rapid tuning session', severity: 'Medium', workaround: 'Reopen Mistake Heatmap component' },
    { id: 'KI-003', area: 'Jam Companion', symptom: 'Double-trigger slowdown on clustered errors', severity: 'Medium', workaround: 'Manual tempo reset in panel' }
  ],
  dataSafety: {
    audio: 'Transient pitch processing only; no storage',
    metrics: 'Performance metrics local device only',
    analytics: 'Disabled until explicit consent',
    sensitive: 'No sensitive personal data collected'
  },
  testFocus: [
    'Audio permission grant/deny behavior',
    'Heatmap accuracy across multiple sessions',
    'Adaptive tempo threshold correctness (Jam Companion)',
    'Metronome stability in >20 min sessions'
  ],
  shortBlurb: 'AI-guided guitar practice studio with adaptive lessons, mistake heatmap, jam tracks, tuner + metronome, and mastery analytics.',
  oneLine: 'Adaptive AI guitar training with real-time performance insight (Internal APK Test v1.0.0).'
};

function md(){
  console.log(`# FretPilot Studio & School – Internal APK Test Release Notes v${notes.versionName}`);
  console.log(`VersionCode: ${notes.versionCode}  |  Package: ${notes.packageId}`);
  console.log(`\nArtifact: ${notes.artifact}\nDistribution: ${notes.distribution}\n`);
  console.log('## Overview');
  console.log(notes.description + '\n');
  console.log('## Core Features');
  notes.features.forEach(f=>console.log('- ' + f));
  console.log('\n## Permissions');
  notes.permissions.forEach(p=>console.log(`- ${p.name}: ${p.rationale}`));
  console.log('\n## Installation');
  console.log('- ADB: ' + notes.installation.adb);
  console.log('- Manual: ' + notes.installation.manual + '\n');
  console.log('## Known Issues (Non-blocking)');
  console.log('| ID | Area | Symptom | Severity | Workaround |');
  console.log('|----|------|---------|----------|------------|');
  notes.knownIssues.forEach(k=>console.log(`| ${k.id} | ${k.area} | ${k.symptom} | ${k.severity} | ${k.workaround} |`));
  console.log('\n## Data Safety');
  Object.entries(notes.dataSafety).forEach(([k,v])=>console.log(`- ${k}: ${v}`));
  console.log('\n## Testing Focus');
  notes.testFocus.forEach(t=>console.log('- ' + t));
  console.log('\n## Short Blurb');
  console.log(notes.shortBlurb + '\n');
  console.log('## One-Line Summary');
  console.log(notes.oneLine + '\n');
  console.log('## Plain Changelog');
  console.log(`v${notes.versionName} APK Internal Test\n- Introduces: ${notes.features.join(', ')}.`);
  console.log('\n## JSON Manifest');
  console.log('```json');
  console.log(JSON.stringify(notes, null, 2));
  console.log('```');
  console.log('\nEnd of APK-only internal test release notes.');
}

function text(){
  console.log(`FretPilot Studio & School v${notes.versionName} Internal APK Test\nFeatures: ${notes.features.join('; ')}\nAPK: ${notes.artifact}\nInstall: ${notes.installation.adb}\nIssues: ${notes.knownIssues.map(k=>k.id).join(', ')} (non-blocking)\nData: audio transient; metrics local; analytics opt-in.\nShort: ${notes.shortBlurb}`);
}

function json(){
  console.log(JSON.stringify(notes, null, 2));
}

const mode = (process.argv[2]||'md').toLowerCase();
if(mode==='md') md();
else if(mode==='text') text();
else if(mode==='json') json();
else md();
