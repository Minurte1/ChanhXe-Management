'use client';
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { getAllUsers } from '../services/userAccountService';

const TaiXeDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  const fetchUsers = async () => {
    try {
      const filters = { vai_tro: ['tai_xe', 'tai_xe_phu'], trang_thai: 'hoat_dong' };

      const response = await getAllUsers(filters);

      setUsers(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách khách hàng', error);
    }
  };

  const dialogFooter = (
    <React.Fragment>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" onClick={onSave} />
    </React.Fragment>
  );

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={isNew ? 'Thêm Tài Xế' : 'Chỉnh Sửa Tài Xế'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="nguoi_dung_id">Người Dùng</label>
        <Dropdown
          id="nguoi_dung_id"
          value={formData.nguoi_dung_id || ''}
          options={users.map((user) => ({
            label: user.ho_ten || '', // Hiển thị tên người dùng
            value: user.id // Giá trị là ID
          }))}
          onChange={(e) => onInputChange({ target: { value: e.value } }, 'nguoi_dung_id')}
          placeholder="Chọn người dùng"
          filter // Bật tính năng tìm kiếm
          filterBy="label" // Tìm kiếm theo trường label (ho_ten)
          className="mt-2"
          style={{ width: '100%' }}
        />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="bang_lai">Bằng Lái</label>
        <InputText id="bang_lai" style={{ marginTop: '3px' }} value={formData.bang_lai || ''} onChange={(e) => onInputChange(e, 'bang_lai')} placeholder="Ví dụ: B2" className="mt-2 h-10" />
      </div>{' '}
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="trang_thai">Trạng Thái</label>
        <Dropdown
          id="trang_thai"
          value={formData.trang_thai || ''}
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
      </div>
    </Dialog>
  );
};

export default TaiXeDialog;
