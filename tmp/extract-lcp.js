const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tmp/lighthouse-mobile-full.report.json', 'utf8'));

console.log('=== LCP ELEMENT IDENTIFICATION ===\n');

// LCP Element
const lcpElement = data.audits['largest-contentful-paint-element'];
if (lcpElement && lcpElement.details && lcpElement.details.items) {
  console.log('LCP ELEMENT:');
  lcpElement.details.items.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.node?.nodeLabel || 'Unknown'}`);
    console.log('   HTML:', item.node?.snippet || 'N/A');
  });
}

// LCP phases breakdown
console.log('\n\n=== LCP TIMING BREAKDOWN ===\n');
const lcpBreakdown = data.audits['lcp-breakdown'];
if (lcpBreakdown && lcpBreakdown.details && lcpBreakdown.details.items) {
  lcpBreakdown.details.items.forEach(item => {
    console.log(`${item.phase}: ${item.timing}ms`);
  });
}

// Font loading
console.log('\n\n=== FONT LOADING ===\n');
const fontDisplay = data.audits['font-display'];
console.log('Status:', fontDisplay?.score === 1 ? 'PASS' : 'NEEDS WORK');
if (fontDisplay?.details?.items) {
  fontDisplay.details.items.forEach(item => {
    console.log(`  ${item.url}`);
  });
}

// Preload key requests
console.log('\n\n=== PRELOAD OPPORTUNITIES ===\n');
const preload = data.audits['uses-rel-preload'];
if (preload?.details?.items && preload.details.items.length > 0) {
  preload.details.items.forEach(item => {
    console.log(`  ${item.url}`);
    console.log(`  Savings: ${Math.round(item.wastedMs)}ms`);
  });
} else {
  console.log('  No major preload opportunities identified');
}

// Network analysis
console.log('\n\n=== CRITICAL NETWORK REQUESTS ===\n');
const networkRequests = data.audits['network-requests'];
if (networkRequests?.details?.items) {
  const critical = networkRequests.details.items
    .filter(r => r.priority === 'High' || r.priority === 'VeryHigh')
    .slice(0, 10);

  critical.forEach(req => {
    console.log(`\n${req.url.substring(0, 80)}`);
    console.log(`  Priority: ${req.priority}`);
    console.log(`  Size: ${Math.round(req.transferSize / 1024)}KB`);
    console.log(`  Time: ${Math.round(req.endTime - req.startTime)}ms`);
  });
}

// Server response time
console.log('\n\n=== SERVER RESPONSE ===\n');
const ttfb = data.audits['server-response-time'];
console.log(`TTFB: ${ttfb?.displayValue || 'N/A'}`);
if (ttfb?.details?.items) {
  ttfb.details.items.forEach(item => {
    console.log(`  ${item.url}: ${Math.round(item.responseTime)}ms`);
  });
}
