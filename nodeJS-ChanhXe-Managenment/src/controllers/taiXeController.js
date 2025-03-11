const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả tài xế
const getAllDrivers = async (req, res) => {
  // #swagger.tags = ['Tài xế']
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

    // Query cơ bản với INNER JOIN và LEFT JOIN
    let query = `
  SELECT 
    tai_xe.id AS tai_xe_id,
    tai_xe.bang_lai,
    tai_xe.trang_thai ,
    tai_xe.id_nguoi_cap_nhat AS id_nguoi_cap_nhat_tai_xe,
    tai_xe.ngay_cap_nhat AS ngay_cap_nhat_tai_xe,
    tai_xe.ngay_tao AS ngay_tao_tai_xe,

    nguoi_dung.id AS nguoi_dung_id,
    nguoi_dung.ho_ten,
    nguoi_dung.so_dien_thoai,
    nguoi_dung.email,
    nguoi_dung.vai_tro,
    nguoi_dung.trang_thai AS trang_thai_nguoi_dung,


    phan_cong_dia_diem_tai_xe.id AS phan_cong_id,
    phan_cong_dia_diem_tai_xe.id_ben,
    phan_cong_dia_diem_tai_xe.id_tai_xe,


    ben_xe.id AS ben_xe_id,
    ben_xe.dia_chi,
    ben_xe.ten_ben_xe,
    ben_xe.tinh,
    ben_xe.huyen,
    ben_xe.xa


  FROM tai_xe
  INNER JOIN nguoi_dung ON tai_xe.nguoi_dung_id = nguoi_dung.id
  LEFT JOIN phan_cong_dia_diem_tai_xe ON tai_xe.id = phan_cong_dia_diem_tai_xe.id_tai_xe
  LEFT JOIN ben_xe ON phan_cong_dia_diem_tai_xe.id_ben = ben_xe.id
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
      const trangThaiArr = Array.isArray(trang_thai_tai_xe)
        ? trang_thai_tai_xe
        : trang_thai_tai_xe.split(",");
      query += ` AND tai_xe.trang_thai IN (${trangThaiArr
        .map(() => "?")
        .join(",")})`;
      queryParams.push(...trangThaiArr);
    }

    // Sắp xếp theo ngày cập nhật của tai_xe
    query += " ORDER BY tai_xe.ngay_cap_nhat DESC";
    console.log("query", query);
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

const getDriverLichTrinh = async (req, res) => {
  // #swagger.tags = ['Tài xế']
  try {
    const { id } = req.params;
    console.log("userId", id);

    let query = `
      SELECT 
        cx.id AS chuyen_xe_id,
        cx.thoi_gian_xuat_ben,
        cx.thoi_gian_cap_ben,
        cx.trang_thai,
        cx.ngay_tao AS chuyen_xe_ngay_tao,
        cx.ngay_cap_nhat AS chuyen_xe_ngay_cap_nhat,

        -- Thông tin xe
        xe.bien_so,
        xe.loai_xe,
        xe.suc_chua,

        -- Thông tin tài xế chính
        tx.bang_lai,
        tx.trang_thai AS trang_thai_tai_xe,
        nd.ho_ten AS ten_tai_xe,
        nd.so_dien_thoai,
        nd.email,

        -- Thông tin tài xế phụ
        tx_phu.bang_lai AS bang_lai_phu,
        tx_phu.trang_thai AS trang_thai_tai_xe_phu,
        nd_phu.so_dien_thoai as so_dien_thoai_tai_xe_phu,
        nd_phu.ho_ten AS ten_tai_xe_phu,

        -- Thông tin bến xe xuất phát
        bx_gui.ten_ben_xe AS ben_xe_xuat_phat,
        bx_gui.dia_chi AS dia_chi_ben_xe_xuat_phat,

        -- Thông tin bến xe đích
        bx_nhan.ten_ben_xe AS ben_xe_dich,
        bx_nhan.dia_chi AS dia_chi_ben_xe_dich

      FROM chuyen_xe cx
      JOIN tai_xe tx ON cx.tai_xe_id = tx.id
      JOIN nguoi_dung nd ON tx.nguoi_dung_id = nd.id
      JOIN xe ON cx.xe_id = xe.id

      -- Thông tin tài xế phụ
      LEFT JOIN tai_xe tx_phu ON cx.tai_xe_phu_id = tx_phu.id
      LEFT JOIN nguoi_dung nd_phu ON tx_phu.nguoi_dung_id = nd_phu.id

      -- Join với bảng bến xe
      LEFT JOIN ben_xe bx_gui ON cx.id_ben_xe_gui = bx_gui.id
      LEFT JOIN ben_xe bx_nhan ON cx.id_ben_xe_nhan = bx_nhan.id
    `;

    let params = [];

    if (id) {
      query += ` WHERE nd.id = ? OR nd_phu.id = ?`;
      params = [id, id];
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy lịch trình", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Lấy lịch trình thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getDriverById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới tài xế
const createDriver = async (req, res) => {
  // #swagger.tags = ['Tài xế']
  try {
    const { nguoi_dung_id, bang_lai, trang_thai } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    if (!nguoi_dung_id || !bang_lai || !trang_thai) {
      return res
        .status(400)
        .json({ EM: "Thiếu thông tin cần thiết", EC: -1, DT: {} });
    }

    const [result] = await pool.query(
      `INSERT INTO tai_xe (nguoi_dung_id, bang_lai, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat, trang_thai) 
       VALUES (?, ?, ?, NOW(), NOW(), ?)`,
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
  // #swagger.tags = ['Tài xế']
  try {
    const { id } = req.params;
    const updates = req.body;
    const id_nguoi_cap_nhat = req.user?.id;

    // Kiểm tra quyền thực hiện
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    // Kiểm tra dữ liệu cập nhật
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }

    // Danh sách các trường hợp lệ trong bảng tai_xe
    const validFields = ["nguoi_dung_id", "bang_lai", "trang_thai"];

    // Lọc các trường hợp lệ từ dữ liệu được truyền vào
    const filteredUpdates = {};
    for (const key of validFields) {
      if (updates.hasOwnProperty(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    // Kiểm tra nếu không có trường hợp lệ nào
    if (Object.keys(filteredUpdates).length === 0) {
      return res
        .status(400)
        .json({ EM: "Không có trường hợp lệ để cập nhật", EC: -1, DT: {} });
    }

    // Tạo câu lệnh SQL động
    const fields = Object.keys(filteredUpdates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(filteredUpdates);

    // Thêm id_nguoi_cap_nhat và id vào cuối mảng values
    values.push(id_nguoi_cap_nhat, id);

    const updateQuery = `UPDATE tai_xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;

    // Thực thi truy vấn
    const [result] = await pool.query(updateQuery, values);

    // Kiểm tra xem có bản ghi nào được cập nhật không
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy tài xế để cập nhật", EC: -1, DT: {} });
    }

    // Trả về kết quả thành công
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
  // #swagger.tags = ['Tài xế']
  try {
    const { id } = req.params;

    // Bắt đầu một transaction để đảm bảo tính toàn vẹn dữ liệu
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Thử xóa tài xế
      const [deleteResult] = await connection.query(
        "DELETE FROM tai_xe WHERE id = ?",
        [id]
      );

      if (deleteResult.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return res
          .status(404)
          .json({ EM: "Không tìm thấy tài xế để xóa", EC: -1, DT: {} });
      }

      // Nếu xóa thành công, commit transaction
      await connection.commit();
      connection.release();
      return res
        .status(200)
        .json({ EM: "Xóa tài xế thành công", EC: 1, DT: {} });
    } catch (deleteError) {
      // Nếu lỗi do ràng buộc khóa ngoại (error code 1451 trong MySQL)
      if (deleteError.errno === 1451) {
        // Cập nhật trạng thái thành ngung_hoat_dong
        const [updateResult] = await connection.query(
          "UPDATE tai_xe SET trang_thai = 'da_xoa' WHERE id = ?",
          [id]
        );

        if (updateResult.affectedRows === 0) {
          await connection.rollback();
          connection.release();
          return res
            .status(404)
            .json({ EM: "Không tìm thấy tài xế để cập nhật", EC: -1, DT: {} });
        }

        await connection.commit();
        connection.release();
        return res.status(200).json({
          EM: "Tài xế đang được sử dụng, đã cập nhật trạng thái thành ngừng hoạt động",
          EC: 1,
          DT: {},
        });
      }

      // Nếu là lỗi khác, throw lại để xử lý ở catch ngoài
      throw deleteError;
    }
  } catch (error) {
    console.error("Error in deleteDriver:", error);
    // Đảm bảo connection được release nếu còn trong pool
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Lấy danh sách người dùng chưa thêm vào vai trò tài xế
const getUsersNotInDriverTable = async (req, res) => {
  // #swagger.tags = ['Tài xế']
  try {
    // Truy vấn SQL để lấy danh sách người dùng có vai trò là tai_xe hoặc tai_xe_phu và chưa có trong bảng tai_xe
    const query = `
      SELECT nguoi_dung.* 
      FROM nguoi_dung
      LEFT JOIN tai_xe ON nguoi_dung.id = tai_xe.nguoi_dung_id
      WHERE tai_xe.nguoi_dung_id IS NULL
      AND (nguoi_dung.vai_tro = 'tai_xe' OR nguoi_dung.vai_tro = 'tai_xe_phu');
    `;

    // Thực thi truy vấn
    const [results] = await pool.query(query);

    // Trả về kết quả
    return res.status(200).json({
      EM: "Lấy danh sách người dùng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error in getUsersNotInDriverTable:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};
module.exports = {
  getAllDrivers,
  getDriverLichTrinh,
  createDriver,
  updateDriver,
  deleteDriver,
  getUsersNotInDriverTable,
};
