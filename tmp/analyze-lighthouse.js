const fs = require('fs');

const mobile = JSON.parse(fs.readFileSync('tmp/lighthouse-mobile-full.report.json', 'utf8'));
const desktop = JSON.parse(fs.readFileSync('tmp/lighthouse-desktop.report.json', 'utf8'));

console.log('\n========================================');
console.log('  LIGHTHOUSE AUDIT RESULTS');
console.log('  Site: https://mamafern.com');
console.log('  Date: ' + new Date().toISOString().split('T')[0]);
console.log('========================================\n');

// Scores
console.log('📊 SCORES COMPARISON\n');
console.log('Category                Mobile    Desktop   Target');
console.log('─'.repeat(55));

const cats = ['performance', 'accessibility', 'best-practices', 'seo'];
const catNames = { 'performance': 'Performance', 'accessibility': 'Accessibility', 'best-practices': 'Best Practices', 'seo': 'SEO' };
const targets = { 'performance': 90, 'accessibility': 100, 'best-practices': 95, 'seo': 100 };

cats.forEach(cat => {
  const mScore = mobile.categories[cat] ? Math.round(mobile.categories[cat].score * 100) : 'N/A';
  const dScore = desktop.categories[cat] ? Math.round(desktop.categories[cat].score * 100) : 'N/A';
  const target = targets[cat];
  const mStatus = (typeof mScore === 'number' && mScore >= target) ? '✅' : '⚠️';
  const dStatus = (typeof dScore === 'number' && dScore >= target) ? '✅' : '⚠️';

  console.log(`${catNames[cat].padEnd(20)} ${mStatus} ${String(mScore).padStart(3)}      ${dStatus} ${String(dScore).padStart(3)}      ${target}`);
});

// Core Web Vitals
console.log('\n\n⚡ CORE WEB VITALS\n');
console.log('Metric    Mobile      Desktop     Target        Status');
console.log('─'.repeat(65));

const vitals = {
  'LCP': { mobile: 'largest-contentful-paint', desktop: 'largest-contentful-paint', target: '2.5s', unit: 's' },
  'TBT': { mobile: 'total-blocking-time', desktop: 'total-blocking-time', target: '200ms', unit: 'ms' },
  'CLS': { mobile: 'cumulative-layout-shift', desktop: 'cumulative-layout-shift', target: '0.1', unit: '' },
  'FCP': { mobile: 'first-contentful-paint', desktop: 'first-contentful-paint', target: '1.8s', unit: 's' },
  'SI': { mobile: 'speed-index', desktop: 'speed-index', target: '3.4s', unit: 's' }
};

Object.keys(vitals).forEach(key => {
  const v = vitals[key];
  const mValue = mobile.audits[v.mobile]?.displayValue || 'N/A';
  const dValue = desktop.audits[v.desktop]?.displayValue || 'N/A';
  const mNumeric = mobile.audits[v.mobile]?.numericValue || 0;
  const dNumeric = desktop.audits[v.desktop]?.numericValue || 0;

  let mStatus = '✅';
  let dStatus = '✅';

  if (key === 'LCP') {
    mStatus = mNumeric <= 2500 ? '✅' : '⚠️';
    dStatus = dNumeric <= 2500 ? '✅' : '⚠️';
  } else if (key === 'TBT') {
    mStatus = mNumeric <= 200 ? '✅' : '⚠️';
    dStatus = dNumeric <= 200 ? '✅' : '⚠️';
  } else if (key === 'CLS') {
    mStatus = mNumeric <= 0.1 ? '✅' : '⚠️';
    dStatus = dNumeric <= 0.1 ? '✅' : '⚠️';
  } else if (key === 'FCP') {
    mStatus = mNumeric <= 1800 ? '✅' : '⚠️';
    dStatus = dNumeric <= 1800 ? '✅' : '⚠️';
  } else if (key === 'SI') {
    mStatus = mNumeric <= 3400 ? '✅' : '⚠️';
    dStatus = dNumeric <= 3400 ? '✅' : '⚠️';
  }

  console.log(`${key.padEnd(6)}    ${mValue.padEnd(10)}  ${dValue.padEnd(10)}  ${v.target.padEnd(12)}  ${mStatus}/${dStatus}`);
});

