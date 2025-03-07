'use client';
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

import BenXeService from '../services/benXeServices';
import { useAxios } from '../authentication/useAxiosClient';
import DriverAssignmentService from '../services/phanCongTaiXeServices';
import VehicleAssignmentService from '../services/phanCongXeServices';
import { validateForm } from '../(main)/utilities/validation';

const ChuyenXeDialog = ({ visible, onHide, isNew, formData, onInputChange, onSave }) => {
  const [taiXeList, setTaiXeList] = useState([]);
  const [taiXePhuList, setTaiXePhuList] = useState([]);
  const [xeList, setXeList] = useState([]);
  const [listBenXe, setListBenXe] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = React.useRef(null);
  const axiosInstance = useAxios();

  const benXeService = BenXeService(axiosInstance);
  const phanCongTaiXe = DriverAssignmentService(axiosInstance);
  const phanCongXe = VehicleAssignmentService(axiosInstance);

  // Danh sách trạng thái ban đầu
  const trangThaiOptions = [
    { label: 'Chờ xuất bến', value: 'cho_xuat_ben' },
    { label: 'Đang vận chuyển', value: 'dang_van_chuyen' },
    { label: 'Đã cập bến', value: 'da_cap_ben' }
  ];

  // Lọc trạng thái dựa trên giá trị hiện tại của formData.trang_thai
  const filteredTrangThaiOptions = trangThaiOptions.filter((option) => {
    if (formData.trang_thai === 'dang_van_chuyen') {
      // Nếu đang là "Đang vận chuyển", không cho chọn "Chờ xuất bến"
      return option.value !== 'cho_xuat_ben';
    } else if (formData.trang_thai === 'da_cap_ben') {
      // Nếu đã là "Đã cập bến", chỉ cho phép giữ nguyên "Đã cập bến"
      return option.value === 'da_cap_ben';
    }
    // Nếu là "Chờ xuất bến", cho phép chọn tất cả
    return true;
  });

  const handleSave = () => {
    const requiredFields = ['id_ben_xe_gui', 'id_ben_xe_nhan', 'xe_id', 'tai_xe_id', 'thoi_gian_xuat_ben', 'trang_thai'];
    const validationErrors = validateForm(formData, requiredFields);
    if (Object.keys(validationErrors).length === 0 && validateTimes()) {
      const formattedData = {
        ...formData,
        thoi_gian_xuat_ben: formatDateTime(formData.thoi_gian_xuat_ben),
        thoi_gian_cap_ben: formatDateTime(formData.thoi_gian_cap_ben)
      };
      onSave(formattedData);
    } else {
      setErrors(validationErrors);
      toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
    }
  };

  const dialogFooter = (
    <React.Fragment>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button
        label="Lưu"
        icon="pi pi-check"
        onClick={handleSave}
      />
    </React.Fragment>
  );

  const showError = (message) => {
    setErrors({ form: message });
    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
  };

  const formatDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [xeResponse, taiXeResponse, benXeResponse] = await Promise.all([
          phanCongXe.getAllVehicleAssignments({ id_ben: formData?.id_ben_xe_gui }),
          phanCongTaiXe.getAllDriverAssignments({ id_ben: formData?.id_ben_xe_gui }),
          benXeService.getAllBenXe()
        ]);

        const allTaiXe = Array.isArray(taiXeResponse.DT) ? taiXeResponse.DT : [];
        const taiXeChinh = allTaiXe.filter((taiXe) => taiXe.vai_tro === 'tai_xe');
        const taiXePhu = allTaiXe.filter((taiXe) => taiXe.vai_tro === 'tai_xe_phu');

        setXeList(Array.isArray(xeResponse.DT) ? xeResponse.DT : []);
        setTaiXeList(taiXeChinh);
        setTaiXePhuList(taiXePhu);
        setListBenXe(Array.isArray(benXeResponse.DT) ? benXeResponse.DT : []);
      } catch (error) {
        showError('Lỗi khi tải dữ liệu: ' + error.message);
      }
    };

    if (visible) {
      fetchData();
    }
  }, [visible, formData?.id_ben_xe_gui]);

  const xeOptions = xeList.map((xe) => ({ label: `${xe.bien_so} (${xe.loai_xe})`, value: xe.id_xe }));
  const taiXeOptions = taiXeList.map((taiXe) => ({
    label: `${taiXe.ho_ten} (${taiXe.bang_lai})`,
    value: taiXe.tai_xe_id
  }));
  const taiXePhuOptions = taiXePhuList.map((taiXe) => ({
    label: `${taiXe.ho_ten} (${taiXe.bang_lai})`,
    value: taiXe.tai_xe_id
  }));
  const benXeOptions = listBenXe.map((benXe) => ({ label: benXe.ten_ben_xe, value: benXe.id }));

  const validateTimes = () => {
    // Chỉ validate thời gian khi tạo mới (isNew === true)
    if (isNew) {
      const now = new Date();
      const xuatBen = formData.thoi_gian_xuat_ben ? new Date(formData.thoi_gian_xuat_ben) : null;
      const capBen = formData.thoi_gian_cap_ben ? new Date(formData.thoi_gian_cap_ben) : null;

      if (!xuatBen) {
        showError('Vui lòng chọn thời gian xuất bến!');
        return false;
      }

      if (xuatBen < now) {
        showError('Thời gian xuất bến không được nằm trong quá khứ!');
        return false;
      }

      if (capBen && capBen < xuatBen) {
        showError('Thời gian cập bến phải sau hoặc cùng thời gian xuất bến!');
        return false;
      }
    }

    // Nếu là cập nhật (isNew === false), không cần validate, luôn trả về true
    return true;
  };

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header={isNew ? 'Thêm Chuyến Xe' : 'Chỉnh Sửa Chuyến Xe'} modal className="p-fluid" footer={dialogFooter} onHide={onHide}>
      <Toast ref={toast} />
      <div className="p-field mt-2">
        <label htmlFor="id_ben_xe_gui">Bến Xe Gửi</label>
        <Dropdown id="id_ben_xe_gui" value={formData.id_ben_xe_gui} options={benXeOptions} onChange={(e) => onInputChange(e, 'id_ben_xe_gui')} placeholder="Chọn bến xe gửi" filter filterBy="label" style={{ marginTop: '3px' }}/>
        {errors.id_ben_xe_gui && <small className="p-error">{errors.id_ben_xe_gui}</small>}
      </div>
      <div className="p-field mt-2">
        <label htmlFor="id_ben_xe_nhan">Bến Xe Nhận</label>
        <Dropdown id="id_ben_xe_nhan" value={formData.id_ben_xe_nhan} options={benXeOptions} onChange={(e) => onInputChange(e, 'id_ben_xe_nhan')} placeholder="Chọn bến xe nhận" filter filterBy="label" style={{ marginTop: '3px' }}/>
        {errors.id_ben_xe_nhan && <small className="p-error">{errors.id_ben_xe_nhan}</small>}
      </div>
      <div className="p-field mt-2">
        <label htmlFor="xe_id">Xe</label>
        <Dropdown id="xe_id" value={formData?.xe_id} options={xeOptions} onChange={(e) => onInputChange(e, 'xe_id')} placeholder="Chọn xe" filter filterBy="label" style={{ marginTop: '3px' }}/>
        {errors.xe_id && <small className="p-error">{errors.xe_id}</small>}
      </div>

      <div className="p-field mt-2">
        <label htmlFor="tai_xe_id">Tài Xế</label>
        <Dropdown id="tai_xe_id" value={formData?.tai_xe_id} options={taiXeOptions} onChange={(e) => onInputChange(e, 'tai_xe_id')} placeholder="Chọn tài xế" filter filterBy="label" style={{ marginTop: '3px' }}/>
        {errors.tai_xe_id && <small className="p-error">{errors.tai_xe_id}</small>}
      </div>

      <div className="p-field mt-2">
        <label htmlFor="tai_xe_phu_id">Tài Xế Phụ</label>
        <Dropdown
          id="tai_xe_phu_id"
          value={formData?.tai_xe_phu_id || null}
          options={taiXePhuOptions}
          onChange={(e) => onInputChange(e, 'tai_xe_phu_id')}
          placeholder="Chọn tài xế phụ (nếu có)"
          filter
          filterBy="label"
          style={{ marginTop: '3px' }}
          showClear
        />
      </div>

      <div className="p-field mt-2">
        <label htmlFor="thoi_gian_xuat_ben">Thời Gian Xuất Bến</label>
        <Calendar
          id="thoi_gian_xuat_ben"
          value={formData.thoi_gian_xuat_ben ? new Date(formData.thoi_gian_xuat_ben) : null}
          onChange={(e) => onInputChange({ target: { value: e.value } }, 'thoi_gian_xuat_ben')}
          showTime
          hourFormat="24"
          dateFormat="yy-mm-dd"
          minDate={new Date()}
          style={{ marginTop: '3px' }}
          placeholder="Chọn thời gian xuất bến"
        />
        {errors.thoi_gian_xuat_ben && <small className="p-error">{errors.thoi_gian_xuat_ben}</small>}
      </div>

      <div className="p-field mt-2">
        <label htmlFor="trang_thai">Trạng Thái</label>
        <Dropdown
          id="trang_thai"
          value={formData?.trang_thai}
          options={filteredTrangThaiOptions} // Sử dụng filteredTrangThaiOptions thay vì trangThaiOptions
          onChange={(e) => onInputChange(e, 'trang_thai')}
          placeholder="Chọn trạng thái"
          style={{ marginTop: '3px' }}
          disabled={formData?.trang_thai === 'da_cap_ben'} // Vô hiệu hóa nếu đã là "Đã cập bến"
        />
        {errors.trang_thai && <small className="p-error">{errors.trang_thai}</small>}
      </div>
    </Dialog>
  );
};

export default ChuyenXeDialog;
