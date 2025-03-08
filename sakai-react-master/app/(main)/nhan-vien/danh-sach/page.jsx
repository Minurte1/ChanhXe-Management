'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';

import NhanVienDialog from '../../../modal/NhanVienDialog';
import PhanCongNguoiDungDialog from '../../../modal/PhanCongNguoiDungDialog';
import PhanCongNguoiDungService from '../../../services/phanCongNguoiDungServices';
import spServices from '../../../share/share-services/sp-services';
import UserService from '@/app/services/userAccountService';
import { useAxios } from '@/app/authentication/useAxiosClient';

const DanhSachNhanVien = () => {
  const [nhanVien, setNhanVien] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayAssignDialog, setDisplayAssignDialog] = useState(false);

  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    mat_khau: '',
    vai_tro: '',
    trang_thai: ''
  });
  const [assignData, setAssignData] = useState({
    id_ben: '',
    id_nguoi_dung: ''
  });

  const toast = useRef(null);
  const axiosInstance = useAxios();
  const userService = UserService(axiosInstance);
  const phanCongNguoiDungService = PhanCongNguoiDungService(axiosInstance);

  useEffect(() => {
    fetchNhanVien();
  }, []);

  const fetchNhanVien = async () => {
    try {
      const response = await userService.getAllUsers();
      const updatedNhanVien = spServices.formatData(response?.DT);
      setNhanVien(updatedNhanVien);
    } catch (error) {
      showError('Lỗi khi tải danh sách nhân viên');
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
      email: '',
      mat_khau: '',
      vai_tro: '',
      trang_thai: ''
    });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const openPhanCongForm = () => {
    setAssignData({
      id_ben: '',
      id_xe: ''
    });
    setIsNew(true);
    setDisplayAssignDialog(true);
  };

  const editNhanVien = (nhanVien) => {
    setFormData({ ...nhanVien });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => deleteNhanVien(id)
    });
  };

  const deleteNhanVien = async (id) => {
    try {
      await userService.deleteUser(id);
      fetchNhanVien();
      showSuccess('Xóa nhân viên thành công');
    } catch (error) {
      showError('Lỗi khi xóa nhân viên');
    }
  };

  const saveNhanVien = async () => {
    try {
      const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;

      if (isNew) {
        await userService.createUser(filteredData);
      } else {
        await userService.updateUser(filteredData.id, filteredData);
      }

      fetchNhanVien();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm nhân viên thành công' : 'Cập nhật nhân viên thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm nhân viên' : 'Lỗi khi cập nhật nhân viên');
    }
  };

  const savePhanCong = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = assignData;
    try {
      if (isNew) {
        await phanCongNguoiDungService.createUserAssignment(assignData);
      } else {
        await phanCongNguoiDungService.updateUserAssignment(filteredData.id, filteredData);
      }
      fetchNhanVien();
      setDisplayAssignDialog(false);
      showSuccess(isNew ? 'Thêm phân công thành công' : 'Cập nhật phân công thành công');
    } catch (error) {
      console.log('error', error);
      showError(isNew ? 'Lỗi khi thêm phân công' : 'Lỗi khi cập nhật phân công');
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredNhanVien(nhanVien);
      } else {
        setFilteredNhanVien(nhanVien.filter((nv) => nv.ho_ten.toLowerCase().includes(searchTerm.toLowerCase())));
      }
    }, 300); // Thời gian trễ 300ms

    return () => clearTimeout(timer); // Xóa timer khi searchTerm thay đổi hoặc component unmount
  }, [searchTerm, nhanVien]);

  useEffect(() => {
    setFilteredNhanVien(nhanVien);
  }, [nhanVien]);

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Nhân Viên</h1>
          <div style={{ marginBottom: '10px' }}>
            <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginRight: '10px' }} />
            <Button label="Phân công địa điểm" icon="pi pi-file" className="p-button-info" onClick={openPhanCongForm} />
            <InputText placeholder="Tìm kiếm tên nhân viên" value={searchTerm} onChange={onSearchChange} style={{ marginLeft: '8px', width: '30%' }} />
          </div>
          <DataTable
            value={filteredNhanVien}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} nhân viên"
          >
            <Column field="ho_ten" header="Họ Tên"></Column>
            <Column field="dia_diem_cong_tac" header="Địa điểm công tác" sortable body={(rowData) => rowData.ten_ben_xe || rowData.ben_xe_nguoi_dung_ten || '(Chưa được phân công)'} />

            <Column field="so_dien_thoai" header="Số Điện Thoại"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="labelVaiTro" header="Vai Trò"></Column>
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
            <Column
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editNhanVien(rowData)} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" style={{ marginLeft: '8px' }} onClick={() => confirmDelete(rowData.id)} />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <NhanVienDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isNew={isNew} formData={formData} onInputChange={onInputChange} onSave={saveNhanVien} />
      <PhanCongNguoiDungDialog visible={displayAssignDialog} onHide={() => setDisplayAssignDialog(false)} isNew={isNew} formData={assignData} onInputChange={onAssignInputChange} onSave={savePhanCong} />
    </div>
  );
};

export default DanhSachNhanVien;
