const express = require("express");
const router = express.Router();

const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
  logoutCustomer,
} = require("../controllers/khachHangController");
const { checkUserJWT } = require("../middleware/JWTaction");
router.get("/customers", checkUserJWT, getAllCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", checkUserJWT, createCustomer);
router.put("/customers/:id", checkUserJWT, updateCustomer);
router.delete("/customers/:id", checkUserJWT, deleteCustomer);
router.post("/login-customer", loginCustomer);
router.post("/logout-customer", logoutCustomer);

module.exports = router;
