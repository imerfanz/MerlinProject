const Product = require("../../../models/productModel");

const product_slugs = async (req, res) => {
    try {
        const products = await Product.find({}, { _id: 1 }).lean(); // Fetch only _id fields
        const productIds = products.map((product) => product._id.toString());
        res.status(200).send(productIds);
      } catch (err) {
        console.error('Error fetching product IDs:', err);
        res.status(500).send('Failed to fetch product IDs');
      }
}

module.exports = {
    product_slugs,
}