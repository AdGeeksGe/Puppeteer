const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const { analyzeWebsite } = require('./gemini.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/run-puppeteer', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scroll to the bottom of the page to ensure all content is loaded
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    // Scroll back to the top of the page
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    // Wait for a short time to ensure all content is fully loaded
    await new Promise(resolve => setTimeout(resolve, 500));

    const pageTitle = await page.title();
    const screenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
    await browser.close();

    //AI analysis
    const analysis = await analyzeWebsite(screenshot, url);

    res.json({ title: pageTitle, screenshot: screenshot, analysis: analysis});
    console.log(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to run Puppeteer script' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});