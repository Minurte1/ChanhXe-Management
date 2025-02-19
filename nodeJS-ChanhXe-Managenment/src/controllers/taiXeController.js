const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả tài xế
const getAllDrivers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tai_xe");
    return res.status(200).json({ EM: "Lấy danh sách tài xế thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllDrivers:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy tài xế theo ID
const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM tai_xe WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ EM: "Không tìm thấy tài xế", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Lấy tài xế thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getDriverById:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới tài xế
const createDriver = async (req, res) => {
  try {
    const { nguoi_dung_id, bang_lai } = req.body;
    const [result] = await pool.query(
      `INSERT INTO tai_xe (nguoi_dung_id, bang_lai) VALUES (?, ?)`,
      [nguoi_dung_id, bang_lai]
    );
    return res.status(201).json({ EM: "Tạo tài xế thành công", EC: 1, DT: { id: result.insertId } });
  } catch (error) {
    console.error("Error in createDriver:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật tài xế
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const [result] = await pool.query(`UPDATE tai_xe SET ${fields} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy tài xế để cập nhật", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Cập nhật tài xế thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateDriver:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa tài xế
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM tai_xe WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy tài xế để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa tài xế thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteDriver:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver };