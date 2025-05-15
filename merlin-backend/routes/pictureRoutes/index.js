const express = require('express');
const router = express.Router();

// Get slider pics 
const getSliders = require("./controllers/getSliders");
router.get("/getSliders",getSliders.slider_get);

module.exports = router;

