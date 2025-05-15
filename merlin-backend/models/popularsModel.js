const mongoose = require("mongoose");

const popSchema = new mongoose.Schema({
  popId: String,
  slideNumber : String,
});

const Populars = mongoose.model("populars", popSchema);

module.exports = Populars;
