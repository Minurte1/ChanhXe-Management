const express = require("express");
const router = express.Router();

const {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/donHangCuaBenChuyenXeController");

router.get("/records", getAllRecords);
router.get("/records/:id", getRecordById);
router.post("/records", createRecord);
router.put("/records/:id", updateRecord);
router.delete("/records/:id", deleteRecord);

module.exports = router;