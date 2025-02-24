const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả địa điểm
const getAllLocations = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM dia_diem");
    return res
      .status(200)
      .json({ EM: "Lấy danh sách địa điểm thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllLocations:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy địa điểm theo ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM dia_diem WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy địa điểm", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy địa điểm thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getLocationById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới địa điểm
const createLocation = async (req, res) => {
  try {
    const { tinh, huyen, xa } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }
    const [result] = await pool.query(
      `INSERT INTO dia_diem (tinh, huyen, xa, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [tinh, huyen, xa, id_nguoi_cap_nhat]
    );

    return res
      .status(201)
      .json({
        EM: "Tạo địa điểm thành công",
        EC: 1,
        DT: { id: result.insertId },
      });
  } catch (error) {
    console.error("Error in createLocation:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật địa điểm
const updateLocation = async (req, res) => {
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

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);

    const updateQuery = `UPDATE dia_diem SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
    values.push(id_nguoi_cap_nhat, id);

    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy địa điểm để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật địa điểm thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateLocation:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa địa điểm
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM dia_diem WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy địa điểm để xóa", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Xóa địa điểm thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteLocation:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
