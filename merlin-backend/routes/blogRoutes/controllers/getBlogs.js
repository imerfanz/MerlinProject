const Blog = require("../../../models/blogModel");

const get_blogs = async (req, res) => {
  try {
    console.log(req);
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 10; // Default to 10 items per page (matching frontend logic)

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch paginated data from the database
    const blogs = await Blog.find().skip(skip).limit(limit);

    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  get_blogs,
};
