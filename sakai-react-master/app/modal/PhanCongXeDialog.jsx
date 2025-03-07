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

const PhanCongXeDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listXe, setListXe] = useState([]);
  const [listPhanCongXe, setListPhanCongXe] = useState([]);
  const [selectedBenXe, setSelectedBenXe] = useState([]);
  const [selectedXe, setSelectedXe] = useState([]);
  const [filters, setFilters] = useState({});
  const toast = useRef(null);

  //
  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);
  const xeService = XeService(axiosInstance);
  const PhanCongXeService = phanCongXeService(axiosInstance);
  useEffect(() => {
    if (visible) {
      fetchPhanCongXe();
      fetchBenXe();
      fetchXe();
    }
  }, [visible, filters]);

  const fetchBenXe = async () => {
    try {
      const response = await benXeService.getAllBenXe();
      setListBenXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bến xe', error);
      showError('Lỗi khi tải danh sách bến xe');
    }
  };

  const fetchXe = async () => {
    try {
      const response = await xeService.getAllVehicles();
      setListXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách xe', error);
      showError('Lỗi khi tải danh sách xe');
    }
  };

  const fetchPhanCongXe = async () => {
    try {
      const response = await PhanCongXeService.getAllVehicleAssignments();
      console.log('response phan cong xe', response);
      setListPhanCongXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phân công xe', error);
      showError('Lỗi khi tải danh sách phân công xe');
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

  // Xử lý thay đổi đầu vào
  const handleInputChange = async (e, field) => {
    const value = e.value;
    if (field === 'id_ben') {
      const response = await xeService.getAllVehicles();
      const updatedListXe = Array.isArray(response.DT) ? response.DT : [];
      const assignedVehicles = listPhanCongXe.filter((assignment) => assignment.id_ben === value).map((assignment) => assignment.id_xe);
      const filteredXeOptions = updatedListXe.filter((xe) => !assignedVehicles.includes(xe.id));
      setSelectedBenXe(value);
      setListXe(filteredXeOptions);
    }
    onInputChange(e, field);
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
    <Dialog header={`Phân công bến xe cho xe`} visible={visible} style={{ width: '40vw', maxWidth: '600px' }} footer={dialogFooter} onHide={onHide} className="p-dialog-custom">
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
              placeholder="Chọn bến xe trước khi chọn xe"
              filter
              filterBy="bien_so"
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

export default PhanCongXeDialog;