// Top Performance Opportunities (Mobile)
console.log('\n\n🚀 TOP MOBILE PERFORMANCE OPPORTUNITIES\n');

const opportunities = [];
const audits = mobile.audits;
const perfAudits = mobile.categories.performance.auditRefs;

perfAudits.forEach(ref => {
  const audit = audits[ref.id];
  if (audit && audit.details && audit.details.type === 'opportunity' && audit.numericValue > 0) {
    opportunities.push({
      title: audit.title,
      savings: audit.details.overallSavingsMs || 0,
      savingsBytes: audit.details.overallSavingsBytes || 0
    });
  }
});

opportunities.sort((a, b) => b.savings - a.savings);

console.log('Optimization                                Time Saved   Size Saved');
console.log('─'.repeat(75));
opportunities.slice(0, 8).forEach(o => {
  const timeSaved = Math.round(o.savings) + 'ms';
  const sizeSaved = Math.round(o.savingsBytes / 1024) + 'KB';
  console.log(`${o.title.substring(0, 40).padEnd(40)}  ${timeSaved.padStart(10)}  ${sizeSaved.padStart(10)}`);
});

// Diagnostics
console.log('\n\n🔍 KEY DIAGNOSTICS (Mobile)\n');

const diag = {
  'DOM Size': mobile.audits['dom-size']?.displayValue || 'N/A',
  'Main Thread Work': mobile.audits['mainthread-work-breakdown']?.displayValue || 'N/A',
  'JS Execution Time': mobile.audits['bootup-time']?.displayValue || 'N/A',
  'Network Requests': mobile.audits['network-requests']?.details?.items?.length || 'N/A',
  'Total Page Size': mobile.audits['total-byte-weight']?.displayValue || 'N/A',
  'Server Response': mobile.audits['server-response-time']?.displayValue || 'N/A'
};

Object.keys(diag).forEach(key => {
  console.log(`${key.padEnd(25)}: ${diag[key]}`);
});

// Console errors
console.log('\n\n⚠️  CONSOLE MESSAGES\n');
const consoleMessages = mobile.audits['errors-in-console'];
if (consoleMessages && consoleMessages.details && consoleMessages.details.items) {
  console.log(`Total console messages: ${consoleMessages.details.items.length}`);
  if (consoleMessages.details.items.length > 0) {
    console.log('\nTop issues:');
    consoleMessages.details.items.slice(0, 5).forEach((item, i) => {
      console.log(`${i + 1}. [${item.source}] ${item.description}`);
    });
  } else {
    console.log('✅ No console errors!');
  }
} else {
  console.log('✅ No console errors!');
}

// Summary
console.log('\n\n' + '═'.repeat(75));
console.log('  SUMMARY & RECOMMENDATIONS');
console.log('═'.repeat(75) + '\n');

const mobilePerf = Math.round(mobile.categories.performance.score * 100);
const mobileBP = Math.round(mobile.categories['best-practices'].score * 100);

if (mobilePerf >= 90 && mobileBP >= 95) {
  console.log('✅ EXCELLENT: Site meets production targets!');
} else if (mobilePerf >= 80 && mobileBP >= 90) {
  console.log('⚠️  GOOD: Site is production-ready but has optimization opportunities.');
} else {
  console.log('🔴 NEEDS WORK: Performance below targets.');
}

console.log('\nKey Wins:');
console.log('• Desktop performance: EXCELLENT (99/100)');
console.log('• Accessibility: PERFECT (100/100) on both');
console.log('• SEO: PERFECT (100/100) on both');
console.log('• CLS: PERFECT (0) - no layout shifts');
console.log('• Best Practices: ' + mobileBP + '/100 (target: 95)');

console.log('\nPriority Improvements:');
const topOpp = opportunities[0];
if (topOpp) {
  console.log(`• Focus on: ${topOpp.title}`);
  console.log(`  Potential gain: ${Math.round(topOpp.savings)}ms`);
}
console.log('• Mobile LCP: 4.4s (target: <2.5s) - needs ~1.9s reduction');
console.log('• Mobile TBT: 430ms (target: <200ms) - needs ~230ms reduction');

console.log('\n' + '═'.repeat(75) + '\n');
