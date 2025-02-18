import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const DashboardAdmin = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [topFiveBestSellers, setTopFiveBestSellers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [revenueStats, setRevenueStats] = useState({
    dailyRevenue: [],
    monthlyRevenue: [],
    yearlyRevenue: [],
  });

  const api = process.env.REACT_APP_URL_SERVER; // URL API của bạn

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch thống kê chung
        const ordersRes = await axios.get(`${api}/thong-ke/orders`);
        setTotalOrders(ordersRes.data.DT.total_orders);

        const revenueRes = await axios.get(`${api}/thong-ke/revenue`);
        setTotalRevenue(revenueRes.data.DT.total_revenue);

        const customersRes = await axios.get(`${api}/thong-ke/customers`);
        setTotalCustomers(customersRes.data.DT.total_customers);

        const bestSellersRes = await axios.get(`${api}/thong-ke/best-seller`);
        setTopFiveBestSellers(bestSellersRes.data.DT);

        const onlineUsersRes = await axios.get(`${api}/thong-ke/online-users`);
        setOnlineUsers(onlineUsersRes.data.DT.online_users);

        // Fetch doanh thu theo ngày, tháng, năm
        const revenueStatsRes = await axios.get(
          "http://localhost:3002/thong-ke/ngay/thang/nam"
        );
        setRevenueStats(revenueStatsRes.data);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchData();
  }, []);

  // Gộp dữ liệu cho biểu đồ đường
  const combinedChartData = {
    labels: [
      ...revenueStats.dailyRevenue.map((item) =>
        new Date(item.ngay).toLocaleDateString("vi-VN")
      ),
      ...revenueStats.monthlyRevenue.map((item) => `${item.thang}/${item.nam}`),
      ...revenueStats.yearlyRevenue.map((item) => item.nam),
    ],
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: revenueStats.dailyRevenue.map((item) => item.doanhThu),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Doanh thu theo tháng",
        data: revenueStats.monthlyRevenue.map((item) => item.doanhThu),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Doanh thu theo năm",
        data: revenueStats.yearlyRevenue.map((item) => item.doanhThu),
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const bestSellersChartData = {
    labels: topFiveBestSellers.map((item) => item.TENSANPHAM),
    datasets: [
      {
        label: "Số lượng bán",
        data: topFiveBestSellers.map((item) => item.total_sold),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>Thống kê</h1>

      {/* Doanh thu */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Doanh thu</h2>
        <p>
          <strong>Tổng doanh thu:</strong>{" "}
          {totalRevenue ? totalRevenue.toLocaleString() : "0"} VND
        </p>
        {/* Thống kê chung */}
        <div style={{ marginBottom: "20px" }}>
          <h2>Thống kê chung</h2>
          <p>
            <strong>Đơn hàng:</strong>{" "}
            {totalOrders ? totalOrders.toLocaleString() : "0"} <br />
            <strong>Khách hàng:</strong>{" "}
            {totalCustomers ? totalCustomers.toLocaleString() : "0"} <br />
            <strong>Số lượng người dùng thanh toán online:</strong>{" "}
            {onlineUsers ? onlineUsers.toLocaleString() : "0"}
          </p>
        </div>
      </div>

      {/* 5 sản phẩm bán chạy nhất */}
      <div style={{ marginBottom: "20px" }}>
        <h2>5 sản phẩm bán chạy nhất</h2>
        <Bar data={bestSellersChartData} />
      </div>

      {/* Biểu đồ doanh thu theo ngày, tháng, năm */}

      <div style={{ marginBottom: "20px" }}>
        <h2>Biểu đồ doanh thu</h2>
        <Line data={combinedChartData} />
      </div>
    </div>
  );
};

export default DashboardAdmin;
