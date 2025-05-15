const Order = require("../../../models/orderModel");

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const unpaid = await Order.findByIdAndDelete(orderId);
    res.status(200).send("سفارش با موفقیت حذف شد");
  } catch (error) {
    console.log(error);
    return res.status(500).send("خطا در حذف سفارش ");
  }
};

module.exports = {
    deleteOrder,
};