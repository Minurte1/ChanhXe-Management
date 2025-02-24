const express = require("express");
const router = express.Router();

const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/diaDiemController");
const { checkUserJWT } = require("../middleware/JWTaction");

router.get("/dia-diem", getAllLocations);
router.get("/dia-diem/:id", getLocationById);
router.post("/dia-diem", checkUserJWT, createLocation);
router.put("/dia-diem/:id", checkUserJWT, updateLocation);
router.delete("/dia-diem/:id", checkUserJWT, deleteLocation);

module.exports = router;
