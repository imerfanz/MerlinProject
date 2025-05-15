const User = require("../../../models/userModel");

const users_show = async (req, res) => {
  const search = req.body.search;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  console.log("body : ", search, " page : ", page);
  try {
    const users = search
      ? await User.find({ phone: { $in: search } })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
      : await User.find()
          .skip((page - 1) * pageSize)
          .limit(pageSize);
    if (users.length == 0) {
      return res.status(404).send("No user found for the specified number");
    }
    res.status(200).send(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  users_show,
};
