#!/usr/bin/env node
/**
 * FretPilot Studio & School v1.0.0 INTERNAL TEST Release Notes Script
 * Single-script source for ALL internal test release notes content.
 * Usage:
 *   node scripts/release_notes_1_0_0_internal.js            # prints everything to console
 *   node scripts/release_notes_1_0_0_internal.js md > internal_release_notes.md   # optional redirect
 * Optional first arg:
 *   md    -> emit pure markdown only
 *   json  -> emit JSON manifest only
 *   text  -> emit condensed plain text
 *   all   -> (default) full multi-section console output
 */

const data = {
  versionName: '1.0.0',
  versionCode: 2,
  packageId: 'com.fretpilot.app',
  releaseType: 'internal-test',
  overviewDescription: 'FretPilot Studio & School combines AI-guided practice, real-time performance analysis, and structured curricula into one guitar training environment.',
  features: [
    'AI Lesson Generator',
    'Mistake Heatmap',
    'Practice Analyzer',
    'Jam Companion adaptive backing tracks',
    'Metronome + Tuner integrated panel',
    'Progress tracking & streaks',
    'Chord Library',
    'Premium Gate scaffold',
    'Consent-based analytics'
  ],
  modules: [
    'AiLessonGenerator.vue',
    'MistakeHeatmap.vue',
    'PracticeAnalyzer.vue',
    'FretPilotTrainer.vue',
    'JamCompanion.vue',
    'MetronomeTuner.vue',
    'ChordLibrary.vue',
    'PremiumGate.vue'
  ],
  services: [
    'aiService.js', 'progressService.js', 'analyticsService.js', 'consentService.js', 'adService.js', 'featureFlags.js', 'config.js'
  ],
  permissions: [
    { name: 'RECORD_AUDIO', rationale: 'Tuner + potential real-time note detection; no audio stored.' },
    { name: 'INTERNET', rationale: 'Future lesson expansion + analytics dispatch (consent-based).'},
    { name: 'ACCESS_NETWORK_STATE', rationale: 'Offline-aware graceful degradation.' }
  ],
  knownIssues: [
    { id: 'KI-001', area: 'Tuner', symptom: 'Latency spike on very low frequencies (<60Hz)', severity: 'Low', workaround: 'Retune higher string then octave adjust' },
    { id: 'KI-002', area: 'Heatmap', symptom: 'Rare fret offset mismatch after rapid tuning session', severity: 'Medium', workaround: 'Reopen Mistake Heatmap component' },
    { id: 'KI-003', area: 'Jam Companion', symptom: 'Double-trigger slowdown on clustered errors', severity: 'Medium', workaround: 'Manual tempo reset in panel' },
    { id: 'KI-004', area: 'Electron Build', symptom: 'Splash screen lingers ~1s longer', severity: 'Low', workaround: 'None (cosmetic)' },
    { id: 'KI-005', area: 'Mobile Resume', symptom: 'Brief metronome desync after background resume', severity: 'Medium', workaround: 'Toggle metronome start/stop once' }
  ],
  dataSafety: {
    diagnostics: { collected: 'Basic feature usage events (opt-in)', storage: 'Rolling 90 days', shared: 'No third-party', userControl: 'Consent + reset' },
    performanceMetrics: { collected: 'Timing accuracy, error density', storage: 'Local device only', shared: 'No', userControl: 'Clear in settings (future)' },
    audioInput: { collected: 'Transient microphone signal for pitch detection', storage: 'None', shared: 'No', userControl: 'Deny permission / disable tuner' },
    sensitiveData: { collected: 'None (no contacts, location, messages, biometrics)', storage: 'N/A', shared: 'N/A', userControl: 'N/A' }
  },
  roadmapShortTerm: [
    'Cloud profile + cross-device sync',
    'Advanced ear-training drills',
    'Multiplayer session pilot (TURN infra)',
    'Adaptive curriculum difficulty layers',
    'Real product imagery & refined store branding',
    'Subscription gateway for premium analytics'
  ],
  testFocus: [
    'Audio permission grant/deny flows',
    'Heatmap accuracy after consecutive error-heavy sessions',
    'Jam Companion tempo adaptation threshold correctness',
    'Metronome drift on long (>20 min) practice runs',
    'State persistence across restarts'
  ],
  shortBlurb: 'AI-guided guitar practice studio: adaptive lessons, mistake heatmap, jam tracks that respond to you, integrated tuner + metronome, and detailed progress analytics.',
  oneLine: 'Adaptive AI guitar training with real-time error mapping and performance analytics (Test v1.0.0).',
  submissionSteps: [
    'Upload .aab to Google Play Console (Internal testing track).',
    'Paste Short Blurb + Detailed Markdown section.',
    'Fill Data Safety using provided table (no stored audio, local metrics, consent analytics).',
    'Confirm permission descriptions.',
    'Attach screenshots (Tuner, Heatmap, Jam Companion, Progress Dashboard).',
    'Roll out to testers.'
  ]
};

