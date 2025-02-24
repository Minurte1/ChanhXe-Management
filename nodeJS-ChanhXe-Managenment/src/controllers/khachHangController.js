const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả khách hàng
const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM khach_hang");
    return res
      .status(200)
      .json({ EM: "Lấy danh sách khách hàng thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy khách hàng theo ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM khach_hang WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy khách hàng", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy khách hàng thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getCustomerById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới khách hàng
const createCustomer = async (req, res) => {
  try {
    const { ho_ten, so_dien_thoai, dia_chi } = req.body;
    const [result] = await pool.query(
      `INSERT INTO khach_hang (ho_ten, so_dien_thoai, dia_chi) VALUES (?, ?, ?)`,
      [ho_ten, so_dien_thoai, dia_chi]
    );
    return res
      .status(201)
      .json({
        EM: "Tạo khách hàng thành công",
        EC: 1,
        DT: { id: result.insertId },
      });
  } catch (error) {
    console.error("Error in createCustomer:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật khách hàng
const updateCustomer = async (req, res) => {
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
      `UPDATE khach_hang SET ${fields} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy khách hàng để cập nhật", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Cập nhật khách hàng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM khach_hang WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy khách hàng để xóa", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Xóa khách hàng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
