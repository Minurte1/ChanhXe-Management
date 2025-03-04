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

router.get("/phancongxe", checkUserJWT, checkUserPermission("admin"), getAllVehicleAssignments);
router.get(
    "/phancongxe/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    getVehicleAssignmentById
);
router.post("/phancongxe", checkUserJWT, checkUserPermission("admin"), createVehicleAssignment);
router.put(
    "/phancongxe/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    updateVehicleAssignment,
);
router.delete(
    "/phancongxe/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    deleteVehicleAssignment,
);

module.exports = router;