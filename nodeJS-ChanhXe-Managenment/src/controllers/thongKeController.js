const pool = require("../config/database"); // Kết nối cơ sở dữ liệu

// 1. Tổng quan
const getTotalOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total_orders FROM don_hang"
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT SUM(cuoc_phi) as total_revenue FROM don_hang"
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Thống kê khách hàng
const getTotalCustomers = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total_customers FROM khach_hang"
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Thống kê các chuyến xe đang vận chuyển
const getActiveTrips = async (req, res) => {
  try {
    const [activeRows] = await pool.execute(
      "SELECT COUNT(*) as active_trips FROM chuyen_xe WHERE trang_thai = 'dang_van_chuyen'"
    );
    const [arrivedRows] = await pool.execute(
      "SELECT COUNT(*) as arrived_trips FROM chuyen_xe WHERE trang_thai = 'da_cap_ben'"
    );

    res.json({
      active_trips: activeRows[0].active_trips,
      arrived_trips: arrivedRows[0].arrived_trips,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Biểu đồ
const getRevenueByMonth = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT MONTH(ngay_tao) as month, SUM(cuoc_phi) as revenue 
      FROM don_hang 
      GROUP BY MONTH(ngay_tao)
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersByMonth = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT MONTH(ngay_tao) as month, COUNT(*) as order_count 
      FROM don_hang 
      GROUP BY MONTH(ngay_tao)
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Danh sách đơn hàng gần đây
const getRecentOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT ma_van_don, ten_nguoi_nhan, cuoc_phi, trang_thai 
      FROM don_hang 
      ORDER BY ngay_tao DESC 
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Loại hàng hóa phổ biến
const getPopularTypes = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT loai_hang_hoa, COUNT(*) as order_count 
      FROM don_hang 
      GROUP BY loai_hang_hoa 
      ORDER BY order_count DESC 
      LIMIT 5
    `);
    const [total] = await pool.execute(
      "SELECT COUNT(*) as total FROM don_hang"
    );
    const totalOrders = total[0].total;
    const result = rows.map((row) => ({
      loai_hang_hoa: row.loai_hang_hoa,
      order_count: row.order_count,
      percentage: ((row.order_count / totalOrders) * 100).toFixed(2),
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Thông báo
const getNewOrdersToday = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT ma_van_don, ten_nguoi_nhan, cuoc_phi 
      FROM don_hang 
      WHERE DATE(ngay_tao) = CURDATE()
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTripsToday = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT xe_id, thoi_gian_xuat_ben 
      FROM chuyen_xe 
      WHERE DATE(thoi_gian_xuat_ben) = CURDATE()
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTotalOrders,
  getRevenue,
  getTotalCustomers,
  getActiveTrips,
  getRevenueByMonth,
  getOrdersByMonth,
  getRecentOrders,
  getPopularTypes,
  getNewOrdersToday,
  getTripsToday,
};
