'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const XeDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const dialogFooter = (
    <React.Fragment>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" onClick={onSave} />
    </React.Fragment>
  );

  // Danh sách trạng thái xe
  const trangThaiOptions = [
    { label: 'Đang hoạt động', value: 'hoat_dong' },
    { label: 'Bảo trì', value: 'bao_tri' },
    { label: 'Ngưng hoạt động', value: 'ngung_hoat_dong' }
  ];

  // Danh sách loại xe
  const loaiXeOptions = [
    { label: 'Xe tải nhẹ (dưới 2 tấn)', value: 'Xe tải nhẹ' },
    { label: 'Xe tải trung (2 - 7 tấn)', value: 'Xe tải trung' },
    { label: 'Xe tải nặng (trên 7 tấn)', value: 'Xe tải nặng' }
  ];

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={isNew ? 'Thêm Xe' : 'Chỉnh Sửa Xe'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <div className="p-field">
        <label htmlFor="bien_so">Biển Số</label>
        <InputText id="bien_so" style={{ marginTop: '3px' }} value={formData.bien_so} onChange={(e) => onInputChange(e, 'bien_so')} placeholder="VD: 51A-12345" />
      </div>
      <div className="p-field mt-2">
        <label htmlFor="loai_xe">Loại Xe</label>
        <Dropdown id="loai_xe" style={{ marginTop: '3px' }} value={formData.loai_xe} options={loaiXeOptions} onChange={(e) => onInputChange(e, 'loai_xe')} placeholder="Chọn loại xe (VD: Xe tải, Xe con)" />
      </div>
      <div className="p-field mt-2">
        <label htmlFor="suc_chua">Sức chứa</label>
        <InputText id="suc_chua" style={{ marginTop: '3px' }} value={formData.suc_chua} onChange={(e) => onInputChange(e, 'suc_chua')} placeholder="VD: 500 kg" />
      </div>
      <div className="p-field mt-2">
        <label htmlFor="trang_thai">Trạng Thái</label>
        <Dropdown id="trang_thai" style={{ marginTop: '3px' }} value={formData.trang_thai} options={trangThaiOptions} onChange={(e) => onInputChange(e, 'trang_thai')} placeholder="Chọn trạng thái " />
      </div>
    </Dialog>
  );
};

export default XeDialog;
