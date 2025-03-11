'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

import taiXeService from '../services/taiXeServices';
import { useAxios } from '../authentication/useAxiosClient';
import { validateForm } from '../(main)/utilities/validation';
import spServices from '../share/share-services/sp-services';

const TaiXeDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const axiosInstance = useAxios();
  const TaiXeServices = taiXeService(axiosInstance);

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setErrors({});
    }
  }, [visible]);

  console.log('formData', formData);

  const fetchUsers = async () => {
    try {
      const response = await TaiXeServices.getUsersNotInDriverTable();
      setUsers(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách khách hàng', error);
    }
  };

  const handleSave = () => {
    const requiredFields = ['nguoi_dung_id', 'bang_lai'];
    const validationErrors = validateForm(formData, requiredFields);
    if (Object.keys(validationErrors).length === 0) {
      onSave();
    } else {
      setErrors(validationErrors);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng kiểm tra lại các thông tin nhập',
        life: 3000
      });
    }
  };

  const dialogFooter = (
    <React.Fragment>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" onClick={handleSave} />
    </React.Fragment>
  );
  console.log('user', users);
  console.log('formData', formData);
  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={isNew ? 'Thêm Tài Xế' : 'Chỉnh Sửa Tài Xế'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <Toast ref={toast} />
      {isNew ? (
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="nguoi_dung_id">Người Dùng</label>
          {users.length > 0 ? (
            <Dropdown
              id="nguoi_dung_id"
              value={formData.nguoi_dung_id || ''}
              options={users.map((user) => ({
                label: user.ho_ten || '',
                value: user.id,
                vai_tro: user.vai_tro || '',
                ho_ten: user.ho_ten || ''
              }))}
              onChange={(e) => onInputChange({ target: { value: e.value } }, 'nguoi_dung_id')}
              placeholder="Chọn người dùng"
              filter
              filterBy="label"
              className="mt-2"
              style={{ width: '100%' }}
              itemTemplate={(option) => (
                <div>
                  <span>{option.ho_ten}</span> {option.vai_tro && <small>({spServices.formatVaiTro(option.vai_tro)})</small>}
                </div>
              )}
            />
          ) : (
            <p>Đang tải danh sách người dùng...</p>
          )}
          {errors.nguoi_dung_id && <small className="p-error">{errors.nguoi_dung_id}</small>}
        </div>
      ) : (
        <h4>{formData?.ho_ten}</h4>
      )}
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="bang_lai">Bằng Lái</label>
        <InputText id="bang_lai" style={{ marginTop: '3px' }} value={formData.bang_lai || ''} onChange={(e) => onInputChange(e, 'bang_lai')} placeholder="Ví dụ: B2" className="mt-2 h-10" />
        {errors.bang_lai && <small className="p-error">{errors.bang_lai}</small>}
      </div>
      {!isNew && (
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="trang_thai">Trạng Thái</label>
          <Dropdown
            id="trang_thai"
            value={formData.trang_thai || 'hoat_dong'}
            options={[
              { label: 'Hoạt Động', value: 'hoat_dong' },
              { label: 'Ngừng Hoạt Động', value: 'ngung_hoat_dong' },
              { label: 'Đang Vận Chuyển', value: 'dang_van_chuyen' }
            ]}
            onChange={(e) => onInputChange({ target: { value: e.value } }, 'trang_thai')}
            placeholder="Chọn trạng thái"
            className="mt-2"
            style={{ width: '100%' }}
          />
          {errors.trang_thai && <small className="p-error">{errors.trang_thai}</small>}
        </div>
      )}
    </Dialog>
  );
};

export default TaiXeDialog;
