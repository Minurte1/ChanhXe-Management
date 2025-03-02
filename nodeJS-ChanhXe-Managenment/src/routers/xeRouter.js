const express = require("express");
const router = express.Router();

const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/xeController");
const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

router.get("/xe", checkUserJWT, checkUserPermission("admin"), getAllVehicles);
router.get(
  "/xe/:id",
  checkUserJWT,
  checkUserPermission("admin"),
  getVehicleById
);
router.post("/xe", checkUserJWT, checkUserPermission("admin"), createVehicle);
router.put(
  "/xe/:id",
  checkUserJWT,
  checkUserPermission("admin"),
  updateVehicle
);
router.delete(
  "/xe/:id",
  checkUserJWT,
  checkUserPermission("admin"),
  deleteVehicle
);

module.exports = router;
