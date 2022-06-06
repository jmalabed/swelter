require("dotenv").config();
const express = require("express");
const app = express();
require("./db/db");
const PORT = process.env.PORT || 9000;
const cors = require("cors");
// Controllers

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

// Middleware

// Routes

// Listen

app.listen(PORT, () => {
  console.log("Now listening on port", PORT);
});