function hr(){console.log('\n---');}
function heading(t){console.log('\n## ' + t);}

function emitMarkdown(){
  console.log(`# FretPilot Studio & School – Internal Test Release Notes v${data.versionName}`);
  hr();
  heading('Overview');
  console.log(`Version: ${data.versionName} (code ${data.versionCode})\nPackage: ${data.packageId}\nType: ${data.releaseType}\n\n${data.overviewDescription}`);
  heading('Core Feature Set');
  data.features.forEach(f=>console.log(`- ${f}`));
  heading('Modules / Components');
  data.modules.forEach(m=>console.log(`- ${m}`));
  console.log('Services:');
  data.services.forEach(s=>console.log(`  - ${s}`));
  heading('Permissions');
  data.permissions.forEach(p=>console.log(`- ${p.name}: ${p.rationale}`));
  heading('Known Issues');
  console.log('| ID | Area | Symptom | Severity | Workaround |');
  console.log('|----|------|---------|----------|------------|');
  data.knownIssues.forEach(k=>console.log(`| ${k.id} | ${k.area} | ${k.symptom} | ${k.severity} | ${k.workaround} |`));
  heading('Data Safety & Privacy');
  console.log('| Category | Collected | Storage | Shared | User Control |');
  console.log('|----------|-----------|---------|--------|--------------|');
  Object.entries(data.dataSafety).forEach(([cat,obj])=>{
    console.log(`| ${cat} | ${obj.collected} | ${obj.storage} | ${obj.shared} | ${obj.userControl} |`);
  });
  heading('Roadmap (Short-Term)');
  // Roadmap list (validated property name: roadmapShortTerm)
  data.roadmapShortTerm.forEach(r=>console.log(`- ${r}`));
  heading('Testing Focus');
  data.testFocus.forEach(t=>console.log(`- ${t}`));
  heading('Changelog (Plain Text)');
  console.log(`FretPilot Studio & School ${data.versionName}\n- Initial internal test build.\n- Added ${data.features.join(', ')}.`);
  heading('Short Blurb');
  console.log(data.shortBlurb);
  heading('One-Line Summary');
  console.log(data.oneLine);
  heading('JSON Manifest');
  console.log('```json');
  console.log(JSON.stringify({
    versionName: data.versionName,
    versionCode: data.versionCode,
    packageId: data.packageId,
    releaseType: data.releaseType,
    features: data.features,
    permissions: data.permissions.map(p=>p.name),
    knownIssues: data.knownIssues,
    dataSafety: data.dataSafety,
    roadmapShortTerm: data.roadmapShortTerm,
    testFocus: data.testFocus
  }, null, 2));
  console.log('```');
  heading('Gradle Snippet');
  console.log('```gradle');
  console.log(`// CHANGELOG ${data.versionName}\n// Internal test release.\n// Features: ${data.features.join(', ')}\n// Issues: ${data.knownIssues.map(k=>k.id).join(', ')} (non-blocking).`);
  console.log('```');
  heading('Submission Instructions');
  data.submissionSteps.forEach((s,i)=>console.log(`${i+1}. ${s}`));
  heading('End');
  console.log('Consolidated internal test release notes complete.');
}

function emitJSON(){
  console.log(JSON.stringify(data, null, 2));
}

function emitPlain(){
  console.log(`FretPilot Studio & School INTERNAL TEST v${data.versionName}\nFeatures: ${data.features.join('; ')}\nKnown Issues: ${data.knownIssues.map(k=>`${k.id}:${k.area}`).join(', ')}\nPermissions: ${data.permissions.map(p=>p.name).join(', ')}\nShort: ${data.shortBlurb}\nSubmit Steps: ${data.submissionSteps.join(' | ')}`);
}

function emitAll(){
  emitMarkdown();
  hr();
  console.log('\nRAW JSON:\n');
  emitJSON();
  hr();
  console.log('\nPLAIN TEXT:\n');
  emitPlain();
}

const mode = (process.argv[2]||'all').toLowerCase();
if(mode==='md') emitMarkdown();
else if(mode==='json') emitJSON();
else if(mode==='text') emitPlain();
else emitAll();
