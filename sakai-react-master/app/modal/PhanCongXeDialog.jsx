'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import BenXeService from '../services/benXeServices';
import XeService from '../services/xeSerivces';
import phanCongXeService from '../services/phanCongXeServices';
import { useAxios } from '../authentication/useAxiosClient';
import { validateForm } from '../(main)/utilities/validation';

const PhanCongXeDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listXe, setListXe] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);
  const xeService = XeService(axiosInstance);
  const PhanCongXeService = phanCongXeService(axiosInstance);

  useEffect(() => {
    if (visible) {
      fetchBenXe();
      fetchXe();
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
      setListBenXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      showError('Lỗi khi tải danh sách bến xe');
    }
  };

  const fetchXe = async () => {
    try {
      const response = await PhanCongXeService.getAllUnassignedVehicles();
      setListXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      showError('Lỗi khi tải danh sách xe');
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

  const handleInputChange = (e, field) => {
    const value = e.value;
    onInputChange({ target: { name: field, value } }, field);
  };

  const handleSave = () => {
    const requiredFields = ['id_ben', 'id_ben_2', 'id_xe'];
    const validationErrors = validateForm(formData, requiredFields);

    if (Object.keys(validationErrors).length === 0) {
      onSave();
    } else {
      setErrors(validationErrors);
      showError('Vui lòng điền đầy đủ thông tin');
    }
  };

  const dialogFooter = (
    <div>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={handleSave} />
    </div>
  );

  return (
    <Dialog header="Phân công bến đỗ cho xe" visible={visible} style={{ width: '40vw', maxWidth: '600px' }} footer={dialogFooter} onHide={onHide} className="p-dialog-custom">
      <Toast ref={toast} />

      <div className="p-mb-4">
        <div className="p-grid p-align-center">
          {/* Chọn bến xe 1 */}
          <div className="p-col-12" style={{ marginBottom: '2rem' }}>
            <label htmlFor="id_ben" className="p-d-block p-mb-2">
              Chọn bến 1
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

          {/* Chọn bến xe 2 */}
          <div className="p-col-12" style={{ marginBottom: '2rem' }}>
            <label htmlFor="id_ben_2" className="p-d-block p-mb-2">
              Chọn bến 2
            </label>
            <Dropdown
              id="id_ben_2"
              value={formData.id_ben_2}
              options={listBenXe}
              optionLabel="ten_ben_xe"
              optionValue="id"
              onChange={(e) => handleInputChange(e, 'id_ben_2')}
              placeholder="Chọn bến thứ hai"
              filter
              filterBy="ten_ben_xe"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
            />
            {errors.id_ben_2 && <small className="p-error">{errors.id_ben_2}</small>}
          </div>

          {/* Chọn xe */}
          <div className="p-col-12" style={{ marginBottom: '2rem' }}>
            <label htmlFor="id_xe" className="p-d-block p-mb-2">
              Chọn xe
            </label>
            <Dropdown
              id="id_xe"
              value={formData.id_xe}
              options={listXe}
              optionLabel="bien_so"
              optionValue="id"
              onChange={(e) => handleInputChange(e, 'id_xe')}
              placeholder="Chọn xe"
              filter
              filterBy="bien_so"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
              disabled={!formData.id_ben || !formData.id_ben_2}
            />
            {errors.id_xe && <small className="p-error">{errors.id_xe}</small>}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PhanCongXeDialog;
