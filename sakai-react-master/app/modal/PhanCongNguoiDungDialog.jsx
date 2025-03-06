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

const PhanCongXeDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listNguoiDung, setListNguoiDung] = useState([]);
  const [selectedBenXe, setSelectedBenXe] = useState([]);
  const [listPhanCongNguoiDung, setListPhanCongNguoiDung] = useState([]);
  const [filters, setFilters] = useState({});
  const toast = useRef(null);
  const axiosInstance = useAxios();
  const userService = UserService(axiosInstance);
  useEffect(() => {
    if (visible) {
      fetchPhanCongNguoiDung();
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
      const response = await userService.getAllUsers();
      const allUsers = Array.isArray(response.DT) ? response.DT : [];
      const filters = { vai_tro: ['tai_xe', 'tai_xe_phu'] };

      const filteredUsers = allUsers.filter((user) => !filters.vai_tro.includes(user.vai_tro));

      setListNguoiDung(filteredUsers);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng', error);
      showError('Lỗi khi tải danh sách người dùng');
    }
  };

  const fetchPhanCongNguoiDung = async () => {
    try {
      const response = await phanCongNguoiDungService.getAllUserAssignments();
      console.log('response phan cong nguoi dung', response);
      setListPhanCongNguoiDung(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phân công nguoi dung', error);
      showError('Lỗi khi tải danh sách phân công nguoi dung');
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
      const response = await userService.getAllUsers();
      const allUsers = Array.isArray(response.DT) ? response.DT : [];
      const filters = { vai_tro: ['tai_xe', 'tai_xe_phu'], trang_thai: 'hoat_dong' };

      const filteredUsers = allUsers.filter((user) => !filters.vai_tro.includes(user.vai_tro) && user.trang_thai === filters.trang_thai);

      const assignedUser = listPhanCongNguoiDung.filter((assignment) => assignment.id_ben === value).map((assignment) => assignment.id_nguoi_dung);
      const filteredNguoiDungOptions = filteredUsers.filter((user) => !assignedUser.includes(user.id));
      setSelectedBenXe(value);
      setListNguoiDung(filteredNguoiDungOptions);
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
    <Dialog header={`Phân công bến xe cho người dùng`} visible={visible} style={{ width: '40vw', maxWidth: '600px' }} footer={dialogFooter} onHide={onHide} className="p-dialog-custom">
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
            <label htmlFor="id_nguoi_dung" className="p-d-block p-mb-2">
              Chọn người dùng
            </label>
            <Dropdown
              id="id_nguoi_dung"
              value={formData.id_nguoi_dung}
              options={listNguoiDung}
              optionLabel="ho_ten"
              optionValue="id"
              onChange={(e) => handleInputChange(e, 'id_nguoi_dung')}
              placeholder="Chọn bến se trước khi chọn người dùng"
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

export default PhanCongXeDialog;
