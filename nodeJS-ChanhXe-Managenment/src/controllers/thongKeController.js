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
    // Doanh thu tuần này
    const [currentWeekRows] = await pool.execute(`
      SELECT SUM(cuoc_phi) AS total_revenue
      FROM don_hang
      WHERE YEARWEEK(ngay_tao, 1) = YEARWEEK(CURDATE(), 1)
    `);

    // Doanh thu tuần trước
    const [lastWeekRows] = await pool.execute(`
      SELECT SUM(cuoc_phi) AS total_revenue
      FROM don_hang
      WHERE YEARWEEK(ngay_tao, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
    `);

    const currentRevenue = currentWeekRows[0].total_revenue || 0;
    const lastRevenue = lastWeekRows[0].total_revenue || 0;

    // Tính phần trăm tăng/giảm
    let percentChange = 0;
    if (lastRevenue > 0) {
      percentChange = ((currentRevenue - lastRevenue) / lastRevenue) * 100;
    }

    res.json({
      total_revenue: currentRevenue,
      percent_change: Math.round(percentChange),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thống kê khách hàng
const getTotalCustomers = async (req, res) => {
  try {
    // Tổng số khách hàng
    const [totalRows] = await pool.execute(
      "SELECT COUNT(*) as total_customers FROM khach_hang"
    );

    // Số lượng khách hàng mới trong tuần này
    const [newThisWeekRows] = await pool.execute(`
      SELECT COUNT(*) AS new_customers_this_week
      FROM khach_hang
      WHERE YEARWEEK(ngay_tao, 1) = YEARWEEK(CURDATE(), 1)
    `);

    res.json({
      total_customers: totalRows[0].total_customers || 0,
      new_customers_this_week: newThisWeekRows[0].new_customers_this_week || 0,
    });
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
      SELECT 
        dh.ma_van_don, 
        dh.ten_nguoi_nhan, 
        dh.cuoc_phi, 
        dh.trang_thai,
        kh.id AS nguoi_gui_id,
        kh.ho_ten AS ten_nguoi_gui,
        kh.so_dien_thoai AS khach_hang_so_dien_thoai,
        kh.dia_chi AS khach_hang_dia_chi,
        kh.ngay_tao AS khach_hang_ngay_tao,
        kh.ngay_cap_nhat AS khach_hang_ngay_cap_nhat
      FROM don_hang dh
      JOIN khach_hang kh ON dh.nguoi_gui_id = kh.id
      ORDER BY dh.ngay_tao DESC 
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.log("error", error);
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
