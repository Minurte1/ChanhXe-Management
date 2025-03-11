'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import BenXeService from '../services/benXeServices';
import phanCongTaiXeService from '../services/phanCongTaiXeServices';
import { useAxios } from '../authentication/useAxiosClient';
import taiXeService from '../services/taiXeServices';
import spServices from '../share/share-services/sp-services';
import { validateForm } from '../(main)/utilities/validation';
import phanCongNguoiDungService from '../services/phanCongNguoiDungServices';
const PhanCongTaiXeDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listTaiXe, setListTaiXe] = useState([]);

  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);

  const phanCongTaiXeServices = phanCongTaiXeService(axiosInstance);
  const PhanCongNguoiDungService = phanCongNguoiDungService(axiosInstance);

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

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Lỗi',
      detail: message,
      life: 3000
    });
  };

  const fetchAllUnassignedUsers = async () => {
    try {
      const params = { vai_tro: ['tai_xe', 'tai_xe_phu'] };
      const response = await PhanCongNguoiDungService.getAllUnassignedUsers(params);
      setListTaiXe(response ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng', error);
      showError('Lỗi khi tải danh sách người dùng');
    }
  };

  // Sử dụng onInputChange từ props thay vì định nghĩa lại
  const handleInputChange = (e, field) => {
    const value = e.value; // Giá trị từ Dropdown
    onInputChange({ target: { name: field, value } }, field); // Gọi prop onInputChange
  };

  const handleSave = () => {
    const requiredFields = ['id_ben', 'id_tai_xe'];
    const validationErrors = validateForm(formData, requiredFields);
    if (Object.keys(validationErrors).length === 0) {
      onSave();
    } else {
      setErrors(validationErrors);
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
    }
  };

  // Footer của modal
  const dialogFooter = (
    <div>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={handleSave} />
    </div>
  );
  console.log('form', formData);
  console.log('listTaiXe', listTaiXe);
  return (
    <Dialog header={`Phân công bến xe cho tài xế`} visible={visible} style={{ width: '40vw', maxWidth: '600px' }} footer={dialogFooter} onHide={onHide} className="p-dialog-custom">
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
            <label htmlFor="id_tai_xe" className="p-d-block p-mb-2">
              Chọn tài xế
            </label>
            <Dropdown
              id="tai_xe_id"
              value={formData.tai_xe_id}
              options={listTaiXe}
              optionLabel="ho_ten"
              optionValue="tai_xe_id"
              onChange={(e) => handleInputChange(e, 'tai_xe_id')}
              placeholder="Chọn bến xe trước khi chọn tài xế"
              filter
              filterBy="ho_ten"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
              disabled={!formData.id_ben}
              itemTemplate={(option) => (
                <div>
                  <span>{option.ho_ten}</span> {option.vai_tro && <small>({spServices.formatVaiTro(option.vai_tro)})</small>}
                </div>
              )}
            />
            {errors.id_tai_xe && <small className="p-error">{errors.id_tai_xe}</small>}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PhanCongTaiXeDialog;
