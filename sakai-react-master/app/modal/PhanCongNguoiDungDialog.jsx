'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import BenXeService from '../services/benXeServices';
import { getAllUsers } from '../services/userAccountService';
import phanCongNguoiDungService from '../services/phanCongNguoiDungServices';

const PhanCongXeDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave, }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listXe, setListXe] = useState([]);
  const [filters, setFilters] = useState({
    // id_ben_xe_nhan: null,
    // id_ben_xe_gui: null
  });
  const toast = useRef(null);

  useEffect(() => {
    if (visible) {
      fetchBenXe();
      fetchUser();
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

  const fetchUser = async () => {
    try {
      const response = await getAllUsers();
      const allUsers = Array.isArray(response.DT) ? response.DT : [];
      // const filters = { vai_tro: ['tai_xe', 'tai_xe_phu'] };

      // const filteredUsers = allUsers.filter(user => 
      //   !filters.vai_tro.includes(user.vai_tro)
      // );

      setListNguoiDung(allUsers);
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
      header={`Phân công bến xe cho xe`}
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
            <label htmlFor="id_nguoi_dung" className="p-d-block p-mb-2">
              Chọn người dùng
            </label>
            <Dropdown
              id="id_nguoi_dung"
              value={formData.id_nguoi_dung}
              options={listXe}
              optionLabel="ho_ten"
              optionValue="id"
              onChange={(e) => onInputChange({ target: { value: e.value } }, 'id_nguoi_dung')}
              placeholder="Chọn người dùng"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PhanCongXeDialog;
