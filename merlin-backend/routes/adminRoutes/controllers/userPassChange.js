const User = require("../../../models/userModel");
const adminValidate = require("../../adminRoutes/validate");
const bcrypt = require("bcrypt");

const change_password = async (req, res) => {
  try {
    const token = req.body.token;
    const newPassword = req.body.newPassword;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    console.log("req : " , req.body.id);
    

    if (!token) return res.status(403).send("Unauthorized");

    const validAdmin = await adminValidate(token);
    if (!validAdmin) return res.status(403).send("Unauthorized");

    const id = req.body.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send("اکانت یافت نشد");

    user.passwordHash = passwordHash;
    await user.save();

    return res.status(200).send("رمز عبور آپدیت شد!");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send("Internal server error"); // Generic error message
  }
};

module.exports = {
  change_password,
};
