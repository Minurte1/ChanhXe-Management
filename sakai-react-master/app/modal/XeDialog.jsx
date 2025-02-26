import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const XeDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
    const dialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Lưu" icon="pi pi-check" onClick={onSave} />
        </React.Fragment>
    );

    // Danh sách trạng thái xe
    const trangThaiOptions = [
        { label: 'Đang hoạt động', value: 'hoat_dong' },
        { label: 'Bảo trì', value: 'bao_tri' },
        { label: 'Ngưng hoạt động', value: 'ngung_hoat_dong' }
    ];

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header={isNew ? 'Thêm Xe' : 'Chỉnh Sửa Xe'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
            <div className="p-field">
                <label htmlFor="bien_so">Biển Số</label>
                <InputText id="bien_so" style={{ marginTop: '3px' }} value={formData.bien_so} onChange={(e) => onInputChange(e, 'bien_so')} />
            </div>
            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="loai_xe_label">Loại Xe</InputLabel>
                <Select
                    labelId="loai_xe_label"
                    InputLabelProps={{
                        shrink: true
                    }}
                    label="Loại Xe"
                    id="loai_xe"
                    value={formData.loai_xe}
                    onChange={(e) => onInputChange(e, 'loai_xe')}
                >
                    <MenuItem value="Xe tải nhẹ">Xe tải nhẹ (dưới 2 tấn): Chở hàng nhỏ, giao hàng trong nội thành</MenuItem>
                    <MenuItem value="Xe tải trung">Xe tải trung (2 - 7 tấn): Phù hợp chở hàng tầm trung, đi liên tỉnh</MenuItem>
                    <MenuItem value="Xe tải nặng">Xe tải nặng (trên 7 tấn): Chở hàng số lượng lớn, đường dài</MenuItem>
                </Select>
            </FormControl>
            <div className="p-field mt-2">
                <label htmlFor="loai_xe">Sức chứa</label>
                <InputText id="suc_chua" style={{ marginTop: '3px' }} value={formData.suc_chua} onChange={(e) => onInputChange(e, 'suc_chua')} />
            </div>
            <div className="p-field mt-2">
                <label htmlFor="trang_thai">Trạng Thái</label>
                <Dropdown id="trang_thai" style={{ marginTop: '3px' }} value={formData.trang_thai} options={trangThaiOptions} onChange={(e) => onInputChange(e, 'trang_thai')} placeholder="Chọn trạng thái" />
            </div>
        </Dialog>
    );
};

export default XeDialog;
