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

router.get("/dia_diem", getAllLocations);
router.get("/dia_diem/:id", getLocationById);
router.post("/dia_diem", checkUserJWT, createLocation);
router.put("/dia_diem/:id", checkUserJWT, updateLocation);
router.delete("/dia_diem/:id", checkUserJWT, deleteLocation);

module.exports = router;
