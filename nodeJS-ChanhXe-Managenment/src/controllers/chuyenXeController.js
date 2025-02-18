const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả chuyến xe
const getAllTrips = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM chuyen_xe");
        return res.status(200).json({ EM: "Lấy danh sách chuyến xe thành công", EC: 1, DT: rows });
    } catch (error) {
        console.error("Error in getAllTrips:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
    }
};

// Lấy chuyến xe theo ID
const getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM chuyen_xe WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ EM: "Không tìm thấy chuyến xe", EC: -1, DT: {} });
        }
        return res.status(200).json({ EM: "Lấy chuyến xe thành công", EC: 1, DT: rows[0] });
    } catch (error) {
        console.error("Error in getTripById:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

// Thêm mới chuyến xe
const createTrip = async (req, res) => {
    try {
        const { xe_id, tai_xe_id, tai_xe_phu_id, thoi_gian_xuat_ben, thoi_gian_cap_ben, trang_thai } = req.body;
        const [result] = await pool.query(
            `INSERT INTO chuyen_xe (xe_id, tai_xe_id, tai_xe_phu_id, thoi_gian_xuat_ben, thoi_gian_cap_ben, trang_thai) VALUES (?, ?, ?, ?, ?, ?)`,
            [xe_id, tai_xe_id, tai_xe_phu_id, thoi_gian_xuat_ben, thoi_gian_cap_ben, trang_thai]
        );
        return res.status(201).json({ EM: "Tạo chuyến xe thành công", EC: 1, DT: { id: result.insertId } });
    } catch (error) {
        console.error("Error in createTrip:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

// Cập nhật chuyến xe
const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
        }
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
        const values = Object.values(updates);
        values.push(id);
        const [result] = await pool.query(`UPDATE chuyen_xe SET ${fields} WHERE id = ?`, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ EM: "Không tìm thấy chuyến xe để cập nhật", EC: -1, DT: {} });
        }
        return res.status(200).json({ EM: "Cập nhật chuyến xe thành công", EC: 1, DT: {} });
    } catch (error) {
        console.error("Error in updateTrip:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

// Xóa chuyến xe
const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM chuyen_xe WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ EM: "Không tìm thấy chuyến xe để xóa", EC: -1, DT: {} });
        }
        return res.status(200).json({ EM: "Xóa chuyến xe thành công", EC: 1, DT: {} });
    } catch (error) {
        console.error("Error in deleteTrip:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };