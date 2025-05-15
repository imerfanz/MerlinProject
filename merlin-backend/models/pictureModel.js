const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema({
  webLocation: String,
  pictureName: String,
  link: String,
  slideNumber : String,
});

const Picture = mongoose.model("pictures", pictureSchema);

module.exports = Picture;
