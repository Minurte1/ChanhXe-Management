'use client';
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { validateForm } from '../(main)/utilities/validation';

const XeDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const [errors, setErrors] = useState({});
  const toast = React.useRef(null);

  const handleSave = () => {
    const requiredFields = ['bien_so', 'loai_xe', 'suc_chua', 'trang_thai'];
    const validationErrors = validateForm(formData, requiredFields);
    if (Object.keys(validationErrors).length === 0) {
      onSave();
    } else {
      setErrors(validationErrors);
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
    }
  };

  const dialogFooter = (
    <React.Fragment>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" onClick={handleSave} />
    </React.Fragment>
  );

  // Danh sách trạng thái xe
  const trangThaiOptions = [
    { label: 'Đang hoạt động', value: 'hoat_dong' },
    { label: 'Bảo trì', value: 'bao_tri' },
    { label: 'Ngưng hoạt động', value: 'ngung_hoat_dong' },
    { label: 'Đang vận chuyển', value: 'dang_van_chuyen' }
  ];

  // Danh sách loại xe
  const loaiXeOptions = [
    { label: 'Xe tải nhẹ (dưới 2 tấn)', value: 'Xe tải nhẹ' },
    { label: 'Xe tải trung (2 - 7 tấn)', value: 'Xe tải trung' },
    { label: 'Xe tải nặng (trên 7 tấn)', value: 'Xe tải nặng' }
  ];

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={isNew ? 'Thêm Xe' : 'Chỉnh Sửa Xe'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <Toast ref={toast} />
      <div className="p-field">
        <label htmlFor="bien_so">Biển Số</label>
        <InputText id="bien_so" name="bien_so" style={{ marginTop: '3px' }} value={formData.bien_so} onChange={(e) => onInputChange(e, 'bien_so')} placeholder="VD: 51A-12345" required />
        {errors.bien_so && <small className="p-error">{errors.bien_so}</small>}
      </div>
      <div className="p-field mt-2">
        <label htmlFor="loai_xe">Loại Xe</label>
        <Dropdown id="loai_xe" name="loai_xe" style={{ marginTop: '3px' }} value={formData.loai_xe} options={loaiXeOptions} onChange={(e) => onInputChange(e, 'loai_xe')} placeholder="Chọn loại xe (VD: Xe tải, Xe con)" required />
        {errors.loai_xe && <small className="p-error">{errors.loai_xe}</small>}
      </div>
      <div className="p-field mt-2">
        <label htmlFor="suc_chua">Sức chứa</label>
        <InputNumber id="suc_chua" name="suc_chua" style={{ marginTop: '3px' }} value={formData.suc_chua} onValueChange={(e) => onInputChange(e, 'suc_chua')} placeholder="VD: 500 kg" min={0} required />
        {errors.suc_chua && <small className="p-error">{errors.suc_chua}</small>}
      </div>
      <div className="p-field mt-2">
        <label htmlFor="trang_thai">Trạng Thái</label>
        <Dropdown id="trang_thai" name="trang_thai" style={{ marginTop: '3px' }} value={formData.trang_thai} options={trangThaiOptions} onChange={(e) => onInputChange(e, 'trang_thai')} placeholder="Chọn trạng thái " required />
        {errors.trang_thai && <small className="p-error">{errors.trang_thai}</small>}
      </div>
    </Dialog>
  );
};

export default XeDialog;
