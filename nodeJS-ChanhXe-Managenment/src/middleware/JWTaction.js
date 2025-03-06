require("dotenv").config();
var jwt = require("jsonwebtoken");

const nonSercurePaths = ["/", "/register", "/login", "/logout"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token;
  try {
    token = jwt.sign(payload, key, { expiresIn: "15m" }); // Access token expires in 15 minutes
  } catch (e) {
    console.log(e);
  }
  return token;
};

const createRefreshToken = (payload) => {
  let key = process.env.JWT_REFRESH_SECRET;
  let token;
  try {
    token = jwt.sign(payload, key, { expiresIn: "7d" }); // Refresh token expires in 7 days
  } catch (e) {
    console.log(e);
  }
  return token;
};

const verifyToken = (token, isRefreshToken = false) => {
  let key = isRefreshToken
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      //console.log('Token expired');
      return { expired: true };
    }
    console.log(e);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  if (nonSercurePaths.includes(req.path)) return next();
  let cookie = req.cookies;

  let tokenFromHeader = extractToken(req);

  if ((cookie && cookie.jwt) || tokenFromHeader) {
    let token = cookie && cookie.jwt ? cookie.jwt : tokenFromHeader;
    let decoded = verifyToken(token);
    if (decoded && !decoded.expired) {
      req.user = decoded;
      req.token = token;
      next();
    } else if (decoded && decoded.expired) {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Token expired",
      });
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Không thể xác thực được user này.",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Không thể xác thực được user này.",
    });
  }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Refresh token is required",
    });
  }

  const decoded = verifyToken(refreshToken, true);
  if (!decoded) {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Invalid refresh token",
    });
  }

  const newAccessToken = createJWT({ id: decoded.id });
  // const newRefreshToken = createRefreshToken({ id: decoded.id });

  // res.cookie('refreshToken', newRefreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production', // Set to true in production
  //   sameSite: 'strict',
  // });

  return res.status(200).json({
    EC: 1,
    DT: {
      accessToken: newAccessToken,
      userInfo: {
        id: decoded.id,
        email: decoded.email,
        ho_ten: decoded.ho_ten,
        so_dien_thoai: decoded.so_dien_thoai,
        vai_tro: decoded.vai_tro,
        trang_thai: decoded.trang_thai,
        id_nguoi_cap_nhat: decoded.id_nguoi_cap_nhat,
        ngay_cap_nhat: decoded.ngay_cap_nhat,
        ngay_tao: decoded.ngay_tao,
      },
    },
    EM: "Token refreshed successfully",
  });
};

// kiểm tra đúng role không?
const checkUserPermission = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.vai_tro;
    const userStatus = req.user.trang_thai;
    if (userStatus === "tam_ngung") {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Tài khoản của bạn bị tạm ngưng hoạt động !!",
      });
    }
    if (!allowedRoles.includes(userRole)) {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Bạn không thuộc phân quyền này.",
      });
    }
    next();
  };
};
module.exports = {
  createJWT,
  createRefreshToken,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
  refreshAccessToken,
};
