const express = require("express");
const router = express.Router();

const {
    getAllUserAssignments,
    getUserAssignmentById,
    createUserAssignment,
    updateUserAssignment,
    deleteUserAssignment,
} = require("../controllers/phanCongNguoiDungControllers");
const {
    checkUserJWT,
    checkUserPermission,
} = require("../middleware/JWTaction");

router.get("/phancongnguoidung", checkUserJWT, checkUserPermission("admin"), getAllUserAssignments);
router.get(
    "/phancongnguoidung/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    getUserAssignmentById
);
router.post("/phancongtaixe", checkUserJWT, checkUserPermission("admin"), createUserAssignment);
router.put(
    "/phancongnguoidung/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    updateUserAssignment,
);
router.delete(
    "/phancongnguoidung/:id",
    checkUserJWT,
    checkUserPermission("admin"),
    deleteUserAssignment,
);

module.exports = router;