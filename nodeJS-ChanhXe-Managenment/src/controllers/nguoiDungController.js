const pool = require("../config/database"); // Kết nối cơ sở dữ liệu
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { getMenuItems } = require("../services/menuService");
const otpStorage = new Map();
// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  try {
    const {
      id,
      ho_ten,
      so_dien_thoai,
      email,
      vai_tro,
      trang_thai,
      id_nguoi_cap_nhat,
      ngay_cap_nhat,
      ngay_tao,
    } = req.query;

    let query = `
SELECT 
    nd.*, 
    pcd.id AS phan_cong_id, pcd.id_ben, pcd.id_nguoi_dung, pcd.id_nguoi_cap_nhat AS phan_cong_id_nguoi_cap_nhat, 
    pcd.ngay_tao AS phan_cong_ngay_tao, pcd.ngay_cap_nhat AS phan_cong_ngay_cap_nhat,
    bx.id AS ben_xe_id, bx.dia_chi, bx.ten_ben_xe, bx.tinh, bx.huyen, bx.xa, 
    bx.id_nguoi_cap_nhat AS ben_xe_id_nguoi_cap_nhat, bx.ngay_tao AS ben_xe_ngay_tao, bx.ngay_cap_nhat AS ben_xe_ngay_cap_nhat,
    pctx.id AS phan_cong_tai_xe_id, pctx.id_ben AS phan_cong_tai_xe_id_ben, pctx.id_tai_xe, 
    pctx.id_nguoi_cap_nhat AS phan_cong_tai_xe_id_nguoi_cap_nhat, pctx.ngay_tao AS phan_cong_tai_xe_ngay_tao, pctx.ngay_cap_nhat AS phan_cong_tai_xe_ngay_cap_nhat,
    tx.id AS tai_xe_id, tx.nguoi_dung_id AS tai_xe_nguoi_dung_id, tx.bang_lai, 
    tx.id_nguoi_cap_nhat AS tai_xe_id_nguoi_cap_nhat, tx.ngay_tao AS tai_xe_ngay_tao, tx.ngay_cap_nhat AS tai_xe_ngay_cap_nhat,
    COALESCE(tx.trang_thai, nd.trang_thai) AS trang_thai
FROM nguoi_dung nd
LEFT JOIN tai_xe tx ON nd.id = tx.nguoi_dung_id
LEFT JOIN phan_cong_dia_diem_tai_xe pctx ON tx.id = pctx.id_tai_xe
LEFT JOIN ben_xe bx ON pctx.id_ben = bx.id
LEFT JOIN phan_cong_dia_diem_nguoi_dung pcd ON nd.id = pcd.id_nguoi_dung AND pcd.id_ben = bx.id
WHERE 1=1



    `;
    let queryParams = [];

    if (id) {
      query += " AND id = ?";
      queryParams.push(id);
    }
    if (ho_ten) {
      query += " AND ho_ten LIKE ?";
      queryParams.push(`%${ho_ten}%`);
    }
    if (so_dien_thoai) {
      query += " AND so_dien_thoai = ?";
      queryParams.push(so_dien_thoai);
    }
    if (email) {
      query += " AND email LIKE ?";
      queryParams.push(`%${email}%`);
    }
    if (vai_tro) {
      // Xử lý vai_tro dạng mảng hoặc chuỗi đơn
      const roles = Array.isArray(vai_tro) ? vai_tro : vai_tro.split(",");
      query += " AND vai_tro IN (" + roles.map(() => "?").join(",") + ")";
      queryParams.push(...roles);
    }
    if (trang_thai) {
      query += " AND trang_thai = ?";
      queryParams.push(trang_thai);
    }
    if (id_nguoi_cap_nhat) {
      query += " AND id_nguoi_cap_nhat = ?";
      queryParams.push(id_nguoi_cap_nhat);
    }
    if (ngay_cap_nhat) {
      query += " AND DATE(ngay_cap_nhat) = ?";
      queryParams.push(ngay_cap_nhat);
    }
    if (ngay_tao) {
      query += " AND DATE(ngay_tao) = ?";
      queryParams.push(ngay_tao);
    }

    query += " ORDER BY ngay_cap_nhat DESC";

    const [rows] = await pool.query(query, queryParams);

    return res.status(200).json({
      EM: "Lấy danh sách người dùng thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM nguoi_dung WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy người dùng", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Lấy người dùng thành công", EC: 1, DT: rows[0] });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Thêm mới người dùng
const createUser = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  try {
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    const { ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai } =
      req.body;

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const [existingUser] = await pool.query(
      `SELECT id FROM nguoi_dung WHERE so_dien_thoai = ? LIMIT 1`,
      [so_dien_thoai]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        EM: "Số điện thoại đã tồn tại",
        EC: -1,
        DT: {},
      });
    }

    // Băm mật khẩu trước khi lưu
    const saltRounds = 10; // Số vòng salt
    const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);

    // Nếu chưa tồn tại, tiến hành thêm mới
    const [result] = await pool.query(
      `INSERT INTO nguoi_dung (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, id_nguoi_cap_nhat, ngay_cap_nhat, ngay_tao) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        ho_ten,
        so_dien_thoai,
        email,
        hashedPassword, // Lưu mật khẩu đã băm
        vai_tro,
        trang_thai,
        id_nguoi_cap_nhat,
      ]
    );

    return res.status(201).json({
      EM: "Tạo người dùng thành công",
      EC: 1,
      DT: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  try {
    const { id } = req.params;
    console.log("id", id);

    let updates = req.body;

    // Loại bỏ các trường không cần thiết
    delete updates.labelVaiTro;
    delete updates.labelTrangThai;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ EM: "Không có dữ liệu cập nhật", EC: -1, DT: {} });
    }

    // Lấy `id_nguoi_cap_nhat` từ cookies hoặc session
    const id_nguoi_cap_nhat = req.user?.id;
    if (!id_nguoi_cap_nhat) {
      return res
        .status(403)
        .json({ EM: "Không có quyền thực hiện", EC: -1, DT: {} });
    }

    // Danh sách các trường hợp lệ trong bảng `nguoi_dung`
    const validFields = [
      "ho_ten",
      "so_dien_thoai",
      "email",
      "mat_khau",
      "vai_tro",
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

    // Kiểm tra nếu có `mat_khau`, so sánh với mật khẩu hiện tại
    if (filteredUpdates.mat_khau) {
      // Lấy mật khẩu hiện tại từ cơ sở dữ liệu
      const [user] = await pool.query(
        "SELECT mat_khau FROM nguoi_dung WHERE id = ?",
        [id]
      );
      const currentPassword = user[0].mat_khau;

      // So sánh mật khẩu mới với mật khẩu hiện tại
      const isPasswordChanged = await bcrypt.compare(
        filteredUpdates.mat_khau,
        currentPassword
      );

      if (!isPasswordChanged) {
        // Nếu mật khẩu thay đổi, băm mật khẩu mới
        const saltRounds = 10;
        filteredUpdates.mat_khau = await bcrypt.hash(
          filteredUpdates.mat_khau,
          saltRounds
        );
      } else {
        // Nếu mật khẩu không thay đổi, không cập nhật mật khẩu
        delete filteredUpdates.mat_khau;
      }
    }

    // Bổ sung `id_nguoi_cap_nhat` và `ngay_cap_nhat`
    filteredUpdates.id_nguoi_cap_nhat = id_nguoi_cap_nhat;
    filteredUpdates.ngay_cap_nhat = new Date(); // Hoặc sử dụng `NOW()` trong SQL

    // Chuẩn bị query
    const fields = Object.keys(filteredUpdates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(filteredUpdates);
    values.push(id);

    const [result] = await pool.query(
      `UPDATE nguoi_dung SET ${fields} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy người dùng để cập nhật", EC: -1, DT: {} });
    }

    return res
      .status(200)
      .json({ EM: "Cập nhật người dùng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};
// Xóa người dùng
const deleteUser = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM nguoi_dung WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ EM: "Không tìm thấy người dùng để xóa", EC: -1, DT: {} });
    }
    return res
      .status(200)
      .json({ EM: "Xóa người dùng thành công", EC: 1, DT: {} });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
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
    const [rows] = await pool.query(
      "SELECT * FROM nguoi_dung WHERE email = ?",
      [email]
    );

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
      // Tạo JWT token
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          vai_tro: user.vai_tro,
          trang_thai: user.trang_thai,
          id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
          ngay_cap_nhat: user.ngay_cap_nhat,
          ngay_tao: user.ngay_tao,
        },
        process.env.JWT_SECRET,
        // { expiresIn: "10s" }
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          vai_tro: user.vai_tro,
          trang_thai: user.trang_thai,
          id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
          ngay_cap_nhat: user.ngay_cap_nhat,
          ngay_tao: user.ngay_tao,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // refresh token là HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "strict",
      });

      return res.status(200).json({
        EM: "Login successful",
        EC: 200,
        DT: {
          accessToken: accessToken,
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
      const id_nguoi_cap_nhat = 0; // Chưa ai cập nhật nên để NULL
      const guiPassword = crypto.randomBytes(4).toString("hex");
      const hashedPassword = await bcrypt.hash(guiPassword, 10);
      const [insertResult] = await pool.query(
        "INSERT INTO nguoi_dung (email, ho_ten, vai_tro, trang_thai, id_nguoi_cap_nhat, ngay_tao, ngay_cap_nhat,mat_khau) VALUES (?, ?, ?, ?, ?, NOW(), NOW(),?)",
        [
          email,
          ho_ten,
          vai_tro_mac_dinh,
          trang_thai_mac_dinh,
          id_nguoi_cap_nhat,
          hashedPassword,
        ]
      );

      // Lấy thông tin user vừa tạo
      const [newUserRows] = await pool.query(
        "SELECT * FROM nguoi_dung WHERE email = ?",
        [email]
      );
      const newUser = newUserRows[0];
      // Gửi email thông tin tài khoản
      await sendAccountEmail(
        email,
        ho_ten,
        guiPassword,
        vai_tro_mac_dinh,
        trang_thai_mac_dinh
      );
      // Tạo token cho user mới
      // Tạo JWT token
      const accessToken = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          ho_ten: newUser.ho_ten,
          so_dien_thoai: newUser.so_dien_thoai,
          vai_tro: newUser.vai_tro,
          trang_thai: newUser.trang_thai,
          id_nguoi_cap_nhat: newUser.id_nguoi_cap_nhat,
          ngay_cap_nhat: newUser.ngay_cap_nhat,
          ngay_tao: newUser.ngay_tao,
        },
        process.env.JWT_SECRET,
        // { expiresIn: "10s" }
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          ho_ten: newUser.ho_ten,
          so_dien_thoai: newUser.so_dien_thoai,
          vai_tro: newUser.vai_tro,
          trang_thai: newUser.trang_thai,
          id_nguoi_cap_nhat: newUser.id_nguoi_cap_nhat,
          ngay_cap_nhat: newUser.ngay_cap_nhat,
          ngay_tao: newUser.ngay_tao,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // refresh token là HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "strict",
      });

      return res.status(200).json({
        EM: "Tài khoản của bạn đã được tạo thành công, vui lòng kiểm tra email để lấy mật khẩu",
        EC: 200,
        DT: {
          accessToken: accessToken,
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
// 📨 Hàm gửi email thông tin tài khoản
const sendAccountEmail = async (email, hoTen, password, vaiTro, trangThai) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_OTP,
      pass: process.env.PASSWORD_OTP,
    },
  });

  const mailOptions = {
    from: "quanlychanhxe@gmail.com",
    to: email,
    subject: "Quản Lý Chành Xe - Thông Tin Tài Khoản Của Bạn",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="text-align: center; color: #007000;">Chào mừng bạn đến với Quản Lý Chành Xe!</h2>
        <p>Xin chào <strong>${hoTen}</strong>,</p>
        <p>Bạn đã đăng ký tài khoản thành công bằng Google. Dưới đây là thông tin tài khoản của bạn:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mật khẩu tạm thời:</strong> <span style="color: red;">${password}</span></p>
          <p><strong>Vai trò:</strong> ${vaiTro}</p>
          <p><strong>Trạng thái:</strong> ${
            trangThai === "hoat_dong" ? "Hoạt động" : "Bị khóa"
          }</p>
        </div>
        <p>Vui lòng đăng nhập và đổi mật khẩu để đảm bảo an toàn.</p>
        <p style="text-align: center; color: #888; font-size: 12px;">&copy; 2024 Quản Lý Chành Xe. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email gửi thành công đến: ${email}`);
  } catch (error) {
    console.error("❌ Gửi email thất bại:", error);
  }
};

const loginUser = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      EM: "Email và mật khẩu không được để trống",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    const [rows] = await pool.query(
      "SELECT * FROM nguoi_dung WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    const user = rows[0];
    console.log("user", user);
    // Kiểm tra nếu tài khoản bị khóa
    if (user.trang_thai == "tam_ngung") {
      return res.status(403).json({
        EM: "Tài khoản đã ngừng hoạt động, không thể đăng nhập",
        EC: 0,
        DT: "Account is disabled",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.mat_khau);
    if (!isPasswordValid) {
      return res.status(401).json({
        EM: "Mật khẩu không đúng",
        EC: 0,
        DT: [],
      });
    }

    // Tạo JWT token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        so_dien_thoai: user.so_dien_thoai,
        vai_tro: user.vai_tro,
        trang_thai: user.trang_thai,
        id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
        ngay_cap_nhat: user.ngay_cap_nhat,
        ngay_tao: user.ngay_tao,
      },
      process.env.JWT_SECRET,
      // { expiresIn: "10s" }
      { expiresIn: "5h" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        so_dien_thoai: user.so_dien_thoai,
        vai_tro: user.vai_tro,
        trang_thai: user.trang_thai,
        id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
        ngay_cap_nhat: user.ngay_cap_nhat,
        ngay_tao: user.ngay_tao,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // refresh token là HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict",
    });

    // Trả về token và thông tin người dùng
    return res.status(200).json({
      EM: "Đăng nhập thành công",
      EC: 1,
      DT: {
        accessToken: accessToken,
        userInfo: {
          id: user.id,
          email: user.email,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          vai_tro: user.vai_tro,
          trang_thai: user.trang_thai,
          id_nguoi_cap_nhat: user.id_nguoi_cap_nhat,
          ngay_cap_nhat: user.ngay_cap_nhat,
          ngay_tao: user.ngay_tao,
        },
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const logoutUser = (req, res) => {
  // #swagger.tags = ['Người dùng']
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Đăng xuất thành công" });
};

const verifyAdmin = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  const { token, pathName } = req.body;

  if (!token) {
    return res.status(401).json({
      EM: "Token is missing",
      EC: 401,
      DT: { role: null },
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const id = decoded.id;

    const [rows] = await pool.query(
      "SELECT vai_tro FROM nguoi_dung WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        EM: "User not found",
        EC: 404,
        DT: { role: null },
      });
    }

    const roleUser = rows[0].vai_tro;
    const menuUser = getMenuItems(roleUser); // Lấy danh sách menu của vai trò
    if (roleUser === "admin") {
      return res.status(200).json({
        EM: "Role verified successfully",
        EC: 200,
        DT: { role: roleUser },
      });
    }
    // Hàm đệ quy để tìm pathName trong danh sách menu
    const findPathInMenu = (menus, path) => {
      for (const item of menus) {
        if (item.url === path) {
          return true;
        }
        if (item.items && item.items.length > 0) {
          if (findPathInMenu(item.items, path)) {
            return true;
          }
        }
      }
      return false;
    };

    const isPathAllowed = findPathInMenu(menuUser, pathName);

    if (!isPathAllowed) {
      return res.status(403).json({
        EM: "Access denied",
        EC: 403,
        DT: { role: roleUser },
      });
    }

    return res.status(200).json({
      EM: "Role verified successfully",
      EC: 200,
      DT: { role: roleUser },
    });
  } catch (error) {
    return res.status(401).json({
      EM: `Invalid token: ${error.message}`,
      EC: 401,
      DT: { role: null },
    });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  // Tạo OTP và thời gian hết hạn
  const otp = crypto.randomInt(100000, 999999);
  const expiresAt = Date.now() + 1 * 60 * 1000; // 1 phút

  // Lưu OTP
  otpStorage.set(email, { otp, expiresAt });
  console.log("to email: ", email);
  // Gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_OTP,
      pass: process.env.PASSWORD_OTP,
    },
  });

  const mailOptions = {
    from: "quanlychanhxe@gmail.com",
    to: email,
    subject: "Quản Lý Chành Xe - Mã OTP Của Bạn",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; padding: 10px 0;">
          <h1 style="color: #007000; margin-bottom: 5px;">Dịch Vụ Quản Lý Chành Xe</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #007000;">Your OTP Code</h2>
          <p style="font-size: 18px; margin: 10px 0; font-weight: bold; color: #000;">${otp}</p>
          <p style="font-size: 14px; color: #555;">Mã này sẽ hết hạn trong <strong>1 phút</strong>.</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>Nếu bạn không yêu cầu mã này, xin hãy bỏ qua email này.</p>
          <p style="margin-top: 10px;">&copy; 2024 quanlychanhxe@gmail.com. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      EM: "Gửi OTP thành công",
      EC: 1,
      DT: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Gửi OTP thất bại",
      EC: -1,
      DT: [],
    });
  }
};

const checkOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  // Kiểm tra OTP có tồn tại trong bộ nhớ
  const storedOtp = otpStorage.get(email);

  if (!storedOtp) {
    return res.status(400).json({
      EM: "OTP không tồn tại hoặc đã hết hạn",
      EC: -1,
      DT: [],
    });
  }

  // Kiểm tra thời gian hết hạn của OTP
  const currentTime = Date.now();
  if (currentTime > storedOtp.expiresAt) {
    otpStorage.delete(email); // Xóa OTP đã hết hạn
    return res.status(400).json({
      EM: "OTP đã hết hạn",
      EC: -1,
      DT: [],
    });
  }

  // Kiểm tra OTP có đúng không
  if (parseInt(otp) === storedOtp.otp) {
    return res.status(200).json({
      EM: "OTP hợp lệ",
      EC: 1,
      DT: [],
    });
  } else {
    return res.status(400).json({
      EM: "OTP không đúng",
      EC: -1,
      DT: [],
    });
  }
};

const registerUser = async (req, res) => {
  // #swagger.tags = ['Người dùng']
  const {
    password,
    email,
    vai_tro = "nhan_vien_kho", // Giả sử mặc định là "nhan_vien_kho" nếu không có thông tin
    ho_ten,
    so_dien_thoai,
    trang_thai = "hoat_dong", // Mặc định người dùng ở trạng thái "hoat_dong"
    id_nguoi_cap_nhat = null, // Mặc định không có người cập nhật
  } = req.body;
  console.log("req.body", req.body);
  const EMAIL = email;
  const HO_TEN = ho_ten;
  const SO_DIEN_THOAI = so_dien_thoai;
  const idNguoiCapNhat = id_nguoi_cap_nhat ?? 0;
  if (!password) {
    return res.status(400).json({
      EM: "Mật khẩu không được để trống",
      EC: 0,
      DT: [],
    });
  }

  // Mã hóa mật khẩu trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Kiểm tra xem có thiếu thông tin cần thiết không
  if (!EMAIL || !HO_TEN || !SO_DIEN_THOAI) {
    return res.status(400).json({
      EM: "Missing required fields",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const [existingUser] = await pool.query(
      `SELECT * FROM nguoi_dung WHERE email = ?`,
      [EMAIL]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        EM: "Tài khoản email này đã được đăng ký",
        EC: 0,
        DT: [],
      });
    }

    // Thực hiện đăng ký người dùng mới
    const [result] = await pool.query(
      `INSERT INTO nguoi_dung (
        ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, 
        id_nguoi_cap_nhat, ngay_cap_nhat, ngay_tao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        HO_TEN,
        SO_DIEN_THOAI,
        EMAIL,
        hashedPassword,
        vai_tro,
        trang_thai,
        idNguoiCapNhat,
      ]
    );

    return res.status(200).json({
      EM: "Đăng ký tài khoản thành công",
      EC: 1,
      DT: {
        id: result.insertId, // Trả về ID người dùng mới
        email: EMAIL,
        ho_ten: HO_TEN,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
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

  loginUserGoogle,
  loginUser,
  logoutUser,
  verifyAdmin,
  checkOtp,
  sendOtp,
  registerUser,
};
