require("dotenv").config();
const express = require("express");
const app = express();
require("./db/db");
const PORT = process.env.PORT || 9000;
const cors = require("cors");
const Buoy = require("./buoy.js");
const dayjs = require("dayjs");
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

// Harvest Buoy Monitoring
const firstBuoy = new Buoy(
  "Harvest",
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
        firstBuoy.alert("It's FIRING!!");
      }
    }
  })(),
  30 * 60 * 1000
);

// Controllers

// Middleware

// Routes
app.get("/", async (req, res, next) => {
  res.send("Welcome to swelter back end");
});
// Listen

app.listen(PORT, () => {
  console.log("Now listening on port", PORT);
});
