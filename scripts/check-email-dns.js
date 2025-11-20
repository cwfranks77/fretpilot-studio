#!/usr/bin/env node
/**
 * Email DNS verification script
 * Usage: node scripts/check-email-dns.js fretpilotstudio.com
 */
const dns = require('dns').promises;
const chalk = require('chalk');

async function main() {
  const domain = process.argv[2];
  if (!domain) {
    console.error('Usage: node scripts/check-email-dns.js <domain>');
    process.exit(1);
  }

  console.log(chalk.cyan(`\nChecking email DNS records for ${domain}\n`));

  // MX Records
  try {
    const mx = await dns.resolveMx(domain);
    console.log(chalk.bold('MX Records:'));
    mx.sort((a,b)=>a.priority-b.priority).forEach(r => {
      const ok = /improvmx\.com$/i.test(r.exchange);
      console.log(`${ok?chalk.green('✓'):chalk.red('✗')} ${r.exchange} (priority ${r.priority})`);
    });
  } catch (e) {
    console.log(chalk.red('Failed to resolve MX:'), e.message);
  }

  // SPF TXT
  try {
    const txt = await dns.resolveTxt(domain);
    const flat = txt.map(arr => arr.join('')).filter(v => v.startsWith('v=spf1'));
    console.log('\n' + chalk.bold('SPF Record:'));
    if (flat.length) {
      const record = flat[0];
      const improvmx = /include:spf\.improvmx\.com/.test(record);
      const sendgrid = /include:sendgrid\.net/.test(record);
      console.log(`${chalk.green('✓')} ${record}`);
      console.log(`  ${improvmx?chalk.green('✓'):chalk.red('✗')} include:spf.improvmx.com`);
      console.log(`  ${sendgrid?chalk.green('✓'):chalk.red('✗')} include:sendgrid.net`);
    } else {
      console.log(chalk.red('✗ No SPF record found'));
    }
  } catch (e) {
    console.log(chalk.red('Failed to resolve SPF TXT:'), e.message);
  }

  // DMARC
  try {
    const dmarc = await dns.resolveTxt(`_dmarc.${domain}`);
    const flat = dmarc.map(arr => arr.join('')).filter(v => v.startsWith('v=DMARC1'));
    console.log('\n' + chalk.bold('DMARC Record:'));
    if (flat.length) {
      const rec = flat[0];
      console.log(`${chalk.green('✓')} ${rec}`);
    } else {
      console.log(chalk.red('✗ No DMARC record found'));
    }
  } catch (e) {
    console.log(chalk.red('Failed to resolve DMARC TXT:'), e.message);
  }

  // DKIM (SendGrid)
  const dkimHosts = [
    's1._domainkey',
    's2._domainkey'
  ];
  console.log('\n' + chalk.bold('DKIM (SendGrid) CNAME Records:'));
  for (const host of dkimHosts) {
    try {
      const cname = await dns.resolveCname(`${host}.${domain}`);
      const target = cname[0];
      const ok = /sendgrid\.net$/i.test(target);
      console.log(`${ok?chalk.green('✓'):chalk.red('✗')} ${host}.${domain} -> ${target}`);
    } catch (e) {
      console.log(chalk.red(`✗ ${host}.${domain} not found (${e.message})`));
    }
  }

  console.log('\n' + chalk.yellow('If any items are marked ✗, wait for propagation (up to 60 minutes) or re-check DNS entries.'));
}

main().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
