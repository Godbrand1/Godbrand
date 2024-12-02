const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/fetch-rank', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL query parameter is required' });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const html = await response.text();
        const rank = extractRankFromHtml(html); // Implement this function based on the HTML structure

        if (rank) {
            res.json({ rank });
        } else {
            res.status(404).json({ error: 'Rank data not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function extractRankFromHtml(html) {
    const $ = cheerio.load(html);
    const ratingText = $('.MuiTypography-root.MuiTypography-body1.jss14.css-1rxv754').text(); // Adjust the selector based on the actual HTML structure
    return ratingText;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
