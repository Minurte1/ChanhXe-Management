'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import BenXeService from '../services/benXeServices';
import TaiXeService from '../services/taiXeServices';
import phanCongTaiXeService from '../services/phanCongTaiXeServices';

const PhanCongTaiXeDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave, }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listTaiXe, setListTaiXe] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    // id_ben_xe_nhan: null,
    // id_ben_xe_gui: null
  });
  const toast = useRef(null);

  useEffect(() => {
    if (visible) {
      fetchBenXe();
      fetchTaiXe();
    }
  }, [visible, filters]);

  const fetchBenXe = async () => {
    try {
      const response = await BenXeService.getAllBenXe();
      console.log('response ben xe', response);
      setListBenXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bến xe', error);
      showError('Lỗi khi tải danh sách bến xe');
    }
  };

  const fetchTaiXe = async () => {
    try {
      const response = await TaiXeService.getAllDrivers({ trang_thai_tai_xe: 'hoat_dong' });
      setListTaiXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài xe', error);
      showError('Lỗi khi tải danh sách tài xe');
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

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 3000
    });
  };

  // Xử lý thay đổi bộ lọc
  const onFilterChange = (e, field) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: e.value
    }));
  };

  // Footer của modal
  const dialogFooter = (
    <div>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={onSave} />
    </div>
  );

  return (
    <Dialog
      header={`Phân công bến xe cho tài xế`}
      visible={visible}
      style={{ width: '40vw', maxWidth: '600px' }}
      footer={dialogFooter}
      onHide={onHide}
      className="p-dialog-custom"
    >
      <Toast ref={toast} />

      <div className="p-mb-4">
        <div className="p-grid p-align-center">
        <div className="p-col-12">
            <label htmlFor="id_ben" className="p-d-block p-mb-2">
              Chọn bến
            </label>
            <Dropdown
              id="id_ben"
              value={formData.id_ben}
              options={listBenXe}
              optionLabel="ten_ben_xe"
              optionValue="id"
              onChange={(e) => onInputChange({ target: { value: e.value } }, 'id_ben')}
              placeholder="Chọn bến"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
            />
          </div>

          <div className="p-col-12">
            <label htmlFor="id_tai_xe" className="p-d-block p-mb-2">
              Chọn tài xế
            </label>
            <Dropdown
              id="id_tai_xe"
              value={formData.id_tai_xe}
              options={listTaiXe}
              optionLabel="ho_ten"
              optionValue="nguoi_dung_id"
              onChange={(e) => onInputChange({ target: { value: e.value } }, 'id_tai_xe')}
              placeholder="Chọn tài xế"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PhanCongTaiXeDialog;
