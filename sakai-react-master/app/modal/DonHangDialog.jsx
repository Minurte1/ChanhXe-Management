'use client';
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import BenXeService from '../services/benXeServices';
import khachHangService from '../services/khachHangServices';
import { v4 as uuidv4 } from 'uuid';
import { Autocomplete, TextField } from '@mui/material';

const OrderDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave, isLoggedIn }) => {
  const [listBenXe, setListBenXe] = useState([]);
  const [tongTien, setTongTien] = useState(0); // State để lưu tổng tiền
  const [users, setUsers] = useState([]);
  const [isDivVisible, setIsDivVisible] = useState(true);
  useEffect(() => {
    if (visible) {
      fetchUsers();
      fetchBenXe();
    }
  }, [visible]);

  const trangThaiOptions = [
    { label: 'Chờ xử lý', value: 'cho_xu_ly' },
    { label: 'Đã nhận', value: 'da_nhan' },
    { label: 'Đang vận chuyển', value: 'dang_van_chuyen' },
    { label: 'Giao thành công', value: 'giao_thanh_cong' },
    { label: 'Giao thất bại', value: 'giao_that_bai' }
  ];

  const loaiHangHoaOptions = [
    { label: 'Hàng dễ vỡ', value: 'hang_de_vo' },
    { label: 'Hàng khô', value: 'hang_kho' },
    { label: 'Hàng đông lạnh', value: 'hang_dong_lanh' },
    { label: 'Hàng nguy hiểm', value: 'hang_nguy_hiem' },
    { label: 'Hàng thông thường', value: 'hang_thong_thuong' }
  ];
  console.log('form', formData);
  useEffect(() => {
    if (isNew && visible) {
      onInputChange({ target: { value: generateCode() } }, 'ma_van_don');
      onInputChange({ target: { value: generateQRCode() } }, 'ma_qr_code');
    }
  }, [isNew, visible]);

  // Tính tổng tiền khi các trường tiền thay đổi
  useEffect(() => {
    const cuocPhi = parseFloat(formData.cuoc_phi) || 0;
    const phiBaoHiem = parseFloat(formData.phi_bao_hiem) || 0;
    const phuPhi = parseFloat(formData.phu_phi) || 0;
    const total = cuocPhi + phiBaoHiem + phuPhi;
    setTongTien(total);
  }, [formData.cuoc_phi, formData.phi_bao_hiem, formData.phu_phi]);

  const fetchUsers = async () => {
    try {
      const response = await khachHangService.getAllCustomers();
      console.log('response users', response);
      setUsers(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách khách hàng', error);
    }
  };

  const fetchBenXe = async () => {
    try {
      const response = await BenXeService.getAllBenXe();
      console.log('response ben xe', response);
      setListBenXe(Array.isArray(response.DT) ? response.DT : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bến xe', error);
    }
  };

  const generateCode = () => {
    return `VD-${uuidv4().slice(0, 20)}`;
  };

  const generateQRCode = () => {
    return `QR-${uuidv4().slice(0, 20)}`;
  };

  const resetFormData = () => {
    onInputChange({ target: { value: '' } }, 'nguoi_gui_id');
  };

  const handleToggleDiv = () => {
    if (isDivVisible) {
      resetFormData();
    }
    setIsDivVisible(!isDivVisible);
  };

  const dialogFooter = (
    <>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-primary" onClick={onSave} />
    </>
  );

  return (
    <Dialog visible={visible} style={{ width: '960px' }} header={isNew ? 'Thêm Đơn Hàng' : 'Chỉnh Sửa Đơn Hàng'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="ma_van_don">Mã Vận Đơn</label>
        <InputText id="ma_van_don" value={formData.ma_van_don || ''} disabled className="mt-2 h-10" placeholder="VD-12345678" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="ma_qr_code">Mã QR Code</label>
        <InputText id="ma_qr_code" value={formData.ma_qr_code || ''} disabled className="mt-2 h-10" placeholder="QR-12345678" />
      </div>

      <Button label="Khách Hàng Mới" onClick={handleToggleDiv} icon="pi pi-plus" className="p-button-success" style={{ width: '20%' }} />
      {isDivVisible ? (
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="nguoi_gui_id">Người gửi</label>
          <Dropdown
            id="nguoi_gui_id"
            value={formData.nguoi_gui_id}
            options={users}
            optionLabel="ho_ten"
            optionValue="id"
            onChange={(e) => onInputChange({ target: { value: e.value } }, 'nguoi_gui_id')}
            filter
            placeholder="Tìm kiếm khách hàng"
            showClear
            className="w-100 mt-2"
          />
        </div>
      ) : (
        <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
          <label htmlFor="ma_qr_code">Thông tin khách hàng mới</label>
          <div className="p-fluid">
            <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
              <label htmlFor="ho_ten">Họ Tên</label>
              <InputText id="ho_ten" value={formData.ho_ten || ''} onChange={(e) => onInputChange(e, 'ho_ten')} className="mt-2 h-10" />
            </div>
            <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
              <label htmlFor="so_dien_thoai">Số Điện Thoại</label>
              <InputText id="so_dien_thoai" value={formData.so_dien_thoai || ''} onChange={(e) => onInputChange(e, 'so_dien_thoai')} className="mt-2 h-10" />
            </div>
            <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
              {/* <AddressSelector
                isEditing={!isNew}
                selectedProvince={selectedProvince}
                selectedDistrict={selectedDistrict}
                selectedWards={selectedWards}
                setSelectedProvince={setSelectedProvince}
                setSelectedDistrict={setSelectedDistrict}
                setSelectedWards={setSelectedWards}
              /> */}
            </div>{' '}
            <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
              <label className="mt-2" htmlFor="ten_duong">
                Tên Đường
              </label>
              {/* <InputText className="mt-2 h-10" id="ten_duong" value={street} onChange={(e) => setStreet(e.target.value)} /> */}
            </div>{' '}
            <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
              <label htmlFor="dia_chi">Địa Chỉ</label>
              <InputText id="dia_chi" value={formData.dia_chi || ''} onChange={(e) => onInputChange(e, 'dia_chi')} className="mt-2 h-10" />
            </div>
            <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
              <label htmlFor="mat_khau">Mật Khẩu</label>
              <InputText id="mat_khau" type="password" value={formData.mat_khau || ''} onChange={(e) => onInputChange(e, 'mat_khau')} className="mt-2 h-10" />
            </div>
          </div>
        </div>
      )}

      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="id_ben_xe_gui">Bến Xe Gửi</label>
        <Dropdown
          id="id_ben_xe_gui"
          value={formData.id_ben_xe_gui}
          options={listBenXe}
          optionLabel="ten_ben_xe"
          optionValue="id"
          onChange={(e) => onInputChange({ target: { value: e.value } }, 'id_ben_xe_gui')}
          placeholder="Tìm kiếm bến xe gửi"
          filter
          showClear
          className="w-100 mt-2"
        />
      </div>

      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="id_ben_xe_nhan">Bến Xe Nhận</label>
        <Dropdown
          id="id_ben_xe_nhan"
          value={formData.id_ben_xe_nhan}
          options={listBenXe}
          optionLabel="ten_ben_xe"
          optionValue="id"
          onChange={(e) => onInputChange({ target: { value: e.value } }, 'id_ben_xe_nhan')}
          placeholder="Tìm kiếm bến xe nhận"
          filter
          showClear
          className="w-100 mt-2"
        />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="loai_hang_hoa">Loại Hàng Hóa</label>
        <Dropdown id="loai_hang_hoa" value={formData.loai_hang_hoa || ''} options={loaiHangHoaOptions} onChange={(e) => onInputChange({ target: { value: e.value } }, 'loai_hang_hoa')} placeholder="Chọn loại hàng hóa" className="mt-2" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="trong_luong">Trọng Lượng</label>
        <InputText id="trong_luong" value={formData.trong_luong || ''} onChange={(e) => onInputChange(e, 'trong_luong')} className="mt-2 h-10" placeholder="Ví dụ: 10 kg" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="kich_thuoc">Kích Thước</label>
        <InputText id="kich_thuoc" value={formData.kich_thuoc || ''} onChange={(e) => onInputChange(e, 'kich_thuoc')} className="mt-2 h-10" placeholder="Ví dụ: 50x30x20 cm" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="so_kien">Số Kiện</label>
        <InputText id="so_kien" value={formData.so_kien || ''} onChange={(e) => onInputChange(e, 'so_kien')} className="mt-2 h-10" placeholder="Ví dụ: 2" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="gia_tri_hang">Giá Trị Hàng</label>
        <InputText id="gia_tri_hang" value={formData.gia_tri_hang || ''} onChange={(e) => onInputChange(e, 'gia_tri_hang')} className="mt-2 h-10" placeholder="Ví dụ: 500000 VND" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="cuoc_phi">Cước Phí</label>
        <InputText id="cuoc_phi" value={formData.cuoc_phi || ''} onChange={(e) => onInputChange(e, 'cuoc_phi')} className="mt-2 h-10" placeholder="Ví dụ: 100000 VND" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="phi_bao_hiem">Phí Bảo Hiểm</label>
        <InputText id="phi_bao_hiem" value={formData.phi_bao_hiem || ''} onChange={(e) => onInputChange(e, 'phi_bao_hiem')} className="mt-2 h-10" placeholder="Ví dụ: 20000 VND" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="phu_phi">Phụ Phí</label>
        <InputText id="phu_phi" value={formData.phu_phi || ''} onChange={(e) => onInputChange(e, 'phu_phi')} className="mt-2 h-10" placeholder="Ví dụ: 30000 VND" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="trang_thai">Trạng Thái</label>
        <Dropdown id="trang_thai" value={formData.trang_thai || ''} options={trangThaiOptions} onChange={(e) => onInputChange({ target: { value: e.value } }, 'trang_thai')} placeholder="Chọn trạng thái" className="mt-2" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="ten_nguoi_nhan">Tên Người Nhận</label>
        <InputText id="ten_nguoi_nhan" value={formData.ten_nguoi_nhan || ''} onChange={(e) => onInputChange(e, 'ten_nguoi_nhan')} className="mt-2 h-10" placeholder="Ví dụ: Nguyễn Văn A" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="so_dien_thoai_nhan">Số Điện Thoại Nhận</label>
        <InputText id="so_dien_thoai_nhan" value={formData.so_dien_thoai_nhan || ''} onChange={(e) => onInputChange(e, 'so_dien_thoai_nhan')} className="mt-2 h-10" placeholder="Ví dụ: 0912345678" />
      </div>
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label htmlFor="email_nhan">Email Nhận</label>
        <InputText id="email_nhan" value={formData.email_nhan || ''} onChange={(e) => onInputChange(e, 'email_nhan')} className="mt-2 h-10" placeholder="Ví dụ: example@gmail.com" />
      </div>
      {/* Hiển thị tổng tiền */}
      <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
        <label>Tổng Tiền</label>
        <InputText value={tongTien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} disabled className="mt-2 h-10" />
      </div>
    </Dialog>
  );
};

export default OrderDialog;
