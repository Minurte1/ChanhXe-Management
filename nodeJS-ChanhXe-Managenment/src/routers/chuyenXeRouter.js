const express = require("express");
const router = express.Router();

const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require("../controllers/chuyenXeController");
const { checkUserJWT } = require("../middleware/JWTaction");
router.get("/trips", checkUserJWT, getAllTrips);
router.get("/trips/:id", checkUserJWT, getTripById);
router.post("/trips", checkUserJWT, createTrip);
router.put("/trips/:id", checkUserJWT, updateTrip);
router.delete("/trips/:id", checkUserJWT, deleteTrip);

module.exports = router;
