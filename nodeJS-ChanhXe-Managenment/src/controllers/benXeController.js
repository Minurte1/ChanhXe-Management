const pool = require("../config/database");

// Lấy tất cả bến xe
const getAllBenXe = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ben_xe");
    return res
      .status(200)
      .json({ EM: "Lấy danh sách bến xe thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllBenXe:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy bến xe theo ID
const getBenXeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM ben_xe WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy bến xe", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy bến xe thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getBenXeById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới bến xe
const createBenXe = async (req, res) => {
  try {
    const { dia_chi, ten_ben_xe } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }
    const [result] = await pool.query(
      `INSERT INTO ben_xe (dia_chi, ten_ben_xe, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [dia_chi, ten_ben_xe, id_nguoi_cap_nhat]
    );

    return res.status(201).json({
      EM: "Tạo bến xe thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createBenXe:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật bến xe
const updateBenXe = async (req, res) => {
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
    values.push(id_nguoi_cap_nhat, id);

    const updateQuery = `UPDATE ben_xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy bến xe để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật bến xe thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateBenXe:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa bến xe
const deleteBenXe = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM ben_xe WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy bến xe để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa bến xe thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteBenXe:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllBenXe,
  getBenXeById,
  createBenXe,
  updateBenXe,
  deleteBenXe,
};
