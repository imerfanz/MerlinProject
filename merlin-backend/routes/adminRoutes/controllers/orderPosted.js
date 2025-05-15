const Order = require("../../../models/orderModel");

const orders_post = async (req, res) => {
  try {
    const { id, postTrackId } = req.body;
    console.log(id);
    console.log(postTrackId);
    if (!postTrackId) {
      return res.status(405).send("Order has no Post Track ID!");
    }
    const postedOrder = await Order.findById(id);
    if (postedOrder.isDelivered) {
      return res.status(409).send("Order already has a Post Track ID!");
    }
    postedOrder.isDelivered = postTrackId;
    await postedOrder.save();
    return res.status(200).send("Order Post ID set");
  } catch (error) {
    return res.status(500).send("Internal server error!");
  }
};

module.exports = {
  orders_post,
};
