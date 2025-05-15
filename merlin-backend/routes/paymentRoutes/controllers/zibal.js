const Order = require("../../../models/orderModel");
const Product = require("../../../models/productModel");
const User = require("../../../models/userModel");
require("dotenv").config();
const zibalGate = "https://gateway.zibal.ir/v1/request";
const zibalVerifyUrl = "https://gateway.zibal.ir/v1/verify";
const zibalMerchant = process.env.ZIBAL_MERCHANT;

// Zibal's main request and order creation in database
const request = async (req, res) => {
  let stepOne;
  try {
    const {
      orderArray,
      accountBalance,
      name,
      lastname,
      email,
      invitedBy,
      useBalance,
      _id,
      ...info
    } = req.body;
    const userId = req.body._id;
    // Setting up a valid order to move on with the proccess
    const validOrder = await Promise.all(
      orderArray.map(async (element) => {
        const item = await Product.findById(element.productId);
        const i = item.weights.indexOf(element.weight.match(/\d+/)[0]);
        if (i === -1) throw new Error("Weight not found in product data");
        const validPrice =
          item.offer !== 0
            ? Math.round((item.prices[i] * (100 - item.offer)) / 100)
            : item.prices[i];
        const mainPrice = validPrice * element.number;
        return {
          itemName: element.productName,
          grind: element.grind ? element.grind : null,
          offer: item.offer,
          weight: item.weights[i],
          number: element.number,
          price: mainPrice,
        };
      })
    );

    const totalPrice = validOrder.reduce((acc, item) => acc + item.price, 0);

    // Calculating the total price to pay based on account balance
    let finalPrice, balanceUsed;

    if (useBalance) {
      const user = await User.findById(userId);
      const balance = user.accountBalance;
      console.log("balance ", balance);

      if (totalPrice > balance) {
        finalPrice = totalPrice - balance;
        balanceUsed = balance;
      } else {
        finalPrice = 0;
        balanceUsed = totalPrice;
      }
    } else {
      finalPrice = totalPrice;
      balanceUsed = 0;
    }
    // Order that is going into database and going to be processed
    const ordrToSave = {
      ...info,
      fullName: `${name.trim()} ${lastname.trim()}`,
      userId: userId,
      paymentAffiliation: invitedBy
        ? {
            to: invitedBy,
            amount: Math.round(finalPrice * 0.07),
            isDone: false,
          }
        : null,
      order: orderArray,
      payment: null,
      isDelivered: null,
      orderFinishedPrice: finalPrice,
      balanceUsed: balanceUsed,
    };

    // Check if there is an unpaid Order and stop the process
    const unpaidOrder = await Order.findOne({ userId: userId, payment: null });

    if (unpaidOrder) {
      const { _id, fullName, order, orderFinishedPrice } = unpaidOrder;
      return res.status(403).send({ _id, fullName, order, orderFinishedPrice });
    }

    // If everything is ok move on with the order
    const newOrder = new Order(ordrToSave);
    stepOne = await newOrder.save();
    if (!stepOne) {
      throw new Error("Problem saving the order");
    }

    // Create an object for zibal
    const objectToPay = {
      merchant: zibalMerchant,
      amount: finalPrice,
      callbackUrl: process.env.FRONTEND_URL,
      orderId: stepOne._id,
      mobile: req.body.phone,
    };

    // Send it to zibal
    const zibalResponse = await fetch(zibalGate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectToPay),
    });

    // Await zibal's answer . If answer is ok proceed to sending the payment link. If not send zibal's answer and delete the order
    const zibalObject = await zibalResponse.json();
    if (zibalObject.result === 100) {
      res.status(200);
      res
        .status(200)
        .send(`https://gateway.zibal.ir/start/${zibalObject.trackId}`);
    } else {
      /* I thought its better to keep the order
      await Order.findByIdAndDelete(stepOne._id);
      */
      res.status(400).send(`${zibalObject.message}`);
    }
  } catch (err) {
    if (stepOne) {
      await Order.findByIdAndDelete(stepOne._id);
    }
    console.log(err);
    return res.status(500).send("خطا در ایجاد پرداخت");
  }
};

// Zibal's validation and order confirmation
const validation = async (req, res) => {
  const { trackId } = req.body;
  console.log(trackId);
  
  if (!trackId) {
    return res.status(400).send({ message: "trackId is required" });
  }
  try {
    const zibalResponse = await fetch(zibalVerifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ merchant: zibalMerchant, trackId: trackId }),
    });

    const zibalObject = await zibalResponse.json();
    if (zibalObject.result !== 100) {
      return res
        .status(403)
        .send({ orderId: zibalObject.orderId, message: zibalObject.message });
    }

    const orderObject = await Order.findById(zibalObject.orderId);
    const customer = await User.findById(orderObject.userId);
    const inviter = customer.invitedBy ? customer.invitedBy : null;

    // Inviter commision calculating and sending
    if (inviter) {
      const cTarget = await User.findById(inviter);
      if (cTarget) {
        const targetBalance = cTarget.accountBalance;
        const cPrice = Math.round((zibalObject.amount / 100) * 7);
        cTarget.accountBalance = targetBalance + cPrice;
        const commision = await cTarget.save();
        if (commision) {
          orderObject.paymentAffiliation = {
            to: inviter,
            amount: cPrice,
          };
        }
      }

      // Reduce the user balance , if used any
      if (
        orderObject.balanceUsed &&
        customer.accountBalance >= orderObject.balanceUsed
      ) {
        customer.accountBalance -= orderObject.balanceUsed;
        await customer.save();
      }
    }

    // Moving on with wrtinig the order in
    orderObject.payment = zibalObject;
    await orderObject.save();

    res.status(200).send({ orderArray: orderObject.order });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Zibal's unpaid order , pay request
const payUnpaid = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const unpaid = await Order.findById(orderId);
    const { orderFinishedPrice, phone } = unpaid;
    // Create an object for zibal
    const objectToPay = {
      merchant: zibalMerchant,
      amount: orderFinishedPrice,
      callbackUrl: process.env.FRONTEND_URL,
      orderId: orderId,
      mobile: phone,
    };

    // Send it to zibal
    const zibalResponse = await fetch(zibalGate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectToPay),
    });

    // Await zibal's answer . If answer is ok proceed to sending the payment link. If not send zibal's answer and delete the order
    const zibalObject = await zibalResponse.json();
    if (zibalObject.result === 100) {
      res.status(200);
      res
        .status(200)
        .send(`https://gateway.zibal.ir/start/${zibalObject.trackId}`);
    } else {
      res.status(400).send(`${zibalObject.message}`);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("خطا در ایجاد پرداخت");
  }
};

module.exports = {
  request,
  validation,
  payUnpaid,
};
