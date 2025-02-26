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

router.get("/ordersintrip", checkUserJWT, getAllOrdersInTrip);
router.get("/ordersintrip/:id", checkUserJWT, getOrderInTripById);
router.post("/ordersintrip", checkUserJWT, createOrderInTrip);
router.put("/ordersintrip/:id", checkUserJWT, updateOrderInTrip);
router.delete("/ordersintrip/:id", checkUserJWT, deleteOrderInTrip);

module.exports = router;