const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả xe
const getAllVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM xe");
    return res
      .status(200)
      .json({ EM: "Lấy danh sách xe thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllVehicles:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy xe theo ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM xe WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ EM: "Không tìm thấy xe", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy xe thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getVehicleById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới xe
const createVehicle = async (req, res) => {
  try {
    const { bien_so, loai_xe, suc_chua, trang_thai } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }
    const [result] = await pool.query(
      `INSERT INTO xe (bien_so, loai_xe, suc_chua, trang_thai, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [bien_so, loai_xe, suc_chua, trang_thai, id_nguoi_cap_nhat]
    );

    return res
      .status(201)
      .json({ EM: "Tạo xe thành công", EC: 1, DT: { id: result.insertId } });
  } catch (error) {
    console.error("Error in createVehicle:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật xe
const updateVehicle = async (req, res) => {
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

    // Tạo danh sách cập nhật, thêm `ngay_cap_nhat = NOW()` và `id_nguoi_cap_nhat`
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);

    // Thêm `ngay_cap_nhat` và `id_nguoi_cap_nhat`
    const updateQuery = `UPDATE xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
    values.push(id_nguoi_cap_nhat, id);

    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy xe để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật xe thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateVehicle:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa xe
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM xe WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy xe để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa xe thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteVehicle:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
