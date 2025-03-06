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

router.get("/phan-cong-xe", checkUserJWT, getAllVehicleAssignments);
router.get("/phan-cong-xe/:id", checkUserJWT, getVehicleAssignmentById);
router.post("/phan-cong-xe", checkUserJWT, createVehicleAssignment);
router.put("/phan-cong-xe/:id", checkUserJWT, updateVehicleAssignment);
router.delete("/phan-cong-xe/:id", checkUserJWT, deleteVehicleAssignment);

module.exports = router;