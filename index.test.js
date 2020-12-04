const geizhalsSchema = require("./schemas/geizhals.json");
const ScrapeLib = require("./index");

const scraper = new ScrapeLib();
scraper.scrapePage("https://geizhals.de/amd-ryzen-9-3950x-100-000000051-a2089958.html?hloc=at&hloc=de", geizhalsSchema)
    .then((data) => console.log(JSON.stringify(data, null, 4)));
