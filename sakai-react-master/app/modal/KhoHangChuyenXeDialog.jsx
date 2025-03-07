import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useAxios } from '../authentication/useAxiosClient';
import spServices from '../share/share-services/sp-services';
import chuyenXeService from '../services/chuyenXeServices';

const KhoHangChuyenXeModal = ({ chuyenXeId, visible, onHide }) => {
  console.log('chuyenXeId', chuyenXeId);
  const [donHangList, setDonHangList] = useState([]);
  const axiosInstance = useAxios();
  const ChuyenXeService = chuyenXeService(axiosInstance);

  useEffect(() => {
    if (visible && chuyenXeId) {
      fetchDonHang(chuyenXeId);
    }
  }, [visible, chuyenXeId]);

  const fetchDonHang = async (chuyenXeId) => {
    try {
      const response = await ChuyenXeService.getTripAndOrders(chuyenXeId);
      const output = spServices.formatData(response?.data);
      console.log('output', output);
      setDonHangList(Array.isArray(output) ? output : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng', error);
    }
  };

  return (
    <Dialog header="Danh Sách Đơn Hàng" visible={visible} style={{ width: '90vw' }} onHide={onHide}>
      <DataTable value={donHangList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
        {/* Các cột hiển thị thông tin đơn hàng */}
        <Column field="ma_van_don" header="Mã Vận Đơn" sortable />
        <Column field="ma_qr_code" header="Mã QR Code" sortable />
        <Column field="ho_ten" header="Người Gửi" sortable />
        <Column field="ten_nguoi_nhan" header="Người Nhận" sortable />
        <Column field="so_dien_thoai_nhan" header="SĐT Người Nhận" sortable />
        <Column field="email_nhan" header="Email Người Nhận" sortable />
        <Column field="dia_chi" header="Địa Chỉ Giao Hàng" sortable />
        <Column field="loai_hang_hoa" header="Loại Hàng Hóa" sortable />
        <Column field="trong_luong" header="Trọng Lượng (kg)" sortable />
        <Column field="kich_thuoc" header="Kích Thước" sortable />
        <Column field="so_kien" header="Số Kiện" sortable />
        <Column field="gia_tri_hang" header="Giá Trị Hàng (VND)" sortable />
        <Column field="cuoc_phi" header="Cước Phí (VND)" sortable />
        <Column field="phi_bao_hiem" header="Phí Bảo Hiểm (VND)" sortable />
        <Column field="phu_phi" header="Phụ Phí (VND)" sortable />
        <Column field="labelTrangThaiDonHang" header="Trạng Thái Đơn Hàng" sortable />
        <Column field="ngay_tao" header="Ngày Tạo" sortable body={(rowData) => new Date(rowData.ngay_tao).toLocaleString('vi-VN')} />
        <Column field="ngay_cap_nhat" header="Ngày Cập Nhật" sortable body={(rowData) => new Date(rowData.ngay_cap_nhat).toLocaleString('vi-VN')} />
      </DataTable>
    </Dialog>
  );
};

export default KhoHangChuyenXeModal;
