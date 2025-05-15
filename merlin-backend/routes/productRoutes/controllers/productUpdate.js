const Product = require("../../../models/productModel");

const product_update = async (req, res) => {
  try {
    const productId = req.body._id;
    const updatedData = req.body;
    console.log('id : ',productId);
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });
    console.log(product);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(`Product (${product.name}) updated successfully!`);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updateing product!");
  }
};

module.exports = {
  product_update,
};
