const puppeteer = require("puppeteer");

class Scraper {
  constructor(url, selector) {
    this.url = url;
    this.selector = selector;
  }
}
const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.ndbc.noaa.gov/station_page.php?station=46218", {
    timeout: 10000,
  });
  const firstLine = await page.waitForSelector(
    "#data > table:nth-child(4) > tbody > tr:nth-child(3)"
  );
  const firstText = await page.evaluate(
    (element) => element.textContent,
    firstLine
  );
  console.log(firstText);
  const secondLine = await page.waitForSelector(
    "#data > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(8)"
  );
  const secondText = await page.evaluate(
    (element) => element.textContent,
    secondLine
  );
  console.log(secondText);

  await browser.close();
};

scrape();
