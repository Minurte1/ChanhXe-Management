const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả phân công địa điểm xe
const getAllVehicleAssignments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM phan_cong_dia_diem_xe");
    return res.status(200).json({ EM: "Lấy danh sách phân công thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllAssignments:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy phân công theo ID
const getVehicleAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM phan_cong_dia_diem_xe WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ EM: "Không tìm thấy phân công", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Lấy phân công thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getAssignmentById:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới phân công
const createVehicleAssignment = async (req, res) => {
  try {
    const { id_ben, id_xe } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res.status(403).json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }
    const [result] = await pool.query(
      "INSERT INTO phan_cong_dia_diem_xe (id_ben, id_xe, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?, NOW(), NOW())",
      [id_ben, id_xe, id_nguoi_cap_nhat]
    );

    return res.status(201).json({ EM: "Tạo phân công thành công", EC: 1, DT: { id: result.insertId } });
  } catch (error) {
    console.error("Error in createAssignment:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật phân công
const updateVehicleAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res.status(403).json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id_nguoi_cap_nhat, id);

    const updateQuery = `UPDATE phan_cong_dia_diem_xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy phân công để cập nhật", EC: -1, DT: {} });
    }

    return res.status(200).json({ EM: "Cập nhật phân công thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateAssignment:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa phân công
const deleteVehicleAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM phan_cong_dia_diem_xe WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy phân công để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa phân công thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteAssignment:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllVehicleAssignments,
  getVehicleAssignmentById,
  createVehicleAssignment,
  updateVehicleAssignment,
  deleteVehicleAssignment,
};