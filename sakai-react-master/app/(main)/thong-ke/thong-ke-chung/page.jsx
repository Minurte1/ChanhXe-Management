'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ChartData, ChartOptions } from 'chart.js';
import { useAxios } from '@/app/authentication/useAxiosClient';
import { Dropdown } from 'primereact/dropdown';
import DonHangService from '../../../services/donHangSevices';
import spServices from '../../../share/share-services/sp-services';
import { Calendar } from 'primereact/calendar';

const ThongKeChung = () => {
  const [lineOptions, setLineOptions] = useState({});

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: []
  });

  const [donHang, setDonHang] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('tong_doanh_thu');
  const [selectedDatasetLabel, setSelectedDatasetLabel] = useState('Tổng Doanh Thu');

  const firstDateOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [selectedStartDate, setSelectedStartDate] = useState(firstDateOfMonth);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [chartType, setChartType] = useState('line');

  const axiosInstance = useAxios();
  const donHangSevices = DonHangService(axiosInstance);
  const toast = useRef(null);
  const { getColorTrangThai, formatLoaiHangHoa, getColorChartTrangThai } = spServices;

  useEffect(() => {
    fetchDonHang();
  }, []);

  useEffect(() => {
    updateChartDataDonHang();
  }, [selectedDataset, selectedStartDate, selectedEndDate, donHang]);

  const fetchDonHang = async () => {
    try {
      const response = await donHangSevices.getAllOrders();
      setDonHang(response.DT);
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
    console.log("a", selectedDataset);
    setLineOptions(spServices.chartTheme('', ''));
    const dateMap = new Map();

    let filteredDonHang = donHang;

    console.log("b", donHang);

    filteredDonHang.sort((a, b) => new Date(a.ngay_tao) - new Date(b.ngay_tao));

    if (selectedStartDate) {
      filteredDonHang = filteredDonHang.filter(item => new Date(item.ngay_tao) >= selectedStartDate);
    }
    if (selectedEndDate) {
      filteredDonHang = filteredDonHang.filter(item => new Date(item.ngay_tao) <= selectedEndDate);
    }

    if (selectedDataset === 'don_hang_nhan') {
      // Group items by ngay_tao and loai_hang_hoa
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
                return context.dataset.label + ': ' + '' + context.raw + '';
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
              callback: function (value) {
                return Number(value).toFixed(0); // Ensure no decimal values
              }
            }
          }
        }
      });
      setChartType('bar');
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
    }
  };

  const handleDatasetChange = (e, options, setDataset, setLabel) => {
    const selectedOption = options.find(option => option.value === e.value);
    console.log("selectedOption", selectedOption);

    setDataset(selectedOption.value);

    console.log("selectedDataset", selectedDataset);
    setLabel(selectedOption.label);

  };

  const handleStartDateChange = (e) => {
    setSelectedStartDate(e.value);
  };

  const handleEndDateChange = (e) => {
    setSelectedEndDate(e.value);
  };

  const handleThongKe = () => {
    updateChartDataDonHang();
  };

  const datasetOptions = [
    { label: 'Tổng doanh thu', value: 'tong_doanh_thu' },
    { label: 'Các đơn hàng đã tiếp nhận', value: 'don_hang_nhan' },
  ];

  return (
    <div>
      <Toast ref={toast} />
      <div>
        <div className="card">
          <div style={{ width: '100%' }}>
            <h5>Thống Kê Chung</h5>
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'row' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '15px' }}>
                <label htmlFor='thoi_gian_thong_ke_1' style={{ marginBottom: '5px' }}>Từ ngày:</label>
                <Calendar
                  id='thoi_gian_thong_ke_1'
                  value={selectedStartDate}
                  onChange={handleStartDateChange}
                  dateFormat="yy-mm-dd"
                  showIcon
                  readOnlyInput
                  maxDate={selectedEndDate ? new Date(new Date(selectedEndDate).setDate(new Date(selectedEndDate).getDate() - 1)) : null}
                  placeholder="Chọn thời gian bắt đầu" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginRight: '15px' }}>
              <label htmlFor='thoi_gian_thong_ke_1' style={{ marginBottom: '5px' }}>Đến ngày:</label>
                <Calendar
                  id='thoi_gian_thong_ke_2'
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                  dateFormat="yy-mm-dd"
                  showIcon
                  readOnlyInput
                  minDate={selectedStartDate ? new Date(new Date(selectedStartDate).setDate(new Date(selectedStartDate).getDate() + 1)) : null}
                  placeholder="Chọn thời gian kết thúc" />
              </div>
            </div>
            <div style={{ marginTop: '25px' }}>
              <Chart type={chartType} data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKeChung;