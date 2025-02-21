const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM nguoi_dung");
    return res.status(200).json({ EM: "Lấy danh sách người dùng thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM nguoi_dung WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ EM: "Không tìm thấy người dùng", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Lấy người dùng thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới người dùng
const createUser = async (req, res) => {
  try {
    const { ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, id_nguoi_cap_nhat, ngay_cap_nhat, ngay_tao } = req.body;
    const [result] = await pool.query(
      `INSERT INTO nguoi_dung (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, id_nguoi_cap_nhat, ngay_cap_nhat, ngay_tao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, id_nguoi_cap_nhat, ngay_cap_nhat, ngay_tao]
    );
    return res.status(201).json({ EM: "Tạo người dùng thành công", EC: 1, DT: { id: result.insertId } });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    values.push(id);
    const [result] = await pool.query(`UPDATE nguoi_dung SET ${fields} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy người dùng để cập nhật", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Cập nhật người dùng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM nguoi_dung WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ EM: "Không tìm thấy người dùng để xóa", EC: -1, DT: {} });
    }
    return res.status(200).json({ EM: "Xóa người dùng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

const loginUserGoogle = async (req, res) => {
  const { email, ho_ten } = req.body;
  console.log("req.body loginUserGoogle", req.body);

  if (!email) {
    return res.status(401).json({
      EM: "Email is missing",
      EC: 401,
      DT: [],
    });
  }

  try {
    // Kiểm tra người dùng đã tồn tại chưa
    const [rows] = await pool.query("SELECT * FROM nguoi_dung WHERE email = ?", [email]);

    if (rows.length > 0) {
      const user = rows[0];

      // Kiểm tra nếu tài khoản bị khóa
      if (user.trang_thai === "ngung_hoat_dong") {
        return res.status(403).json({
          EM: "Tài khoản bị khóa, không thể đăng nhập",
          EC: 0,
          DT: "Account is disabled",
        });
      }

      // Tạo token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          vai_tro: user.vai_tro,
          trang_thai: user.trang_thai,
          id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
          ngay_tao: user.ngay_tao,
          ngay_cap_nhat: user.ngay_cap_nhat,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      return res.status(200).json({
        EM: "Login successful",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: {
            id: user.id,
            email: user.email,
            ho_ten: user.ho_ten,
            so_dien_thoai: user.so_dien_thoai,
            vai_tro: user.vai_tro,
            trang_thai: user.trang_thai,
            id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
            ngay_tao: user.ngay_tao,
            ngay_cap_nhat: user.ngay_cap_nhat,
          },
        },
      });
    } else {
      // Nếu người dùng chưa tồn tại, tạo mới
      const vai_tro_mac_dinh = "nhan_vien_kho";
      const trang_thai_mac_dinh = "hoat_dong";
      const id_nguoi_cap_nhat = null; // Chưa ai cập nhật nên để NULL

      const [insertResult] = await pool.query(
        "INSERT INTO nguoi_dung (email, ho_ten, vai_tro, trang_thai, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
        [email, ho_ten, vai_tro_mac_dinh, trang_thai_mac_dinh, id_nguoi_cap_nhat]
      );

      // Lấy thông tin user vừa tạo
      const [newUserRows] = await pool.query("SELECT * FROM nguoi_dung WHERE email = ?", [email]);
      const newUser = newUserRows[0];

      // Tạo token cho user mới
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          ho_ten: newUser.ho_ten,
          so_dien_thoai: newUser.so_dien_thoai,
          vai_tro: newUser.vai_tro,
          trang_thai: newUser.trang_thai,
          id_nguoi_cap_nhat: newUser.id_nguoi_cap_nhat,
          ngay_tao: newUser.ngay_tao,
          ngay_cap_nhat: newUser.ngay_cap_nhat,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      return res.status(200).json({
        EM: "New user created and logged in successfully",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: {
            id: newUser.id,
            email: newUser.email,
            ho_ten: newUser.ho_ten,
            so_dien_thoai: newUser.so_dien_thoai,
            vai_tro: newUser.vai_tro,
            trang_thai: newUser.trang_thai,
            id_nguoi_cap_nhat: newUser.id_nguoi_cap_nhat,
            ngay_tao: newUser.ngay_tao,
            ngay_cap_nhat: newUser.ngay_cap_nhat,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error in loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: 500,
      DT: [],
    });
  }
};

module.exports = { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  
  loginUserGoogle
};