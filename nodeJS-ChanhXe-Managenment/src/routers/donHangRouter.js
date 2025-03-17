const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  createOrderAndCustomer,
  gethDonHangAddChuyenXe,
} = require("../controllers/donHangController");
const { checkUserJWT } = require("../middleware/JWTaction");
router.get("/orders-chuyen-xe", checkUserJWT, gethDonHangAddChuyenXe);
router.get("/orders", checkUserJWT, getAllOrders);
router.get("/orders/:id", checkUserJWT, getOrderById);
router.post("/orders", checkUserJWT, createOrder);
router.put("/orders/:id", checkUserJWT, updateOrder);
router.delete("/orders/:id", checkUserJWT, deleteOrder);
router.post("/order-and-customer", checkUserJWT, createOrderAndCustomer);

module.exports = router;
