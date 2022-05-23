var express = require("express");
var router = express.Router();
const userController = require("../controllers/user");
router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
module.exports = router;
