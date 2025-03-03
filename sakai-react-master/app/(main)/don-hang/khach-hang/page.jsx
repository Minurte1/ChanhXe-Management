'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import khachHangService from '../../../services/khachHangServices';
import KhachHangDialog from '../../../modal/KhachHangDialog';

const DanhSachKhachHang = () => {
  const [khachHangList, setKhachHangList] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: '',
    mat_khau: ''
  });

  const toast = useRef(null);

  useEffect(() => {
    fetchKhachHang();
  }, []);

  const fetchKhachHang = async () => {
    try {
      const response = await khachHangService.getAllCustomers();
      setKhachHangList(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      showError('Lỗi khi tải danh sách khách hàng');
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
      ho_ten: '',
      so_dien_thoai: '',
      dia_chi: '',
      mat_khau: ''
    });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const editKhachHang = (khachHang) => {
    setFormData({
      ...khachHang
    });
    setIsNew(false);

    setDisplayDialog(true);
  };

  const deleteKhachHang = async (id) => {
    try {
      await khachHangService.deleteCustomer(id);
      fetchKhachHang();
      showSuccess('Xóa khách hàng thành công');
    } catch (error) {
      showError('Lỗi khi xóa khách hàng');
    }
  };

  const saveKhachHang = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
    try {
      if (isNew) {
        await khachHangService.createCustomer(filteredData);
      } else {
        await khachHangService.updateCustomer(filteredData.id, filteredData);
      }
      fetchKhachHang();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm khách hàng thành công' : 'Cập nhật khách hàng thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm khách hàng' : 'Lỗi khi cập nhật khách hàng');
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
          <h1>Danh Sách Khách Hàng</h1>
          <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginBottom: '10px' }} />
          <DataTable value={khachHangList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="ho_ten" header="Họ Tên" />
            <Column field="so_dien_thoai" header="Số Điện Thoại" />
            <Column field="dia_chi" header="Địa Chỉ" />
            <Column
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editKhachHang(rowData)} />
                  <Button icon="pi pi-trash" style={{ marginLeft: '5px' }} className="p-button-rounded p-button-warning" onClick={() => deleteKhachHang(rowData.id)} />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <KhachHangDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isNew={isNew} formData={formData} onInputChange={onInputChange} onSave={saveKhachHang} />
    </div>
  );
};

export default DanhSachKhachHang;
