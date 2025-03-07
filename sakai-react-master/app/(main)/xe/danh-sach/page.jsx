'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import VehicleService from '../../../services/xeSerivces';
import XeDialog from '../../../modal/XeDialog';
import PhanCongDialog from '../../../modal/PhanCongXeDialog';
import VehicleAssignmentService from '../../../services/phanCongXeServices';
import spServices from '@/app/share/share-services/sp-services';
import { useAxios } from '@/app/authentication/useAxiosClient';

const DanhSachXe = () => {
  const [xeList, setXeList] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayAssignDialog, setDisplayAssignDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    ten_xe: '',
    bien_so: '',
    suc_chua: '',
    loai_xe: '',
    trang_thai: ''
  });
  const [assignData, setAssignData] = useState({
    id_ben: '',
    id_xe: ''
  });
  //
  const axiosInstance = useAxios();
  const vehicleService = VehicleService(axiosInstance);
  const vehicleAssignmentService = VehicleAssignmentService(axiosInstance);
  const toast = useRef(null);

  useEffect(() => {
    fetchXe();
  }, []);

  const fetchXe = async () => {
    try {
      const response = await vehicleService.getAllVehicles();
      const output = spServices.formatData(response?.DT);
      setXeList(output);
    } catch (error) {
      showError('Lỗi khi tải danh sách xe');
    }
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 3000
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Lỗi',
      detail: message,
      life: 3000
    });
  };

  const openNew = () => {
    setFormData({
      ten_xe: '',
      bien_so: '',
      suc_chua: '',
      loai_xe: '',
      trang_thai: ''
    });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const openPhanCongForm = () => {
    setAssignData({
      id_ben: '',
      id_xe: ''
    });
    setIsNew(true);
    setDisplayAssignDialog(true);
  };

  const editXe = (xe) => {
    setFormData({ ...xe });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const confirmDeleteXe = (id) => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xe này tạm ngưng hoạt động?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => deleteXe(id)
    });
  };

  const deleteXe = async (id) => {
    try {
      await vehicleService.deleteVehicle(id);
      fetchXe();
      showSuccess('Xóa xe thành công');
    } catch (error) {
      showError('Lỗi khi xóa xe');
    }
  };

  const saveXe = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, labelTrangThai, ...filteredData } = formData;
    try {
      if (isNew) {
        await vehicleService.createVehicle(formData);
      } else {
        await vehicleService.updateVehicle(filteredData.id, filteredData);
      }
      fetchXe();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm xe thành công' : 'Cập nhật xe thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm xe' : 'Lỗi khi cập nhật xe');
    }
  };

  const savePhanCong = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = assignData;
    try {
      if (isNew) {
        await vehicleAssignmentService.createVehicleAssignment(assignData);
      } else {
        await vehicleAssignmentService.createVehicleAssignment(filteredData.id, filteredData);
      }
      fetchXe();
      setDisplayAssignDialog(false);
      showSuccess(isNew ? 'Thêm phân công xe thành công' : 'Cập nhật phân công xe thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm phân công  xe' : 'Lỗi khi cập nhật phân công  xe');
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    setFormData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };

  const onAssignInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    setAssignData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <ConfirmDialog /> {/* Thêm component này */}
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Xe</h1>
          <div style={{ marginBottom: '10px' }}>
            <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginRight: '10px' }} />
            <Button label="Phân công địa điểm" icon="pi pi-file" className="p-button-info" onClick={openPhanCongForm} />
          </div>
          <DataTable value={xeList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="bien_so" header="Biển Số"></Column>
            <Column field="ten_ben_xe" header="Địa điểm công tác" sortable body={(rowData) => rowData.ten_ben_xe || '(Chưa được phân công)'} />
            <Column field="suc_chua" header="Sức chứa"></Column>
            <Column field="loai_xe" header="Loại Xe"></Column>
            <Column
              field="labelTrangThai"
              header="Trạng Thái"
              sortable
              body={(rowData) => {
                const { text, background } = spServices.getColorTrangThai(rowData.labelTrangThai);
                return (
                  <span
                    style={{
                      color: text,
                      backgroundColor: background,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      fontWeight: 'bold'
                    }}
                  >
                    {rowData.labelTrangThai}
                  </span>
                );
              }}
            />
            <Column
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editXe(rowData)} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteXe(rowData.id)} />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>
      <XeDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isNew={isNew} formData={formData} onInputChange={onInputChange} onSave={saveXe} />
      <PhanCongDialog visible={displayAssignDialog} onHide={() => setDisplayAssignDialog(false)} formData={assignData} onInputChange={onAssignInputChange} onSave={savePhanCong} />
    </div>
  );
};

export default DanhSachXe;
