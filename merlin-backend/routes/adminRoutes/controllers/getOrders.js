const Order = require("../../../models/orderModel");

const orders_get = async (req, res) => {
  try {
    const { page } = req.body;
    const limit = 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ "payment.paidAt": -1 })
      .skip(skip)
      .limit(limit);

    if (orders.length === 0) {
      return res.status(404).send("No paid orders!");
    }

    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send("Error retrieving orders");
  }
};

module.exports = {
  orders_get,
};
