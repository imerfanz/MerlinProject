const express = require("express");
const router = express.Router();

// User Register
const userAdd = require("./controllers/addUser");
router.post("/reg", express.json(), userAdd.user_add);

// User Login
const userLog = require("./controllers/logUser");
router.post("/log", express.json(), userLog.user_log);

// User Edit
const userEdit = require("./controllers/editUser");
router.post("/edit", express.json(), userEdit.user_edit);

// JWT verification route
const tokenVerify = require("./controllers/jwt");
router.post("/token", express.json(), tokenVerify.token_verify);

// Show all users for admin
const usersShow = require("./controllers/showUsers");
router.post("/showUsers", express.json(), usersShow.users_show);

// Password update
const passwordChange = require("./controllers/passChange");
router.post("/passChange", express.json(), passwordChange.change_password);

// User orders fetch
const userOrders = require("./controllers/userOrders");
router.post("/orders", express.json(), userOrders.userOrders);

module.exports = router;
