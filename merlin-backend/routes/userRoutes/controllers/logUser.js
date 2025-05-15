const User = require("../../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const user_log = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      return res.status(404).send("کاربر یافت نشد");
    }
    const passCheck = bcrypt.compare(req.body.password, user.passwordHash);
    if (passCheck) {
      // Generate JWT on successful login
      const payload = { userId: user._id }; // Include user ID in the payload
      const token = jwt.sign(payload, secretKey, { expiresIn: "3d" }); // Set token expiration (e.g., 3 Days)

      return res
        .status(200)
        .send({ message: `${user.name}, شما وارد شما شدید` , object : user , token: token });
    } else {
      return res.status(401).send("رمز صحیح نیست");
    }
  } catch (error) {
    return res.status(500).send("خطای سرور");
  }
};

module.exports = {
  user_log,
};
