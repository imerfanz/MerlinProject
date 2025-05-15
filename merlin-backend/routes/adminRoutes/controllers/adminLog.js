const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../../models/adminModel");
require("dotenv").config();

const adminSecretKey = process.env.ADMIN_SECRET_KEY;

const admin_log = async (req, res) => {
  const user = req.body.username;
  const pass1 = req.body.password;
  const pass2 = req.body.password2;
  try {
    const admin = await Admin.findOne({ username: user });
    if (!admin) return res.status(404).send("Admin not found!");

    const passComparison1 = bcrypt.compare(pass1, admin.passwordHash);
    const passComparison2 = bcrypt.compare(pass2, admin.secondPasswordHash);
    if (passComparison1 && passComparison2) {
      const payload = { adminId: admin._id };
      const token = jwt.sign(payload, adminSecretKey, { expiresIn: "1d" });
      res.status(200).send({ token: token });
    } else {
      return res.status(401).send("wrong password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
};

module.exports = {
  admin_log,
};
