const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weights: [String],
  prices: [Number], // Array of arrays for price and quantity
  offer: {
    type: Number,
    default: 0,
  },
  explanation: [
    [String, String],
  ],
  category: [String],
  available: {
    type: Boolean,
    default: true,
  },
  picture: {
    type: String,
    validate: {
      validator: (value) => {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w-]*)*\/?/.test(
          value
        );
      },
      message: "Invalid image URL",
    },
  },
});


const Product = mongoose.model("products", productSchema);

module.exports = Product;
