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

router.get("/phancongtaixe", checkUserJWT, checkUserPermission("admin"), getAllDriverAssignments);
router.get(
    "/phancongtaixe/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    getDriverAssignmentById
);
router.post("/phancongtaixe", checkUserJWT, checkUserPermission("admin"), createDriverAssignment);
router.put(
    "/phancongtaixe/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    updateDriverAssignment,
);
router.delete(
    "/phancongtaixe/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    deleteDriverAssignment,
);

module.exports = router;