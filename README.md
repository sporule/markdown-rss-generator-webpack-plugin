# Markdown RSS Generator Plugin

> Generate RSS from markdown

## Installation

Node.js

```bash
npm install markdown-rss-generator-webpack-plugin
```

## Usage Example (ES6)

In your Webpack Config file

```javascript
const MarkdownRSSGeneratorPlugin = require("markdown-rss-generator-webpack-plugin").default;

//define the options
const option = {
                title: "Sporule",
                outputPath: "rss.xml", //rss file output path
                description: "Sporule is a micro blog site",
                link: "https://www.sporule.com",
                language: "en",
                image: "https://i.imgur.com/vfh3Une.png",
                favicon: "https://i.imgur.com/vfh3Une.png",
                copyright: "All rights reserved 2019, Sporule",
                updated: new Date(), //updated date
                generator: "Sporule",
                author: {
                    name: "Sporule",
                    email: "example@example.com",
                    link: "https://www.sporule.com"
                },
                route: "/items",
                //this is the route for the markdown link. If the path of the markdown files are /posts/sporule.md, and the page link for rendered markdown is /items/sporule, then the route is /items
                useAtom:true //it will return atom xml if it is true, otherwise it will return rss version 2 xml.
    }

//In the plugin section

 plugins: [
  new MarkdownRSSGeneratorPlugin(option)
 ]

```
