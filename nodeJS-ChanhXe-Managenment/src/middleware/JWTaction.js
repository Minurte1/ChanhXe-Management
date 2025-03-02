require("dotenv").config();
var jwt = require("jsonwebtoken");

const nonSercurePaths = ["/", "/register", "/login", "/logout"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token;
  try {
    token = jwt.sign(payload, key, { expiresIn: '15m' }); // Access token expires in 15 minutes
  } catch (e) {
    console.log(e);
  }
  return token;
};

const createRefreshToken = (payload) => {
  let key = process.env.JWT_REFRESH_SECRET;
  let token;
  try {
    token = jwt.sign(payload, key, { expiresIn: '7d' }); // Refresh token expires in 7 days
  } catch (e) {
    console.log(e);
  }
  return token;
};

const verifyToken = (token, isRefreshToken = false) => {
  let key = isRefreshToken ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (e) {
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
    if (decoded) {
      console.log("check decode: ", decoded);
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "không xác thực được user",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "không thể xác thực được user này",
    });
  }
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
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
  const newRefreshToken = createRefreshToken({ id: decoded.id });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict',
  });

  return res.status(200).json({
    EC: 0,
    DT: {
      accessToken: newAccessToken,
    },
    EM: "Token refreshed successfully",
  });
};

module.exports = {
  createJWT,
  createRefreshToken,
  verifyToken,
  checkUserJWT,
  refreshToken,
};
// module.exports = {
//   createJWT,
//   verifyToken,
//   checkUserJWT,
//   // checkUserPermission,
// };
