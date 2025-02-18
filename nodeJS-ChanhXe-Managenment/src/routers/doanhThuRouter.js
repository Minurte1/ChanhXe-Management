const express = require("express");
const router = express.Router();

const {
  getAllRevenues,
  getRevenueById,
  createRevenue,
  updateRevenue,
  deleteRevenue,
} = require("../controllers/doanhThuController");

router.get("/revenues", getAllRevenues);
router.get("/revenues/:id", getRevenueById);
router.post("/revenues", createRevenue);
router.put("/revenues/:id", updateRevenue);
router.delete("/revenues/:id", deleteRevenue);

module.exports = router;