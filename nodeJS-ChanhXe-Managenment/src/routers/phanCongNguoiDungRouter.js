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

router.get("/phancongnguoidung", getAllUserAssignments);
router.get("/phancongnguoidung/:id", getUserAssignmentById);
router.post("/phancongnguoidung", createUserAssignment);
router.put("/phancongnguoidung/:id", updateUserAssignment );
router.delete("/phancongnguoidung/:id", deleteUserAssignment);

module.exports = router;