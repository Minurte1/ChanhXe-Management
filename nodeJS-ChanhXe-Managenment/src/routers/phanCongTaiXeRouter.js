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

router.get("/phan-cong-tai-xe", checkUserJWT, getAllDriverAssignments);
router.get("/phan-cong-tai-xe/:id", checkUserJWT, getDriverAssignmentById);
router.post("/phan-cong-tai-xe", checkUserJWT, createDriverAssignment);
router.put("/phan-cong-tai-xe/:id", checkUserJWT, updateDriverAssignment);
router.delete("/phan-cong-tai-xe/:id", checkUserJWT, deleteDriverAssignment);

module.exports = router;