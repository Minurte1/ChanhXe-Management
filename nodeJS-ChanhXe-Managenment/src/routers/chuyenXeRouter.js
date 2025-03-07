const express = require("express");
const router = express.Router();

const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  updateChuyenXeCapBen,
  getDonHangChuyenXe,
} = require("../controllers/chuyenXeController");
const { checkUserJWT } = require("../middleware/JWTaction");
router.post("/trips/don-hang", checkUserJWT, getDonHangChuyenXe);

router.get("/trips", checkUserJWT, getAllTrips);
router.get("/trips/:id", checkUserJWT, getTripById);
router.post("/trips", checkUserJWT, createTrip);
router.put("/trips/:id", checkUserJWT, updateTrip);
router.delete("/trips/:id", checkUserJWT, deleteTrip);
router.post("/trips/updateChuyenXeCapBen", checkUserJWT, updateChuyenXeCapBen);

module.exports = router;
