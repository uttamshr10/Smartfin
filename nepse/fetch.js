const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const { MongoClient } = require("mongodb");
require("dotenv").config();

async function fetchAndStoreStockData() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    let browser;

    try {
        await client.connect();
        const db = client.db("Smartfin_db");
        const stockCollection = db.collection("stocks");

        const maxRetries = 3;
        let attempt = 1;
        while (attempt <= maxRetries) {
            try {
                browser = await puppeteer.launch({
                    headless: true,
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                });
                const page = await browser.newPage();
                await page.setUserAgent(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
                );

                await page.goto("https://www.sharesansar.com/today-share-price", {
                    waitUntil: "networkidle2",
                    timeout: 60000,
                });

                await page.waitForSelector("table.table-bordered.table-striped", {
                    timeout: 15000,
                });

                const stocks = await page.evaluate(() => {
                    const rows = Array.from(
                        document.querySelectorAll("table.table-bordered.table-striped tbody tr")
                    );
                    return rows
                        .map((row) => {
                            const cells = row.querySelectorAll("td");
                            return {
                                symbol: cells[1]?.innerText.trim(),
                                open_price: parseFloat(cells[3]?.innerText.replace(",", "")) || null,
                                high_price: parseFloat(cells[4]?.innerText.replace(",", "")) || null,
                                low_price: parseFloat(cells[5]?.innerText.replace(",", "")) || null,
                                close_price: parseFloat(cells[6]?.innerText.replace(",", "")) || null,
                                ltp: parseFloat(cells[7]?.innerText.replace(",", "")) || null,
                                volume: parseInt(cells[11]?.innerText.replace(",", "")) || null,
                                turnover: parseFloat(cells[13]?.innerText.replace(",", "").replace("Rs.", "")) || null,
                            };
                        })
                        .filter((stock) => stock.symbol);
                });

                for (const stock of stocks) {
                    await stockCollection.updateOne(
                        { symbol: stock.symbol },
                        { $set: { ...stock, fetched_at: new Date() } },
                        { upsert: true }
                    );
                    console.log(`Stored data for ${stock.symbol}`);
                }

                console.log("Data scraping and storage complete");
                break;
            } catch (error) {
                console.error(`Attempt ${attempt} failed: ${error.message}`);
                if (attempt === maxRetries) throw error;
                attempt++;
                if (browser) await browser.close();
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    } catch (error) {
        console.error(`Error: ${error.stack}`);
    } finally {
        if (browser) await browser.close();
        await client.close();
    }
}

fetchAndStoreStockData();