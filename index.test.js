const hackerNewsSchema = require("./schemas/hackernews.json");
const geizhalsSchema = require("./schemas/geizhals.json");
const genericSchema = require("./schemas/generic.json");
const amdSchema = require("./schemas/amd.json");
const bcSchema = require("./schemas/bike-components.json");
const ScrapeLib = require("./index");

const scraper = new ScrapeLib();
// scraper.scrapePage("https://geizhals.de/amd-ryzen-9-3950x-100-000000051-a2089958.html?hloc=at&hloc=de", geizhalsSchema)
//     .then((data) => console.log(JSON.stringify(data, null, 4)));
// scraper.scrapePage("https://news.ycombinator.com/news", hackerNewsSchema)
//     .then((data) => console.log(JSON.stringify(data, null, 4)));
// scraper.scrapePage("https://news.ycombinator.com/news", genericSchema)
//     .then((data) => console.log(JSON.stringify(data, null, 4)));
// scraper.scrapePage("https://www.amd.com/de/direct-buy/5458374100/de", amdSchema)
//     .then((data) => console.log(JSON.stringify(data, null, 4)));
scraper.scrapePage("https://www.bike-components.de/de/COMMENCAL/Meta-AM-Essential-29-Komplettrad-p78086/", bcSchema)
    .then((data) => console.log(JSON.stringify(data, null, 4)));
