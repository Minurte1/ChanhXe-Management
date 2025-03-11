const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả xe với search động kèm thông tin bến xe
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

    let query = `
      SELECT 
        xe.id,
        xe.bien_so,
        xe.loai_xe,
        xe.suc_chua,
        xe.trang_thai,
        xe.id_nguoi_cap_nhat,
        xe.ngay_cap_nhat,
        xe.ngay_tao,
        pcdx.id AS id_phan_cong,
        pcdx.id_ben,
        pcdx.ngay_tao AS ngay_phan_cong,
        pcdx.ngay_cap_nhat AS ngay_cap_nhat_phan_cong,
        ben_xe.ten_ben_xe,
        ben_xe.dia_chi,
        ben_xe.tinh,
        ben_xe.huyen,
        ben_xe.xa
      FROM xe
      LEFT JOIN phan_cong_dia_diem_xe pcdx ON xe.id = pcdx.id_xe
      LEFT JOIN ben_xe ON pcdx.id_ben = ben_xe.id
      WHERE 1=1
    `;
    let queryParams = [];

    // Thêm điều kiện tìm kiếm động
    if (id) {
      query += " AND xe.id = ?";
      queryParams.push(id);
    }
    if (bien_so) {
      query += " AND xe.bien_so LIKE ?";
      queryParams.push(`%${bien_so}%`);
    }
    if (loai_xe) {
      query += " AND xe.loai_xe = ?";
      queryParams.push(loai_xe);
    }
    if (suc_chua) {
      query += " AND xe.suc_chua = ?";
      queryParams.push(suc_chua);
    }
    if (trang_thai) {
      const trangThaiList = Array.isArray(trang_thai)
        ? trang_thai
        : trang_thai.split(",");
      query += ` AND xe.trang_thai IN (${trangThaiList
        .map(() => "?")
        .join(",")})`;
      queryParams.push(...trangThaiList);
    }

    // if (trang_thai) {
    //   query += " AND xe.trang_thai = ?";
    //   queryParams.push(trang_thai);
    // }
    if (id_nguoi_cap_nhat) {
      query += " AND xe.id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat);
    }
    if (ngay_cap_nhat) {
      query += " AND DATE(xe.ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat);
    }
    if (ngay_tao) {
      query += " AND DATE(xe.ngay_tao) = ?";
      queryParams.push(ngay_tao);
    }

    // Sắp xếp theo ngày cập nhật mới nhất
    query += " ORDER BY xe.ngay_cap_nhat DESC";

    // Thực thi truy vấn
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

    if (!bien_so || !loai_xe || !suc_chua || !trang_thai) {
      return res
        .status(400)
        .json({ EM: "Thiếu thông tin cần thiết", EC: -1, DT: {} });
    }

    // Kiểm tra xem biển số đã tồn tại chưa
    const [existingBienSo] = await pool.query(
      `SELECT id FROM xe WHERE bien_so = ? LIMIT 1`,
      [bien_so]
    );

    if (existingBienSo.length > 0) {
      return res.status(400).json({
        EM: "Biển số xe đã tồn tại",
        EC: -1,
        DT: {},
      });
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

    // Danh sách các trường hợp lệ trong bảng `xe`
    const validFields = [
      "bien_so",
      "loai_xe",
      "suc_chua",
      "trang_thai",
      "id_nguoi_cap_nhat",
      "ngay_cap_nhat",
      "ngay_tao",
    ];

    // Lọc các trường cập nhật hợp lệ
    const filteredUpdates = Object.keys(updates)
      .filter((key) => validFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    if (Object.keys(filteredUpdates).length === 0) {
      return res
        .status(400)
        .json({ EM: "Không có trường hợp lệ để cập nhật", EC: -1, DT: {} });
    }

    // Tạo danh sách cập nhật, thêm `ngay_cap_nhat = NOW()` và `id_nguoi_cap_nhat`
    const fields = Object.keys(filteredUpdates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(filteredUpdates);

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
    console.log("id", id);
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
        const { id } = req.params;
        await pool.query("UPDATE xe SET trang_thai = 'da_xoa' WHERE id = ?", [
          id,
        ]);
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
