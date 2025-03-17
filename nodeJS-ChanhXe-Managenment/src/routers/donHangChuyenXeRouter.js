const express = require("express");
const router = express.Router();

const {
  getAllDonHangChuyenXe,
  getDonHangChuyenXeById,
  // createDonHangChuyenXe,
  updateDonHangChuyenXe,
  deleteDonHangChuyenXe,
  addDonHangToChuyenXe,
  startChuyenXe,
} = require("../controllers/donHangChuyenXeController");

const { checkUserJWT } = require("../middleware/JWTaction");

router.get("/don-hang-chuyen-xe", getAllDonHangChuyenXe);
router.get("/don-hang-chuyen-xe/:id", getDonHangChuyenXeById);

router.post("/don-hang-chuyen-xe", checkUserJWT, addDonHangToChuyenXe);
router.post("/don-hang-chuyen-xe/start-chuyen-xe", checkUserJWT, startChuyenXe);

router.put("/don-hang-chuyen-xe/:id", checkUserJWT, updateDonHangChuyenXe);
router.delete("/don-hang-chuyen-xe/:id", checkUserJWT, deleteDonHangChuyenXe);

module.exports = router;
