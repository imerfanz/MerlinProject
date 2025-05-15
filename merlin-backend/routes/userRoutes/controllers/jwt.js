const User = require("../../../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const token_verify = async (req, res) => {
  try {
    const token = req.body.jwt;
    const info = jwt.verify(token, secretKey);
    const id = info.userId;
    const user = await User.findById(id);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("خطای سرور")
  }
};

module.exports = {
  token_verify,
};
