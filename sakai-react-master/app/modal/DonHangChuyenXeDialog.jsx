'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import DonHangService from '../services/donHangSevices';
import DonHangChuyenXeService from '../services/DonHangChuyenXeService';
import BenXeService from '../services/benXeServices';
import { useAxios } from '../authentication/useAxiosClient';

const DonHangChuyenXeDialog = ({ visible, onHide, selectedChuyenXe }) => {
  const [donHangList, setDonHangList] = useState([]);
  const [listBenXe, setListBenXe] = useState([]);
  const [selectedDonHang, setSelectedDonHang] = useState([]);
  const [filters, setFilters] = useState({
    id_ben_xe_nhan: null,
    id_ben_xe_gui: null
  });
  const toast = useRef(null);
  const axiosInstance = useAxios();
  const benXeService = BenXeService(axiosInstance);
  const donHangService = DonHangService(axiosInstance);
  const donHangChuyenXeService = DonHangChuyenXeService(axiosInstance);
  // Chuyển đổi dữ liệu bến xe thành định dạng Dropdown
  const benXeOptions = [
    { label: 'Tất cả', value: null },
    ...listBenXe.map((benXe) => ({
      label: benXe.ten_ben_xe,
      value: benXe.id
    }))
  ];

  useEffect(() => {
    if (visible) {
      fetchDonHang();
      fetchBenXe();
    }
  }, [visible, filters]);

  // Lấy danh sách đơn hàng từ API với bộ lọc
  const fetchDonHang = async () => {
    try {
      const params = {
        trang_thai: 'cho_xu_ly', // Chỉ lấy đơn hàng có trạng thái "Chờ xử lý"
        id_ben_xe_nhan: selectedChuyenXe.id_ben_xe_nhan,
        id_ben_xe_gui: selectedChuyenXe.id_ben_xe_gui
      };
      const response = await donHangService.getAllOrders(params);
      setDonHangList(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      showError('Lỗi khi tải danh sách đơn hàng');
    }
  };

  // Lấy danh sách bến xe từ API
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

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 3000
    });
  };

  // Xử lý khi người dùng nhấn nút Lưu
  const saveDonHangChuyenXe = async () => {
    if (selectedDonHang.length === 0) {
      showError('Vui lòng chọn ít nhất một đơn hàng');
      return;
    }

    const don_hang_ids = selectedDonHang.map((donHang) => donHang.id);
    try {
      await donHangChuyenXeService.createDonHangChuyenXe({
        don_hang_ids,
        don_hang_chuyen_xe_id: selectedChuyenXe?.chuyen_xe_id
      });

      showSuccess('Thêm đơn hàng vào chuyến xe thành công');
      onHide();
    } catch (error) {
      showError('Lỗi khi thêm đơn hàng vào chuyến xe');
    }
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
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={saveDonHangChuyenXe} />
    </div>
  );

  return (
    <Dialog
      header={`Thêm đơn hàng vào chuyến xe ID: ${selectedChuyenXe?.chuyen_xe_id}`} // Sửa thành id thay vì chuyen_xe_id
      visible={visible}
      style={{ width: '60vw', maxWidth: '900px' }} // Tăng chiều rộng và đặt giới hạn tối đa
      footer={dialogFooter}
      onHide={onHide}
      className="p-dialog-custom" // Thêm class để tùy chỉnh CSS nếu cần
    >
      <Toast ref={toast} />

      {/* Bộ lọc */}
      {/* <div className="p-mb-4">
        <div className="p-grid p-align-center">
          <div className="p-col-6 p-md-4 p-mb-3">
            {' '}
            <label htmlFor="id_ben_xe_nhan" className="p-d-block p-mb-2 ">
              Bến xe nhận
            </label>
            <Dropdown
              id="id_ben_xe_nhan"
              value={filters.id_ben_xe_nhan}
              options={benXeOptions}
              onChange={(e) => onFilterChange(e, 'id_ben_xe_nhan')}
              placeholder="Chọn bến xe nhận"
              className="p-inputtext-sm"
              style={{ width: '100%', marginTop: '5px' }}
            />
          </div>

          <div className="p-col-6 p-md-4 p-mb-3 " style={{ marginTop: '10px' }}>
            {' '}
            <label htmlFor="id_ben_xe_gui" className="p-d-block p-mb-2">
              Bến xe gửi
            </label>
            <Dropdown id="id_ben_xe_gui" value={filters.id_ben_xe_gui} options={benXeOptions} onChange={(e) => onFilterChange(e, 'id_ben_xe_gui')} placeholder="Chọn bến xe gửi" className="p-inputtext-sm" style={{ width: '100%', marginTop: '5px' }} />
          </div>
        </div>
      </div> */}

      {/* DataTable hiển thị đơn hàng */}
      <DataTable
        value={donHangList}
        selection={selectedDonHang}
        onSelectionChange={(e) => setSelectedDonHang(e.value)}
        selectionMode="checkbox"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="Không có đơn hàng nào"
        className="p-datatable-sm p-datatable-striped" // Thu nhỏ và thêm kẻ sọc
        style={{ marginTop: '20px' }} // Thêm khoảng cách phía trên
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '4em', padding: '10px' }} // Tăng chiều rộng và padding
        />
        {/* <Column
          field="id"
          header="ID Đơn Hàng"
          sortable
          bodyStyle={{ padding: '10px' }} // Thêm padding cho nội dung cột
        /> */}
        <Column field="ma_van_don" header="Mã Vận Đơn" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="ten_nguoi_nhan" header="Tên Người Nhận" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="so_dien_thoai_nhan" header="Số Điện Thoại" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="ben_xe_gui_ten" header="Bến Xe Gửi" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="ben_xe_nhan_ten" header="Bến Xe Nhận" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="trang_thai" header="Trạng Thái" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="ngay_tao" header="Ngày Tạo" sortable body={(rowData) => new Date(rowData.ngay_tao).toLocaleString('vi-VN')} bodyStyle={{ padding: '10px' }} />
      </DataTable>
    </Dialog>
  );
};

export default DonHangChuyenXeDialog;
