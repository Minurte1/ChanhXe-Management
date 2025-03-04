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

router.get("/phancongxe", getAllVehicleAssignments);
router.get("/phancongxe/:id", getVehicleAssignmentById);
router.post("/phancongxe", createVehicleAssignment);
router.put("/phancongxe/:id", updateVehicleAssignment);
router.delete("/phancongxe/:id", deleteVehicleAssignment);

module.exports = router;