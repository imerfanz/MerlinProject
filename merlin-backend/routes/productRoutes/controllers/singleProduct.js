const Product = require("../../../models/productModel");

const product_single = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ _id: slug }).lean();
    console.log(product);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.status(200).send(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).send("Failed to fetch product");
  }
};

module.exports = {
  product_single,
};
