const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/fetch-rating', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL query parameter is required' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: process.env.CHROME_BIN || null
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        const html = await page.content();
        await browser.close();

        const rating = extractRatingFromHtml(html);
        if (rating) {
            res.json({ rating });
        } else {
            res.status(404).json({ error: 'Rating data not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function extractRatingFromHtml(html) {
    const $ = cheerio.load(html);
    let ratingText = '';

    $('body').find('*').each((index, element) => {
        const text = $(element).text().trim();
        const match = text.match(/^\d+\.\d+\s*rating$/i); // Match decimal number followed by "rating" at the beginning of the line
        if (match) {
            ratingText = match[0].replace(' rating', ''); // Extract the number preceding "rating"
            return false; // Exit the loop once the rating is found
        }
    });

    return ratingText;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
