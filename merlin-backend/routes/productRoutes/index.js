const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../images/products"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadProduct = multer({ storage: storage });

// product show : sends the whole object by category
const showProduct = require("./controllers/showProduct");
router.post("/show", express.json(), showProduct.product_show);

// product post : adds product and write picture
const addProduct = require("./controllers/addProduct");
router.post(
  "/",
  express.json(),
  uploadProduct.single("picture"),
  addProduct.product_add
);

// product put : updates product but not the picture
const updateProduct = require("./controllers/productUpdate");
router.put("/", express.json(), updateProduct.product_update);

// product delete : deletes the product and its picture
const deleteProduct = require("./controllers/deleteProduct");
router.delete("/", express.json(), deleteProduct.product_delete);

// product get : sends all the product ids as slugs for getStaticPaths
const productSlugs = require("./controllers/productSlugs");
router.get("/slugs", express.json(), productSlugs.product_slugs);

// popular products get
const getPopulars = require("./controllers/getPopulars");
router.get("/populars", express.json(), getPopulars.populars_get);

// product get one : it just sends the requested product
const singleProduct = require("./controllers/singleProduct");
router.get("/:slug", express.json(), singleProduct.product_single);



module.exports = router;
