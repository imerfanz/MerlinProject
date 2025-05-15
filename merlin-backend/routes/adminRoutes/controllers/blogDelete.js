const Blog = require("../../../models/blogModel");
const fs = require("fs");

const blog_delete = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("Blog ID is required");
  }

  try {
    // Use findByIdAndDelete or deleteOne
    const blog = await Blog.findById(id);

    // Check if the blog was found and deleted
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    await fs.promises
      .unlink(`${__dirname}/../../../images/blogs/${blog.firstPicture}`)
      .catch((err) => {
        throw new Error(`Error deleting image file: ${err.message}`);
      });

    if (blog.secondPicture) {
      await fs.promises
        .unlink(`${__dirname}/../../../images/blogs/${blog.secondPicture}`)
        .catch((err) => {
          throw new Error(`Error deleting image file: ${err.message}`);
        });
    }
    await blog.deleteOne();
    res.status(200).send(`Blog (${blog.blogName}) deleted successfuly`);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  blog_delete,
};
