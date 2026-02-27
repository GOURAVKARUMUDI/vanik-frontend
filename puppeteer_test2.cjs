
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Expose function to log network requests
  page.on('response', async res => {
    if (res.url().includes('api/products')) {
      console.log('API RESPONSE STATUS:', res.status());
      try {
        console.log('API RESPONSE DATA:', await res.json());
      } catch (e) {
        console.log('API RESPONSE DATA TEXT:', await res.text());
      }
    }
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:5173/marketplace', { waitUntil: 'networkidle0' });
  await browser.close();
})();
