const puppeteer = require("puppeteer");
const dayjs = require("dayjs");
const axios = require("axios");

dayjs().format();

class Scraper {
  constructor(url, selectors) {
    this.url = url;
    this.selectors = selectors;
    this.timeout = 1;
    this.values = null;
    this.timestamp = null;
    this.lastNotification = dayjs();
    this.cooldown = 4; // hours;
  }

  setTimestamp() {
    this.timestamp = dayjs();
  }

  setLastNotification() {
    this.lastNotification = dayjs();
  }

  async scrapeBuoy() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url, { timeout: 10000 });
    let newVals = [];
    for (let i = 0; i < this.selectors.length; i++) {
      const selector = await page.waitForSelector(this.selectors[i]);
      const newVal = await page.evaluate(
        (element) => element.textContent,
        selector
      );
      newVals.push(parseInt(newVal));
    }
    this.values = newVals;
    this.setTimestamp();
    await browser.close();
  }

  alert() {
    // not implemented !
  }
}

module.exports = Scraper;
