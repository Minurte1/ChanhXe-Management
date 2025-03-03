const pool = require("../config/database");

// Lấy tất cả bản ghi trong don_hang_chuyen_xe
const getAllDonHangChuyenXe = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM don_hang_chuyen_xe");
    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng chuyến xe thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllDonHangChuyenXe:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Lấy bản ghi theo ID
const getDonHangChuyenXeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM don_hang_chuyen_xe WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng chuyến xe",
        EC: -1,
        DT: {},
      });
    }
    return res.status(200).json({
      EM: "Lấy đơn hàng chuyến xe thành công",
      EC: 1,
      DT: rows[0],
    });
  } catch (error) {
    console.error("Error in getDonHangChuyenXeById:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

// Thêm nhiều đơn hàng vào một chuyến xe
const createDonHangChuyenXe = async (req, res) => {
  try {
    const { don_hang_ids, don_hang_chuyen_xe_id } = req.body;
    const id_nguoi_cap_nhat = req.user?.id;

    if (!id_nguoi_cap_nhat) {
      return res.status(403).json({
        EM: "Không có quyền thực hiện",
        EC: -1,
        DT: {},
      });
    }

    if (!Array.isArray(don_hang_ids) || don_hang_ids.length === 0) {
      return res.status(400).json({
        EM: "Danh sách đơn hàng không hợp lệ",
        EC: -1,
        DT: {},
      });
    }

    if (!don_hang_chuyen_xe_id) {
      return res.status(400).json({
        EM: "ID chuyến xe không được để trống",
        EC: -1,
        DT: {},
      });
    }

    const [donHangCheck] = await pool.query(
      "SELECT id FROM don_hang WHERE id IN (?)",
      [don_hang_ids]
    );
    const [chuyenXeCheck] = await pool.query(
      "SELECT id, xe_id FROM chuyen_xe WHERE id = ?",
      [don_hang_chuyen_xe_id]
    );

    if (donHangCheck.length !== don_hang_ids.length) {
      return res.status(400).json({
        EM: "Một hoặc nhiều đơn hàng không tồn tại",
        EC: -1,
        DT: {},
      });
    }
    if (chuyenXeCheck.length === 0) {
      return res.status(400).json({
        EM: "Chuyến xe không tồn tại",
        EC: -1,
        DT: {},
      });
    }

    const xe_id = chuyenXeCheck[0].xe_id;

    // Lấy thông tin tài xế liên quan đến xe
    const [taiXeCheck] = await pool.query(
      "SELECT id FROM tai_xe WHERE xe_id = ? LIMIT 1",
      [xe_id]
    );

    if (taiXeCheck.length === 0) {
      return res.status(400).json({
        EM: "Không tìm thấy tài xế cho xe này",
        EC: -1,
        DT: {},
      });
    }

    const tai_xe_id = taiXeCheck[0].id;

    await pool.query("START TRANSACTION");

    try {
      // 1. Thêm các bản ghi vào don_hang_chuyen_xe
      const values = don_hang_ids.map((don_hang_id) => [
        don_hang_id,
        don_hang_chuyen_xe_id,
        id_nguoi_cap_nhat,
        new Date(),
        new Date(),
      ]);

      const [insertResult] = await pool.query(
        `INSERT INTO don_hang_chuyen_xe (don_hang_id, don_hang_chuyen_xe_id, id_nguoi_cap_nhat, ngay_cap_nhat, ngay_tao) 
         VALUES ?`,
        [values]
      );

      // 2. Cập nhật trang_thai của chuyen_xe
      const updateChuyenXeQuery = `
        UPDATE chuyen_xe 
        SET trang_thai = ?, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? 
        WHERE id = ?
      `;
      const chuyenXeValues = [
        "dang_van_chuyen",
        id_nguoi_cap_nhat,
        don_hang_chuyen_xe_id,
      ];
      const [chuyenXeResult] = await pool.query(
        updateChuyenXeQuery,
        chuyenXeValues
      );

      if (chuyenXeResult.affectedRows === 0) {
        throw new Error("Không tìm thấy chuyến xe để cập nhật trạng thái");
      }

      // 3. Cập nhật trang_thai của đơn hàng
      const updateDonHangQuery = `
        UPDATE don_hang 
        SET trang_thai = ?, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? 
        WHERE id IN (?)
      `;
      const donHangValues = [
        "dang_van_chuyen",
        id_nguoi_cap_nhat,
        don_hang_ids,
      ];
      const [donHangResult] = await pool.query(
        updateDonHangQuery,
        donHangValues
      );

      if (donHangResult.affectedRows !== don_hang_ids.length) {
        throw new Error("Không cập nhật được trạng thái tất cả đơn hàng");
      }

      // 4. Cập nhật trang_thai của xe
      const updateXeQuery = `
        UPDATE xe 
        SET trang_thai = ?, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? 
        WHERE id = ?
      `;
      const xeValues = ["dang_van_chuyen", id_nguoi_cap_nhat, xe_id];
      const [xeResult] = await pool.query(updateXeQuery, xeValues);

      if (xeResult.affectedRows === 0) {
        throw new Error("Không tìm thấy xe để cập nhật trạng thái");
      }

      // 5. Cập nhật trang_thai của tài xế
      const updateTaiXeQuery = `
        UPDATE tai_xe 
        SET trang_thai = ?, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? 
        WHERE id = ?
      `;
      const taiXeValues = ["dang_van_chuyen", id_nguoi_cap_nhat, tai_xe_id];
      const [taiXeResult] = await pool.query(updateTaiXeQuery, taiXeValues);

      if (taiXeResult.affectedRows === 0) {
        throw new Error("Không tìm thấy tài xế để cập nhật trạng thái");
      }

      await pool.query("COMMIT");

      return res.status(201).json({
        EM: "Thêm đơn hàng vào chuyến xe và cập nhật trạng thái thành công",
        EC: 1,
        DT: { insertedRows: insertResult.affectedRows },
      });
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error in createDonHangChuyenXe:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

// Cập nhật bản ghi don_hang_chuyen_xe
const updateDonHangChuyenXe = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    const id_nguoi_cap_nhat = req.user?.id;

    if (!id_nguoi_cap_nhat) {
      return res.status(403).json({
        EM: "Không có quyền thực hiện",
        EC: -1,
        DT: {},
      });
    }

    delete updates.id_nguoi_cap_nhat;
    delete updates.ngay_cap_nhat;
    delete updates.ngay_tao;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        EM: "Không có dữ liệu cập nhật",
        EC: -1,
        DT: {},
      });
    }

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id_nguoi_cap_nhat, id);

    const updateQuery = `UPDATE don_hang_chuyen_xe SET ${fields}, ngay_cap_nhat = NOW(), id_nguoi_cap_nhat = ? WHERE id = ?`;

    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy bản ghi để cập nhật",
        EC: -1,
        DT: {},
      });
    }

    return res.status(200).json({
      EM: "Cập nhật đơn hàng chuyến xe thành công",
      EC: 1,
      DT: {},
    });
  } catch (error) {
    console.error("Error in updateDonHangChuyenXe:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

// Xóa bản ghi don_hang_chuyen_xe
const deleteDonHangChuyenXe = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM don_hang_chuyen_xe WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy bản ghi để xóa",
        EC: -1,
        DT: {},
      });
    }

    return res.status(200).json({
      EM: "Xóa đơn hàng chuyến xe thành công",
      EC: 1,
      DT: {},
    });
  } catch (error) {
    console.error("Error in deleteDonHangChuyenXe:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

module.exports = {
  getAllDonHangChuyenXe,
  getDonHangChuyenXeById,
  createDonHangChuyenXe,
  updateDonHangChuyenXe,
  deleteDonHangChuyenXe,
};
