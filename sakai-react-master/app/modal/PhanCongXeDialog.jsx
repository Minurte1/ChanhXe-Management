'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import BenXeService from '../services/benXeServices';
import XeService from '../services/xeSerivces';
import phanCongXeService from '../services/phanCongXeSerivces';

const PhanCongXeDialog = ({ visible, onHide, selectedChuyenXe, isNew, formData, onInputChange, onSave, }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [listXe, setListXe] = useState([]);
  const [selectedBenXe, setSelectedBenXe] = useState([]);
  const [selectedXe, setSelectedXe] = useState([]);
  const [filters, setFilters] = useState({
    // id_ben_xe_nhan: null,
    // id_ben_xe_gui: null
  });
  const toast = useRef(null);

  // Chuyển đổi dữ liệu bến xe thành định dạng Dropdown
  const benXeOptions = [
    { label: 'Tất cả', value: null },
    ...listBenXe.map((benXe) => ({
      label: benXe.ten_ben_xe,
      value: benXe.id
    }))
  ];

  const xeOptions = [
    { label: 'Tất cả', value: null },
    ...listXe.map((Xe) => ({
      label: Xe.bien_so,
      value: Xe.id
    }))
  ];

  useEffect(() => {
    if (visible) {
      // fetchDonHang();
      fetchBenXe();
      fetchXe();
    }
  }, [visible, filters]);

  // Lấy danh sách đơn hàng từ API với bộ lọc
  // const fetchDonHang = async () => {
  //   try {
  //     const params = {
  //       trang_thai: 'cho_xu_ly', // Chỉ lấy đơn hàng có trạng thái "Chờ xử lý"
  //       ...(filters.id_ben_xe_nhan && { id_ben_xe_nhan: filters.id_ben_xe_nhan }),
  //       ...(filters.id_ben_xe_gui && { id_ben_xe_gui: filters.id_ben_xe_gui })
  //     };
  //     const response = await DonHangService.getAllOrders(params);
  //     setDonHangList(Array.isArray(response.DT) ? response.DT : []);
  //   } catch (error) {
  //     showError('Lỗi khi tải danh sách đơn hàng');
  //   }
  // };

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

  const fetchXe = async () => {
    try {
      const response = await XeService.getAllVehicles();
      console.log('response xe', response);
      setListXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách xe', error);
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

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 3000
    });
  };

  // Xử lý khi người dùng nhấn nút Lưu
  // const saveDonHangChuyenXe = async () => {
  //   if (selectedDonHang.length === 0) {
  //     showError('Vui lòng chọn ít nhất một đơn hàng');
  //     return;
  //   }

  //   const don_hang_ids = selectedDonHang.map((donHang) => donHang.id);
  //   try {
  //     await DonHangChuyenXeService.createDonHangChuyenXe({
  //       don_hang_ids,
  //       don_hang_chuyen_xe_id: selectedChuyenXe?.chuyen_xe_id
  //     });

  //     showSuccess('Thêm đơn hàng vào chuyến xe thành công');
  //     onHide();
  //   } catch (error) {
  //     showError('Lỗi khi thêm đơn hàng vào chuyến xe');
  //   }
  // };

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
            <label htmlFor="ben_xe" className="p-d-block p-mb-2">
              Chọn xe
            </label>
            <Dropdown
              id="xe"
              value={formData.xe}
              options={xeOptions}
              onChange={(e) => setSelectedXe(e.value)}
              placeholder="Chọn xe"
              className="p-inputtext-sm"
              style={{ width: '100%' }}
            />
          </div>

          <div className="p-col-12">
            <label htmlFor="ben_xe" className="p-d-block p-mb-2">
              Chọn bến xe
            </label>
            <Dropdown
              id="ben_xe"
              value={formData.ben_xe}
              options={benXeOptions}
              onChange={(e) => setSelectedBenXe(e.value)}
              placeholder="Chọn bến xe"
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
