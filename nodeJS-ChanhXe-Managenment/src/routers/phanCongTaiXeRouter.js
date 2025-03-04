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

router.get("/phancongtaixe", getAllDriverAssignments);
router.get("/phancongtaixe/:id", getDriverAssignmentById);
router.post("/phancongtaixe", createDriverAssignment);
router.put("/phancongtaixe/:id", updateDriverAssignment);
router.delete("/phancongtaixe/:id", deleteDriverAssignment);

module.exports = router;