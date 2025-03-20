const express = require("express");
const router = express.Router();

const {
  getTotalOrders,
  getRevenue,
  getTotalCustomers,
  getActiveTrips,
  getRevenueByMonth,
  getOrdersByMonth,
  getRecentOrders,
  getPopularTypes,
  getNewOrdersToday,
  getTripsToday,
} = require("../controllers/thongKeController");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Middleware áp dụng cho tất cả các route

// 1. Tổng quan
router.get("/overview/total-orders", getTotalOrders);
router.get("/overview/revenue", getRevenue);
router.get("/overview/customers", getTotalCustomers);
router.get("/overview/active-trips", getActiveTrips);

// 2. Biểu đồ
router.get("/chart/revenue-by-month", getRevenueByMonth);
router.get("/chart/orders-by-month", getOrdersByMonth);

// 3. Danh sách đơn hàng gần đây
router.get("/thong-ke/order/recent", getRecentOrders);

// 4. Loại hàng hóa phổ biến
router.get("/thong-ke/orders/popular-types", getPopularTypes);

// 5. Thông báo
router.get("/notifications/new-orders", getNewOrdersToday);
router.get("/notifications/trips-today", getTripsToday);

module.exports = router;
