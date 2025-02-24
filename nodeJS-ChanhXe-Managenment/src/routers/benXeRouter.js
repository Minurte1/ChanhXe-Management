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

router.get("/ben_xe", getAllBenXe);
router.get("/ben_xe/:id", getBenXeById);
router.post("/ben_xe", checkUserJWT, createBenXe);
router.put("/ben_xe/:id", checkUserJWT, updateBenXe);
router.delete("/ben_xe/:id", checkUserJWT, deleteBenXe);

module.exports = router;
