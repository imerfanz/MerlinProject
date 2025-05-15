const Blog = require("../../../models/blogModel");

const blog_add = async (req, res) => {
  try {
    const firstPictureName = req.files["firstPicture"]
      ? req.files["firstPicture"][0].filename
      : null;
    const secondPictureName = req.files["secondPicture"]
      ? req.files["secondPicture"][0].filename
      : null;
    const blogObject = {
      blogName: req.body.blogName,
      firstText: req.body.firstText,
      firstPicture: firstPictureName ? firstPictureName : null,
      secondText: req.body.secondText,
      secondPicture: secondPictureName ? secondPictureName : null,
      thirdText: req.body.thirdText,
      fourthText: req.body.fourthText,
    };
    const newBlog = new Blog(blogObject);
    await newBlog.save();
    res.status(200).send("Blog saved successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
};

module.exports = {
  blog_add,
};
