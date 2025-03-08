'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import TripService from '../../services/chuyenXeServices'; // Đường dẫn tới TripService

import { useAxios } from '../../authentication/useAxiosClient';
import spServices from '../../share/share-services/sp-services';
import { enqueueSnackbar } from 'notistack';
import KhoHangChuyenXe from '../../modal/KhoHangChuyenXeDialog';
const DonHangCapBen = () => {
  const [tripList, setTripList] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [displayDonHangDialog, setDisplayDonHangDialog] = useState(false); // State cho modal DonHangChuyenXe
  const [selectedChuyenXe, setSelectedChuyenXe] = useState(null); // ID chuyến xe được chọn
  const [formData, setFormData] = useState({
    xe_id: '',
    tai_xe_id: '',
    tai_xe_phu_id: '',
    thoi_gian_xuat_ben: '',
    thoi_gian_cap_ben: '',
    trang_thai: '',
    id_ben_xe_nhan: '',
    id_ben_xe_gui: ''
  });

  const toast = useRef(null);
  const axiosInstance = useAxios();
  const tripService = TripService(axiosInstance);
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await tripService.getAllTrips({ trang_thai: ['dang_van_chuyen', 'da_cap_ben'] });
      const output = spServices.formatData(response?.DT);

      setTripList(Array.isArray(output) ? output : []);
    } catch (error) {
      showError('Lỗi khi tải danh sách chuyến xe');
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

  const openNew = () => {
    setFormData({
      xe_id: '',
      tai_xe_id: '',
      tai_xe_phu_id: '',
      thoi_gian_xuat_ben: '',
      thoi_gian_cap_ben: '',
      trang_thai: '',
      id_ben_xe_nhan: '',
      id_ben_xe_gui: ''
    });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const editTrip = (trip) => {
    setFormData({ ...trip });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const deleteTrip = async (id) => {
    try {
      await tripService.deleteTrip(id);
      fetchTrips();
      showSuccess('Xóa chuyến xe thành công');
    } catch (error) {
      showError('Lỗi khi xóa chuyến xe');
    }
  };

  const saveTrip = async () => {
    console.log('formData', formData);
    const { id, ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
    try {
      if (isNew) {
        await tripService.createTrip(filteredData);
      } else {
        await tripService.updateTrip(formData.chuyen_xe_id, filteredData);
      }
      fetchTrips();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm chuyến xe thành công' : 'Cập nhật chuyến xe thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm chuyến xe' : 'Lỗi khi cập nhật chuyến xe');
    }
  };

  const onInputChange = (e, name) => {
    const val = e.target?.value || e.value || '';
    setFormData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };

  const confirmUpdate = async (trip) => {
    console.log('trip', trip.chuyen_xe_id);
    try {
      const id = trip?.chuyen_xe_id;
      if (!id) {
        enqueueSnackbar('Chuyến xe này không tồn tại id -_-`');
        return;
      }
      await tripService.updateChuyenXeCapBen(id);
      fetchTrips();
      showSuccess('Cập nhật trạng thái chuyến xe thành công');
    } catch (error) {
      showError('Lỗi khi cập nhật trạng thái chuyến xe');
    }
  };

  const openDonHangDialog = (chuyenXe) => {
    setSelectedChuyenXe(chuyenXe);
    setDisplayDonHangDialog(true);
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="p-col-12">
        <div className="card">
          <h1>Đơn hàng cập bến</h1>
          <DataTable value={tripList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="xe_bien_so" header="Biển số xe" sortable />
            <Column field="tai_xe_ho_ten" header="Tài Xế" sortable />
            <Column field="tai_xe_phu_ho_ten" header="Tài Xế Phụ" sortable body={(rowData) => rowData.tai_xe_phu_ho_ten || 'Không có'} />
            <Column field="thoi_gian_xuat_ben" header="Thời Gian Xuất Bến" sortable body={(rowData) => new Date(rowData.thoi_gian_xuat_ben).toLocaleString('vi-VN')} />
            <Column field="thoi_gian_cap_ben" header="Thời Gian Cập Bến" sortable body={(rowData) => (rowData.thoi_gian_cap_ben ? new Date(rowData.thoi_gian_cap_ben).toLocaleString('vi-VN') : 'Chưa cập bến')} />

            <Column
              field="labelTrangThai"
              header="Trạng Thái"
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

            <Column field="ben_xe_nhan_ten" header="Bến Xe Nhận" sortable />
            <Column field="ben_xe_gui_ten" header="Bến Xe Gửi" sortable />
            <Column
              header="Hành Động"
              body={(rowData) => (
                <>
                  {rowData.trang_thai === 'dang_van_chuyen' && (
                    <Button
                      style={{ height: '30px', width: '30px' }}
                      icon="pi pi-check"
                      className="p-button-rounded p-button-success p-mr-2"
                      onClick={() => {
                        confirmDialog({
                          message: 'Bạn có chắc chắn là chuyến xe đã cập bến?',
                          header: 'Xác nhận',
                          icon: 'pi pi-exclamation-triangle',
                          accept: () => confirmUpdate(rowData)
                        });
                      }}
                    />
                  )}

                  <Button style={{ height: '30px', width: '30px' }} icon="pi pi-list" className="p-button-rounded p-button-info p-mr-2" onClick={() => openDonHangDialog(rowData)} />
                </>
              )}
            />
          </DataTable>{' '}
          <KhoHangChuyenXe chuyenXeId={selectedChuyenXe?.chuyen_xe_id} visible={displayDonHangDialog} onHide={() => setDisplayDonHangDialog(false)} />
        </div>
      </div>
    </div>
  );
};

export default DonHangCapBen;
