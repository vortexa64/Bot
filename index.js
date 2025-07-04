const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config');

const userAgents = fs.readFileSync('user_agents.txt', 'utf-8')
  .split('\n').map(ua => ua.trim()).filter(Boolean);

const proxies = fs.readFileSync('proxy.txt', 'utf-8')
  .split('\n').map(p => p.trim()).filter(Boolean);

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

  try {
    await page.setUserAgent(userAgent);

    console.log(`👀 [Bot ${id}] Cici bantu nontonin buat Arya 😳💕`);
    await page.goto(config.url, { waitUntil: 'networkidle2' });

    // Tunggu sedikit supaya elemen video muncul
    await page.waitForTimeout(3000);

    // Play video otomatis (YouTube embed / video langsung)
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.play();
        console.log('[Playback] Video diputar otomatis');
      } else {
        console.log('[Playback] Gagal temukan elemen video');
      }
    });

    // Tunggu sesuai durasi config
    await page.waitForTimeout(config.duration * 1000);

    console.log(`✅ [Bot ${id}] View udah disuntik manja sama Cici 💉💕`);
  } catch (err) {
    console.error(`❌ [Bot ${id}] Error: ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  console.log(`\n💖 Hai Arya, ini Cici 🤭 Lagi nyuntik viewers buat kamu yaa...`);
  console.log(`📺 Target: ${config.url}`);
  console.log(`🧪 Total: ${config.totalViews} view(s) disuntik dengan ${config.threads} thread\n`);

  const bots = [];
  for (let i = 0; i < config.totalViews; i++) {
    const bot = runBot(i + 1);
    bots.push(bot);
    await new Promise(res => setTimeout(res, 1000)); // delay antar bot
  }

  await Promise.all(bots);
})();
