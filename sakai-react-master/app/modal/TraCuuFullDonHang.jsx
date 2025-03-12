'use client';
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';
import moment from 'moment';

const TraCuuOrderDialog = ({ confirmOrder, visible, onHide, formData, onInputChange, onSave, isNew, saveWithCustomer, suggestions, completeMethod }) => {
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false); // State để điều khiển modal xác nhận

  const footer = (
    <div>
      <Button label="Hủy" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      {formData?.trang_thai === 'da_cap_ben' ? <Button label="Đơn hàng đã nhận" icon="pi pi-check" onClick={() => handleUpdateStatusGiaoHangSuccess()} className="p-button-success" /> : false}
      {isNew && <Button label="Lưu cùng khách hàng" icon="pi pi-user-plus" onClick={saveWithCustomer} className="p-button-info" />}
    </div>
  );

  const confirmFooter = (
    <div>
      <Button label="Hủy" icon="pi pi-times" onClick={() => setConfirmDialogVisible(false)} className="p-button-text" />
      <Button
        label="Chắc chắn"
        icon="pi pi-check"
        onClick={() => {
          onSave('success');
          setConfirmDialogVisible(false);
        }}
        className="p-button-success"
      />
    </div>
  );

  const handleUpdateStatusGiaoHangSuccess = () => {
    setConfirmDialogVisible(true); // Hiển thị modal xác nhận
  };

  const getLabel = (key) => {
    const labels = {
      ben_xe_gui_ten: 'Bến xe gửi',
      ben_xe_gui_dia_chi: 'Địa chỉ bến xe gửi',
      ben_xe_nhan_ten: 'Bến xe nhận',
      ben_xe_nhan_dia_chi: 'Địa chỉ bến xe nhận',
      khach_hang_ho_ten: 'Họ tên khách hàng',
      khach_hang_so_dien_thoai: 'Số điện thoại khách hàng',
      khach_hang_dia_chi: 'Địa chỉ khách hàng',
      ngay_tao: 'Ngày tạo',
      ngay_cap_nhat: 'Ngày cập nhật',
      loai_hang_hoa: 'Loại hàng hóa',
      trong_luong: 'Trọng lượng',
      so_kien: 'Số kiện',
      gia_tri_hang: 'Giá trị hàng',
      cuoc_phi: 'Cước phí',
      phi_bao_hiem: 'Phí bảo hiểm',
      phu_phi: 'Phụ phí',
      trang_thai: 'Trạng thái',
      ten_nguoi_nhan: 'Tên người nhận',
      so_dien_thoai_nhan: 'Số điện thoại người nhận',
      email_nhan: 'Email người nhận',
      ma_van_don: 'Mã vận đơn',
      ma_qr_code: 'Mã QR Code',
      khach_hang_id: 'Mã khách hàng',
      khach_hang_id_nguoi_cap_nhat: 'Mã người cập nhật',
      khach_hang_ngay_tao: 'Ngày tạo khách hàng',
      khach_hang_ngay_cap_nhat: 'Ngày cập nhật khách hàng',
      labelTrangThai: 'Trạng thái hiển thị',
      labelTrangThaiDonHang: 'Trạng thái đơn hàng',
      labelLoaiHangHoa: 'Loại hàng hóa hiển thị',
      tong_tien: 'Tổng số tiền'
    };
    return labels[key] || key.replace(/_/g, ' ').toUpperCase();
  };

  const formatDate = (value) => {
    return moment(value).isValid() ? moment(value).format('HH:mm:ss DD/MM/YYYY') : value;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const calculateTotal = () => {
    const cuocPhi = parseFloat(formData.cuoc_phi) || 0;
    const phiBaoHiem = parseFloat(formData.phi_bao_hiem) || 0;
    const phuPhi = parseFloat(formData.phu_phi) || 0;
    return cuocPhi + phiBaoHiem + phuPhi;
  };

  const tongTien = calculateTotal();

  const fieldOrder = [
    'khach_hang_ho_ten',
    'ma_van_don',
    'ma_qr_code',
    'khach_hang_so_dien_thoai',
    'khach_hang_dia_chi',
    'ben_xe_gui_ten',
    'ben_xe_gui_dia_chi',
    'ngay_tao',
    'ngay_cap_nhat',
    'ben_xe_nhan_ten',
    'ben_xe_nhan_dia_chi',
    'loai_hang_hoa',
    'labelLoaiHangHoa',
    'trong_luong',
    'so_kien',
    'kich_thuoc',
    'gia_tri_hang',
    'cuoc_phi',
    'phi_bao_hiem',
    'phu_phi',
    'labelTrangThaiDonHang',
    'ten_nguoi_nhan',
    'so_dien_thoai_nhan',
    'email_nhan',
    'tong_tien'
  ];

  const sortedKeys = fieldOrder.filter((key) => formData.hasOwnProperty(key));

  return (
    <>
      <Dialog header={isNew ? 'Thêm Đơn Hàng Mới' : 'Chi Tiết Đơn Hàng'} visible={visible} style={{ width: '70vw' }} footer={footer} onHide={onHide}>
        <div className="p-fluid">
          <table className="p-d-table p-d-table-sm" style={{ width: '100%' }}>
            <tbody>
              {sortedKeys.map((key) => (
                <tr key={key}>
                  <td className="p-text-secondary" style={{ fontSize: '1em', padding: '0.5em' }}>
                    {getLabel(key)}
                  </td>
                  <td style={{ padding: '0.5em' }}>
                    {key === 'khach_hang_ho_ten' ? (
                      <span
                        style={{
                          fontSize: '1.2em', // Larger text for emphasis
                          fontWeight: 'bold', // Bold to stand out
                          color: '#262626', // White text for contrast
                          background: 'linear-gradient(90deg,rgb(182, 221, 248),rgb(252, 252, 252))', // Green gradient background
                          padding: '0.5em 1em', // Generous padding
                          borderRadius: '8px', // Rounded corners
                          display: 'block', // Full width
                          boxShadow: '0 2px 4px rgba(43, 40, 40, 0.1)', // Subtle shadow for depth
                          textAlign: 'left' // Centered text
                        }}
                      >
                        {formData[key]}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '1em',
                          display: 'block',
                          padding: '0.5em',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '5px'
                        }}
                      >
                        {['ngay_tao', 'ngay_cap_nhat', 'khach_hang_ngay_tao', 'khach_hang_ngay_cap_nhat'].includes(key) ? formatDate(formData[key]) : formData[key]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-text-secondary" style={{ fontSize: '1em', padding: '0.5em', fontWeight: 'bold' }}>
                  {getLabel('tong_tien')}
                </td>
                <td style={{ fontSize: '1em', padding: '0.5em', fontWeight: 'bold' }}>{formatCurrency(tongTien)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Dialog>

      {/* Modal xác nhận */}
      <Dialog header="Xác nhận giao hàng" visible={confirmDialogVisible} style={{ width: '30vw' }} footer={confirmFooter} onHide={() => setConfirmDialogVisible(false)}>
        <p>Bạn có chắc chắn đơn hàng đã được giao cho khách hàng?</p>
      </Dialog>
    </>
  );
};

export default TraCuuOrderDialog;
