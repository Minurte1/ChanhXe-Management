const express = require("express");
const router = express.Router();

const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require("../controllers/chuyenXeController");

router.get("/trips", getAllTrips);
router.get("/trips/:id", getTripById);
router.post("/trips", createTrip);
router.put("/trips/:id", updateTrip);
router.delete("/trips/:id", deleteTrip);

module.exports = router;