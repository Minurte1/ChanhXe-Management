'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import khachHangService from '../../../services/khachHangServices';
import KhachHangDialog from '../../../modal/KhachHangDialog';
import { useAxios } from '@/app/authentication/useAxiosClient';
import { ReduxExportServices } from '@/app/redux/redux-services/services-redux-export';

const DanhSachKhachHang = () => {
  const [khachHangList, setKhachHangList] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const { userInfo } = ReduxExportServices();
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: '',
    mat_khau: ''
  });

  const toast = useRef(null);
  const axiosInstance = useAxios();
  const KhachHangService = khachHangService(axiosInstance);

  // State cho tìm kiếm
  const [searchText, setSearchText] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchKhachHang();
  }, []);

  const fetchKhachHang = async () => {
    try {
      const response = await KhachHangService.getAllCustomers();
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
    setFormData({ ...khachHang });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const deleteKhachHang = async (id) => {
    try {
      await KhachHangService.deleteCustomer(id);
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
        await KhachHangService.createCustomer(filteredData);
      } else {
        await KhachHangService.updateCustomer(filteredData.id, filteredData);
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

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredKhachHangList = khachHangList.filter((khachHang) => {
    if (!isSearchActive || !searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return khachHang.ho_ten.toLowerCase().includes(searchLower) || khachHang.so_dien_thoai.includes(searchLower);
  });

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Khách Hàng Trong Hệ Thống</h1>
          <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginBottom: '10px' }} />

          {/* Thanh tìm kiếm */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Button label={isSearchActive ? 'Tắt tìm kiếm' : 'Bật tìm kiếm'} icon="pi pi-search" className={isSearchActive ? 'p-button-danger' : 'p-button-primary'} onClick={() => setIsSearchActive((prev) => !prev)} style={{ marginRight: '10px' }} />
            {isSearchActive && <InputText value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Tìm theo họ tên hoặc số điện thoại..." style={{ width: '300px' }} />}
          </div>

          <DataTable value={filteredKhachHangList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
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
