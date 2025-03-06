'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import taiXeServices from '../../../services/taiXeServices';
import TaiXeDialog from '../../../modal/TaiXeDialog';
import PhanCongTaiXeDialog from '../../../modal/PhanCongTaiXeDialog';
import phanCongTaiXeService from '../../../services/phanCongTaiXeServices';
import spServices from '@/app/share/share-services/sp-services';

const DanhSachTaiXe = () => {
  const [taiXeList, setTaiXeList] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayAssignDialog, setDisplayAssignDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    nguoi_dung_id: '',
    bang_lai: '',
    trang_thai: ''
  });

  const [assignData, setAssignData] = useState({
    id_ben: '',
    id_tai_xe: ''
  });

  const toast = useRef(null);

  useEffect(() => {
    fetchTaiXe();
  }, []);

  const fetchTaiXe = async () => {
    try {
      const response = await taiXeServices.getAllDrivers();
      const updatedTaiXe = spServices.formatData(response?.DT);
      setTaiXeList(updatedTaiXe);
    } catch (error) {
      showError('Lỗi khi tải danh sách tài xế');
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
      nguoi_dung_id: '',
      bang_lai: ''
    });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const openPhanCongForm = () => {
    setAssignData({
      id_ben: '',
      id_tai_xe: ''
    });
    setIsNew(true);
    setDisplayAssignDialog(true);
  };

  const editTaiXe = (taiXe) => {
    setFormData({ ...taiXe });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const confirmDeleteTaiXe = (id) => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xóa tài xế này không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy',
      accept: () => deleteTaiXe(id),
      reject: () => console.log('Hủy bỏ')
    });
  };

  const deleteTaiXe = async (id) => {
    try {
      await taiXeServices.deleteDriver(id);
      fetchTaiXe();
      showSuccess('Xóa tài xế thành công');
    } catch (error) {
      showError('Lỗi khi xóa tài xế');
    }
  };

  const saveTaiXe = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
    try {
      if (isNew) {
        await taiXeServices.createDriver(filteredData);
      } else {
        await taiXeServices.updateDriver(formData.tai_xe_id, filteredData);
      }
      fetchTaiXe();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm tài xế thành công' : 'Cập nhật tài xế thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm tài xế' : 'Lỗi khi cập nhật tài xế');
    }
  };

  const savePhanCong = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = assignData;
    try {
      if (isNew) {
        await phanCongTaiXeService.createDriverAssignment(assignData);
      } else {
        await phanCongTaiXeService.createDriverAssignment(filteredData.id, filteredData);
      }
      fetchTaiXe();
      setDisplayAssignDialog(false);
      showSuccess(isNew ? 'Thêm phân công tài xe thành công' : 'Cập nhật phân công tài xe thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm phân công tài xe' : 'Lỗi khi cập nhật phân công tài xe');
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    setFormData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };

  const onAssignInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    setAssignData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Tài Xế</h1>
          <div style={{ marginBottom: '10px' }}>
            <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginRight: '10px' }} />
            <Button label="Phân công địa điểm" icon="pi pi-file" className="p-button-info" onClick={openPhanCongForm} />
          </div>
          <DataTable value={taiXeList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="nguoi_dung_id" header="ID Người Dùng" sortable />
            <Column field="ho_ten" header="Họ Tên" sortable />
            <Column field="so_dien_thoai" header="Số Điện Thoại" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="labelVaiTro" header="Vai Trò" sortable />
            <Column field="labelTrangThai" header="Trạng Thái" sortable />
            <Column field="bang_lai" header="Bằng Lái" sortable />
            <Column
              header="Hành Động"
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editTaiXe(rowData)} />
                  <Button icon="pi pi-trash" style={{ marginLeft: '5px' }} className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTaiXe(rowData.tai_xe_id)} />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <TaiXeDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isNew={isNew} formData={formData} onInputChange={onInputChange} onSave={saveTaiXe} />
      <PhanCongTaiXeDialog visible={displayAssignDialog} onHide={() => setDisplayAssignDialog(false)} isNew={isNew} formData={assignData} onInputChange={onAssignInputChange} onSave={savePhanCong} />
    </div>
  );
};

export default DanhSachTaiXe;
