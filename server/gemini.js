const GoogleGenAI = require('@google/genai').GoogleGenAI;
const fs = require('fs');
const path = require('path');

async function main(screenshoot, url) {
  // const screenshot = fs.readFileSync("./screenshoot.png", {encoding: "base64",});
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
  const website = url;
  const prompt = fs
        .readFileSync("prompt.txt", "utf8")
        .replace("{{WEBSITE_URL}}", website);
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
      images: [imagePart],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();