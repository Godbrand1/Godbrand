const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/fetch-rank', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const rankElement = $('.MuiTypography-root.MuiTypography-body1.jss14.css-1rxv754').first();
        const rankText = rankElement.text();
        const rank = parseFloat(rankText.split(' ')[0]);

        res.json({ rank });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
