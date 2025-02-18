const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  loginUserGoogle,
  verifyAdmin,
  logoutUser,

  updateUserById_Admin,
  getAllUser_Admin,
  updateAvatarController,
  getUser_ById,
  updateUserById_User,
  sendOtp,
  updatePrefences,
  updatePasswordUser,
  updateLanguage,
  checkOtp,
  sendTeacherDayWish,
  sendBirthdayWish,
  registerUser,
  loginUser,
} = require("../../controllers/nguoiDungController/userController");
const { checkUserJWT } = require("../../middleware/JWTaction");
const upload = require("../../config/multerConfig");

router.get("/user", getAllUser_Admin);
router.get("/user/:id", getUser_ById);
router.post("/logout", logoutUser);
router.post("/login/google", loginUserGoogle);
router.post("/verify-admin", verifyAdmin);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/user/:id/avatar", upload.single("images"), updateAvatarController);

router.put("/user/:id", updateUserById_User);
router.put("/user/update", updateUserById_Admin);

router.post("/send-otp", sendOtp);
router.post("/check-otp", checkOtp);
router.post("/update-password", updatePasswordUser);

router.post("/update-preferences", updatePrefences);

router.post("/update-language", updateLanguage);

router.post("/send-teacher", sendTeacherDayWish);
router.post("/send-birtday", sendBirthdayWish);

module.exports = router;
