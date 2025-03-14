'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import TripService from '../../../services/chuyenXeServices'; // Đường dẫn tới TripService
import TripDialog from '../../../modal/ChuyenXeDialog'; // Đường dẫn tới TripDialog
import DonHangChuyenXeDialog from '../../../modal/DonHangChuyenXeDialog';
import spServices from '@/app/share/share-services/sp-services';
import { useAxios } from '@/app/authentication/useAxiosClient';
import { ReduxExportServices } from '@/app/redux/redux-services/services-redux-export';
const DanhSachChuyenXe = () => {
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

  //
  const toast = useRef(null);
  const axiosInstance = useAxios();
  const tripService = TripService(axiosInstance);
  const { userInfo } = ReduxExportServices();

  useEffect(() => {
    if (userInfo) {
      fetchTrips();
    }
  }, [userInfo]);

  const fetchTrips = async () => {
    try {
      let id_ben_xe_gui = null;
      id_ben_xe_gui = userInfo.vai_tro === 'admin' || userInfo.vai_tro === 'nhan_vien_dieu_phoi' ? {} : (id_ben_xe_gui.id_ben_xe_gui = userInfo.id_ben);
      const response = await tripService.getAllTrips({ id_ben_xe_gui });
      const output = spServices.formatData(response?.DT);
      console.log('output', output);
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
        filteredData.trang_thai = 'cho_xuat_ben';
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
    console.log('name', name);

    const val = e.target?.value || e.value || '';
    console.log('val', val);
    setFormData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };
  // Mở modal thêm đơn hàng vào chuyến xe
  const openDonHangDialog = (chuyenXe) => {
    setSelectedChuyenXe(chuyenXe);
    setDisplayDonHangDialog(true);
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Chuyến Xe</h1>
          <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginBottom: '10px' }} />
          <DataTable value={tripList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            {/* <Column field="chuyen_xe_id" header="ID Chuyến Xe" sortable /> */}
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
                  <Button style={{ height: '30px', width: '30px' }} icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editTrip(rowData)} />
                  <Button icon="pi pi-trash" style={{ marginLeft: '5px', height: '30px', width: '30px' }} className="p-button-rounded p-button-warning" onClick={() => deleteTrip(rowData.chuyen_xe_id)} />

                  {rowData.trang_thai === 'cho_xuat_ben' && (
                    <Button icon="pi pi-plus" style={{ height: '30px', width: '30px', marginLeft: '5px' }} className="p-button-rounded p-button-info" onClick={() => openDonHangDialog(rowData)} tooltip="Thêm đơn hàng" />
                  )}
                </>
              )}
            />
          </DataTable>
        </div>
      </div>
      <DonHangChuyenXeDialog
        visible={displayDonHangDialog}
        onHide={() => {
          setDisplayDonHangDialog(false);
          fetchTrips();
        }}
        selectedChuyenXe={selectedChuyenXe}
      />
      <TripDialog
        visible={displayDialog}
        onHide={() => {
          setDisplayDialog(false);
          fetchTrips();
        }}
        isNew={isNew}
        formData={formData}
        onInputChange={onInputChange}
        onSave={saveTrip}
      />
    </div>
  );
};

export default DanhSachChuyenXe;
