'use client';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import AddressSelector from '../share/component-share/addressUser';
import { validateForm } from '../(main)/utilities/validation';
import { useAxios } from '../authentication/useAxiosClient';
import khachHangService from '../services/khachHangServices';

const KhachHangDialog = ({ isEditing, visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const [errors, setErrors] = useState({});
  const toast = React.useRef(null);
  const [street, setStreet] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWards, setSelectedWards] = useState(null);
  const [address, setAddress] = useState('');

  const axiosInstance = useAxios();
  const khachHangServices = khachHangService(axiosInstance);

  useEffect(() => {
    if (formData && !isNew) {
      const addressParts = formData.dia_chi.split(',').map((part) => part.trim());

      setStreet(addressParts[0] || street);
      setSelectedWards(addressParts[1] ? { full_name: addressParts[1] } : selectedWards);
      setSelectedDistrict(addressParts[2] ? { full_name: addressParts[2] } : selectedDistrict);
      setSelectedProvince(addressParts[3] ? { full_name: addressParts[3] } : selectedProvince);
    }
  }, [formData, isEditing]);

  useEffect(() => {
    if (!visible) {
      setErrors({});
    }
  }, [visible]);
  // Update address locally whenever street or address components change
  useEffect(() => {
    formData.dia_chi = [street, selectedWards?.full_name, selectedDistrict?.full_name, selectedProvince?.full_name].filter((part) => part).join(', ');
    setAddress(formData.dia_chi);
  }, [street, selectedProvince, selectedDistrict, selectedWards]);

  const handleSave = async () => {
    const requiredFields = ['ho_ten', 'so_dien_thoai', 'dia_chi', 'mat_khau'];
    const validationErrors = validateForm(formData, requiredFields);

    if (formData.so_dien_thoai.length !== 10) {
      validationErrors.so_dien_thoai = 'Số điện thoại không hợp lệ';
      return;
    }

    const timSoDienThoai = await khachHangServices.getAllCustomers({ so_dien_thoai: formData.so_dien_thoai });
    console.log('timSoDienThoai', timSoDienThoai);
    if (timSoDienThoai.DT.length === 1) {
      validationErrors.so_dien_thoai = 'Số điện thoại đã tồn tại';
      setErrors(validationErrors);
      console.log('validationErrors', validationErrors);
    }

    if (Object.keys(validationErrors).length === 0) {
      onSave();
      console.log('ok to save');
    } else {
      setErrors(validationErrors);
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng kiểm tra lại các thông tin nhập', life: 3000 });
    }
  };

  return (
    <Dialog visible={visible} style={{ width: '600px' }} header={isNew ? 'Thêm khách hàng' : 'Chỉnh sửa khách hàng'} modal onHide={onHide}>
      <Toast ref={toast} />
      <div className="p-fluid">
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="ho_ten">Họ Tên</label>
          <InputText id="ho_ten" value={formData.ho_ten || ''} onChange={(e) => onInputChange(e, 'ho_ten')} className="mt-2 h-10" required />
          {errors.ho_ten && <small className="p-error">{errors.ho_ten}</small>}
        </div>
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="so_dien_thoai">Số Điện Thoại</label>
          <InputText type="number" id="so_dien_thoai" value={formData.so_dien_thoai || ''} onChange={(e) => onInputChange(e, 'so_dien_thoai')} className="mt-2 h-10" required />
          {errors.so_dien_thoai && <small className="p-error">{errors.so_dien_thoai}</small>}
        </div>
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <AddressSelector
            isEditing={!isNew}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            selectedWards={selectedWards}
            setSelectedProvince={setSelectedProvince}
            setSelectedDistrict={setSelectedDistrict}
            setSelectedWards={setSelectedWards}
          />
        </div>{' '}
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label className="mt-2" htmlFor="ten_duong">
            Tên Đường
          </label>
          <InputText className="mt-2 h-10" id="ten_duong" value={street} onChange={(e) => setStreet(e.target.value)} required />
          {errors.ten_duong && <small className="p-error">{errors.ten_duong}</small>}
        </div>{' '}
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="dia_chi">Địa Chỉ</label>
          <InputText id="dia_chi" value={formData.dia_chi || ''} onChange={(e) => onInputChange(e, 'dia_chi')} className="mt-2 h-10" required />
          {errors.dia_chi && <small className="p-error">{errors.dia_chi}</small>}
        </div>
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="mat_khau">Mật Khẩu</label>
          <InputText id="mat_khau" type="password" value={formData.mat_khau || ''} onChange={(e) => onInputChange(e, 'mat_khau')} className="mt-2 h-10" required />
          {errors.mat_khau && <small className="p-error">{errors.mat_khau}</small>}
        </div>
      </div>
      <div className="p-dialog-footer">
        <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
        <Button label="Lưu" icon="pi pi-check" className="p-button-primary" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default KhachHangDialog;
