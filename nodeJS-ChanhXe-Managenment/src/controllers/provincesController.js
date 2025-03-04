const pool = require("../config/database");

const getProvincesAll = async (req, res) => {
  try {
    // Kết nối và thực thi query
    const [rows] = await pool.query("SELECT * FROM provinces");

    // Trả dữ liệu cho client
    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch provinces",
    });
  }
};
// Lấy danh sách quận/huyện theo ID tỉnh
const getDistricts_ProvincesId = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID tỉnh từ tham số URL

    // Kiểm tra nếu không có provinceId
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Province ID is required",
      });
    }
    console.log("id", id);
    // Thực thi truy vấn
    const [rows] = await pool.query(
      "SELECT * FROM districts WHERE province_code = ?",
      [id]
    );
    console.log("rows", rows);
    // Trả dữ liệu cho client
    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch districts",
    });
  }
};

// Lấy danh sách phường/xã theo ID quận/huyện
const getWards_DistrictsId = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID quận/huyện từ tham số URL

    // Kiểm tra nếu không có districtId
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "District ID is required",
      });
    }

    // Thực thi truy vấn
    const [rows] = await pool.query(
      "SELECT * FROM wards WHERE district_code = ?",
      [id]
    );

    // Trả dữ liệu cho client
    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching wards:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch wards",
    });
  }
};

// Xuất các hàm
module.exports = {
  getProvincesAll,
  getDistricts_ProvincesId,
  getWards_DistrictsId,
};
