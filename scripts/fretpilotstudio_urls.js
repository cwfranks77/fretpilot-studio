#!/usr/bin/env node
/**
 * FretPilotStudio URL Helper Script
 * Prints canonical URLs and optionally copies them to the clipboard on Windows.
 * Usage:
 *   node scripts/fretpilotstudio_urls.js          # print list
 *   node scripts/fretpilotstudio_urls.js --copy   # copy list to clipboard (Windows: uses powershell Set-Clipboard)
 *   node scripts/fretpilotstudio_urls.js --json   # output JSON array
 */

const urls = {
  home: 'https://fretpilotstudio.com/',
  store: 'https://thefranksstandard.com/',
  privacy: 'https://fretpilotstudio.com/privacy',
  terms: 'https://fretpilotstudio.com/terms',
  supportEmail: 'mailto:support@fretpilotstudio.com',
  feedbackForm: 'https://fretpilotstudio.com/feedback', // placeholder
  releaseNotes: 'https://fretpilotstudio.com/release-notes', // placeholder if you host them
};

function print(){
  console.log('FretPilot Studio Canonical URLs:\n');
  Object.entries(urls).forEach(([k,v])=>console.log(`${k}: ${v}`));
}

function toJSON(){
  console.log(JSON.stringify(urls, null, 2));
}

async function copy(){
  const list = Object.values(urls).join('\n');
  const { spawn } = require('child_process');
  // Windows PowerShell clipboard
  const ps = spawn('powershell', ['-NoLogo','-NoProfile','-Command', `Set-Clipboard -Value @'${list}'@`]);
  ps.on('exit', code => {
    if(code===0){
      console.log('Copied URLs to clipboard.');
    } else {
      console.error('Failed to copy (exit code ' + code + ').');
    }
  });
}

const args = process.argv.slice(2);
if(args.includes('--json')) {
  toJSON();
} else {
  print();
  if(args.includes('--copy')) {
    copy();
  }
}
