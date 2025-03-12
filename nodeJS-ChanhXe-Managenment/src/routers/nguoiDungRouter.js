const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  loginUserGoogle,
  loginUser,
  logoutUser,
  verifyAdmin,
  sendOtp,
  checkOtp,
  registerUser,
  getAllUnassignedUsers,
  updateProfileUser,
} = require("../controllers/nguoiDungController");
const { getMenuUser } = require("../controllers/menuUserController");
const { checkUserJWT } = require("../middleware/JWTaction");
router.get("/users", getAllUsers);
router.get("/user/chua-phan-cong", checkUserJWT, getAllUnassignedUsers);
router.get("/users/:id", getUserById);
router.post("/users", checkUserJWT, createUser);
router.put("/users-profile/:id", checkUserJWT, updateProfileUser);
router.put("/users/:id", checkUserJWT, updateUser);
router.delete("/users/:id", deleteUser);

router.post("/login/google", loginUserGoogle);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-admin", verifyAdmin);
router.post("/send-otp", sendOtp);
router.post("/check-otp", checkOtp);
router.post("/register", registerUser);

// --------------------

router.get("/menu", checkUserJWT, getMenuUser);

module.exports = router;
