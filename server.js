require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;
const Buoy = require("./buoy.js");
const dayjs = require("dayjs");
const methodOverride = require("method-override");
dayjs().format();

app.use(express.urlencoded({ extended: true }));

// Harvest Buoy Monitoring
const firstBuoy = new Buoy(
  "Harvest",
  "https://www.ndbc.noaa.gov/station_page.php?station=46218",
  [
    "#data > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(8)",
    "#data > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(8)",
  ]
);
firstBuoy.alert("testing cloud server!");
setInterval(async () => {
  // every 30 mins, scrape the buoy and read the data.
  // if data is >15 DPD && the last notification sent was over 2 hours ago && the time window is satisfied
  // send push notification to subscribers of the buoy
  console.log("pre-scrape");
  await firstBuoy.scrapeBuoy();
  console.log("post-scrape");
  if (firstBuoy.values.filter((val) => val > 15).length > 1) {
    if (
      firstBuoy.lastNotification.isBefore(
        dayjs().subtract(firstBuoy.cooldown, "hour")
      )
    ) {
      firstBuoy.alert("It's FIRING!!");
    }
  } else {
    console.log("checked, no notifications");
  }
}, 30 * 60 * 1000);

// Middleware
// Listen

app.listen(PORT, () => {
  console.log("Now listening on port", PORT);
});
