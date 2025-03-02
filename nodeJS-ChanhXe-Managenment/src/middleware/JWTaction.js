require("dotenv").config();
var jwt = require("jsonwebtoken");

const nonSercurePaths = ["/", "/register", "/login", "/logout"];
const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token;
  try {
    token = jwt.sign(payload, key, { expiresIn: 300000 });
  } catch (e) {
    console.log(e);
  }

  return token;
};
//--
const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (e) {
    console.log(e);
  }
  return decoded;
};
//-- Giải nén cookie
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
    if (decoded) {
      console.log("check decode: ", decoded);
      req.user = decoded;
      req.token = token;
      next();
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
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
