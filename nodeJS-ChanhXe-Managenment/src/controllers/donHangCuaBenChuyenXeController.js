const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả bản ghi
const getAllRecords = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM don_hang_cua_ben_chuyen_xe");
    return res.status(200).json({ EM: "Lấy danh sách thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllRecords:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy bản ghi theo ID
const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM don_hang_cua_ben_chuyen_xe WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ EM: "Không tìm thấy bản ghi", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Lấy bản ghi thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getRecordById:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới bản ghi
const createRecord = async (req, res) => {
  try {
    const { don_hang_cua_ben_id, don_hang_chuyen_xe_id } = req.body;
    const [result] = await pool.query(
      `INSERT INTO don_hang_cua_ben_chuyen_xe (don_hang_cua_ben_id, don_hang_chuyen_xe_id) VALUES (?, ?)`,
      [don_hang_cua_ben_id, don_hang_chuyen_xe_id]
    );
    return res.status(201).json({ EM: "Tạo bản ghi thành công", EC: 1, DT: { id: result.insertId } });
  } catch (error) {
    console.error("Error in createRecord:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật bản ghi
const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const [result] = await pool.query(`UPDATE don_hang_cua_ben_chuyen_xe SET ${fields} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy bản ghi để cập nhật", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Cập nhật bản ghi thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateRecord:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa bản ghi
const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM don_hang_cua_ben_chuyen_xe WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy bản ghi để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa bản ghi thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteRecord:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };