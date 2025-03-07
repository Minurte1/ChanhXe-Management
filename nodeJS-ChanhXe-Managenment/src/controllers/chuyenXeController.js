const pool = require("../config/database"); // Kết nối cơ sở dữ liệu
const moment = require("moment");
// Lấy tất cả chuyến xe
const getAllTrips = async (req, res) => {
  // #swagger.tags = ['Chuyến xe']
  try {
    const { trang_thai } = req.query;
    let query = `
  SELECT 
    cx.id AS chuyen_xe_id,
    cx.xe_id,
    cx.thoi_gian_xuat_ben,
    cx.thoi_gian_cap_ben,
    cx.trang_thai ,
    cx.id_nguoi_cap_nhat AS cx_id_nguoi_cap_nhat,
    cx.ngay_cap_nhat AS cx_ngay_cap_nhat,
    cx.ngay_tao AS cx_ngay_tao,
    cx.id_ben_xe_nhan,
    cx.id_ben_xe_gui,

    -- Thông tin xe
    x.id AS xe_id_check,
    x.bien_so AS xe_bien_so,
    x.loai_xe AS xe_loai_xe,
    x.suc_chua AS xe_suc_chua,
    x.trang_thai AS xe_trang_thai,
    x.id_nguoi_cap_nhat AS x_id_nguoi_cap_nhat,

    -- Thông tin tài xế chính (tai_xe)
    tx.id AS tai_xe_id,
    tx.nguoi_dung_id AS tai_xe_nguoi_dung_id,
    tx.bang_lai AS tai_xe_bang_lai,
    tx.id_nguoi_cap_nhat AS tx_id_nguoi_cap_nhat,

    -- Thông tin người dùng của tài xế chính
    nd1.id AS tai_xe_nguoi_dung_id_check,
    nd1.ho_ten AS tai_xe_ho_ten,
    nd1.so_dien_thoai AS tai_xe_so_dien_thoai,
    nd1.email AS tai_xe_email,
    nd1.vai_tro AS tai_xe_vai_tro,
    nd1.trang_thai AS tai_xe_trang_thai,
    nd1.id_nguoi_cap_nhat AS nd1_id_nguoi_cap_nhat,

    -- Thông tin tài xế phụ (tai_xe_phu)
    txp.id AS tai_xe_phu_id,
    txp.nguoi_dung_id AS tai_xe_phu_nguoi_dung_id,
    txp.bang_lai AS tai_xe_phu_bang_lai,
    txp.id_nguoi_cap_nhat AS txp_id_nguoi_cap_nhat,

    -- Thông tin người dùng của tài xế phụ
    nd2.id AS tai_xe_phu_nguoi_dung_id_check,
    nd2.ho_ten AS tai_xe_phu_ho_ten,
    nd2.so_dien_thoai AS tai_xe_phu_so_dien_thoai,
    nd2.email AS tai_xe_phu_email,
    nd2.vai_tro AS tai_xe_phu_vai_tro,
    nd2.trang_thai AS tai_xe_phu_trang_thai,
    nd2.id_nguoi_cap_nhat AS nd2_id_nguoi_cap_nhat,

    -- Thông tin bến xe nhận
    bx_nhan.id AS ben_xe_nhan_id,
    bx_nhan.dia_chi AS ben_xe_nhan_dia_chi,
    bx_nhan.ten_ben_xe AS ben_xe_nhan_ten,
    bx_nhan.tinh AS ben_xe_nhan_tinh,
    bx_nhan.huyen AS ben_xe_nhan_huyen,
    bx_nhan.xa AS ben_xe_nhan_xa,
    bx_nhan.id_nguoi_cap_nhat AS bx_nhan_id_nguoi_cap_nhat,
    bx_nhan.ngay_tao AS bx_nhan_ngay_tao,
    bx_nhan.ngay_cap_nhat AS bx_nhan_ngay_cap_nhat,

    -- Thông tin bến xe gửi
    bx_gui.id AS ben_xe_gui_id,
    bx_gui.dia_chi AS ben_xe_gui_dia_chi,
    bx_gui.ten_ben_xe AS ben_xe_gui_ten,
    bx_gui.tinh AS ben_xe_gui_tinh,
    bx_gui.huyen AS ben_xe_gui_huyen,
    bx_gui.xa AS ben_xe_gui_xa,
    bx_gui.id_nguoi_cap_nhat AS bx_gui_id_nguoi_cap_nhat,
    bx_gui.ngay_tao AS bx_gui_ngay_tao,
    bx_gui.ngay_cap_nhat AS bx_gui_ngay_cap_nhat

  FROM chuyen_xe cx 
  LEFT JOIN xe x ON cx.xe_id = x.id
  LEFT JOIN tai_xe tx ON cx.tai_xe_id = tx.id
  LEFT JOIN nguoi_dung nd1 ON tx.nguoi_dung_id = nd1.id
  LEFT JOIN tai_xe txp ON cx.tai_xe_phu_id = txp.id
  LEFT JOIN nguoi_dung nd2 ON txp.nguoi_dung_id = nd2.id
  LEFT JOIN ben_xe bx_nhan ON cx.id_ben_xe_nhan = bx_nhan.id
  LEFT JOIN ben_xe bx_gui ON cx.id_ben_xe_gui = bx_gui.id
  
`;

    const params = [];

    if (trang_thai) {
      const trangThaiArray = Array.isArray(trang_thai)
        ? trang_thai
        : [trang_thai];
      query += ` WHERE cx.trang_thai IN (${trangThaiArray
        .map(() => "?")
        .join(", ")})`;
      params.push(...trangThaiArray);
    }

    query += ` ORDER BY cx.ngay_cap_nhat DESC`;

    const [rows] = await pool.query(query, params);

    return res.status(200).json({
      EM: "Lấy danh sách chuyến xe thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllTrips:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Lấy chuyến xe theo ID
const getTripById = async (req, res) => {
  // #swagger.tags = ['Chuyến xe']
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM chuyen_xe WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy chuyến xe", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy chuyến xe thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getTripById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới chuyến xe
const createTrip = async (req, res) => {
  // #swagger.tags = ['Chuyến xe']
  try {
    const {
      xe_id,
      tai_xe_id,
      tai_xe_phu_id,
      thoi_gian_xuat_ben,
      thoi_gian_cap_ben,
      trang_thai,
      id_ben_xe_nhan,
      id_ben_xe_gui,
    } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;

    // Kiểm tra quyền thực hiện
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    // Định dạng thời gian xuất bến
    const thoiGianXuatBen = moment(thoi_gian_xuat_ben).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    // Xử lý thời gian cập bến: nếu là chuỗi rỗng hoặc không hợp lệ, gán giá trị NULL
    let thoiGianCapBen = null;
    if (thoi_gian_cap_ben && moment(thoi_gian_cap_ben).isValid()) {
      thoiGianCapBen = moment(thoi_gian_cap_ben).format("YYYY-MM-DD HH:mm:ss");
    }

    // Thực thi truy vấn SQL
    const [result] = await pool.query(
      `INSERT INTO chuyen_xe (xe_id, tai_xe_id, tai_xe_phu_id, thoi_gian_xuat_ben, thoi_gian_cap_ben, trang_thai, id_ben_xe_nhan, id_ben_xe_gui, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        xe_id,
        tai_xe_id,
        tai_xe_phu_id,
        thoiGianXuatBen,
        thoiGianCapBen,
        trang_thai,
        id_ben_xe_nhan,
        id_ben_xe_gui,
        id_nguoi_cap_nhat,
      ]
    );

    // Trả về kết quả thành công
    return res.status(201).json({
      EM: "Tạo chuyến xe thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createTrip:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};
// Cập nhật chuyến xe

const updateTrip = async (req, res) => {
  // #swagger.tags = ['Chuyến xe']
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

    // Danh sách các trường được phép cập nhật
    const allowedFields = [
      "xe_id",
      "tai_xe",
      "tai_xe_phu_id",
      "thoi_gian_xuat_ben",
      "thoi_gian_cap_ben",
      "trang_thai",
      "id_ben_xe_nhan",
      "id_ben_xe_gui",
    ];

    // Lọc các trường cập nhật hợp lệ
    const validUpdates = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        // Xử lý trường hợp giá trị là null
        if (updates[key] === null) {
          validUpdates[key] = null; // Giữ nguyên giá trị null
        } else if (
          key === "thoi_gian_xuat_ben" ||
          key === "thoi_gian_cap_ben"
        ) {
          // Chuyển đổi định dạng thời gian nếu giá trị không phải null
          validUpdates[key] = moment(updates[key]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          validUpdates[key] = updates[key];
        }
      }
    }

    // Kiểm tra nếu không có trường hợp lệ nào
    if (Object.keys(validUpdates).length === 0) {
      return res
        .status(400)
        .json({ EM: "Không có trường hợp lệ để cập nhật", EC: -1, DT: {} });
    }

    // Xây dựng câu lệnh SQL động
    const fields = Object.keys(validUpdates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(validUpdates);

    // Thêm id_nguoi_cap_nhat và id vào mảng giá trị
    values.push(id_nguoi_cap_nhat, id);

    // Câu lệnh SQL cập nhật
    const updateQuery = `
      UPDATE chuyen_xe 
      SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? 
      WHERE id = ?
    `;

    // Thực thi câu lệnh SQL
    const [result] = await pool.query(updateQuery, values);

    // Kiểm tra kết quả cập nhật
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy chuyến xe để cập nhật", EC: -1, DT: {} });
    }

    // Trả về kết quả thành công
    return res
      .status(200)
      .json({ EM: "Cập nhật chuyến xe thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateTrip:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa chuyến xe
const deleteTrip = async (req, res) => {
  // #swagger.tags = ['Chuyến xe']
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM chuyen_xe WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy chuyến xe để xóa", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Xóa chuyến xe thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteTrip:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

const updateChuyenXeCapBen = async (req, res) => {
  const { id } = req.body; // id của bảng chuyen_xe
  console.log("req.body", req.body);
  if (!id) {
    return res.status(400).json({ message: "Thiếu id chuyến xe" });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Update trạng thái chuyen_xe => da_cap_ben
    const thoiGianCapBen = new Date();

    // Update trạng thái chuyen_xe => da_cap_ben và thời gian thoi_gian_cap_ben
    await connection.query(
      `UPDATE chuyen_xe SET trang_thai = 'da_cap_ben', ngay_cap_nhat = NOW(), thoi_gian_cap_ben = ? WHERE id = ?`,
      [thoiGianCapBen, id]
    );

    // Lấy xe_id và tai_xe từ chuyen_xe
    const [chuyenXe] = await connection.query(
      `SELECT xe_id, tai_xe_id, tai_xe_phu_id FROM chuyen_xe WHERE id = ?`,
      [id]
    );
    if (chuyenXe.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Không tìm thấy chuyến xe" });
    }

    const { xe_id, tai_xe_id, tai_xe_phu_id } = chuyenXe[0];

    // Update trạng thái xe => hoat_dong
    await connection.query(
      `UPDATE xe SET trang_thai = 'hoat_dong' WHERE id = ?`,
      [xe_id]
    );

    // Update trạng thái tai_xe => hoat_dong
    await connection.query(
      `UPDATE tai_xe SET trang_thai = 'hoat_dong' WHERE id = ?`,
      [tai_xe_id]
    );
    await connection.query(
      `UPDATE tai_xe SET trang_thai = 'hoat_dong' WHERE id = ?`,
      [tai_xe_phu_id]
    );
    // Lấy danh sách don_hang_id từ don_hang_chuyen_xe
    const [donHangChuyenXe] = await connection.query(
      `SELECT don_hang_id FROM don_hang_chuyen_xe WHERE don_hang_chuyen_xe_id = ?`,
      [id]
    );

    // Update trạng thái don_hang => da_cap_ben
    for (let item of donHangChuyenXe) {
      await connection.query(
        `UPDATE don_hang SET trang_thai = 'da_cap_ben' WHERE id = ?`,
        [item.don_hang_id]
      );
    }

    await connection.commit();
    return res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  } finally {
    connection.release();
  }
};

const getDonHangChuyenXe = async (req, res) => {
  const { id } = req.body; // id của bảng chuyen_xe
  console.log("id", id);
  if (!id) {
    return res.status(400).json({ message: "Thiếu id chuyến xe" });
  }

  try {
    const [donHangKhachHang] = await pool.query(
      `SELECT dh.*, kh.ho_ten, kh.so_dien_thoai, kh.dia_chi 
       FROM don_hang dh 
       JOIN khach_hang kh ON dh.nguoi_gui_id = kh.id 
       JOIN don_hang_chuyen_xe dhcx ON dh.id = dhcx.don_hang_id 
       WHERE dhcx.don_hang_chuyen_xe_id = ?`,
      [id]
    );

    if (donHangKhachHang.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng cho chuyến xe này" });
    }

    return res.status(200).json({ data: donHangKhachHang });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  updateChuyenXeCapBen,
  getDonHangChuyenXe,
};
