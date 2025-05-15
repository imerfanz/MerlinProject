const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentAffiliation: {
    type: Object,
    default: null,
  },
  order: [Object],
  payment: {
    type: Object,
    default: null,
  },
  isDelivered: {
    type: String,
    default: null,
  },
  orderFinishedPrice: {
    type: Number,
    required: true,
  },
  balanceUsed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, // TTL field
});

orderSchema.index(
  { userId: 1, payment: 1 },
  { unique: true, partialFilterExpression: { payment: null } }
);

orderSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400, // 24 hours
    partialFilterExpression: { payment: null }, // Only for unpaid orders
  }
);

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
