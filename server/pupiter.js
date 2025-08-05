import puppeteer from "puppeteer";

async function pupiter(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2" });

    // Scroll to the bottom of the page to ensure all content is loaded
    await page.evaluate(async () => {
      await new Promise((resolve) => {
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pageTitle = await page.title();
    const screenshot = await page.screenshot({
      encoding: "base64",
      fullPage: true,
    });
    await browser.close();

    return { pageTitle, screenshot };
  } catch (error) {
    console.error(error);
  }
}
export default pupiter;
