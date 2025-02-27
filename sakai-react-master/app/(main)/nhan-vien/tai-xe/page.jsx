'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import taiXeServices from '../../../services/taiXeServices';
import TaiXeDialog from '../../../modal/TaiXeDialog';

const DanhSachTaiXe = () => {
  const [taiXeList, setTaiXeList] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    nguoi_dung_id: '',
    bang_lai: ''
  });

  const toast = useRef(null);

  useEffect(() => {
    fetchTaiXe();
  }, []);

  const fetchTaiXe = async () => {
    try {
      const response = await taiXeServices.getAllDrivers();
      setTaiXeList(Array.isArray(response.DT) ? response.DT : []);
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

  const editTaiXe = (taiXe) => {
    setFormData({ ...taiXe });
    setIsNew(false);
    setDisplayDialog(true);
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
        await taiXeServices.updateDriver(filteredData.id, filteredData);
      }
      fetchTaiXe();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm tài xế thành công' : 'Cập nhật tài xế thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm tài xế' : 'Lỗi khi cập nhật tài xế');
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    setFormData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Tài Xế</h1>
          <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginBottom: '10px' }} />
          <DataTable value={taiXeList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="nguoi_dung_id" header="ID Người Dùng" sortable />
            <Column field="ho_ten" header="Họ Tên" sortable />
            <Column field="so_dien_thoai" header="Số Điện Thoại" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="vai_tro" header="Vai Trò" sortable />
            <Column field="trang_thai" header="Trạng Thái" sortable />
            <Column field="bang_lai" header="Bằng Lái" sortable />
            <Column
              header="Hành Động"
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editTaiXe(rowData)} />
                  <Button
                    icon="pi pi-trash"
                    style={{ marginLeft: '5px' }}
                    className="p-button-rounded p-button-warning"
                    onClick={() => deleteTaiXe(rowData.tai_xe_id)} // Sử dụng tai_xe_id thay vì id
                  />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <TaiXeDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isNew={isNew} formData={formData} onInputChange={onInputChange} onSave={saveTaiXe} />
    </div>
  );
};

export default DanhSachTaiXe;
