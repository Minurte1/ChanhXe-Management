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

  const [selectedDonHang, setSelectedDonHang] = useState([]);

  const toast = useRef(null);
  const axiosInstance = useAxios();

  const donHangService = DonHangService(axiosInstance);
  const donHangChuyenXeService = DonHangChuyenXeService(axiosInstance);

  useEffect(() => {
    if (visible) {
      fetchDonHangChuyenXe();
    }
  }, [visible]);

  // Lấy danh sách đơn hàng từ API với bộ lọc
  const fetchDonHangChuyenXe = async () => {
    try {
      const params = {
        trang_thai: 'cho_xu_ly', // Chỉ lấy đơn hàng có trạng thái "Chờ xử lý"
        id_ben_xe_nhan: selectedChuyenXe.id_ben_xe_nhan,
        id_ben_xe_gui: selectedChuyenXe.id_ben_xe_gui
      };
      const response = await donHangService.getDonHangChuyenXe(params);
      const data = Array.isArray(response.DT) ? response.DT : [];

      // Pre-select các đơn hàng có isAddDHChuyenXe = 1
      const selected = data.filter((item) => item.isAddDHChuyenXe === 1);

      setDonHangList(data);
      setSelectedDonHang(selected);
    } catch (error) {
      showError('Lỗi khi tải danh sách đơn hàng');
    }
  };
  console.log('donHangList', donHangList);
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
  // Xử lý khi người dùng nhấn Bắt đầu vận chuyển
  const startChuyenXeD = async () => {
    try {
      await donHangChuyenXeService.startChuyenXe({
        don_hang_chuyen_xe_id: selectedChuyenXe?.chuyen_xe_id
      });

      showSuccess('Thêm đơn hàng vào chuyến xe thành công');
      onHide();
    } catch (error) {
      showError('Lỗi khi thêm đơn hàng vào chuyến xe');
    }
  };

  // Footer của modal
  const dialogFooter = (
    <div>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={saveDonHangChuyenXe} />
      <Button label="Bắt đầu vận chuyển" icon="pi pi-check" className="p-button-text" onClick={startChuyenXeD} />
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
        className="p-datatable-sm p-datatable-striped " // Thu nhỏ và thêm kẻ sọc
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
        <Column field="ten_ben_xe_gui" header="Bến Xe Gửi" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="ten_ben_xe_nhan" header="Bến Xe Nhận" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="trang_thai" header="Trạng Thái" sortable bodyStyle={{ padding: '10px' }} />
        <Column field="ngay_tao" header="Ngày Tạo" sortable body={(rowData) => new Date(rowData.ngay_tao).toLocaleString('vi-VN')} bodyStyle={{ padding: '10px' }} />
      </DataTable>
    </Dialog>
  );
};

export default DonHangChuyenXeDialog;
