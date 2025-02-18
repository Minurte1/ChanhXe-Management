const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM don_hang");
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
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

// Thêm mới đơn hàng
const createOrder = async (req, res) => {
  try {
    const {
      ma_van_don,
      ma_qr_code,
      nguoi_gui_id,
      nguoi_nhan_id,
      dia_chi_gui,
      dia_chi_nhan,
      loai_hang_hoa,
      trong_luong,
      kich_thuoc_,
      so_kien,
      gia_tri_hang,
      cuoc_phi,
      phi_bao_hiem,
      phu_phi,
      trang_thai,
      ben_don_hang_id,
    } = req.body;
    const [result] = await pool.query(
      `INSERT INTO don_hang (ma_van_don, ma_qr_code, nguoi_gui_id, nguoi_nhan_id, dia_chi_gui, dia_chi_nhan, loai_hang_hoa, trong_luong, kich_thuoc_, so_kien, gia_tri_hang, cuoc_phi, phi_bao_hiem, phu_phi, trang_thai, ben_don_hang_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ma_van_don,
        ma_qr_code,
        nguoi_gui_id,
        nguoi_nhan_id,
        dia_chi_gui,
        dia_chi_nhan,
        loai_hang_hoa,
        trong_luong,
        kich_thuoc_,
        so_kien,
        gia_tri_hang,
        cuoc_phi,
        phi_bao_hiem,
        phu_phi,
        trang_thai,
        ben_don_hang_id,
      ]
    );
    return res.status(201).json({
      EM: "Tạo đơn hàng thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

// Cập nhật đơn hàng với dữ liệu động
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id);

    const [result] = await pool.query(
      `UPDATE don_hang SET ${fields} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy đơn hàng để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật đơn hàng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateOrder:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

// Xóa đơn hàng
const deleteOrder = async (req, res) => {
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
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
