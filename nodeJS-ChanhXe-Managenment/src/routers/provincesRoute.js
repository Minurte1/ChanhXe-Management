const express = require("express");
const router = express.Router();

const {
  getProvincesAll,
  getDistricts_ProvincesId,
  getWards_DistrictsId,
} = require("../controllers/provincesController");

router.get("/provinces", getProvincesAll);
router.get("/districts/:id", getDistricts_ProvincesId);
router.get("/wards/:id", getWards_DistrictsId);

module.exports = router;
