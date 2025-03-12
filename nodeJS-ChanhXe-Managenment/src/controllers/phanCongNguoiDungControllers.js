const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả phân công địa điểm người dùng
const getAllUserAssignments = async (req, res) => {
  // #swagger.tags = ['Phân công người dùng']
  try {
    const [rows] = await pool.query(
      "SELECT * FROM phan_cong_dia_diem_nguoi_dung"
    );
    return res
      .status(200)
      .json({ EM: "Lấy danh sách phân công thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllAssignments:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy phân công theo ID
const getUserAssignmentById = async (req, res) => {
  // #swagger.tags = ['Phân công người dùng']
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM phan_cong_dia_diem_nguoi_dung WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy phân công", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy phân công thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getAssignmentById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Phân cong địa điểm cho người dùng
const createUserAssignment = async (req, res) => {
  // #swagger.tags = ['Phân công người dùng']
  try {
    const { id_ben, id_nguoi_dung } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    if (!id_ben || !id_nguoi_dung) {
      return res
        .status(400)
        .json({ EM: "Thiếu thông tin bắt buộc", EC: -1, DT: {} });
    }

    // Kiểm tra xem id_nguoi_dung đã tồn tại chưa
    const [existingRows] = await pool.query(
      "SELECT id FROM phan_cong_dia_diem_nguoi_dung WHERE id_nguoi_dung = ? AND isDelete = false",
      [id_nguoi_dung]
    );

    if (existingRows.length > 0) {
      // Nếu đã tồn tại, cập nhật isDelete thành true
      await pool.query(
        "UPDATE phan_cong_dia_diem_nguoi_dung SET isDelete = true, id_nguoi_cap_nhat = ?, ngay_cap_nhat = NOW() WHERE id_nguoi_dung = ?",
        [id_nguoi_cap_nhat, id_nguoi_dung]
      );
    }

    // Thêm mới phân công
    const [result] = await pool.query(
      "INSERT INTO phan_cong_dia_diem_nguoi_dung (id_ben, id_nguoi_dung, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat, isDelete) VALUES (?, ?, ?, NOW(), NOW(), false)",
      [id_ben, id_nguoi_dung, id_nguoi_cap_nhat]
    );

    return res.status(201).json({
      EM: "Tạo phân công thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createUserAssignment:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật phân công
const updateUserAssignment = async (req, res) => {
  // #swagger.tags = ['Phân công người dùng']
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

    const updateQuery = `UPDATE phan_cong_dia_diem_nguoi_dung SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy phân công để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật phân công thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateAssignment:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa phân công
const deleteUserAssignment = async (req, res) => {
  // #swagger.tags = ['Phân công người dùng']
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM phan_cong_dia_diem_nguoi_dung WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy phân công để xóa", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Xóa phân công thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteAssignment:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllUserAssignments,
  getUserAssignmentById,
  createUserAssignment,
  updateUserAssignment,
  deleteUserAssignment,
};
