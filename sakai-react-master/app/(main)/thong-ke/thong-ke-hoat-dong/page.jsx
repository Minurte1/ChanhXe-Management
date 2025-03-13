'use client';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ChartData, ChartOptions } from 'chart.js';
import { useAxios } from '@/app/authentication/useAxiosClient';
import { Dropdown } from 'primereact/dropdown';
import DonHangService from '../../../services/donHangSevices';
import spServices from '../../../share/share-services/sp-services';
import { Calendar } from 'primereact/calendar';
import BenXeService from '../../../services/benXeServices';

const ThongKeHoatDong = () => {
  const [lineOptions, setLineOptions] = useState({});

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: []
  });

  const firstDateOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [donHang, setDonHang] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('tong_doanh_thu');
  const [selectedDatasetLabel, setSelectedDatasetLabel] = useState('Tổng Doanh Thu');

  const [benXe, setBenXe] = useState([]);
  const [selectedBenXeDataset, setSelectedBenXeDataset] = useState('tong_doanh_thu');
  const [selectedBenXe, setSelectedBenXe] = useState();
  const [selectedBenXeLabel, setSelectedBenXeLabel] = useState();
  const [selectedBenXeDatasetLabel, setSelectedBenXeDatasetLabel] = useState('Tổng doanh thu');
  const [datasetBenXeOptions, setDatasetBenXeOptions] = useState([]);
  const [selectedBenXeStartDate, setSelectedBenXeStartDate] = useState(firstDateOfMonth);
  const [selectedBenXeEndDate, setSelectedBenXeEndDate] = useState(new Date());
  const [chartBenXeType, setChartBenXeType] = useState('line');
  const [lineBenXeOptions, setLineBenXeOptions] = useState({});
  const [lineBenXeData, setLineBenXeData] = useState({
    labels: [],
    datasets: []
  });

  const [selectedStartDate, setSelectedStartDate] = useState(firstDateOfMonth);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [chartType, setChartType] = useState('line');

  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);
  const donHangSevices = DonHangService(axiosInstance);
  const toast = useRef(null);
  const { formatLoaiHangHoa, getColorChartTrangThai } = spServices;
  const [messageThongKeChung, setMessageThongKeChung] = useState();
  const [messageThongKeBenXe, setMessageThongKeBenXe] = useState();

  useEffect(() => {
    fetchDonHang();
    fetchBenXe();
  }, []);

  useEffect(() => {
    updateChartDataDonHang();
  }, [selectedDataset, selectedStartDate, selectedEndDate, donHang]);

  useEffect(() => {
    updateChartDataBenXe();
  }, [selectedBenXe, selectedBenXeDataset, selectedBenXeStartDate, selectedBenXeEndDate, donHang]);

  const fetchDonHang = async () => {
    try {
      const response = await donHangSevices.getAllOrders();
      setDonHang(response.DT);
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchBenXe = async () => {
    try {
      const response = await benXeService.getAllBenXe();
      setBenXe(response.DT);

      // Map the fetched data to the dropdown options format
      const options = response.DT.map(item => ({
        label: item.ten_ben_xe, // Adjust the property name as needed
        value: item.id // Adjust the property name as needed
      }));
      setDatasetBenXeOptions(options);

      // Set default value for selectedBenXe and selectedBenXeLabel
      if (options.length > 0) {
        setSelectedBenXe(options[0].value);
        setSelectedBenXeLabel(options[0].label);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Lỗi',
      detail: message,
      life: 3000
    });
  };

  const updateChartDataDonHang = () => {
    setLineOptions(spServices.chartTheme('', ''));
    setMessageThongKeChung(null);
    const dateMap = new Map();

    let filteredDonHang = donHang;

    filteredDonHang.sort((a, b) => new Date(a.ngay_tao) - new Date(b.ngay_tao));

    if (selectedStartDate) {
      filteredDonHang = filteredDonHang.filter(item => new Date(item.ngay_tao) >= selectedStartDate);
    }
    if (selectedEndDate) {
      filteredDonHang = filteredDonHang.filter(item => new Date(item.ngay_tao) <= selectedEndDate);
    }

    let totalSum = 0;

    if (selectedDataset === 'don_hang_nhan') {
      // Group items by ngay_tao and loai_hang_hoa
      totalSum = filteredDonHang.length;
      filteredDonHang.forEach(item => {
        const date = new Date(item.ngay_tao);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const loaiHangHoa = formatLoaiHangHoa(item.loai_hang_hoa);

        if (!dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, new Map());
        }

        const loaiHangHoaMap = dateMap.get(formattedDate);
        if (!loaiHangHoaMap.has(loaiHangHoa)) {
          loaiHangHoaMap.set(loaiHangHoa, 0);
        }
        loaiHangHoaMap.set(loaiHangHoa, loaiHangHoaMap.get(loaiHangHoa) + 1);
      });

      // Convert the map to arrays for labels and data
      const labels = Array.from(dateMap.keys());
      const datasets = [];

      const loaiHangHoaSet = new Set();
      dateMap.forEach(loaiHangHoaMap => {
        loaiHangHoaMap.forEach((_, loaiHangHoa) => {
          loaiHangHoaSet.add(loaiHangHoa);
        });
      });

      loaiHangHoaSet.forEach(loaiHangHoa => {
        const data = labels.map(label => {
          const loaiHangHoaMap = dateMap.get(label);
          return loaiHangHoaMap.has(loaiHangHoa) ? loaiHangHoaMap.get(loaiHangHoa) : 0;
        });

        const { text, background } = getColorChartTrangThai(loaiHangHoa);

        datasets.push({
          label: loaiHangHoa,
          data,
          backgroundColor: background,
          borderColor: text,
        });
      });

      setLineData({
        labels,
        datasets
      });

      setLineOptions({
        ...lineOptions,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + '' + context.raw + ' đơn hàng';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              color: 'rgba(100, 99, 99, 0.98)'
            }
          },
          y: {
            stacked: true,
            grid: {
              color: 'rgba(100, 99, 99, 0.98)'
            },
            ticks: {
              stepSize: 1,
              min: 0, 
              callback: function (value) {
                return Number(value).toFixed(0); // Ensure no decimal values
              }
            }
          }
        }
      });
      setChartType('bar');
      setMessageThongKeChung(`Tổng số đơn hàng: ${totalSum} đơn hàng`);
    } else {
      filteredDonHang.forEach(item => {
        const date = new Date(item.ngay_tao);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        if (!dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, 0);
        }

        const currentValue = dateMap.get(formattedDate);
        let newValue = 0;

        if (selectedDataset === 'tong_doanh_thu') {
          newValue = (parseFloat(item.cuoc_phi) || 0) + (parseFloat(item.phi_bao_hiem) || 0) + (parseFloat(item.phu_phi) || 0);
        } else {
          newValue = parseFloat(item[selectedDataset]) || 0; // Ensure the value is a number
        }

        dateMap.set(formattedDate, currentValue + newValue);
        totalSum += newValue;
      });

      // Convert the map to arrays for labels and data
      const labels = Array.from(dateMap.keys());
      const dataset1 = Array.from(dateMap.values());

      setLineData({
        labels,
        datasets: [
          {
            label: selectedDatasetLabel,
            data: dataset1,
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
          }
        ]
      });
      setLineOptions(spServices.chartTheme('', '', (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)));
      setChartType('line');
      const formattedTotalSum = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSum);
      setMessageThongKeChung(`Tổng giá trị: ${formattedTotalSum}`);
    }
  };

  const updateChartDataBenXe = () => {

    setLineBenXeOptions(spServices.chartTheme('', ''));
    const dateMap = new Map();

    let filteredDonHang = donHang;

    filteredDonHang.sort((a, b) => new Date(a.ngay_tao) - new Date(b.ngay_tao));

    let totalSum = 0;

    if (selectedBenXeStartDate) {
      filteredDonHang = filteredDonHang.filter(item => new Date(item.ngay_tao) >= selectedBenXeStartDate);
    }
    if (selectedBenXeEndDate) {
      filteredDonHang = filteredDonHang.filter(item => new Date(item.ngay_tao) <= selectedBenXeEndDate);
    }

    if (selectedBenXeDataset === 'don_hang_nhan' || selectedBenXeDataset === 'don_hang_gui') {

      if (selectedBenXeDataset === 'don_hang_nhan') {
        filteredDonHang = filteredDonHang.filter(item => item.id_ben_xe_nhan === selectedBenXe);
      };
      if (selectedBenXeDataset === 'don_hang_gui') {
        filteredDonHang = filteredDonHang.filter(item => item.id_ben_xe_gui === selectedBenXe);
      };

      totalSum = filteredDonHang.length;
      filteredDonHang.forEach(item => {
        const date = new Date(item.ngay_tao);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const loaiHangHoa = formatLoaiHangHoa(item.loai_hang_hoa);

        if (!dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, new Map());
        }

        const loaiHangHoaMap = dateMap.get(formattedDate);
        if (!loaiHangHoaMap.has(loaiHangHoa)) {
          loaiHangHoaMap.set(loaiHangHoa, 0);
        }
        loaiHangHoaMap.set(loaiHangHoa, loaiHangHoaMap.get(loaiHangHoa) + 1);
      });

      // Convert the map to arrays for labels and data
      const labels = Array.from(dateMap.keys());
      const datasets = [];

      const loaiHangHoaSet = new Set();
      dateMap.forEach(loaiHangHoaMap => {
        loaiHangHoaMap.forEach((_, loaiHangHoa) => {
          loaiHangHoaSet.add(loaiHangHoa);
        });
      });

      loaiHangHoaSet.forEach(loaiHangHoa => {
        const data = labels.map(label => {
          const loaiHangHoaMap = dateMap.get(label);
          return loaiHangHoaMap.has(loaiHangHoa) ? loaiHangHoaMap.get(loaiHangHoa) : 0;
        });

        const { text, background } = getColorChartTrangThai(loaiHangHoa);

        datasets.push({
          label: loaiHangHoa,
          data,
          backgroundColor: background,
          borderColor: text,
        });
      });

      setLineBenXeData({
        labels,
        datasets
      });

      setLineBenXeOptions({
        ...lineBenXeOptions,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + '' + context.raw + ' đơn hàng';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              color: 'rgba(100, 99, 99, 0.98)'
            }
          },
          y: {
            stacked: true,
            grid: {
              color: 'rgba(100, 99, 99, 0.98)'
            },
            ticks: {
              stepSize: 1,
              min: 0, 
              callback: function (value) {
                return Number(value).toFixed(0); // Ensure no decimal values
              }
            }
          }
        }
      });
      setChartBenXeType('bar');
      setMessageThongKeBenXe(`Tổng số đơn hàng: ${totalSum} đơn hàng`);
    } else {
      filteredDonHang = filteredDonHang.filter(item => item.id_ben_xe_gui === selectedBenXe);
      filteredDonHang.forEach(item => {
        const date = new Date(item.ngay_tao);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        if (!dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, 0);
        }

        const currentValue = dateMap.get(formattedDate);
        let newValue = 0;

        if (selectedBenXeDataset === 'tong_doanh_thu') {
          newValue = (parseFloat(item.cuoc_phi) || 0) + (parseFloat(item.phi_bao_hiem) || 0) + (parseFloat(item.phu_phi) || 0);
        } else {
          newValue = parseFloat(item[selectedBenXeDataset]) || 0; // Ensure the value is a number
        }

        dateMap.set(formattedDate, currentValue + newValue);
        totalSum += newValue;
      });

      // Convert the map to arrays for labels and data
      const labels = Array.from(dateMap.keys());
      const dataset1 = Array.from(dateMap.values());

      setLineBenXeData({
        labels,
        datasets: [
          {
            label: selectedBenXeDatasetLabel,
            data: dataset1,
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
          }
        ]
      });
      setLineBenXeOptions(spServices.chartTheme('', '', (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)));
      setChartBenXeType('line');
      const formattedTotalSum = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSum);
      setMessageThongKeBenXe(`Tổng giá trị: ${formattedTotalSum}`);
    }
  };

  const handleDatasetChange = (e, options, setDataset, setLabel) => {
    const selectedOption = options.find(option => option.value === e.value);
    setDataset(selectedOption.value);
    setLabel(selectedOption.label);
  };

  const handleDateChange = (setter) => (e) => {
    setter(e.value);
  };

  const datasetOptions = [
    { label: 'Tổng doanh thu', value: 'tong_doanh_thu' },
    { label: 'Các đơn hàng đã tiếp nhận', value: 'don_hang_nhan' },
  ];

  const dataOptionsBenXe = [
    { label: 'Tổng doang thu', value: 'tong_doanh_thu' },
    { label: 'Các đơn hàng bến nhận', value: 'don_hang_nhan' },
    { label: 'Các đơn hàng được gửi từ bến', value: 'don_hang_gui' },
    // { label: 'Test', value: 'id' }
  ];

  return (
    <div>
      <Toast ref={toast} />
      <div>
        <div className="card">
          <div style={{ width: '100%' }}>
            <h5>Thống Kê Chung</h5>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '15px' }}>
                <label htmlFor='d_k_thong_ke' style={{ marginBottom: '5px' }}>Điều kiện thống kê:</label>
                <Dropdown
                  id='d_k_thong_ke'
                  value={selectedDataset}
                  options={datasetOptions}
                  onChange={(e) => handleDatasetChange(e, datasetOptions, setSelectedDataset, setSelectedDatasetLabel)}
                  placeholder="Chọn một điều kiện thống kê"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '20px' }}>
                <label htmlFor='thoi_gian_thong_ke_1' style={{ marginBottom: '5px' }}>Từ ngày:</label>
                <Calendar
                  id='thoi_gian_thong_ke_1'
                  value={selectedStartDate}
                  onChange={handleDateChange(setSelectedStartDate)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  readOnlyInput
                  maxDate={selectedEndDate ? new Date(new Date(selectedEndDate).setDate(new Date(selectedEndDate).getDate() - 1)) : null}
                  placeholder="Chọn thời gian bắt đầu" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '20px' }}>
              <label htmlFor='thoi_gian_thong_ke_1' style={{ marginBottom: '5px' }}>Đến ngày:</label>
                <Calendar
                  id='thoi_gian_thong_ke_2'
                  value={selectedEndDate}
                  onChange={handleDateChange(setSelectedEndDate)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  readOnlyInput
                  minDate={selectedStartDate ? new Date(new Date(selectedStartDate).setDate(new Date(selectedStartDate).getDate() + 1)) : null}
                  placeholder="Chọn thời gian kết thúc" />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <label>{messageThongKeChung}</label>
            </div>
            <div style={{ marginTop: '5px' }}>
              <Chart type={chartType} data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginTop: '15px' }}>
          <div style={{ width: '100%' }}>
            <h5>Thống Kê Theo Bến Xe</h5>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '15px' }}>
                <label htmlFor='id_ben_xe' style={{ marginBottom: '5px' }}>Bến xe:</label>
                <Dropdown
                  id='id_ben_xe'
                  value={selectedBenXe}
                  options={datasetBenXeOptions}
                  onChange={(e) => handleDatasetChange(e, datasetBenXeOptions, setSelectedBenXe, setSelectedBenXeLabel)}
                  placeholder="Chọn một bến xe"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '20px' }}>
                <label htmlFor='d_k_thong_ke' style={{ marginBottom: '5px' }}>Điều kiện thống kê:</label>
                <Dropdown
                  id='d_k_thong_ke'
                  value={selectedBenXeDataset}
                  options={dataOptionsBenXe}
                  onChange={(e) => handleDatasetChange(e, dataOptionsBenXe, setSelectedBenXeDataset, setSelectedBenXeDatasetLabel)}
                  placeholder="Chọn một điều kiện thống kê"
                />
              </div>
            {/* </div>

            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'row' }}> */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '20px' }}>
                <label htmlFor='tg_thong_ke_1_bx' style={{ marginBottom: '5px' }}>Từ ngày:</label>
                <Calendar
                  id='tg_thong_ke_1_bx'
                  value={selectedBenXeStartDate}
                  onChange={handleDateChange(setSelectedBenXeStartDate)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  readOnlyInput
                  maxDate={selectedBenXeEndDate ? new Date(new Date(selectedBenXeEndDate).setDate(new Date(selectedBenXeEndDate).getDate() - 1)) : null}
                  placeholder="Chọn thời gian bắt đầu" />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '20px' }}>
                <label htmlFor='tg_thong_ke_2_bx' style={{ marginBottom: '5px' }}>Đến ngày:</label>
                <Calendar
                  id='tg_thong_ke_2_bx'
                  value={selectedBenXeEndDate}
                  onChange={handleDateChange(setSelectedBenXeEndDate)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  readOnlyInput
                  minDate={selectedBenXeStartDate ? new Date(new Date(selectedBenXeStartDate).setDate(new Date(selectedBenXeStartDate).getDate() + 1)) : null}
                  placeholder="Chọn thời gian kết thúc" />
              </div>

            </div>

            <div style={{ marginTop: '20px' }}>
              <label>{messageThongKeBenXe}</label>
            </div>
            <div style={{ marginTop: '5px' }}>
              <Chart type={chartBenXeType} data={lineBenXeData} options={lineBenXeOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKeHoatDong;