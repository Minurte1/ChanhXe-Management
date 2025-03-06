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

const PhanCongTaiXeDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listTaiXe, setListTaiXe] = useState([]);
  const [listPhanCongTaiXe, setListPhanCongTaiXe] = useState([]);
  const [selectedBenXe, setSelectedBenXe] = useState([]);
  const [filters, setFilters] = useState({});
  const toast = useRef(null);
  //
  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);
  const TaiXeServices = taiXeService(axiosInstance);
  const phanCongTaiXeServices = phanCongTaiXeService(axiosInstance);
  useEffect(() => {
    if (visible) {
      fetchBenXe();
      fetchTaiXe();
      fetchPhanCongTaiXe();
    }
  }, [visible, filters]);

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

  const fetchTaiXe = async () => {
    try {
      const response = await TaiXeServices.getAllDrivers({ trang_thai_tai_xe: 'hoat_dong' });
      setListTaiXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài xe', error);
      showError('Lỗi khi tải danh sách tài xe');
    }
  };

  const fetchPhanCongTaiXe = async () => {
    try {
      const response = await phanCongTaiXeServices.getAllDriverAssignments();
      console.log('response phan cong tai xe', response);
      setListPhanCongTaiXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phân công tai xe', error);
      showError('Lỗi khi tải danh sách phân công tai xe');
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

  // Xử lý thay đổi đầu vào
  const handleInputChange = async (e, field) => {
    const value = e.value;
    if (field === 'id_ben') {
      const response = await TaiXeServices.getAllDrivers({ trang_thai_tai_xe: 'hoat_dong' });
      const updatedListTaiXe = Array.isArray(response.DT) ? response.DT : [];
      const assignedDriver = listPhanCongTaiXe.filter((assignment) => assignment.id_ben === value).map((assignment) => assignment.id_tai_xe);
      const filteredTaiXeOptions = updatedListTaiXe.filter((driver) => !assignedDriver.includes(driver.nguoi_dung_id));
      setSelectedBenXe(value);
      setListTaiXe(filteredTaiXeOptions);
    }
    onInputChange(e, field);
  };

  // Footer của modal
  const dialogFooter = (
    <div>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={onSave} />
    </div>
  );

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
          </div>

          <div className="p-col-12" style={{ marginBottom: '2rem' }}>
            <label htmlFor="id_tai_xe" className="p-d-block p-mb-2">
              Chọn tài xế
            </label>
            <Dropdown
              id="id_tai_xe"
              value={formData.id_tai_xe}
              options={listTaiXe}
              optionLabel="ho_ten"
              optionValue="nguoi_dung_id"
              onChange={(e) => handleInputChange(e, 'id_tai_xe')}
              placeholder="Chọn bến xe trước khi chọn tài xế"
              filter
              filterBy="ho_ten"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
              disabled={!formData.id_ben}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PhanCongTaiXeDialog;
