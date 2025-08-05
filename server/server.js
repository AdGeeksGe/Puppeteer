import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import pupiter from "./pupiter.js";
import { main } from "./gemini.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/run-puppeteer", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const { pageTitle, screenshot } = await pupiter(url);

  // And here you call main() with that screenshot:
  const aiOutput = await main(screenshot, url, pageTitle);
  console.log(aiOutput);

  // Format the response to match what the client expects
  res.json({
    url,
    title: pageTitle,
    screenshot,
    analysis: aiOutput.fullResponse,
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
