import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      logs.push('BROWSER ERROR: ' + msg.text());
    }
  });

  page.on('pageerror', error => {
    logs.push('PAGE ERROR: ' + error.message);
  });

  try {
    await page.goto('http://127.0.0.1:5174/wardrobe', { waitUntil: 'networkidle0' });
    logs.push('Page loaded successfully');
  } catch (err) {
    logs.push('Navigation error: ' + err.message);
  } finally {
    fs.writeFileSync('clean_log.txt', logs.join('\n'));
    await browser.close();
  }
})();
