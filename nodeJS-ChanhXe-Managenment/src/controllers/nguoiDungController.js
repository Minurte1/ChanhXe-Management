const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM nguoi_dung");
    return res.status(200).json({ EM: "Lấy danh sách người dùng thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM nguoi_dung WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ EM: "Không tìm thấy người dùng", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Lấy người dùng thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới người dùng
const createUser = async (req, res) => {
  try {
    const { ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai } = req.body;
    const [result] = await pool.query(
      `INSERT INTO nguoi_dung (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai) VALUES (?, ?, ?, ?, ?, ?)`,
      [ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai]
    );
    return res.status(201).json({ EM: "Tạo người dùng thành công", EC: 1, DT: { id: result.insertId } });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const [result] = await pool.query(`UPDATE nguoi_dung SET ${fields} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy người dùng để cập nhật", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Cập nhật người dùng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM nguoi_dung WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy người dùng để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa người dùng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };