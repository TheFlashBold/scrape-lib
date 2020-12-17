const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const HtmlCrawler = require("./lib/HtmlCrawler");
const puppeteer = require("puppeteer-extra");
const request = require("request-promise");
const Utils = require("./lib/Utils");

puppeteer.use(StealthPlugin());

class ScrapeLib {
    _browser = null;

    async scrapePage(url, schema) {
        const doc = await this.loadPage(url, schema.options || {});
        return this.parseDoc(doc, schema);
    }

    async loadPage(url, options) {
        if (options.puppeteer) {
            const page = await this.loadPuppeteerPage(url);

            if (options.scrollToBottom) {
                await Utils.ScrollToBottom(page);
            }

            return page.content();
        }

        return request({
            method: "GET",
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
