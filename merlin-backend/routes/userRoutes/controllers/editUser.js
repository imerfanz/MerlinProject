const User = require("../../../models/userModel");
const bcrypt = require("bcrypt");

const user_edit = async (req, res) => {
  try {
    const id = req.body._id;
    const {
      name,
      lastname,
      password,
      state,
      city,
      postalCode,
      address,
      email,
    } = req.body;

    const user = await User.findOne({ _id: id });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);
    if (state) user.state = state;
    if (city) user.city = city;
    if (postalCode) user.postalCode = postalCode;
    if (address) user.address = address;
    if (email) user.email = email;

    user.save().then(() => {
        res.status(200).send('اطلاعات اپدیت شد !')
    }).catch((error) => {
        res.status(500).send("خطا در اپدیت اطلاعات")
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("خطای سرور")
  }
};

module.exports = {
  user_edit,
};
