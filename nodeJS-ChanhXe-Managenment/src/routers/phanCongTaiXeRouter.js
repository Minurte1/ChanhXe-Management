const express = require("express");
const router = express.Router();

const {
    getAllDriverAssignments,
    getDriverAssignmentById,
    createDriverAssignment,
    updateDriverAssignment,
    deleteDriverAssignment,
} = require("../controllers/phanCongTaiXeController");
const {
    checkUserJWT,
    checkUserPermission,
} = require("../middleware/JWTaction");

router.get("/phancongtaixe", checkUserJWT, getAllDriverAssignments);
router.get("/phancongtaixe/:id", checkUserJWT, getDriverAssignmentById);
router.post("/phancongtaixe", checkUserJWT, createDriverAssignment);
router.put("/phancongtaixe/:id", checkUserJWT, updateDriverAssignment);
router.delete("/phancongtaixe/:id", checkUserJWT, deleteDriverAssignment);

module.exports = router;