const Order = require("../../../models/orderModel");

const userOrders = async (req, res) => {
  const { id } = req.body;
  
  try {
    const orders = await Order.find({ userId: id });
    
    // If there is no orders
    if (orders.length === 0) {
      return res.status(404).send("No orders found");
    }
    
    const fiexdOrders = orders.map((item) => {
      const { payment, _id, isDelivered, order } = item;
      return {
        _id: _id,
        payment: payment ? true : null,
        order: order,
        isDelivered: isDelivered,
      };
    });

    // If orders been found successfully
    res.status(200).send(fiexdOrders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  userOrders,
};
