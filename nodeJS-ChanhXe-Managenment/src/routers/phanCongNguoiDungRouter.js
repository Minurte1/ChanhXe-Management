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

router.get("/phancongnguoidung", checkUserJWT, getAllUserAssignments);
router.get("/phancongnguoidung/:id", checkUserJWT, getUserAssignmentById);
router.post("/phancongnguoidung", checkUserJWT, createUserAssignment);
router.put("/phancongnguoidung/:id", checkUserJWT, updateUserAssignment );
router.delete("/phancongnguoidung/:id", checkUserJWT, deleteUserAssignment);

module.exports = router;