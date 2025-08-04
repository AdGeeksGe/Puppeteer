// server/server.js (Alternative: Using server-friendly Puppeteer args)

const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const { analyzeWebsite } = require('./gemini.js');

const app = express();
const port = 3001;
let browserInstance;

app.use(cors());
app.use(express.json());

app.post('/api/run-puppeteer', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let page;
    try {
        page = await browserInstance.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const pageTitle = await page.title();
        const screenshot = await page.screenshot({ encoding: 'base64', fullPage: true });

        const analysis = await analyzeWebsite(screenshot, url);
        res.json({ title: pageTitle, screenshot: screenshot, analysis: analysis });

    } catch (error) {
        console.error("An error occurred in the /api/run-puppeteer route:", error);
        res.status(500).json({ error: 'Failed to process the request. See server logs.' });
    } finally {
        if (page) await page.close();
    }
});

async function startServer() {
    try {
        console.log("[SERVER] Launching persistent browser with server-friendly arguments...");

        // THE CHANGE IS HERE: Added 'args' for stability in server environments.
        browserInstance = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', // This is for testing only, do not use in production
                '--disable-gpu'
            ]
        });

        app.listen(port, () => {
            console.log(`[SERVER] Ready and listening on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("!!!!!! [SERVER] FAILED TO LAUNCH BROWSER !!!!!!", error);
        process.exit(1);
    }
}

startServer();