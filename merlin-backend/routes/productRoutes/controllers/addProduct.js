const Product = require("../../../models/productModel");

const product_add = (req, res) => {
  try{
  const productData = {
    name: req.body.name,
    weights: JSON.parse(req.body.weights),
    prices: JSON.parse(req.body.prices),
    offer: req.body.offer,
    explanation: JSON.parse(req.body.explanation),
    category: JSON.parse(req.body.category),
    available: req.body.available,
    picture: req.file.filename,
  };
  const newProduct = new Product(productData);
  newProduct
    .save()
    .then((re) => {
      res.status(200).send("Product saved successfuly : " + re.name );
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ message: "Error saving product", errors: err.errors }); // More informative response
    });
  }catch (err){
    res.status(500).send('Something went wrong!')
  }
};

module.exports = {
  product_add,
};
