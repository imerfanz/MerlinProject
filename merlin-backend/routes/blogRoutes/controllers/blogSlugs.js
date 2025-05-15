const Blog = require("../../../models/blogModel");

const blog_slugs = async (req, res) => {
  try {
    const blogs = await Blog.find({}, { _id: 1 }).lean(); // Fetch only _id fields
    const blogIds = blogs.map((blog) => blog._id.toString());
    res.status(200).send(blogIds);
  } catch (err) {
    console.error("Error fetching blog IDs:", err);
    res.status(500).send("Failed to fetch blog IDs");
  }
};

module.exports = {
  blog_slugs,
};
