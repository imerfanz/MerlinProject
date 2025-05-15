const Admin = require("../../models/adminModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminSecretKey = process.env.ADMIN_SECRET_KEY;

const adminValidate = async (token) => {
  try {
    const payload = jwt.verify(token, adminSecretKey);
    console.log("payload :", payload);
    const admin = await Admin.findById(payload.adminId);
    if (admin._id) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("validate error : ",error);
    return false;
  }
};

module.exports = adminValidate;
