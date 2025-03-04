const express = require("express");
const router = express.Router();

const {
    getAllVehicleAssignments,
    getVehicleAssignmentById,
    createVehicleAssignment,
    updateVehicleAssignment,
    deleteVehicleAssignment,
} = require("../controllers/phanCongXeController");
const {
    checkUserJWT,
    checkUserPermission,
} = require("../middleware/JWTaction");

router.get("/phancongxe", checkUserJWT, getAllVehicleAssignments);
router.get("/phancongxe/:id", checkUserJWT, getVehicleAssignmentById);
router.post("/phancongxe", checkUserJWT, createVehicleAssignment);
router.put("/phancongxe/:id", checkUserJWT, updateVehicleAssignment);
router.delete("/phancongxe/:id", checkUserJWT, deleteVehicleAssignment);

module.exports = router;