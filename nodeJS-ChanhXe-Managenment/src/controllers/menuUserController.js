const pool = require("../config/database"); // Kết nối cơ sở dữ liệu
const { getMenuItems } = require("../services/menuService");

const getMenuUser = async (req, res) => {
  const roleUser = req.user.vai_tro;

  try {
    const menuUser = await getMenuItems(roleUser);
    console.log("menuUser", menuUser);
    return res.status(200).json({
      EM: "Lấy menu thành công",
      EC: 1,
      DT: menuUser,
    });
  } catch (error) {
    console.error("Lấy menu thất bại:", error);
    return res
      .status(500)
      .json({ EM: `Lỗi: ${error.message}`, EC: -1, DT: {} });
  }
};
module.exports = { getMenuUser };
