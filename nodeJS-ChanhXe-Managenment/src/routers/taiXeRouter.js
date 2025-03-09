const express = require("express");
const router = express.Router();

const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getUsersNotInDriverTable,
} = require("../controllers/taiXeController");
const { checkUserJWT } = require("../middleware/JWTaction");
router.get("/tai-xe", checkUserJWT, getAllDrivers);
router.get("/tai-xe-add-table", checkUserJWT, getUsersNotInDriverTable);
router.get("/tai-xe/:id", getDriverById);
router.post("/tai-xe", checkUserJWT, createDriver);
router.put("/tai-xe/:id", checkUserJWT, updateDriver);
router.delete("/tai-xe/:id", checkUserJWT, deleteDriver);

module.exports = router;
