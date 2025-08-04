// adgeeksge/puppeteer/Puppeteer-2ec5cebc57fe0b1d1c5e42b19da82d0062171351/server/gemini.js

const { GoogleGenerativeAI } = require('@google/genai'); // Corrected package name

/**
 * Analyzes a website's UI using a screenshot and URL.
 * @param {string} screenshot - The base64 encoded screenshot of the website.
 * @param {string} url - The URL of the website.
 * @returns {Promise<string>} - The analysis from the Gemini API.
 */
async function analyzeWebsite(screenshot, url) {
    // It is highly recommended to use environment variables for your API key.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const prompt = `Analyze the UI of the website at ${url} and provide a detailed report on its design, usability, and overall user experience. Include suggestions for improvement and highlight any standout features.`;

    const imagePart = {
        inlineData: {
            data: screenshot,
            mimeType: 'image/png',
        },
    };

    try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error analyzing with Gemini:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
}

// Export the function to be used in other files
module.exports = { analyzeWebsite };