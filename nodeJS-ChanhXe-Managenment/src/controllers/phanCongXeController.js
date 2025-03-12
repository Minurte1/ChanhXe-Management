const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả phân công địa điểm xe
const getAllVehicleAssignments = async (req, res) => {
  try {
    const {
      id,
      id_ben,
      id_xe,
      id_nguoi_cap_nhat,
      ngay_tao,
      ngay_cap_nhat,
      trang_thai,
    } = req.query;

    let query = `
      SELECT 
        pcx.id_xe,
        xe.bien_so, xe.loai_xe, xe.suc_chua, xe.trang_thai, 
        xe.id_nguoi_cap_nhat AS xe_id_nguoi_cap_nhat, 
        xe.ngay_cap_nhat AS xe_ngay_cap_nhat, 
        xe.ngay_tao AS xe_ngay_tao,
        GROUP_CONCAT(DISTINCT bx.ten_ben_xe ORDER BY bx.ten_ben_xe SEPARATOR ', ') AS ben_xe,
        GROUP_CONCAT(DISTINCT bx.dia_chi ORDER BY bx.dia_chi SEPARATOR ', ') AS dia_chi_ben,
        GROUP_CONCAT(DISTINCT bx.tinh ORDER BY bx.tinh SEPARATOR ', ') AS tinh_ben,
        CASE 
          WHEN COUNT(DISTINCT bx.id) > 1 THEN true
          ELSE false
        END AS multiple_ben_xe
      FROM phan_cong_dia_diem_xe pcx
      JOIN ben_xe bx ON pcx.id_ben = bx.id
      JOIN xe ON pcx.id_xe = xe.id
      WHERE pcx.isDelete = FALSE
    `;

    let queryParams = [];

    if (id) {
      query += " AND pcx.id = ?";
      queryParams.push(id);
    }

    if (id_ben) {
      let idBenArray = Array.isArray(id_ben) ? id_ben : [id_ben];
      let placeholders = idBenArray.map(() => "?").join(",");
      query += ` AND pcx.id_ben IN (${placeholders})`;
      queryParams.push(...idBenArray);
    }

    if (id_xe) {
      query += " AND pcx.id_xe = ?";
      queryParams.push(id_xe);
    }

    if (id_nguoi_cap_nhat) {
      query += " AND pcx.id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat);
    }

    if (ngay_tao) {
      query += " AND DATE(pcx.ngay_tao) = ?";
      queryParams.push(ngay_tao);
    }

    if (ngay_cap_nhat) {
      query += " AND DATE(pcx.ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat);
    }

    if (trang_thai) {
      let trangThaiArray = Array.isArray(trang_thai)
        ? trang_thai
        : [trang_thai];
      let placeholders = trangThaiArray.map(() => "?").join(",");
      query += ` AND xe.trang_thai IN (${placeholders})`;
      queryParams.push(...trangThaiArray);
    }

    query += " GROUP BY pcx.id_xe ORDER BY xe.ngay_cap_nhat DESC";

    const [rows] = await pool.query(query, queryParams);

    return res.status(200).json({
      EM: "Lấy danh sách phân công thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllVehicleAssignments:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const getAllUnassignedVehicles = async (req, res) => {
  // #swagger.tags = ['Xe chưa phân công']
  try {
    let query = `
      SELECT 
        xe.id, xe.bien_so, xe.loai_xe, xe.suc_chua, xe.trang_thai, 
        xe.id_nguoi_cap_nhat, xe.ngay_cap_nhat, xe.ngay_tao
      FROM xe
      LEFT JOIN phan_cong_dia_diem_xe pcx 
        ON xe.id = pcx.id_xe AND pcx.isDelete = FALSE
      WHERE pcx.id IS NULL
      ORDER BY xe.ngay_cap_nhat DESC
    `;

    // Thực thi query
    const [rows] = await pool.query(query);

    return res.status(200).json({
      EM: "Lấy danh sách xe chưa phân công thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllUnassignedVehicles:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Lấy phân công theo ID
const getVehicleAssignmentById = async (req, res) => {
  // #swagger.tags = ['Phân công xe']
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM phan_cong_dia_diem_xe WHERE id = ?",
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

// Thêm mới phân công
const createVehicleAssignment = async (req, res) => {
  try {
    const { id_ben, id_xe, id_ben_2 } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;

    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    if (!id_ben || !id_xe) {
      return res
        .status(400)
        .json({ EM: "Thiếu thông tin bắt buộc", EC: -1, DT: {} });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Kiểm tra xem xe đã tồn tại chưa
      const [existingRecords] = await connection.query(
        `SELECT id FROM phan_cong_dia_diem_xe WHERE id_xe = ? AND isDelete = FALSE`,
        [id_xe]
      );

      if (existingRecords.length > 0) {
        // Nếu xe đã tồn tại, cập nhật isDelete = TRUE
        await connection.query(
          `UPDATE phan_cong_dia_diem_xe SET isDelete = TRUE, ngay_cap_nhat = NOW() WHERE id_xe = ?`,
          [id_xe]
        );
      }

      // Thêm mới phân công
      const query = `
        INSERT INTO phan_cong_dia_diem_xe (id_ben, id_xe, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat, isDelete)
        VALUES (?, ?, ?, NOW(), NOW(), FALSE), (?, ?, ?, NOW(), NOW(), FALSE)`;

      const values = [
        id_ben,
        id_xe,
        id_nguoi_cap_nhat,
        id_ben_2,
        id_xe,
        id_nguoi_cap_nhat,
      ];

      const [result] = await connection.query(query, values);

      await connection.commit();
      connection.release();

      return res.status(201).json({
        EM: "Tạo phân công thành công",
        EC: 1,
        DT: { id: result.insertId },
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("Error in createVehicleAssignment:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật phân công
const updateVehicleAssignment = async (req, res) => {
  // #swagger.tags = ['Phân công xe']
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

    const updateQuery = `UPDATE phan_cong_dia_diem_xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
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
const deleteVehicleAssignment = async (req, res) => {
  // #swagger.tags = ['Phân công xe']
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM phan_cong_dia_diem_xe WHERE id = ?",
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
  getAllVehicleAssignments,
  getVehicleAssignmentById,
  createVehicleAssignment,
  updateVehicleAssignment,
  deleteVehicleAssignment,

  //
  getAllUnassignedVehicles, // Xe chưa được phân công
};
