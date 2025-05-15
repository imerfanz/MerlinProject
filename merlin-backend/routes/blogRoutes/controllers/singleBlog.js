const Blog = require("../../../models/blogModel");

const blog_single = async (req, res) => {
  const { slug } = req.params;
  try {
    const blog = await Blog.findOne({ _id: slug }).lean();

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.status(200).send(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).send("Failed to fetch Blog");
  }
};

module.exports = {
  blog_single,
};
