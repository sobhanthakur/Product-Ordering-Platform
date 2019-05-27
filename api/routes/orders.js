const express = require("express");
const router = express.Router();

const orderController = require("../controllers/v1/orders");

const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, orderController.orders_get_all);

router.post("/", checkAuth, orderController.create_new_order);

router.get("/:orderId", checkAuth, orderController.get_order_by_id);

router.delete("/:orderId", checkAuth, orderController.delete_order);

module.exports = router;
