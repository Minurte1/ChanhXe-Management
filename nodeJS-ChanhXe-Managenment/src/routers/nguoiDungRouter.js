const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  loginUserGoogle,
  loginUser
} = require("../controllers/nguoiDungController");

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.post("/login/google", loginUserGoogle);
router.post("/login", loginUser);

module.exports = router;