const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả xe với search động
const getAllVehicles = async (req, res) => {
  // #swagger.tags = ['Xe']
  try {
    const {
      id,
      bien_so,
      loai_xe,
      suc_chua,
      trang_thai,
      id_nguoi_cap_nhat,
      ngay_cap_nhat,
      ngay_tao,
    } = req.query;

    // Query cơ bản
    let query = `
      SELECT 
        id,
        bien_so,
        loai_xe,
        suc_chua,
        trang_thai,
        id_nguoi_cap_nhat,
        ngay_cap_nhat,
        ngay_tao
      FROM xe
      WHERE 1=1
    `;
    let queryParams = [];

    // Thêm điều kiện tìm kiếm động
    if (id) {
      query += " AND id = ?";
      queryParams.push(id);
    }
    if (bien_so) {
      query += " AND bien_so LIKE ?";
      queryParams.push(`%${bien_so}%`);
    }
    if (loai_xe) {
      query += " AND loai_xe = ?";
      queryParams.push(loai_xe);
    }
    if (suc_chua) {
      query += " AND suc_chua = ?";
      queryParams.push(suc_chua);
    }
    if (trang_thai) {
      query += " AND trang_thai = ?";
      queryParams.push(trang_thai);
    }
    if (id_nguoi_cap_nhat) {
      query += " AND id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat);
    }
    if (ngay_cap_nhat) {
      query += " AND DATE(ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat);
    }
    if (ngay_tao) {
      query += " AND DATE(ngay_tao) = ?";
      queryParams.push(ngay_tao);
    }

    // Sắp xếp theo ngày cập nhật (tùy chọn)
    query += " ORDER BY ngay_cap_nhat DESC";

    // Thực thi query
    const [rows] = await pool.query(query, queryParams);

    return res.status(200).json({
      EM: "Lấy danh sách xe thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllVehicles:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Lấy xe theo ID
const getVehicleById = async (req, res) => {
  // #swagger.tags = ['Xe']
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
  // #swagger.tags = ['Xe']
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
  // #swagger.tags = ['Xe']
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

// Xóa xe (Nếu vướng khóa ngoại thì cập nhật trạng_thai thành 'ngung_hoat_dong')
const deleteVehicle = async (req, res) => {
  // #swagger.tags = ['Xe']
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

    // Kiểm tra lỗi liên quan đến khóa ngoại (ER_ROW_IS_REFERENCED_2 trong MySQL)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      try {
        await pool.query(
          "UPDATE xe SET trang_thai = 'ngung_hoat_dong' WHERE id = ?",
          [id]
        );
        return res.status(200).json({
          EM: "Xe có liên kết dữ liệu, đã cập nhật trạng thái ngừng hoạt động",
          EC: 1,
          DT: {},
        });
      } catch (updateError) {
        console.error("Error updating vehicle status:", updateError);
        return res
          .status(500)
          .json({ EM: "Lỗi khi cập nhật trạng thái xe", EC: -1, DT: {} });
      }
    }

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
