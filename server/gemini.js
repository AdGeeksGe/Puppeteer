// index.mjs
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";

export async function main(screenshotBase64, url, pageTitle) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const tools = [{ googleSearch: {} }];
  const config = { thinkingConfig: { thinkingBudget: -1 }, tools };
  const model = "gemini-2.5-pro";

  let prompt = await fs.readFile(path.resolve("./prompt.txt"), "utf8");
  prompt = prompt
    .replace("{{WEBSITE_URL}}", url)
    .replace("{{PAGE_TITLE}}", pageTitle ?? "");

  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
      images: [
        {
          inlineData: { data: screenshotBase64, mimeType: "image/png" },
        },
      ],
    },
  ];

  const stream = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = "";
  for await (const chunk of stream) {
    fullResponse += chunk.text;
  }
  return { fullResponse };
}
