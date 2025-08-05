const GoogleGenAI = require('@google/genai').GoogleGenAI;
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

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

    // Call Gemini AI to analyze the screenshot
    const ai = new GoogleGenAI({
      apiKey: "AIzaSyCsf9NLYLk_QCOLM4mMkWaAZsy-xJei_pY",
    });
    const tools = [
      {
        googleSearch: {
        }
      },
    ];
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };
    const model = 'gemini-2.5-pro';
    const imagePart = {
      inlineData: {
          data: screenshot,
          mimeType: 'image/png',
      },
    };
    const prompt = fs
      .readFileSync("prompt.txt", "utf8")
      .replace("{{WEBSITE_URL}}", url);
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
          images: [screenshot],
        },
      ];
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let fileIndex = 0;
    const analysis = '';
    for await (const chunk of response) {
      console.log(chunk.text);
      analysis += chunk.text;
    }

    res.json({ title: pageTitle, screenshot: screenshot, analysis: analysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to run Puppeteer script' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});