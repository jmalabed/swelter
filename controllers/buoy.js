const Scraper = require("../scraper.js");
const mongoose = require("mongoose");
const express = require("express");
const dayjs = require("dayjs");
dayjs().format();

const firstBuoy = new Scraper(
  "https://www.ndbc.noaa.gov/station_page.php?station=46218",
  [
    "#data > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(8)",
    "#data > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(8)",
  ]
);
setInterval(
  (async () => {
    // every 30 mins, scrape the buoy and read the data.
    // if data is >15 DPD && the last notification sent was over 2 hours ago && the time window is satisfied
    // send push notification to subscribers of the buoy
    await firstBuoy.scrapeBuoy();

    if (firstBuoy.values.filter((val) => val > 15).length > 1) {
      if (
        firstBuoy.lastNotification.isBefore(
          dayjs().subtract(firstBuoy.cooldown, "hour")
        )
      ) {
        firstBuoy.alert();
      }
    }
  })()
);
