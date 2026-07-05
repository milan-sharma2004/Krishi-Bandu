import { chromium } from 'playwright';

const base = 'http://localhost:5174';
const shot = (name) => `/private/tmp/claude-501/-Users-aadi-Documents-agri-tech/4a47b94d-c769-4712-908c-6f0085b64960/scratchpad/${name}.png`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=email]', 'ravi@krishibandu.com');
await page.fill('input[type=password]', 'password123');
await page.click('button[type=submit]');
await page.waitForTimeout(1000);
await page.screenshot({ path: shot('farmer-dashboard-v2') });

await page.evaluate(() => localStorage.clear());
await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
await page.fill('input[type=email]', 'sita@krishibandu.com');
await page.fill('input[type=password]', 'password123');
await page.click('button[type=submit]');
await page.waitForTimeout(1000);
await page.goto(`${base}/buyer/browse`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: shot('buyer-browse-v2') });

await browser.close();
