const express = require("express");
const router = express.Router();

const {
  getAllBenXe,
  getBenXeById,
  createBenXe,
  updateBenXe,
  deleteBenXe,
} = require("../controllers/benXeController");

const { checkUserJWT } = require("../middleware/JWTaction");

router.get("/ben-xe", checkUserJWT, getAllBenXe);
router.get("/ben-xe/:id", checkUserJWT, getBenXeById);
router.post("/ben-xe", checkUserJWT, createBenXe);
router.put("/ben-xe/:id", checkUserJWT, updateBenXe);
router.delete("/ben-xe/:id", checkUserJWT, deleteBenXe);

module.exports = router;
