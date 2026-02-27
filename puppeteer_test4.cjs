
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Attach all logs
  page.on('console', msg => console.log('LOG:', msg.text()));
  
  // Expose Axios interceptor success/failure messages
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('unhandledrejection', e => console.log('UNHANDLED:', e.reason));
    window.addEventListener('error', e => console.log('ERROR:', e.message));
  });

  await page.goto('http://localhost:5173/marketplace', { waitUntil: 'networkidle0' });
  await browser.close();
})();
