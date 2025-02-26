const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả đơn hàng trong chuyến xe
const getAllOrdersInTrip = async (req, res) => {
    try {
        const id_nguoi_cap_nhat = req.user?.id;
        if (!id_nguoi_cap_nhat) {
        return res.status(403).json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
        }
        const [rows] = await pool.query("SELECT * FROM don_hang_chuyen_xe");
        return res.status(200).json({ EM: "Lấy danh sách đơn hàng chuyến xe thành công", EC: 1, DT: rows });
    } 
    catch (error) {
        console.error("Error in getAllOrdersInTrip:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
    }
};

// Lấy đơn hàng theo ID trong chuyến xe
const getOrderInTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const id_nguoi_cap_nhat = req.user?.id;
        if (!id_nguoi_cap_nhat) {
            return res.status(403).json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
        }
        const [rows] = await pool.query("SELECT * FROM don_hang_chuyen_xe WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ EM: "Không tìm thấy đơn hàng trong chuyến xe", EC: -1, DT: {} });
        }

        return res.status(200).json({ EM: "Lấy đơn hàng trong chuyến xe thành công", EC: 1, DT: rows[0] });
    } 
    catch (error) {
        console.error("Error in getOrderInTripById:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

// Thêm mới đơn hàng vào chuyến xe
const createOrderInTrip = async (req, res) => {
    try {
        const { don_hang_id, don_hang_chuyen_xe_id } = req.body;
        const id_nguoi_cap_nhat = req.user?.id;
        if (!id_nguoi_cap_nhat) {
            return res.status(403).json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
        }
        const [result] = await pool.query(
            `INSERT INTO don_hang_chuyen_xe (don_hang_id, don_hang_chuyen_xe_id, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) 
       VALUES (?, ?, ?, NOW(), NOW())`,
            [don_hang_id, don_hang_chuyen_xe_id, id_nguoi_cap_nhat]
        );

        return res.status(201).json({ EM: "Tạo đơn hàng trong chuyến xe thành công", EC: 1, DT: { id: result.insertId } });
    } 
    catch (error) {
        console.error("Error in createOrderInTrip:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

// Cập nhật đơn hàng trong chuyến xe
const updateOrderInTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const id_nguoi_cap_nhat = req.user?.id;
        if (!id_nguoi_cap_nhat) {
            return res.status(403).json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
        }

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
        const values = Object.values(updates);

        const updateQuery = `UPDATE don_hang_chuyen_xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;
        values.push(id_nguoi_cap_nhat, id);

        const [result] = await pool.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ EM: "Không tìm thấy đơn hàng trong chuyến xe để cập nhật", EC: -1, DT: {} });
        }

        return res.status(200).json({ EM: "Cập nhật đơn hàng trong chuyến xe thành công", EC: 1, DT: {} });
    } catch (error) {
        console.error("Error in updateOrderInTrip:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

// Xóa đơn hàng khỏi chuyến xe
const deleteOrderInTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const id_nguoi_cap_nhat = req.user?.id;
        if (!id_nguoi_cap_nhat) {
            return res.status(403).json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
        }
        const [result] = await pool.query("DELETE FROM don_hang_chuyen_xe WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ EM: "Không tìm thấy đơn hàng trong chuyến xe để xóa", EC: -1, DT: {} });
        }
        return res.status(200).json({ EM: "Xóa đơn hàng trong chuyến xe thành công", EC: 1, DT: {} });
    } catch (error) {
        console.error("Error in deleteOrderInTrip:", error);
        return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
    }
};

module.exports = {
    getAllOrdersInTrip,
    getOrderInTripById,
    createOrderInTrip,
    updateOrderInTrip,
    deleteOrderInTrip,
};
