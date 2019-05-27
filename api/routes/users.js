const express = require("express");
const router = express.Router();

const userController = require("../controllers/v1/users");

router.post("/signup", userController.signup);

router.delete("/:userId", userController.delete);

router.post("/login", userController.login);

module.exports = router;
