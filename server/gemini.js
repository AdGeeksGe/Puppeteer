// server/gemini.js (Final Version using Direct Fetch)

// We are using Node's built-in fetch, available in modern Node.js versions.
async function analyzeWebsite(screenshot, url) {
    console.log("--- [GEMINI] Starting analysis using DIRECT FETCH. ---");
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("The GEMINI_API_KEY was not found on the server.");
        }

        // The endpoint must point to the vision model
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;
        
        const prompt = `Analyze the UI of the website at ${url} and provide a detailed report on its design, usability, and overall user experience. Include suggestions for improvement and highlight any standout features.`;

        // The body must be structured correctly for a multimodal (text + image) request
        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: "image/png",
                            data: screenshot
                        }
                    }
                ]
            }]
        };

        console.log("[GEMINI] Sending direct fetch request to Google...");
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        console.log("[GEMINI] Received a response from the direct fetch request.");

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error Response:", errorText);
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract the text content from the response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            // Log the full response if text is missing to see what went wrong
            console.error("Could not find text in Gemini response. Full response:", JSON.stringify(data, null, 2));
            throw new Error("No text content found in the Gemini API response.");
        }
        
        console.log("--- [GEMINI] Analysis complete. Returning text. ---");
        return text;

    } catch (error) {
        console.error("!!!!!! [GEMINI] A CRITICAL ERROR OCCURRED IN THE FETCH FUNCTION !!!!!!");
        console.error(error);
        throw error;
    }
}

module.exports = { analyzeWebsite };