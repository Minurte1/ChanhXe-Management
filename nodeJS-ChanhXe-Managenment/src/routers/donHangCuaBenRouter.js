const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/donHangCuaBenController");

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

module.exports = router;