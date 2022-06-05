const mongoose = require("mongoose");

const buoySchema = mongoose.Schema(
  {
    name: String,
    buoy: {},
    lastData: [],
  },
  { timestamps: true }
);

const Buoy = mongoose.model("Buoy", buoySchema);

module.exports = Buoy;
