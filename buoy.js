const puppeteer = require("puppeteer");
const dayjs = require("dayjs");
const axios = require("axios");

require("dotenv").config();
dayjs().format();

class Buoy {
  constructor(name, url, selectors) {
    this.url = url;
    this.name = name;
    this.selectors = selectors;
    this.timeout = 1;
    this.values = null;
    this.timestamp = null;
    this.lastNotification = dayjs();
    this.cooldown = 2; // hours;
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
    await page.goto(this.url, { timeout: 20000 });
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

  async alert(message) {
    // not implemented !
    try {
      const data = JSON.stringify({
        app_id: `${process.env.ONESIGNAL_APP_ID}`,
        included_segments: ["Subscribed Users"],
        headings: {
          en: `Swelter:Buoy '${this.name}'`,
        },
        contents: {
          en: `${message}`,
        },
      });

      const config = {
        method: "post",
        url: `${process.env.BASE_URL}/notifications`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.API_KEY}`,
        },
        data: data,
      };

      const notification = await axios(config);
      const parsedNotification = await JSON.stringify(notification.data);
      this.setLastNotification();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Buoy;
