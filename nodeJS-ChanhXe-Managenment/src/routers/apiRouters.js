const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.js");
const donHangRoute = require("./donHangRouter.js");
const nguoiDungRoute = require("./nguoiDungRouter.js");
const xeRoute = require("./xeRouter.js");
const benXeRoute = require("./benXeRouter.js");
const khachHangRoute = require("./khachHangRouter.js");
const taiXeRoute = require("./taiXeRouter.js");
const chuyenXeRoute = require("./chuyenXeRouter.js");
const donHangChuyenXeRoute = require("./donHangChuyenXeRouter.js");
const provincesRoute = require("./provincesRoute.js");
const phanCongXeRoute = require("./phanCongXeRouter.js");
const phanCongTaiXeRoute = require("./phanCongTaiXeRouter.js");
const phanCongNguoiDungRoute = require("./phanCongNguoiDungRouter.js");
const thongKeRoute = require("./thongKe.js");

// Register routes
router.use("/", authRoutes);
router.use("/", donHangRoute);
router.use("/", nguoiDungRoute);
router.use("/", xeRoute);
router.use("/", benXeRoute);
router.use("/", khachHangRoute);
router.use("/", taiXeRoute);
router.use("/", chuyenXeRoute);
router.use("/", donHangChuyenXeRoute);
router.use("/", provincesRoute);
router.use("/", phanCongXeRoute);
router.use("/", phanCongTaiXeRoute);
router.use("/", phanCongNguoiDungRoute);
router.use("/", thongKeRoute);
module.exports = router;
