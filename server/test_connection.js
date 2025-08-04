// test_connection.js

console.log("--- Starting Standalone Gemini Connection Test ---");

// This test will prove if the connection to Google's API is hanging.

async function runTest() {
    const { GoogleGenAI } = require('@google/genai');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ FAILED: The GEMINI_API_KEY environment variable was not found.");
        return;
    }
    console.log("✅ API Key found.");

    const genAI = new GoogleGenAI({ apiKey: apiKey });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Please say 'Hello, world.'";

    console.log("\nAttempting to send a request to the Gemini API...");
    console.log("The script will wait for a response. If it hangs, there is a network issue.");

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("\n✅✅✅ SUCCESS! ✅✅✅");
        console.log("Received response from Gemini:", text);
    } catch (error) {
        console.error("\n❌ FAILED: The API call returned an error:", error);
    }
}


// --- Timeout Logic ---
const testPromise = runTest();
const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
        reject(new Error("❌ FAILED: The API call timed out after 20 seconds. This confirms a network or firewall issue."));
    }, 20000); // 20 seconds
});

// Race the test against the timeout
Promise.race([testPromise, timeoutPromise])
    .catch(err => {
        console.error(err.message);
        process.exit(1); // Exit with an error code
    });