/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';
import DashboardService from '../services/thongKeServices';
import { useAxios } from '../authentication/useAxiosClient';
interface PopularType {
  loai_hang_hoa: string;
  order_count: number;
  percentage: number;
}
interface Order {
  ten_nguoi_nhan: string;
  ma_van_don: string;
  cuoc_phi: number;
}

interface Trip {
  xe_id: string;
  bien_so: string;
  tai_xe_nguoi_dung_id: number;
  ten_tai_xe: string;
  sdt_tai_xe: string;
  thoi_gian_xuat_ben: string;
  ten_ben_xe_nhan: string;
  ten_ben_xe_gui: string;
}

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [tripStats, setTripStats] = useState({ active_trips: 0, arrived_trips: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularTypes, setPopularTypes] = useState<PopularType[]>([]);

  const [newOrdersToday, setNewOrdersToday] = useState<Order[]>([]);
  const [tripsToday, setTripsToday] = useState<Trip[]>([]);

  const [revenueByMonth, setRevenueByMonth] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [percentChange, setPercentChange] = useState(0);
  const [newCustomersThis_week, setNewCustomersThisWeek] = useState(0);
  const menu1 = useRef<Menu>(null);
  const menu2 = useRef<Menu>(null);
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const { layoutConfig } = useContext(LayoutContext);

  const applyLightTheme = () => {
    const lineOptions: ChartOptions = {
      plugins: { legend: { labels: { color: '#495057' } } },
      scales: {
        x: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
        y: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } }
      }
    };
    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: { legend: { labels: { color: '#ebedef' } } },
      scales: {
        x: { ticks: { color: '#ebedef' }, grid: { color: 'rgba(160, 167, 181, .3)' } },
        y: { ticks: { color: '#ebedef' }, grid: { color: 'rgba(160, 167, 181, .3)' } }
      }
    };
    setLineOptions(lineOptions);
  };

  const formatCurrency = (value: number) => {
    return value?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  const axiosInstance = useAxios();

  const dashboardService = DashboardService(axiosInstance);
  // Gọi API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalOrdersRes, revenueRes, totalCustomersRes, tripStatsRes, recentOrdersRes, popularTypesRes, newOrdersTodayRes, tripsTodayRes, revenueByMonthRes] = await Promise.all([
          dashboardService.getTotalOrders(),
          dashboardService.getRevenue(),
          dashboardService.getTotalCustomers(),
          dashboardService.getActiveTrips(),
          dashboardService.getRecentOrders(),
          dashboardService.getPopularTypes(),
          dashboardService.getNewOrdersToday(),
          dashboardService.getTripsToday(),
          dashboardService.getRevenueByMonth()
        ]);

        // Xử lý dữ liệu ở đây
        setTotalOrders(totalOrdersRes.total_orders || 0);
        setRevenue(revenueRes.total_revenue || 0);

        setPercentChange(revenueRes.percent_change);
        setTotalCustomers(totalCustomersRes.total_customers || 0);

        setNewCustomersThisWeek(totalCustomersRes.new_customers_this_week || 0);

        setTripStats({
          active_trips: tripStatsRes.active_trips || 0,
          arrived_trips: tripStatsRes.arrived_trips || 0
        });
        setRecentOrders(recentOrdersRes || []);
        setPopularTypes(popularTypesRes || []);
        setNewOrdersToday(newOrdersTodayRes || []);
        setTripsToday(tripsTodayRes || []);
        // Chart xử lý riêng
        setRevenueByMonth({
          labels: (revenueByMonthRes || []).map((item: any) => `Tháng ${item.month}`),
          datasets: [
            {
              label: 'Doanh thu',
              data: (revenueByMonthRes || []).map((item: any) => item.revenue || 0),
              fill: false,
              backgroundColor: '#2f4860',
              borderColor: '#2f4860',
              tension: 0.4
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (layoutConfig.colorScheme === 'light') applyLightTheme();
    else applyDarkTheme();
  }, [layoutConfig.colorScheme]);

  const translateLoaiHang = (loai: string) => {
    const map: { [key: string]: string } = {
      hang_de_vo: 'Hàng Dễ Vỡ',
      hang_thong_thuong: 'Hàng Thông Thường',
      hang_nguy_hiem: 'Hàng Nguy Hiểm',
      hang_dong_lanh: 'Hàng Đông Lạnh',
      hang_kho: 'Hàng Khô'
    };
    return map[loai] || loai;
  };

  return (
    <div className="grid">
      {/* Tổng quan */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Đơn hàng</span>
              <div className="text-900 font-medium text-xl">{totalOrders}</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">{newOrdersToday.length} mới </span>
          <span className="text-500">hôm nay</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Doanh thu</span>
              <div className="text-900 font-medium text-xl">{formatCurrency(revenue)}</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-dollar text-orange-500 text-xl" />
            </div>
          </div>
          <span className={`${percentChange >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>{percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`}</span>

          <span className="text-500"> so với tuần trước</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Khách hàng</span>
              <div className="text-900 font-medium text-xl">{totalCustomers}</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-users text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">{newCustomersThis_week} </span>
          <span className="text-500">mới đăng ký</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Chuyến xe</span>
              <div className="text-900 font-medium text-xl">{tripStats.arrived_trips} đã cập bến</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-truck text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">{tripStats.active_trips} </span>
          <span className="text-500">đang vận chuyển</span>
        </div>
      </div>

      {/* Đơn hàng gần đây & Loại hàng hóa phổ biến */}
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Đơn hàng gần đây</h5>
          <DataTable value={recentOrders} rows={5} paginator responsiveLayout="scroll">
            <Column field="ma_van_don" header="Mã vận đơn" sortable style={{ width: '35%' }} />
            <Column field="ten_nguoi_nhan" header="Người nhận" sortable style={{ width: '35%' }} />
            <Column field="ten_nguoi_gui" header="Người gửi" sortable style={{ width: '35%' }} />
            <Column field="cuoc_phi" header="Cước phí" sortable style={{ width: '20%' }} body={(data) => formatCurrency(data?.cuoc_phi || 0)} />
            {/* <Column header="Xem" style={{ width: '10%' }} body={() => <Button icon="pi pi-search" text />} /> */}
          </DataTable>
        </div>
        <div className="card">
          <div className="flex justify-content-between align-items-center mb-5">
            <h5>Loại hàng hóa phổ biến</h5>
            <div>
              <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu1.current?.toggle(event)} />
              <Menu
                ref={menu1}
                popup
                model={[
                  { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                  { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                ]}
              />
            </div>
          </div>
          <ul className="list-none p-0 m-0">
            {popularTypes.map((item, index) => (
              <li key={index} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                  <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{translateLoaiHang(item.loai_hang_hoa)}</span>
                  <div className="mt-1 text-600">{item.order_count} đơn</div>
                </div>
                <div className="mt-2 md:mt-0 flex align-items-center">
                  <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                    <div className="bg-orange-500 h-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="text-orange-500 ml-3 font-medium">{item.percentage}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Biểu đồ & Thông báo */}
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Tổng quan doanh thu</h5>
          <Chart type="line" data={revenueByMonth} options={lineOptions} />
        </div>

        <div className="card">
          <div className="flex align-items-center justify-content-between mb-4">
            <h5>Thông báo</h5>
            <div>
              <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu2.current?.toggle(event)} />
              <Menu
                ref={menu2}
                popup
                model={[
                  { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                  { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                ]}
              />
            </div>
          </div>

          <span className="block text-600 font-medium mb-3">HÔM NAY</span>
          <ul className="p-0 mx-0 mt-0 mb-4 list-none">
            {newOrdersToday.map((order, index) => (
              <li key={index} className="flex align-items-center py-2 border-bottom-1 surface-border">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                  <i className="pi pi-dollar text-xl text-blue-500" />
                </div>
                <span className="text-900 line-height-3">
                  {order.ten_nguoi_nhan}{' '}
                  <span className="text-700">
                    đã đặt đơn <span className="text-blue-500">{order.ma_van_don}</span> với cước {formatCurrency(order.cuoc_phi || 0)}
                  </span>
                </span>
              </li>
            ))}
            {tripsToday.map((trip, index) => (
              <li key={index} className="flex align-items-center py-2">
                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                  <i className="pi pi-truck text-xl text-orange-500" />
                </div>
                <span className="text-700 line-height-3">
                  Chuyến xe <span className="text-blue-500 font-medium">{trip.bien_so}</span> đã xuất bến lúc {new Date(trip.thoi_gian_xuat_ben).toLocaleTimeString()} từ bến <span className="text-blue-500 font-medium">{trip.ten_ben_xe_gui}</span> đến{' '}
                  <span className="text-blue-500 font-medium">{trip.ten_ben_xe_nhan}</span> do tài xế <span className="text-green-500 font-medium">{trip.ten_tai_xe}</span>.
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
