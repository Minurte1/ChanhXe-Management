const express = require("express");
const router = express.Router();

const {
    getAllOrdersInTrip,
    getOrderInTripById,
    createOrderInTrip,
    updateOrderInTrip,
    deleteOrderInTrip,
} = require("../controllers/donHangChuyenXeController");
const { checkUserJWT } = require("../middleware/JWTaction");

router.get("/don-hang-chuyen-xe", checkUserJWT, getAllOrdersInTrip);
router.get("/don-hang-chuyen-xe/:id", checkUserJWT, getOrderInTripById);
router.post("/don-hang-chuyen-xe", checkUserJWT, createOrderInTrip);
router.put("/don-hang-chuyen-xe/:id", checkUserJWT, updateOrderInTrip);
router.delete("/don-hang-chuyen-xe/:id", checkUserJWT, deleteOrderInTrip);

module.exports = router;