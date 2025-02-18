const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả doanh thu
const getAllRevenues = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM doanh_thu");
    return res.status(200).json({ EM: "Lấy danh sách doanh thu thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllRevenues:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy doanh thu theo ID
const getRevenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM doanh_thu WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ EM: "Không tìm thấy doanh thu", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Lấy doanh thu thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getRevenueById:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới doanh thu
const createRevenue = async (req, res) => {
  try {
    const { ngay, doanh_thu } = req.body;
    const [result] = await pool.query(
      `INSERT INTO doanh_thu (ngay, doanh_thu) VALUES (?, ?)`,
      [ngay, doanh_thu]
    );
    return res.status(201).json({ EM: "Tạo doanh thu thành công", EC: 1, DT: { id: result.insertId } });
  } catch (error) {
    console.error("Error in createRevenue:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật doanh thu
const updateRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const [result] = await pool.query(`UPDATE doanh_thu SET ${fields} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy doanh thu để cập nhật", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Cập nhật doanh thu thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateRevenue:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa doanh thu
const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM doanh_thu WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy doanh thu để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa doanh thu thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteRevenue:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = { getAllRevenues, getRevenueById, createRevenue, updateRevenue, deleteRevenue };