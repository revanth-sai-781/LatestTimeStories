const https = require('https');

const express = require("express");

const app = express();

const port = 5500;

app.use(express.json());

app.get("/getTimeStories", (req, res) => {
    https.get('https://time.com/', (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            const stories = [];
            const listItemRegex = /<li class="latest-stories__item">([\s\S]*?)<\/li>/g;
            const titleRegex = /<h3 class="latest-stories__item-headline">([\s\S]*?)<\/h3>/;
            const urlRegex = /<a href="([\s\S]*?)"/;

            let match;
            while ((match = listItemRegex.exec(data)) !== null && stories.length < 6) {
                const listItem = match[1];
                const titleMatch = listItem.match(titleRegex);
                const urlMatch = listItem.match(urlRegex);

                if (titleMatch && urlMatch) {
                    stories.push({
                        title: titleMatch[1].trim(),
                        url: `https://time.com${urlMatch[1].trim()}`
                    });
                }
            }

            res.status(200).json(stories);
        });
    }).on('error', (err) => {
        res.status(500).send("Internal Server Error! Please try again.!");
    });
});

app.listen(port, () => {
    console.log(`Server Successfully running on Port http://localhost:${5500}/getTimeStories`)
});
