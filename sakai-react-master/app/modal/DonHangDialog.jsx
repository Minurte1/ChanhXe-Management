import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import khachHangService from '../services/khachHangServices';

const OrderDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave, isLoggedIn }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUsers();
        }
    }, [isLoggedIn]);

    const fetchUsers = async () => {
        try {
            const response = await khachHangService.getAllCustomers();
            setUsers(response);
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng', error);
        }
    };

    const dialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Lưu" icon="pi pi-check" onClick={onSave} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '500px' }} header={isNew ? 'Thêm Đơn Hàng' : 'Chỉnh Sửa Đơn Hàng'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
            <div className="p-field">
                <label htmlFor="ma_van_don">Mã Vận Đơn</label>
                <InputText id="ma_van_don" value={formData.ma_van_don} onChange={(e) => onInputChange(e, 'ma_van_don')} />
            </div>
            <div className="p-field">
                <label htmlFor="ma_qr_code">Mã QR Code</label>
                <InputText id="ma_qr_code" value={formData.ma_qr_code} onChange={(e) => onInputChange(e, 'ma_qr_code')} />
            </div>
            {isLoggedIn ? (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="nguoi_gui_label">Người Gửi</InputLabel>
                    <Select labelId="nguoi_gui_label" id="nguoi_gui_id" value={formData.nguoi_gui_id || ''} onChange={(e) => onInputChange(e, 'nguoi_gui_id')}>
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.ho_ten}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <>
                    <div className="p-field">
                        <label htmlFor="ho_ten">Họ Tên Người Gửi</label>
                        <InputText id="ho_ten" value={formData.ho_ten} onChange={(e) => onInputChange(e, 'ho_ten')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="so_dien_thoai">Số Điện Thoại</label>
                        <InputText id="so_dien_thoai" value={formData.so_dien_thoai} onChange={(e) => onInputChange(e, 'so_dien_thoai')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={formData.email} onChange={(e) => onInputChange(e, 'email')} />
                    </div>
                </>
            )}
            <div className="p-field">
                <label htmlFor="dia_chi_gui">Địa Chỉ Gửi</label>
                <InputText id="dia_chi_gui" value={formData.dia_chi_gui} onChange={(e) => onInputChange(e, 'dia_chi_gui')} />
            </div>
            <div className="p-field">
                <label htmlFor="dia_chi_nhan">Địa Chỉ Nhận</label>
                <InputText id="dia_chi_nhan" value={formData.dia_chi_nhan} onChange={(e) => onInputChange(e, 'dia_chi_nhan')} />
            </div>
            <div className="p-field">
                <label htmlFor="loai_hang_hoa">Loại Hàng Hóa</label>
                <InputText id="loai_hang_hoa" value={formData.loai_hang_hoa} onChange={(e) => onInputChange(e, 'loai_hang_hoa')} />
            </div>
            <div className="p-field">
                <label htmlFor="ten_nguoi_nhan">Tên Người Nhận</label>
                <InputText id="ten_nguoi_nhan" value={formData.ten_nguoi_nhan} onChange={(e) => onInputChange(e, 'ten_nguoi_nhan')} />
            </div>
            <div className="p-field">
                <label htmlFor="so_dien_thoai_nhan">Số Điện Thoại Người Nhận</label>
                <InputText id="so_dien_thoai_nhan" value={formData.so_dien_thoai_nhan} onChange={(e) => onInputChange(e, 'so_dien_thoai_nhan')} />
            </div>
            <div className="p-field">
                <label htmlFor="email_nhan">Email Người Nhận</label>
                <InputText id="email_nhan" value={formData.email_nhan} onChange={(e) => onInputChange(e, 'email_nhan')} />
            </div>
        </Dialog>
    );
};

export default OrderDialog;
