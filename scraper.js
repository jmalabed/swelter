const puppeteer = require("puppeteer");
const dayjs = require("dayjs");
const axios = require("axios");

dayjs().format();

const API_KEY = process.env.API_KEY;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const BASE_URL = process.env.BASE_URL;

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

  async alert() {
    // not implemented !
    const configs = {
      url: "https://onesignal.com/api/v1/notifications",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${API_KEY}`,
      },
      body: {
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["Subscribed Users"],
        data: {
          foo: "bar",
        },
        contents: {
          en: "Sample push notification",
        },
      },
    };
    const alert = await axios(configs);
    console.log(alert);
  }
}

module.exports = Scraper;
