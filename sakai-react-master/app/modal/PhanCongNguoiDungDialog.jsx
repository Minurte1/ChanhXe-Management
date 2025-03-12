'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import BenXeService from '../services/benXeServices';
import UserService from '../services/userAccountService';
import phanCongNguoiDungService from '../services/phanCongNguoiDungServices';
import { useAxios } from '../authentication/useAxiosClient';
import { validateForm } from '../(main)/utilities/validation';

const PhanCongNguoiDungDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listNguoiDung, setListNguoiDung] = useState([]);
  const [listPhanCongNguoiDung, setListPhanCongNguoiDung] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const axiosInstance = useAxios();
  const userService = UserService(axiosInstance);
  const benXeService = BenXeService(axiosInstance);
  const PhanCongNguoiDungService = phanCongNguoiDungService(axiosInstance);
  console.log('formData', formData);
  useEffect(() => {
    if (visible) {
      fetchBenXe();
      fetchAllUnassignedUsers();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setErrors({});
    }
  }, [visible]);

  const fetchBenXe = async () => {
    try {
      const response = await benXeService.getAllBenXe();
      console.log('response ben xe', response);
      setListBenXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bến xe', error);
      showError('Lỗi khi tải danh sách bến xe');
    }
  };

  const fetchAllUnassignedUsers = async () => {
    try {
      const params = { vai_tro: ['nhan_vien_kho', 'nhan_vien_dieu_phoi', 'nhan_vien_giao_dich'], phanCongTaiXe: 'false' };
      const response = await PhanCongNguoiDungService.getAllUnassignedUsers(params);
      setListNguoiDung(response ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng', error);
      showError('Lỗi khi tải danh sách người dùng');
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

  // Sử dụng onInputChange từ props thay vì định nghĩa lại
  const handleInputChange = (e, field) => {
    const value = e.value; // Giá trị từ Dropdown
    onInputChange({ target: { name: field, value } }, field); // Gọi prop onInputChange
  };

  const handleSave = () => {
    const requiredFields = ['id_ben', 'id_nguoi_dung'];
    const validationErrors = validateForm(formData, requiredFields);
    if (Object.keys(validationErrors).length === 0) {
      onSave();
    } else {
      setErrors(validationErrors);
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
    }
  };

  const dialogFooter = (
    <div>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={handleSave} />
    </div>
  );

  return (
    <Dialog header="Phân công bến xe cho người dùng" visible={visible} style={{ width: '40vw', maxWidth: '600px' }} footer={dialogFooter} onHide={onHide} className="p-dialog-custom">
      <Toast ref={toast} />

      <div className="p-mb-4">
        <div className="p-grid p-align-center">
          <div className="p-col-12" style={{ marginBottom: '2rem' }}>
            <label htmlFor="id_ben" className="p-d-block p-mb-2">
              Chọn bến
            </label>
            <Dropdown
              id="id_ben"
              value={formData.id_ben}
              options={listBenXe}
              optionLabel="ten_ben_xe"
              optionValue="id"
              onChange={(e) => handleInputChange(e, 'id_ben')}
              placeholder="Chọn bến"
              filter
              filterBy="ten_ben_xe"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
            />
            {errors.id_ben && <small className="p-error">{errors.id_ben}</small>}
          </div>

          <div className="p-col-12" style={{ marginBottom: '2rem' }}>
            <label className="p-d-block p-mb-2">Chọn xe</label>
            <div className="p-inputtext-sm p-d-flex p-ai-center" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', background: '#f8f9fa' }}>
              {formData.ho_ten || 'Không có dữ liệu'}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PhanCongNguoiDungDialog;
