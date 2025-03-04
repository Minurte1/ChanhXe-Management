'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { createUser, deleteUser, getAllUsers, updateUser } from '../../../services/userAccountService';
import NhanVienDialog from '../../../modal/NhanVienDialog';

const DanhSachNhanVien = () => {
  const [nhanVien, setNhanVien] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    mat_khau: '',
    vai_tro: '',
    trang_thai: ''
  });

  const toast = useRef(null);

  useEffect(() => {
    fetchNhanVien();
  }, []);

  const fetchNhanVien = async () => {
    try {
      const response = await getAllUsers();
      setNhanVien(response.DT);
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
      await deleteUser(id);
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
        await createUser(filteredData);
      } else {
        await updateUser(filteredData.id, filteredData);
      }

      fetchNhanVien();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm nhân viên thành công' : 'Cập nhật nhân viên thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm nhân viên' : 'Lỗi khi cập nhật nhân viên');
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
      <ConfirmDialog />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Nhân Viên</h1>
          <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginBottom: '10px' }} />
          <DataTable
            value={nhanVien}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} nhân viên"
          >
            <Column field="ho_ten" header="Họ Tên"></Column>
            <Column field="so_dien_thoai" header="Số Điện Thoại"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="vai_tro" header="Vai Trò"></Column>
            <Column field="trang_thai" header="Trạng Thái"></Column>
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
    </div>
  );
};

export default DanhSachNhanVien;
