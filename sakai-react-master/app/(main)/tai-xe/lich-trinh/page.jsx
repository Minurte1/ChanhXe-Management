'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import { useAxios } from '@/app/authentication/useAxiosClient';
import spServices from '@/app/share/share-services/sp-services';
import taiXeService from '@/app/services/taiXeServices';
import { ReduxExportServices } from '../../../redux/redux-services/services-redux-export';
import { useRouter } from 'next/navigation';
const TripScheduleTracker = () => {
  const [tripList, setTripList] = useState([]);
  const axiosInstance = useAxios();
  const TaiXeService = taiXeService(axiosInstance); // Service để lấy dữ liệu chuyến xe
  const toast = useRef(null);
  const currentDate = new Date(); // Ngày hiện tại theo yêu cầu
  const { userInfo } = ReduxExportServices();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (userInfo) {
      fetchTrips();
    } else {
      router.push('/');
    }
  }, [userInfo]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const input = userInfo.vai_tro === 'admin' || userInfo.vai_tro === 'tai_xe' || userInfo.vai_tro === 'tai_xe_phu' ? {} : (input.id = userInfo.id);
      const response = await TaiXeService.getDriverByLichTrinh({ input });
      const updatedTrips = spServices.formatData(response?.DT); // Format dữ liệu nếu cần
      // Lọc các chuyến xe liên quan đến ngày hôm nay
      const filteredTrips = updatedTrips.filter((trip) => {
        const departureDate = new Date(trip.thoi_gian_xuat_ben);
        const arrivalDate = new Date(trip.thoi_gian_cap_ben);
        return departureDate.toDateString() === currentDate.toDateString() || arrivalDate.toDateString() === currentDate.toDateString();
      });
      setTripList(filteredTrips);
    } catch (error) {
      showError('Lỗi khi tải danh sách chuyến xe');
    } finally {
      setLoading(false);
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

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 3000
    });
  };

  // Format thời gian
  const formatDateTime = (value) => {
    return new Date(value).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  // Template cho lộ trình
  const routeBodyTemplate = (rowData) => {
    return (
      <span>
        {rowData.ben_xe_xuat_phat} <i className="pi pi-arrow-right" /> {rowData.ben_xe_dich}
      </span>
    );
  };

  // Template cho thông tin tài xế
  const driverBodyTemplate = (rowData) => {
    return (
      <span>
        {rowData.ten_tai_xe} ({rowData.so_dien_thoai})
      </span>
    );
  };
  const driverPhuBodyTemplate = (rowData) => {
    return (
      <span>
        {rowData.ten_tai_xe_phu} ({rowData.so_dien_thoai_tai_xe_phu})
      </span>
    );
  };

  // Template cho thông tin xe
  const vehicleBodyTemplate = (rowData) => {
    return (
      <span>
        {rowData.bien_so} - {rowData.loai_xe}
      </span>
    );
  };
  console.log('trip', tripList);
  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Theo Dõi Lịch Trình Chuyến Xe</h1>
          <div style={{ marginBottom: '10px' }}>
            <Button label="Tải lại" icon="pi pi-refresh" className="p-button-info" onClick={fetchTrips} loading={loading} />
          </div>
          <DataTable value={tripList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage="Không có chuyến xe nào trong ngày hôm nay">
            <Column field="bien_so" header="Thông Tin Xe" body={vehicleBodyTemplate} sortable style={{ width: '15%' }} />
            <Column field="ten_tai_xe" header="Tài Xế" body={driverBodyTemplate} sortable style={{ width: '12%' }} />
            <Column field="ten_tai_xe_phu" header="Tài Xế Phụ" body={driverPhuBodyTemplate} sortable style={{ width: '12%' }} />
            <Column field="thoi_gian_xuat_ben" header="Xuất Bến" body={(rowData) => formatDateTime(rowData.thoi_gian_xuat_ben)} sortable style={{ width: '10%' }} />
            <Column field="thoi_gian_cap_ben" header="Cập Bến" body={(rowData) => formatDateTime(rowData.thoi_gian_cap_ben)} sortable style={{ width: '10%' }} />
            <Column header="Lộ Trình" body={routeBodyTemplate} style={{ width: '25%' }} />
            <Column
              style={{ width: '11%' }}
              field="labelTrangThai"
              header="Trạng Thái Chuyến Xe"
              sortable
              body={(rowData) => {
                const { text, background } = spServices.getColorTrangThai(rowData.labelTrangThai);
                return (
                  <span
                    style={{
                      color: text,
                      backgroundColor: background,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      fontWeight: 'bold'
                    }}
                  >
                    {rowData.labelTrangThai}
                  </span>
                );
              }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TripScheduleTracker;
