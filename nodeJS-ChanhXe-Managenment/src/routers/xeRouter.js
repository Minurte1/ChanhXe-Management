const express = require("express");
const router = express.Router();

const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/xeController");
const { checkUserJWT } = require("../middleware/JWTaction");
router.get("/xe", getAllVehicles);
router.get("/xe/:id", getVehicleById);
router.post("/xe", checkUserJWT, createVehicle);
router.put("/xe/:id", checkUserJWT, updateVehicle);
router.delete("/xe/:id", checkUserJWT, deleteVehicle);

module.exports = router;
