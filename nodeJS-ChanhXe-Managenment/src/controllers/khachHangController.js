const pool = require("../config/database"); // Kết nối cơ sở dữ liệu
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpStorage = new Map();
// Lấy tất cả khách hàng
const getAllCustomers = async (req, res) => {
  // #swagger.tags = ['Khách hàng']
  try {
    const [rows] = await pool.query("SELECT * FROM khach_hang");
    return res
      .status(200)
      .json({ EM: "Lấy danh sách khách hàng thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy khách hàng theo ID
const getCustomerById = async (req, res) => {
  // #swagger.tags = ['Khách hàng']
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM khach_hang WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy khách hàng", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy khách hàng thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getCustomerById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới khách hàng
const createCustomer = async (req, res) => {
  // #swagger.tags = ['Khách hàng']
  try {
    const { ho_ten, so_dien_thoai, dia_chi, mat_khau } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;

    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    // Mã hóa mật khẩu trước khi lưu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);

    const [result] = await pool.query(
      `INSERT INTO khach_hang (ho_ten, so_dien_thoai, dia_chi, mat_khau, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [ho_ten, so_dien_thoai, dia_chi, hashedPassword, id_nguoi_cap_nhat]
    );

    return res.status(201).json({
      EM: "Tạo khách hàng thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createCustomer:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật khách hàng
const updateCustomer = async (req, res) => {
  // #swagger.tags = ['Khách hàng']
  try {
    const { id } = req.params;
    const updates = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }

    if (updates.mat_khau) {
      const [currentCustomer] = await pool.query(
        "SELECT mat_khau FROM khach_hang WHERE id = ?",
        [id]
      );
      if (
        currentCustomer.length > 0 &&
        currentCustomer[0].mat_khau === updates.mat_khau
      ) {
        delete updates.mat_khau;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        EM: "Không có dữ liệu cập nhật hoặc mật khẩu không thay đổi",
        EC: -1,
        DT: {},
      });
    }

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);

    const updateQuery = `UPDATE khach_hang SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
    values.push(id_nguoi_cap_nhat, id);

    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy khách hàng để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật khách hàng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
  // #swagger.tags = ['Khách hàng']
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM khach_hang WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy khách hàng để xóa", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Xóa khách hàng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
