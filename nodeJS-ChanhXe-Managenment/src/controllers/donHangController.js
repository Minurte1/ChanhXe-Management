const pool = require("../config/database"); // Kết nối cơ sở dữ liệu
const bcrypt = require("bcrypt");

// Lấy tất cả đơn hàng với truy vấn động và thông tin từ bảng ben_xe
const getAllOrders = async (req, res) => {
  // #swagger.tags = ['Đơn hàng']
  try {
    const {
      id,
      ma_van_don,
      ma_qr_code,
      nguoi_gui_id,
      id_ben_xe_nhan,
      id_ben_xe_gui,
      loai_hang_hoa,
      trong_luong,
      kich_thuoc,
      so_kien,
      gia_tri_hang,
      cuoc_phi,
      phi_bao_hiem,
      phu_phi,
      trang_thai, // Có thể là string hoặc array
      id_nguoi_cap_nhat,
      ngay_cap_nhat,
      ngay_tao,
      ten_nguoi_nhan,
      so_dien_thoai_nhan,
      email_nhan,
    } = req.query;

    let query = `
      SELECT 
        dh.*, 
        bx_nhan.ten_ben_xe AS ben_xe_nhan_ten, 
        bx_nhan.dia_chi AS ben_xe_nhan_dia_chi,
        bx_gui.ten_ben_xe AS ben_xe_gui_ten, 
        bx_gui.dia_chi AS ben_xe_gui_dia_chi,
        kh.id AS khach_hang_id,
        kh.ho_ten AS khach_hang_ho_ten,
        kh.so_dien_thoai AS khach_hang_so_dien_thoai,
        kh.dia_chi AS khach_hang_dia_chi,
        kh.id_nguoi_cap_nhat AS khach_hang_id_nguoi_cap_nhat,
        kh.ngay_tao AS khach_hang_ngay_tao,
        kh.ngay_cap_nhat AS khach_hang_ngay_cap_nhat
      FROM don_hang dh
      LEFT JOIN ben_xe bx_nhan ON dh.id_ben_xe_nhan = bx_nhan.id
      LEFT JOIN ben_xe bx_gui ON dh.id_ben_xe_gui = bx_gui.id
      LEFT JOIN khach_hang kh ON dh.nguoi_gui_id = kh.id
      WHERE 1=1
    `;

    let queryParams = [];

    if (id) {
      query += " AND dh.id = ?";
      queryParams.push(id);
    }
    if (ma_van_don) {
      query += " AND dh.ma_van_don LIKE ?";
      queryParams.push(`%${ma_van_don}%`);
    }
    if (ma_qr_code) {
      query += " AND dh.ma_qr_code LIKE ?";
      queryParams.push(`%${ma_qr_code}%`);
    }
    if (nguoi_gui_id) {
      query += " AND dh.nguoi_gui_id = ?";
      queryParams.push(nguoi_gui_id);
    }
    if (id_ben_xe_nhan) {
      query += " AND dh.id_ben_xe_nhan = ?";
      queryParams.push(id_ben_xe_nhan);
    }
    if (id_ben_xe_gui) {
      query += " AND dh.id_ben_xe_gui = ?";
      queryParams.push(id_ben_xe_gui);
    }
    if (loai_hang_hoa) {
      query += " AND dh.loai_hang_hoa LIKE ?";
      queryParams.push(`%${loai_hang_hoa}%`);
    }
    if (trong_luong) {
      query += " AND dh.trong_luong = ?";
      queryParams.push(trong_luong);
    }
    if (kich_thuoc) {
      query += " AND dh.kich_thuoc LIKE ?";
      queryParams.push(`%${kich_thuoc}%`);
    }
    if (so_kien) {
      query += " AND dh.so_kien = ?";
      queryParams.push(so_kien);
    }
    if (gia_tri_hang) {
      query += " AND dh.gia_tri_hang = ?";
      queryParams.push(gia_tri_hang);
    }
    if (cuoc_phi) {
      query += " AND dh.cuoc_phi = ?";
      queryParams.push(cuoc_phi);
    }
    if (phi_bao_hiem) {
      query += " AND dh.phi_bao_hiem = ?";
      queryParams.push(phi_bao_hiem);
    }
    if (phu_phi) {
      query += " AND dh.phu_phi = ?";
      queryParams.push(phu_phi);
    }

    // Xử lý `trang_thai` hỗ trợ tìm kiếm theo mảng
    if (trang_thai) {
      const trangThaiArray = Array.isArray(trang_thai)
        ? trang_thai
        : [trang_thai];
      const placeholders = trangThaiArray.map(() => "?").join(",");
      query += ` AND dh.trang_thai IN (${placeholders})`;
      queryParams.push(...trangThaiArray);
    }

    if (id_nguoi_cap_nhat) {
      query += " AND dh.id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat);
    }
    if (ngay_cap_nhat) {
      query += " AND DATE(dh.ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat);
    }
    if (ngay_tao) {
      query += " AND DATE(dh.ngay_tao) = ?";
      queryParams.push(ngay_tao);
    }
    if (ten_nguoi_nhan) {
      query += " AND dh.ten_nguoi_nhan LIKE ?";
      queryParams.push(`%${ten_nguoi_nhan}%`);
    }
    if (so_dien_thoai_nhan) {
      query += " AND dh.so_dien_thoai_nhan LIKE ?";
      queryParams.push(`%${so_dien_thoai_nhan}%`);
    }
    if (email_nhan) {
      query += " AND dh.email_nhan LIKE ?";
      queryParams.push(`%${email_nhan}%`);
    }
    // **Sắp xếp đơn hàng mới nhất**
    query += " ORDER BY dh.ngay_cap_nhat DESC";
    const [rows] = await pool.query(query, queryParams);

    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Lấy đơn hàng theo ID
const getOrderById = async (req, res) => {
  // #swagger.tags = ['Đơn hàng']
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM don_hang WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy đơn hàng", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy đơn hàng thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới đơn hàng
const createOrder = async (req, res) => {
  // #swagger.tags = ['Đơn hàng']
  try {
    const {
      ma_van_don,
      ma_qr_code,
      nguoi_gui_id,
      id_ben_xe_nhan,
      id_ben_xe_gui,
      loai_hang_hoa,
      trong_luong,
      kich_thuoc,
      so_kien,
      gia_tri_hang,
      cuoc_phi,
      phi_bao_hiem,
      phu_phi,
      trang_thai,
      ten_nguoi_nhan,
      so_dien_thoai_nhan,
      email_nhan,
    } = req.body;

    if (
      !ma_van_don ||
      !ma_qr_code ||
      !nguoi_gui_id ||
      !id_ben_xe_nhan ||
      !id_ben_xe_gui ||
      !loai_hang_hoa ||
      !trong_luong ||
      !kich_thuoc ||
      !so_kien ||
      !gia_tri_hang ||
      !cuoc_phi ||
      !phi_bao_hiem ||
      !phu_phi ||
      !trang_thai ||
      !ten_nguoi_nhan ||
      !so_dien_thoai_nhan ||
      !email_nhan
    ) {
      return res
        .status(400)
        .json({ EM: "Thiếu thông tin cần thiết", EC: -1, DT: {} });
    }

    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    const [result] = await pool.query(
      `INSERT INTO don_hang 
      (ma_van_don, ma_qr_code, nguoi_gui_id, id_ben_xe_nhan, id_ben_xe_gui, loai_hang_hoa, 
      trong_luong, kich_thuoc, so_kien, gia_tri_hang, cuoc_phi, phi_bao_hiem, phu_phi, 
      trang_thai, ten_nguoi_nhan, so_dien_thoai_nhan, email_nhan, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        ma_van_don,
        ma_qr_code,
        nguoi_gui_id,
        id_ben_xe_nhan,
        id_ben_xe_gui,
        loai_hang_hoa,
        trong_luong,
        kich_thuoc,
        so_kien,
        gia_tri_hang,
        cuoc_phi,
        phi_bao_hiem,
        phu_phi,
        trang_thai,
        ten_nguoi_nhan,
        so_dien_thoai_nhan,
        email_nhan,
        id_nguoi_cap_nhat,
      ]
    );

    return res.status(201).json({
      EM: "Tạo đơn hàng thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật đơn hàng
const updateOrder = async (req, res) => {
  // #swagger.tags = ['Đơn hàng']
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
      "ma_van_don",
      "ma_qr_code",
      "nguoi_gui_id",
      "id_ben_xe_nhan",
      "id_ben_xe_gui",
      "loai_hang_hoa",
      "trong_luong",
      "kich_thuoc",
      "so_kien",
      "gia_tri_hang",
      "cuoc_phi",
      "phi_bao_hiem",
      "phu_phi",
      "trang_thai",
      "ten_nguoi_nhan",
      "so_dien_thoai_nhan",
      "email_nhan",
    ];

    // Lọc các trường cập nhật hợp lệ
    const validUpdates = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        validUpdates[key] = updates[key];
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
      UPDATE don_hang 
      SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? 
      WHERE id = ?
    `;

    // Thực thi câu lệnh SQL
    const [result] = await pool.query(updateQuery, values);

    // Kiểm tra kết quả cập nhật
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy đơn hàng để cập nhật", EC: -1, DT: {} });
    }

    // Trả về kết quả thành công
    return res
      .status(200)
      .json({ EM: "Cập nhật đơn hàng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateOrder:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa đơn hàng
const deleteOrder = async (req, res) => {
  // #swagger.tags = ['Đơn hàng']
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM don_hang WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy đơn hàng để xóa", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Xóa đơn hàng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

const createOrderAndCustomer = async (req, res) => {
  // #swagger.tags = ['Đơn hàng']
  const connection = await pool.getConnection();
  try {
    const {
      ma_van_don,
      ma_qr_code,
      nguoi_gui_id,
      id_ben_xe_nhan,
      id_ben_xe_gui,
      loai_hang_hoa,
      trong_luong,
      kich_thuoc,
      so_kien,
      gia_tri_hang,
      cuoc_phi,
      phi_bao_hiem,
      phu_phi,
      trang_thai,
      ten_nguoi_nhan,
      so_dien_thoai_nhan,
      email_nhan,

      ho_ten,
      so_dien_thoai,
      dia_chi,
      mat_khau,
    } = req.body;

    if (
      !ma_van_don ||
      !ma_qr_code ||
      !id_ben_xe_nhan ||
      !id_ben_xe_gui ||
      !loai_hang_hoa ||
      !trong_luong ||
      !kich_thuoc ||
      !so_kien ||
      !gia_tri_hang ||
      !cuoc_phi ||
      !phi_bao_hiem ||
      !phu_phi ||
      !trang_thai ||
      !ten_nguoi_nhan ||
      !so_dien_thoai_nhan ||
      !email_nhan ||
      !ho_ten ||
      !so_dien_thoai ||
      !dia_chi ||
      !mat_khau
    ) {
      return res
        .status(400)
        .json({ EM: "Thiếu thông tin cần thiết", EC: -1, DT: {} });
    }

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const [existingPhone] = await pool.query(
      `SELECT id FROM  khach_hang WHERE so_dien_thoai = ? LIMIT 1`,
      [so_dien_thoai]
    );

    if (existingPhone.length > 0) {
      return res.status(400).json({
        EM: "Số điện thoại đã tồn tại",
        EC: -1,
        DT: {},
      });
    }

    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    // Mã hóa mật khẩu trước khi lưu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);

    await connection.beginTransaction();

    // Insert into khach_hang table
    const [khachHangResult] = await connection.query(
      `INSERT INTO khach_hang (ho_ten, so_dien_thoai, dia_chi, mat_khau, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [ho_ten, so_dien_thoai, dia_chi, hashedPassword, id_nguoi_cap_nhat]
    );

    const khachHangId = khachHangResult.insertId;

    // Insert into don_hang table
    const [donHangResult] = await connection.query(
      `INSERT INTO don_hang 
      (ma_van_don, ma_qr_code, nguoi_gui_id, id_ben_xe_nhan, id_ben_xe_gui, loai_hang_hoa, 
      trong_luong, kich_thuoc, so_kien, gia_tri_hang, cuoc_phi, phi_bao_hiem, phu_phi, 
      trang_thai, ten_nguoi_nhan, so_dien_thoai_nhan, email_nhan, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        ma_van_don,
        ma_qr_code,
        khachHangId, // Sử dụng khach_hang ID mới tạo
        id_ben_xe_nhan,
        id_ben_xe_gui,
        loai_hang_hoa,
        trong_luong,
        kich_thuoc,
        so_kien,
        gia_tri_hang,
        cuoc_phi,
        phi_bao_hiem,
        phu_phi,
        trang_thai,
        ten_nguoi_nhan,
        so_dien_thoai_nhan,
        email_nhan,
        id_nguoi_cap_nhat,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      EM: "Tạo đơn hàng và khách hàng thành công",
      EC: 1,
      DT: { donHangId: donHangResult.insertId, khachHangId },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error in createOrderAndUser:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  createOrderAndCustomer,
};
