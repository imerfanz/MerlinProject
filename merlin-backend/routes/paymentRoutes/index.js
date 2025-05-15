const express = require("express");
const router = express.Router();

// Paying request through Zibal
const zibal = require("./controllers/zibal");
router.post("/zibal-request", express.json(), zibal.request);
router.post("/zibal-unpaid", express.json(), zibal.payUnpaid);
router.post("/zibal-validate" , express.json() , zibal.validation);

// Delete order (any payment gate)
const deleteOrder = require("./controllers/unpaidDelete");
router.post("/delete-order" , express.json() , deleteOrder.deleteOrder);


module.exports = router;
