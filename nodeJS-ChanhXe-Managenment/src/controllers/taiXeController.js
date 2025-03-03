const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả tài xế
const getAllDrivers = async (req, res) => {
  try {
    const {
      id,
      ho_ten,
      so_dien_thoai,
      email,
      vai_tro,
      trang_thai,
      id_nguoi_cap_nhat_nguoi_dung,
      ngay_cap_nhat_nguoi_dung,
      ngay_tao_nguoi_dung,
      nguoi_dung_id,
      bang_lai,
      id_nguoi_cap_nhat_tai_xe,
      ngay_cap_nhat_tai_xe,
      ngay_tao_tai_xe,
      trang_thai_tai_xe,
    } = req.query;

    // Query cơ bản với INNER JOIN, lấy từ tai_xe làm gốc
    let query = `
      SELECT 
        nguoi_dung.id AS nguoi_dung_id, 
        nguoi_dung.ho_ten, 
        nguoi_dung.so_dien_thoai, 
        nguoi_dung.email, 
        nguoi_dung.vai_tro, 
        nguoi_dung.trang_thai, 
        nguoi_dung.id_nguoi_cap_nhat AS id_nguoi_cap_nhat_nguoi_dung, 
        nguoi_dung.ngay_cap_nhat AS ngay_cap_nhat_nguoi_dung, 
        nguoi_dung.ngay_tao AS ngay_tao_nguoi_dung,
        tai_xe.id AS tai_xe_id, 
        tai_xe.bang_lai,
           tai_xe.trang_thai,  
        tai_xe.id_nguoi_cap_nhat AS id_nguoi_cap_nhat_tai_xe, 
        tai_xe.ngay_cap_nhat AS ngay_cap_nhat_tai_xe, 
        tai_xe.ngay_tao AS ngay_tao_tai_xe
      FROM tai_xe
      INNER JOIN nguoi_dung ON tai_xe.nguoi_dung_id = nguoi_dung.id
      WHERE 1=1
    `;
    let queryParams = [];

    // Thêm điều kiện tìm kiếm dynamic
    if (id) {
      query += " AND nguoi_dung.id = ?";
      queryParams.push(id);
    }
    if (ho_ten) {
      query += " AND nguoi_dung.ho_ten LIKE ?";
      queryParams.push(`%${ho_ten}%`);
    }
    if (so_dien_thoai) {
      query += " AND nguoi_dung.so_dien_thoai = ?";
      queryParams.push(so_dien_thoai);
    }
    if (email) {
      query += " AND nguoi_dung.email LIKE ?";
      queryParams.push(`%${email}%`);
    }
    if (vai_tro) {
      const roles = Array.isArray(vai_tro) ? vai_tro : vai_tro.split(",");
      query +=
        " AND nguoi_dung.vai_tro IN (" + roles.map(() => "?").join(",") + ")";
      queryParams.push(...roles);
    }
    if (trang_thai) {
      query += " AND nguoi_dung.trang_thai = ?";
      queryParams.push(trang_thai);
    }
    if (id_nguoi_cap_nhat_nguoi_dung) {
      query += " AND nguoi_dung.id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat_nguoi_dung);
    }
    if (ngay_cap_nhat_nguoi_dung) {
      query += " AND DATE(nguoi_dung.ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat_nguoi_dung);
    }
    if (ngay_tao_nguoi_dung) {
      query += " AND DATE(nguoi_dung.ngay_tao) = ?";
      queryParams.push(ngay_tao_nguoi_dung);
    }
    if (nguoi_dung_id) {
      query += " AND tai_xe.nguoi_dung_id = ?";
      queryParams.push(nguoi_dung_id);
    }
    if (bang_lai) {
      query += " AND tai_xe.bang_lai = ?";
      queryParams.push(bang_lai);
    }
    if (id_nguoi_cap_nhat_tai_xe) {
      query += " AND tai_xe.id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat_tai_xe);
    }
    if (ngay_cap_nhat_tai_xe) {
      query += " AND DATE(tai_xe.ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat_tai_xe);
    }
    if (ngay_tao_tai_xe) {
      query += " AND DATE(tai_xe.ngay_tao) = ?";
      queryParams.push(ngay_tao_tai_xe);
    }
    if (trang_thai_tai_xe) {
      query += " AND tai_xe.trang_thai = ?";
      queryParams.push(trang_thai_tai_xe);
    }

    // Sắp xếp theo ngày cập nhật của tai_xe (hoặc nguoi_dung nếu muốn)
    query += " ORDER BY tai_xe.ngay_cap_nhat DESC";

    // Thực thi query
    const [rows] = await pool.query(query, queryParams);

    return res.status(200).json({
      EM: "Lấy danh sách tài xế thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllDrivers:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Lấy tài xế theo ID
const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM tai_xe WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy tài xế", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy tài xế thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getDriverById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới tài xế
const createDriver = async (req, res) => {
  try {
    const { nguoi_dung_id, bang_lai, trang_thai } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }
    const [result] = await pool.query(
      `INSERT INTO tai_xe (nguoi_dung_id, bang_lai, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat, trang_thai) 
       VALUES (?, ?, ?, NOW(), NOW()),?`,
      [nguoi_dung_id, bang_lai, id_nguoi_cap_nhat, trang_thai]
    );

    return res.status(201).json({
      EM: "Tạo tài xế thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createDriver:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật tài xế
const updateDriver = async (req, res) => {
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

    const updateQuery = `UPDATE tai_xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
    values.push(id_nguoi_cap_nhat, id);

    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy tài xế để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật tài xế thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateDriver:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa tài xế
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM tai_xe WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy tài xế để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa tài xế thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteDriver:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
