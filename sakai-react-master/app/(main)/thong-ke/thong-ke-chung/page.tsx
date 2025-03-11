'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import BenXeService from '../../../services/benXeServices';
import { useAxios } from '@/app/authentication/useAxiosClient';
import { Dropdown } from 'primereact/dropdown';
import DonHangService from '../../../services/donHangSevices';
import spServices from '../../../share/share-services/sp-services';
import { Calendar } from 'primereact/calendar';

const ThongKeChung = () => {
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const { layoutConfig } = useContext(LayoutContext);

  const [lineData, setLineData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [benXe, setBenXe] = useState([]);
  const [donHang, setDonHang] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedBenXeDataset, setSelectedBenXeDataset] = useState();
  const [selectedBenXeDatasetLabel, setSelectedBenXeDatasetLabel] = useState();
  const [selectedDatasetLabel, setSelectedDatasetLabel] = useState('');
  const [datasetBenXeOptions, setDatasetBenXeOptions] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [chartType, setChartType] = useState('line');

  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);
  const donHangSevices = DonHangService(axiosInstance);
  const [theme, setTheme] = useState('light');
  const toast = useRef(null);
  const { getColorTrangThai, formatLoaiHangHoa, getColorChartTrangThai } = spServices;

  useEffect(() => {
    fetchBenXe();
    fetchDonHang();
  }, []);

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
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchDonHang = async () => {
    try {
      const response = await donHangSevices.getAllOrders();
      setDonHang(response.DT);
    } catch (error) {
      console.log('error', error);
    }
  };

  const updateChartDataDonHang = () => {
    setLineOptions(spServices.chartTheme('', ''));
    const dateMap = new Map();

    // Filter donHang to include only items with trang_thai set to 'giao_thanh_cong'
    let filteredDonHang = donHang; //.filter(item => item.trang_thai === 'giao_thanh_cong');

    // Apply date filters if selected
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

        if (selectedDataset === 'tong_doang_thu') {
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
      setLineOptions(spServices.chartTheme('', ' VND'));
      setChartType('line');
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleDatasetChange = (e, options, setDataset, setLabel) => {
    const selectedOption = options.find(option => option.value === e.value);
    setDataset(e.value);
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
    { label: 'Tổng doang thu', value: 'tong_doang_thu' },
    // { label: 'Cước phí thu được', value: 'cuoc_phi' },
    // { label: 'Tổng giá trị hàng đã nhận', value: 'gia_tri_hang' },
    { label: 'Các đơn hàng đã nhận', value: 'don_hang_nhan'},
    // { label: 'Test', value: 'id' }
  ];

  return (
    <div>
      {/* <div>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div> */}
      <div>
        <div className="card">
          <div style={{ width: '100%' }}>
            <h5>Thống Kê Chung</h5>
            <div style={{ flex: 1 }}>
              <Dropdown
                value={selectedDataset}
                options={datasetOptions}
                onChange={(e) => handleDatasetChange(e, datasetOptions, setSelectedDataset, setSelectedDatasetLabel)}
                placeholder="Chọn một trường thống kê"
              />
              <Calendar
                id="thoi_gian_thong_ke_1"
                value={selectedStartDate}
                onChange={handleStartDateChange}
                dateFormat="yy-mm-dd"
                style={{ marginLeft: '5px' }}
                placeholder="Chọn thời gian bắt đầu"/>
              <Calendar
                id="thoi_gian_thong_ke_2"
                value={selectedEndDate}
                onChange={handleEndDateChange}
                dateFormat="yy-mm-dd"
                style={{ marginLeft: '5px' }}
                placeholder="Chọn thời gian cuối"/>
              <Button label="Thống kê" style={{ marginLeft: '5px' }} className="p-button-success" onClick={handleThongKe}/>
            </div>
            <Chart type={chartType} data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
      {/* <div>
        <div className="card">
          <div style={{ width: '100%' }}>
            <h5>Thống kê theo bến xe</h5>
            <Dropdown
              id='id_ben_xe'
              value={selectedBenXeDataset}
              options={datasetBenXeOptions}
              onChange={(e) => handleDatasetChange(e, datasetBenXeOptions, setSelectedBenXeDataset, setSelectedBenXeDatasetLabel)}
              placeholder="Chọn một trường thống kê"
            />
            <Chart type="bar" data={lineData} options={lineOptions} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ThongKeChung;