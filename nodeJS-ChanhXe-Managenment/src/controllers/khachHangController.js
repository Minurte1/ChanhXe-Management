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
    const {
      id,
      ho_ten,
      so_dien_thoai,
      dia_chi,
      id_nguoi_cap_nhat,
      ngay_cap_nhat,
      ngay_tao,
    } = req.query;

    // Query cơ bản
    let query = `
      SELECT 
        khach_hang.id,
        khach_hang.mat_khau,
        khach_hang.ho_ten,
        khach_hang.so_dien_thoai,
        khach_hang.dia_chi,
        khach_hang.id_nguoi_cap_nhat,
        khach_hang.ngay_cap_nhat,
        khach_hang.ngay_tao
      FROM khach_hang
      WHERE 1=1
    `;
    let queryParams = [];

    // Thêm điều kiện tìm kiếm dynamic
    if (id) {
      query += " AND khach_hang.id = ?";
      queryParams.push(id);
    }
    if (ho_ten) {
      query += " AND khach_hang.ho_ten LIKE ?";
      queryParams.push(`%${ho_ten}%`);
    }
    if (so_dien_thoai) {
      query += " AND khach_hang.so_dien_thoai = ?";
      queryParams.push(so_dien_thoai);
    }
    if (dia_chi) {
      query += " AND khach_hang.dia_chi LIKE ?";
      queryParams.push(`%${dia_chi}%`);
    }
    if (id_nguoi_cap_nhat) {
      query += " AND khach_hang.id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat);
    }
    if (ngay_cap_nhat) {
      query += " AND DATE(khach_hang.ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat);
    }
    if (ngay_tao) {
      query += " AND DATE(khach_hang.ngay_tao) = ?";
      queryParams.push(ngay_tao);
    }

    // Sắp xếp theo ngày cập nhật của khach_hang
    query += " ORDER BY khach_hang.ngay_cap_nhat DESC";

    // Thực thi query
    const [rows] = await pool.query(query, queryParams);

    return res.status(200).json({
      EM: "Lấy danh sách khách hàng thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
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

    if (!ho_ten || !so_dien_thoai || !dia_chi || !mat_khau) {
      return res
        .status(400)
        .json({ EM: "Thiếu thông tin cần thiết", EC: -1, DT: {} });
    }

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const [existingPhone] = await pool.query(
      `SELECT id FROM  khach_hang WHERE so_dien_thoai = ? LIMIT 1`,
      [so_dien_thoai]
    );

    if (existingPhone.length > 0) {
      return res.status(400).json({
        EM: "Số điện thoại đã tồn tại",
        EC: -1,
        DT: {},
      });
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

const loginCustomer = async (req, res) => {
  // #swagger.tags = ['Khách hàng']
  const { so_dien_thoai, password } = req.body;

  if (!so_dien_thoai || !password) {
    return res.status(400).json({
      EM: "Số điện thoại và mật khẩu không được để trống",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    const [rows] = await pool.query(
      "SELECT * FROM khach_hang WHERE so_dien_thoai = ?",
      [so_dien_thoai]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    const user = rows[0];

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.mat_khau);
    if (!isPasswordValid) {
      return res.status(401).json({
        EM: "Mật khẩu không đúng",
        EC: 0,
        DT: [],
      });
    }
    
    // Tạo JWT token
    const accessToken = jwt.sign(
      {
        id: user.id,
        ho_ten: user.ho_ten,
        so_dien_thoai: user.so_dien_thoai,
        id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
        ngay_cap_nhat: user.ngay_cap_nhat,
        ngay_tao: user.ngay_tao,
        vai_tro: "khach_hang"
      },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        ho_ten: user.ho_ten,
        so_dien_thoai: user.so_dien_thoai,
        id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
        ngay_cap_nhat: user.ngay_cap_nhat,
        ngay_tao: user.ngay_tao,
        vai_tro: "khach_hang"
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // refresh token là HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict",
    });

    // Trả về token và thông tin người dùng
    return res.status(200).json({
      EM: "Đăng nhập thành công",
      EC: 1,
      DT: {
        accessToken: accessToken,
        userInfo: {
          id: user.id,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
          ngay_cap_nhat: user.ngay_cap_nhat,
          ngay_tao: user.ngay_tao,
          vai_tro: "khach_hang"
        },
      },
    });
  } catch (error) {
    console.error("Error in login customer:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const logoutCustomer = (req, res) => {
  // #swagger.tags = ['Khách hàng']
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Đăng xuất thành công" });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
  logoutCustomer
};
