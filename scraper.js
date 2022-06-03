const puppeteer = require("puppeteer");
const dayjs = require("dayjs");
dayjs().format();

class Scraper {
  constructor(url, selectors) {
    this.url = "https://www.ndbc.noaa.gov/station_page.php?station=46218";
    this.selectors = [
      "#data > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(8)",
      "#data > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(8)",
    ];
    this.timeout = 1;
    this.values = [];
    this.lastNotification = null;
  }

  setTimestamp() {
    this.lastNotification = dayjs();
    console.log(this.lastNotification);
  }

  async scrapeBuoy() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url, { timeout: 10000 });

    for (let i = 0; i < this.selectors.length; i++) {
      const selector = await page.waitForSelector(this.selectors[i]);
      const newVal = await page.evaluate(
        (element) => element.textContent,
        selector
      );
      this.values.push(parseInt(newVal));
    }
    await browser.close();
    this.setTimestamp();
  }

  alert() {
    // not implemented !
    if (this.values.filter((val) => val > 15).length > 1) {
      console.log("Its red hot baby!");
    }
  }

  getWaveData() {
    // only for DPD right now
    console.log(this.values);
    return this.values;
  }

  getTimestamp() {
    return this.lastNotification;
  }
}

const myFavBuoy = new Scraper("x", ["x"]);

(async () => {
  await myFavBuoy.scrapeBuoy();
  myFavBuoy.getWaveData();
  myFavBuoy.alert();
})();

module.exports = Scraper;
