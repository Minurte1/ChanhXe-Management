const pool = require("../config/database"); // Kết nối cơ sở dữ liệu
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpStorage = new Map();
// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM nguoi_dung");
    return res
      .status(200)
      .json({ EM: "Lấy danh sách người dùng thành công", EC: 1, DT: rows });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: [] });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
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
  try {
    const {
      id,
      ho_ten,
      so_dien_thoai,
      email,
      mat_khau,
      vai_tro,
      trang_thai,
      id_nguoi_cap_nhat,
      ngay_cap_nhat,
      ngay_tao,
    } = req.body;
    const [result] = await pool.query(
      `INSERT INTO nguoi_dung (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, id_nguoi_cap_nhat, ngay_cap_nhat, ngay_tao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        ho_ten,
        so_dien_thoai,
        email,
        mat_khau,
        vai_tro,
        trang_thai,
        id_nguoi_cap_nhat,
        ngay_cap_nhat,
        ngay_tao,
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
        [
          email,
          ho_ten,
          vai_tro_mac_dinh,
          trang_thai_mac_dinh,
          id_nguoi_cap_nhat,
        ]
      );

      // Lấy thông tin user vừa tạo
      const [newUserRows] = await pool.query(
        "SELECT * FROM nguoi_dung WHERE email = ?",
        [email]
      );
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

const loginUser = async (req, res) => {
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

    // Kiểm tra nếu tài khoản bị khóa
    if (user.trang_thai === "ngung_hoat_dong") {
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
    const token = jwt.sign(
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
      JWT_SECRET,
      { expiresIn: "5h" }
    );

    // Trả về token và thông tin người dùng
    return res.status(200).json({
      EM: "Đăng nhập thành công",
      EC: 1,
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
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Đăng xuất thành công" });
};

const verifyAdmin = async (req, res) => {
  const { token } = req.body;
  console.log("token", token);
  if (!token) {
    return res.status(401).json({
      EM: "Token is missing",
      EC: 401,
      DT: { isAdmin: false },
    });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, JWT_SECRET);

    const id = decoded.id;
    console.log("id", decoded);
    // Truy vấn để lấy thông tin user từ database
    const [rows] = await pool.query(
      "SELECT vai_tro FROM nguoi_dung WHERE id = ?",
      [id]
    );

    if (rows.length > 0) {
      const user = rows[0];

      // Kiểm tra vai trò của người dùng
      if (user.vai_tro === "admin") {
        return res.status(200).json({
          EM: "User is admin",
          EC: 200,
          DT: { isAdmin: true }, // Người dùng là admin
        });
      } else {
        return res.status(403).json({
          EM: "User is not admin",
          EC: 403,
          DT: { isAdmin: false }, // Người dùng không phải admin
        });
      }
    } else {
      return res.status(404).json({
        EM: "User not found",
        EC: 404,
        DT: { isAdmin: false }, // Người dùng không tìm thấy
      });
    }
  } catch (error) {
    console.error("Error decoding token or querying database:", error);
    return res.status(401).json({
      EM: `Invalid token: ${error.message}`, // Thông báo lỗi token không hợp lệ
      EC: 401,
      DT: { isAdmin: false }, // Token không hợp lệ, trả về false
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
          <p style="margin-top: 10px;">&copy; 2024 PhucShoe2. All rights reserved.</p>
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

  // Mã hóa mật khẩu trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Kiểm tra xem có thiếu thông tin cần thiết không
  if (!EMAIL || !hashedPassword || !HO_TEN || !SO_DIEN_THOAI) {
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
