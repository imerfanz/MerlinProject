const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogName : String,
    firstText : String,
    firstPicture : String,
    secondText : String,
    secondPicture : String,
    thirdText : String,
    fourthText : String
})

const Blog = mongoose.model("blogs" , blogSchema);

module.exports = Blog;