const express = require("express");
const router = express.Router();

// get all blogs
const getBlogs = require("./controllers/getBlogs");
router.get("/getBlogs", express.json(), getBlogs.get_blogs);

// product get : sends all the product ids as slugs for getStaticPaths
const blogSlugs = require("./controllers/blogSlugs");
router.get("/slugs", express.json(), blogSlugs.blog_slugs);

// product get one : it just sends the requested product
const singleBlog = require("./controllers/singleBlog");
router.get("/:slug", express.json(), singleBlog.blog_single);

module.exports = router;
