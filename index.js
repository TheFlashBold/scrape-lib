const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const HtmlCrawler = require("./lib/HtmlCrawler");
const puppeteer = require("puppeteer-extra");
const request = require("request-promise");
const Utils = require("./lib/Utils");

puppeteer.use(StealthPlugin());

const USER_AGENTS = {
    default: "Googlebot/2.1 (+http://www.google.com/bot.html)",
    mozilla: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
    chrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    internetExplorer: "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)"
};

class ScrapeLib {
    _browser = null;

    async scrapePage(url, schema) {
        const doc = await this.loadPage(url, schema.options || {});
        return this.parseDoc(doc, schema);
    }

    async loadPage(url, options = {}) {
        const {puppeteer, userAgent} = options;
        if (puppeteer) {
            const page = await this.loadPuppeteerPage(url);

            if (USER_AGENTS[userAgent || "default"]) {
                await page.setUserAgent(USER_AGENTS[userAgent || "default"]);
            }

            if (options.scrollToBottom) {
                await Utils.ScrollToBottom(page);
            }

            return page.content();
        }

        return request({
            method: "GET",
            headers: {"User-Agent": USER_AGENTS[userAgent || "default"]},
            url: url
        });
    }

    async loadPuppeteerPage(url) {
        if (!this._browser) {
            this._browser = await puppeteer.launch({headless: true});
        }

        const page = await this._browser.newPage();
        await page.goto(url, {waitUntil: "networkidle2"});
        return page;
    }

    async parseDoc(doc, schema) {
        const parsed = new HtmlCrawler(doc, schema.schema);
        return parsed.getData();
    }
}

module.exports = ScrapeLib;
