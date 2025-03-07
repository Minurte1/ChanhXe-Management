'use client';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import AddressSelector from '../share/component-share/addressUser';
import { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { validateForm } from '../(main)/utilities/validation';

const BenXeDialog = ({ visible, onHide, isEditing, formData, onInputChange, onSave }) => {
  const [street, setStreet] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWards, setSelectedWards] = useState(null);
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  // Sync local state with formData when dialog opens or formData changes
  useEffect(() => {
    if (formData && visible) {
      if (isEditing) {
        setStreet(formData.duong);
        setAddress(formData.dia_chi || '');
        setSelectedProvince(formData.tinh ? { full_name: formData.tinh } : null);
        setSelectedDistrict(formData.huyen ? { full_name: formData.huyen } : null);
        setSelectedWards(formData.xa ? { full_name: formData.xa } : null);
      } else {
        setStreet('');
        setAddress('');
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWards(null);
      }
    }
  }, [formData, visible, isEditing]);

  // Update address locally whenever street or address components change
  useEffect(() => {
    const addressParts = [street, selectedWards?.full_name, selectedDistrict?.full_name, selectedProvince?.full_name].filter((part) => part).join(', ');
    setAddress(addressParts);
  }, [street, selectedProvince, selectedDistrict, selectedWards]);

  // Handle save action
  const handleSave = () => {
    const requiredFields = ['ten_ben_xe', 'dia_chi', 'tinh', 'huyen', 'xa', 'duong'];
    const validationErrors = validateForm({
      ...formData,
      dia_chi: address,
      tinh: selectedProvince?.full_name || '',
      huyen: selectedDistrict?.full_name || '',
      xa: selectedWards?.full_name || '',
      duong: street
    }, requiredFields);

    if (Object.keys(validationErrors).length === 0) {
      const dataToSave = {
        id: formData.id, // Thêm id để giữ nguyên khi edit
        ten_ben_xe: formData.ten_ben_xe || '',
        dia_chi: address,
        tinh: selectedProvince?.full_name || '',
        huyen: selectedDistrict?.full_name || '',
        xa: selectedWards?.full_name || '',
        duong: street
      };

      // Gửi toàn bộ dataToSave lên parent, không cần lọc updatedFields
      onInputChange(dataToSave);
      onSave(dataToSave);
    } else {
      setErrors(validationErrors);
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
    }
  };

  return (
    <Dialog visible={visible} style={{ width: '960px' }} header={isEditing ? 'Chỉnh sửa bến xe' : 'Thêm bến xe'} modal onHide={onHide}>
      <Toast ref={toast} />
      <div className="p-fluid">
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="ten_ben_xe">Tên Bến Xe</label>
          <InputText className="mt-2 h-10" id="ten_ben_xe" value={formData.ten_ben_xe || ''} onChange={(e) => onInputChange(e)} />
          {errors.ten_ben_xe && <small className="p-error">{errors.ten_ben_xe}</small>}
        </div>
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <AddressSelector
            isEditing={isEditing}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            selectedWards={selectedWards}
            setSelectedProvince={setSelectedProvince}
            setSelectedDistrict={setSelectedDistrict}
            setSelectedWards={setSelectedWards}
          />
        </div>
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label className="mt-2" htmlFor="dia_chi">
            Địa Chỉ
          </label>
          <InputText className="mt-2 h-10" id="dia_chi" value={address} readOnly />
          {errors.dia_chi && <small className="p-error">{errors.dia_chi}</small>}
        </div>
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label className="mt-2" htmlFor="ten_duong">
            Tên Đường
          </label>
          <InputText className="mt-2 h-10" id="ten_duong" value={street} onChange={(e) => setStreet(e.target.value)} />
          {errors.duong && <small className="p-error">{errors.duong}</small>}
        </div>
      </div>
      <div className="p-dialog-footer">
        <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
        <Button label="Lưu" icon="pi pi-check" className="p-button-primary" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default BenXeDialog;