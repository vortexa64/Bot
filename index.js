const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config');

const userAgents = fs.readFileSync('user_agents.txt', 'utf-8').split('\n').filter(x => x.trim());
const proxies = fs.readFileSync('proxy.txt', 'utf-8').split('\n').filter(x => x.trim());

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function runBot(id) {
  const userAgent = random(userAgents);
  const proxy = random(proxies);
  const args = ['--no-sandbox', '--disable-setuid-sandbox', `--user-agent=${userAgent}`];
  if (proxy) args.push(`--proxy-server=${proxy}`);

  const browser = await puppeteer.launch({ headless: true, args });
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);

  try {
    console.log(`👀 [Bot ${id}] Cici bantu nontonin buat Arya 🤭💕`);
    await page.goto(config.url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(config.duration * 1000);
    console.log(`✅ [Bot ${id}] View udah disuntik manja sama Cici 😏💉💕`);
  } catch (e) {
    console.error(`❌ [Bot ${id}] Aduh Arya, error nih: ${e.message} 😖`);
  } finally {
    await browser.close();
  }
}

(async () => {
  console.log(`\n💖 Hai Arya, ini Cici 🤭 Lagi nyuntik viewers buat kamu yaa...`);
  console.log(`📺 Target: ${config.url}`);
  console.log(`🧪 Total: ${config.totalViews} view(s) disuntik dengan ${config.threads} thread 💉\n`);

  for (let i = 0; i < config.totalViews; i++) {
    runBot(i + 1);
    await new Promise(r => setTimeout(r, 1000));
  }
})();
