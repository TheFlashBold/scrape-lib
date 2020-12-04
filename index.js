const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const HtmlCrawler = require("./lib/HtmlCrawler");
const puppeteer = require("puppeteer-extra");
const moment = require("moment");
const Utils = require("./lib/Utils");

puppeteer.use(StealthPlugin());

/**
 * @type WebCrawlerModule
 */
class WebCrawlerModule {
    _browser = null;
    _presets = {};

    /**
     * @param {string} url
     * @param {{preset: string, puppeteer: Boolean|undefined, cache: Number}} options
     * @returns {Promise<object>}
     */
    async crawlPage(url, options = {preset: "auto", cache: 3600}) {
        const {preset: presetName} = options;
        const doc = await this.loadPage(url, options);
        const preset = presetName === "auto" || !this._presets[presetName] ? this.findPreset(url) : this.findPreset(url);
        const data = await this.parsePage(doc, preset);

        const databaseModule = this.app.getModule("database");
        if (!databaseModule) {
            return data;
        }
        let crawledPageModel = databaseModule.getModel("crawledPage");
        let model = await crawledPageModel.findOne({
            url: url,
            timestamp: {
                $gt: moment().subtract(options.cache, "s")
            }
        });
        if (!model) {
            model = new crawledPageModel({
                url: url,
                data: data,
                preset: preset.name || presetName,
                timestamp: new Date()
            });
            await model.save();
        }

        return data;
    }

    /**
     * Find preset by supported url
     * @param {string} url
     * @return {{urls: [], schema: {}}}
     */
    findPreset(url) {
        for (const [presetName, preset] of Object.entries(this._presets)) {
            if (preset.urls.find((regex) => new RegExp(regex, "i").test(url))) {
                preset.name = presetName;
                return preset;
            }
        }
    }

    /**
     * @param {string} url
     * @param {{puppeteer: Boolean}} options
     * @returns {Promise<string>}
     */
    async loadPage(url, options = {}) {
        if (options.puppeteer) {
            if (!this._browser) {
                this._browser = new puppeteer.launch({headless: true});
            }

            const page = await this._browser.newPage();
            await page.goto(url);

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

    /**
     * @param {string} doc html document
     * @param {object} preset as object
     * @returns {object}
     */
    async parsePage(doc, preset) {
        const parsedPage = new HtmlCrawler(doc, preset.schema);
        return parsedPage.getData();
    }
}

module.exports = WebCrawlerModule;
