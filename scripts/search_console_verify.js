#!/usr/bin/env node
/**
 * Google Search Console Verification Helper
 * Modes:
 *  - meta: Inject or update <meta name="google-site-verification" ...> in an HTML file (default: index.html)
 *    Usage: node scripts/search_console_verify.js meta --code=YOUR_CODE --file=index.html
 *
 *  - file: Create HTML verification file under /public so it's served at the site root.
 *    Usage: node scripts/search_console_verify.js file --filename=googleXXXX.html --code=YOUR_CODE
 *    (Writes: public/googleXXXX.html with content: "google-site-verification: YOUR_CODE")
 *
 *  - dns: Print DNS TXT record instructions for Domain property verification.
 *    Usage: node scripts/search_console_verify.js dns --domain=fretpilotstudio.com
 *
 * Notes:
 *  - For Vite/Vercel, files in /public are copied to the deploy root.
 *  - After meta/file changes, commit and trigger a redeploy, then click Verify in Search Console.
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const mode = (args[0] || 'help').toLowerCase();

function getArg(name, defVal = null) {
  const key = `--${name}=`;
  const hit = args.find(a => a.startsWith(key));
  return hit ? hit.substring(key.length) : defVal;
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function insertOrUpdateMeta(htmlPath, code) {
  const abs = path.resolve(htmlPath);
  if (!fs.existsSync(abs)) {
    console.error(`ERROR: HTML file not found: ${abs}`);
    process.exit(1);
  }
  let html = fs.readFileSync(abs, 'utf8');
  const metaRegex = /<meta\s+name=["']google-site-verification["']\s+content=["'][^"']*["']\s*\/?>(?![^<]*<meta)/i;
  const closingHeadRegex = /<\/head>/i;

  const newTag = `<meta name="google-site-verification" content="${code}" />`;

  if (metaRegex.test(html)) {
    html = html.replace(/<meta\s+name=["']google-site-verification["']\s+content=["'][^"']*["']\s*\/?>(?![^<]*<meta)/i, newTag);
    fs.writeFileSync(abs, html, 'utf8');
    console.log(`Updated existing google-site-verification meta tag in: ${abs}`);
  } else if (closingHeadRegex.test(html)) {
    html = html.replace(closingHeadRegex, `  ${newTag}\n</head>`);
    fs.writeFileSync(abs, html, 'utf8');
    console.log(`Inserted google-site-verification meta tag before </head> in: ${abs}`);
  } else {
    console.error('ERROR: Could not find </head> to insert meta tag. Please place it manually.');
    process.exit(1);
  }
}

function createVerificationFile(filename, code) {
  if (!filename || !/^[a-zA-Z0-9._-]+$/.test(filename)) {
    console.error('ERROR: Invalid --filename. Provide something like googleXXXXXXXXXXXX.html');
    process.exit(1);
  }
  const publicDir = path.resolve('public');
  ensureDirSync(publicDir);
  const abs = path.join(publicDir, filename);
  const content = `google-site-verification: ${code}`;
  fs.writeFileSync(abs, content, 'utf8');
  console.log(`Wrote verification file: ${abs}`);
  console.log('After deploy, verify that it is accessible at: https://<your-domain>/' + filename);
}

function printDnsInstructions(domain) {
  if (!domain) {
    console.error('Usage: dns mode requires --domain=example.com');
    process.exit(1);
  }
  console.log('\nDNS TXT Verification (Recommended)\n');
  console.log(`1) In Google Search Console, add a Domain property for ${domain}.`);
  console.log('2) Copy the TXT record value shown (looks like google-site-verification=XXXXXXXX).');
  console.log('3) In your DNS provider (Vercel Domains UI if using Vercel):');
  console.log('   - Type: TXT');
  console.log('   - Name/Host: @');
  console.log('   - Value: google-site-verification=YOUR_CODE');
  console.log('4) Save. Wait a few minutes for DNS to propagate.');
  console.log('5) Click Verify in Search Console.');
  console.log('\nVercel domain settings (replace with your domain page):');
  console.log(`https://vercel.com/dashboard/domains/${domain}`);
}

function help() {
  console.log('\nGoogle Search Console Verification Helper\n');
  console.log('Meta tag method:');
  console.log('  node scripts/search_console_verify.js meta --code=YOUR_CODE --file=index.html');
  console.log('\nHTML file method:');
  console.log('  node scripts/search_console_verify.js file --filename=googleXXXX.html --code=YOUR_CODE');
  console.log('\nDNS TXT method (instructions only):');
  console.log('  node scripts/search_console_verify.js dns --domain=fretpilotstudio.com');
}

if (mode === 'meta') {
  const code = getArg('code');
  const file = getArg('file', 'index.html');
  if (!code) {
    console.error('ERROR: --code is required for meta mode');
    process.exit(1);
  }
  insertOrUpdateMeta(file, code);
  console.log('Commit & redeploy. Then click Verify in Search Console.');
} else if (mode === 'file') {
  const code = getArg('code');
  const filename = getArg('filename');
  if (!code || !filename) {
    console.error('ERROR: --filename and --code are required for file mode');
    process.exit(1);
  }
  createVerificationFile(filename, code);
  console.log('Commit & redeploy. Then click Verify in Search Console.');
} else if (mode === 'dns') {
  const domain = getArg('domain');
  printDnsInstructions(domain);
} else {
  help();
}
