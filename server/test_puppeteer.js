// test_puppeteer.js

console.log("Attempting to require the 'puppeteer' library...");
console.log("If the script quits after this line, Puppeteer is the issue.");

try {
    const puppeteer = require('puppeteer');
    console.log("✅ SUCCESS: The Puppeteer library was loaded correctly.");
    console.log("   - Puppeteer version:", puppeteer.version);
    console.log("\nThis test proves the problem is not with Puppeteer itself, but how it's used with Express or Gemini.");
} catch (e) {
    console.error("❌ FAILED to require Puppeteer. The error is:");
    console.error(e);
}