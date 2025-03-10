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

const ThongKeChung = () => {
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const { layoutConfig } = useContext(LayoutContext);

  const [lineData, setLineData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [benXe, setBenXe] = useState([]);
  const [donHang, setDonHang] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('cuoc_phi');
  const [selectedDatasetLabel, setSelectedDatasetLabel] = useState('Cước phí thu được');

  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);
  const donHangSevices = DonHangService(axiosInstance);
  const [theme, setTheme] = useState('light');
  const toast = useRef(null);

  const applyLightTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#000000'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(15, 85, 224, 0.98)'
          }
        },
        y: {
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(0, 163, 0, 0.3)'
          },
          min: 0, // Set the minimum value for the y-axis
          // max: 10000, // Set the maximum value for the y-axis
          stepSize: 10000 // Set the step size for the y-axis
        }
      }
    };

    setLineOptions(lineOptions);
  };

  // const applyDarkTheme = () => {
  //   const lineOptions = {
  //     plugins: {
  //       legend: {
  //         labels: {
  //           color: '#000000'
  //         }
  //       }
  //     },
  //     scales: {
  //       x: {
  //         ticks: {
  //           color: '#000000'
  //         },
  //         grid: {
  //           color: 'rgba(15, 85, 224, 0.98)'
  //         }
  //       },
  //       y: {
  //         ticks: {
  //           color: '#000000'
  //         },
  //         grid: {
  //           color: 'rgba(0, 163, 0, 0.3)'
  //         },
  //         min: 1000, // Set the minimum value for the y-axis
  //         // max: 100000, // Set the maximum value for the y-axis
  //         stepSize: 50000 // Set the step size for the y-axis
  //       }
  //     }
  //   };

  //   setLineOptions(lineOptions);
  // };

  useEffect(() => {
    fetchBenXe();
    fetchDonHang();
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      applyLightTheme();
    } else {
      // applyDarkTheme();
    }
  }, [theme]);

  useEffect(() => {
    updateChartData();
  }, [donHang, selectedDataset]);

  const fetchBenXe = async () => {
    try {
      const response = await benXeService.getAllBenXe();
      setBenXe(response.DT);
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

  const formatCurrency = (value: number) => {
    return value?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const updateChartData = () => {
    const dateMap = new Map();

    donHang.forEach(item => {
      const date = new Date(item.ngay_tao);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      if (!dateMap.has(formattedDate)) {
        dateMap.set(formattedDate, 0);
      }

      const currentValue = dateMap.get(formattedDate);
      const newValue = parseFloat(item[selectedDataset]) || 0; // Ensure the value is a number
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
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleDatasetChange = (e) => {
    const selectedOption = datasetOptions.find(option => option.value === e.value);
    setSelectedDataset(e.value);
    setSelectedDatasetLabel(selectedOption.label);
  };

  const datasetOptions = [
    { label: 'Cước phí thu được', value: 'cuoc_phi' },
    { label: 'Tổng giá trị hàng đã nhận', value: 'gia_tri_hang' },
    { label: 'Test', value: 'id' }
  ];

  const datasetBenXeOptions = [
    { label: 'Cước phí thu được', value: 'cuoc_phi' },
    { label: 'Tổng giá trị hàng đã nhận', value: 'gia_tri_hang' },
    { label: 'Test', value: 'id' }
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
            <Dropdown
              value={datasetOptions.values || 'cuoc_phi'}
              options={datasetOptions}
              onChange={handleDatasetChange}
              placeholder="Chọn một trường thống kê"
            />
            <Chart type="line" data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
      <div>
        <div className="card">
          <div style={{ width: '100%' }}>
            <h5>Thống kê theo bến xe</h5>
            <Dropdown
              value={datasetOptions.values || 'cuoc_phi'}
              options={datasetOptions}
              onChange={handleDatasetChange}
              placeholder="Chọn một trường thống kê"
            />
            <Dropdown
              value={datasetOptions.values || 'cuoc_phi'}
              options={datasetOptions}
              onChange={handleDatasetChange}
              placeholder="Chọn một trường thống kê"
            />
            <Chart type="bar" data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKeChung;