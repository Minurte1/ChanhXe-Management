'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const NhanVienDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const dialogFooter = (
    <React.Fragment>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" onClick={onSave} />
    </React.Fragment>
  );

  // Danh sách vai trò
  const vaiTroOptions = [
    { label: 'Quản trị viên', value: 'admin' },
    { label: 'Nhân viên Kho', value: 'nhan_vien_kho' },
    { label: 'Nhân viên điều phối', value: 'nhan_vien_dieu_phoi' },
    { label: 'Tài xế', value: 'tai_xe' },
    { label: 'Tài xế phụ', value: 'tai_xe_phu' },
    { label: 'Nhân viên giao dịch', value: 'nhan_vien_giao_dich' }
  ];

  // Danh sách trạng thái
  const trangThaiOptions = [
    { label: 'Hoạt động', value: 'hoat_dong' },
    { label: 'Tạm ngưng', value: 'tam_ngung' }
  ];

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={isNew ? 'Thêm Nhân Viên' : 'Chỉnh Sửa Nhân Viên'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <div className="p-field">
        <label htmlFor="ho_ten ">Họ Tên</label>
        <InputText id="ho_ten" style={{ marginTop: '3px' }} value={formData.ho_ten} onChange={(e) => onInputChange(e, 'ho_ten')} />
      </div>
      <div className="p-field  mt-2">
        <label htmlFor="so_dien_thoai ">Số Điện Thoại</label>
        <InputText id="so_dien_thoai" style={{ marginTop: '3px' }} value={formData.so_dien_thoai} onChange={(e) => onInputChange(e, 'so_dien_thoai')} />
      </div>
      <div className="p-field mt-2">
        <label htmlFor="email ">Email</label>
        <InputText id="email" style={{ marginTop: '3px' }} value={formData.email} onChange={(e) => onInputChange(e, 'email')} />
      </div>
      <div className="p-field mt-2">
        <label htmlFor="mat_khau ">Mật Khẩu</label>
        <InputText id="mat_khau" style={{ marginTop: '3px' }} type="password" value={formData.mat_khau} onChange={(e) => onInputChange(e, 'mat_khau')} />
      </div>
      <div className="p-field mt-2">
        <label htmlFor="vai_tro ">Vai Trò</label>
        <Dropdown id="vai_tro" style={{ marginTop: '3px' }} value={formData.vai_tro} options={vaiTroOptions} onChange={(e) => onInputChange(e, 'vai_tro')} placeholder="Chọn vai trò" />
      </div>
      <div className="p-field mt-2">
        <label htmlFor="trang_thai ">Trạng Thái</label>
        <Dropdown id="trang_thai" style={{ marginTop: '3px' }} value={formData.trang_thai} options={trangThaiOptions} onChange={(e) => onInputChange(e, 'trang_thai')} placeholder="Chọn trạng thái" />
      </div>
    </Dialog>
  );
};

export default NhanVienDialog;
