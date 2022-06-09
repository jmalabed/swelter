require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;
const cors = require("cors");
const Buoy = require("./buoy.js");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
dayjs().format();

// Cors
const whiteList = ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Harvest Buoy Monitoring
const firstBuoy = new Buoy(
  "Harvest",
  "https://www.ndbc.noaa.gov/station_page.php?station=46218",
  [
    "#data > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(8)",
    "#data > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(8)",
  ]
);

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
