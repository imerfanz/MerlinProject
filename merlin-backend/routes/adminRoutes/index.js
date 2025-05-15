const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const adminValidate = require("./validate");

// Validation function for Multers
const tokenCheck = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Get the token part after 'Bearer'
    const isValid = await adminValidate(token);
    console.log(isValid);
    if (!isValid) return res.status(401).send("Not Authorized");
    next();
  } catch (error) {
    console.error("Error in tokenCheck middleware:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Multer setup for sliders
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../images/sliders"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadSlider = multer({ storage: storage });

// Admin auth verify
const authAdmin = require("./controllers/auth");
router.post("/auth", express.json(), authAdmin.admin_auth);

// Admin login and token sending
const logAdmin = require("./controllers/adminLog");
router.post("/log", express.json(), logAdmin.admin_log);

// Admin change users pass and token check
const passwordChange = require("./controllers/userPassChange");
router.post("/changePass", express.json(), passwordChange.change_password);

// Admin Picture change and token check
const setPicture = require("./controllers/setPicture");
router.post(
  "/picture",
  express.json(),
  tokenCheck,
  uploadSlider.single("picture"),
  setPicture.picture_set
);

// Admin picture delete and token check
const deletePicture = require("./controllers/deletePicture");
router.post(
  "/deletePicture",
  express.json(),
  tokenCheck,
  deletePicture.picture_delete
);

// Admin product controll and token check

// Add popular items and delete
const controllPopulars = require("./controllers/controllPopular");
router.post(
  "/popularControll",
  express.json(),
  tokenCheck,
  controllPopulars.populars_controll
);

// Add blog pictures storage
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../images/blogs"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadBlog = multer({ storage: blogStorage });

// Add blogs and token check
const blogAdd = require("./controllers/blogAdd");
router.post(
  "/addBlog",
  express.json(),
  tokenCheck,
  uploadBlog.fields([
    { name: "firstPicture", maxCount: 1 }, // Handle "firstPicture"
    { name: "secondPicture", maxCount: 1 }, // Handle "secondPicture"
  ]),
  blogAdd.blog_add
);

// Blog Delete and image delete
const deleteBlog = require("./controllers/blogDelete");
router.post("/deleteBlog", express.json(), tokenCheck, deleteBlog.blog_delete);

// Get all the orders for admin to check and send
const getOrders = require("./controllers/getOrders");
router.post("/getOrders", express.json(), tokenCheck, getOrders.orders_get);

// Set order's as posted and save post ID
const postOrders = require("./controllers/orderPosted");
router.post("/postOrder", express.json(), tokenCheck, postOrders.orders_post);


module.exports = router;
