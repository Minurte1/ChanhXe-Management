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

router.get("/phan-cong-nguoi-dung", checkUserJWT, getAllUserAssignments);
router.get("/phan-cong-nguoi-dung/:id", checkUserJWT, getUserAssignmentById);
router.post("/phan-cong-nguoi-dung", checkUserJWT, createUserAssignment);
router.put("/phan-cong-nguoi-dung/:id", checkUserJWT, updateUserAssignment );
router.delete("/phan-cong-nguoi-dung/:id", checkUserJWT, deleteUserAssignment);

module.exports = router;