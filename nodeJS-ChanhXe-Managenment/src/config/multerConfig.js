// multerConfig.js

const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path"); // Ensure appRoot is correctly set in your environment

// Disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/images/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Image file filter function
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Export configured multer instance
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 100 * 1024 * 1024, // Cho phép mỗi trường dữ liệu tối đa 100MB
  },
  fileFilter: imageFilter,
});

module.exports = upload;
