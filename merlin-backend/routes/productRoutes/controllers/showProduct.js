const Product = require("../../../models/productModel");

const product_show = async (req, res) => {
  const categoryArray = req.body.array;
  const page = parseInt(req.query.page) || 1; 
  const pageSize = 10;
  console.log('body : ' , categoryArray , ' page : ' , page ); 

  try {
    const products = await Product.find({ category: { $in: categoryArray } })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (products.length === 0) {
      return res
        .status(404)
        .send("No products found for the specified categories");
    }

    res.status(200).send(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  product_show,
};