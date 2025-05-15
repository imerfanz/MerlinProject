const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required : true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  invitedBy: {
    type: String,
  },
  affiliates: [String],
  notifications: [
    [
      { type: String },
      {
        type: Boolean,
        default: false,
      },

    ],
  ],
  createdAt: {
    type: Date,
    required: true,
  },
  accountBalance: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
