'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import BenXeDialog from '../../../modal/BenXeDialog';
import BenXeService from '../../../services/benXeServices';
const DanhSachBenXe = () => {
  const [benXe, setBenXe] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    dia_chi: '',
    ten_ben_xe: '',
    tinh: '',
    huyen: '',
    xa: '',
    duong: ''
  });

  const toast = useRef(null);

  useEffect(() => {
    fetchBenXe();
  }, []);

  const fetchBenXe = async () => {
    try {
      const response = await BenXeService.getAllBenXe();
      setBenXe(response.DT);
    } catch (error) {
      showError('Lỗi khi tải danh sách bến xe');
    }
  };

  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
  };

  const showSuccess = (message) => {
    toast.current.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
  };

  const openNew = () => {
    setFormData({ dia_chi: '', ten_ben_xe: '', tinh: '', huyen: '', xa: '', duong: '' });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const editBenXe = (benXe) => {
    setFormData({ ...benXe });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const deleteBenXeHandler = async (id) => {
    try {
      await BenXeService.deleteBenXe(id);
      fetchBenXe();
      showSuccess('Xóa bến xe thành công');
    } catch (error) {
      showError('Lỗi khi xóa bến xe');
    }
  };

  // Điều chỉnh onInputChange để luôn cập nhật toàn bộ formData
  const onInputChange = (data) => {
    if (typeof data === 'object' && !data.target) {
      setFormData((prevData) => ({ ...prevData, ...data }));
    } else {
      const val = (data.target && data.target.value) || '';
      const name = data.target.name || data.target.id;
      setFormData((prevData) => ({ ...prevData, [name]: val }));
    }
  };
  const saveBenXe = async (dataToSave) => {
    try {
      if (isNew) {
        await BenXeService.createBenXe(dataToSave);
      } else {
        console.log('formData', formData);
        await BenXeService.updateBenXe(formData.id, dataToSave);
      }
      fetchBenXe();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm bến xe thành công' : 'Cập nhật bến xe thành công');
    } catch (error) {
      console.log('error', error);
      showError(isNew ? 'Lỗi khi thêm bến xe' : 'Lỗi khi cập nhật bến xe');
    }
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Bến Xe</h1>
          <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginBottom: '10px' }} />
          <DataTable value={benXe} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="ten_ben_xe" header="Tên Bến Xe"></Column>
            <Column field="dia_chi" header="Địa Chỉ"></Column>
            <Column field="tinh" header="Tỉnh"></Column>
            <Column field="huyen" header="Huyện"></Column>
            <Column field="xa" header="Xã"></Column>
            <Column
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editBenXe(rowData)} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" style={{ marginLeft: '8px' }} onClick={() => deleteBenXeHandler(rowData.id)} />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <BenXeDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isEditing={!isNew} formData={formData} onInputChange={onInputChange} onSave={saveBenXe} />
    </div>
  );
};

export default DanhSachBenXe;
