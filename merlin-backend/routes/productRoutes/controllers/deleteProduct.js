const Product = require("../../../models/productModel");
const fs = require("fs");

const product_delete = async (req, res) => {
  try {
    const productId = req.body._id;

    // Retrieve the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found"); 
    }

    // Delete the image file (if it exists)
    if (product.picture) {
      await fs.promises
        .unlink(`${__dirname}/../../../images/products/${product.picture}`)
        .then(async () => {
          await product.deleteOne();
        })
        .then(() => {
          res.status(200).send(`Product (${product.name}) deleted successfully`);
        })
        .catch((err) => {
          throw new Error(`Error deleting image file: ${err.message}`);
        });
    }

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Error deleting product");
  }
};

module.exports = {
  product_delete,
};
