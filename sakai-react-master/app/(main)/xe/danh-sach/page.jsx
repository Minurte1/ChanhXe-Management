'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import VehicleService from '../../../services/xeSerivces';
import PhanCongXeServie from '../../../services/phanCongXeSerivces';
import XeDialog from '../../../modal/XeDialog';
import PhanCongDialog from '../../../modal/PhanCongXeDialog';

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
        ben_xe: ''
    });

    const toast = useRef(null);

    useEffect(() => {
        fetchXe();
    }, []);

    const fetchXe = async () => {
        try {
            const response = await VehicleService.getAllVehicles();

            setXeList(Array.isArray(response.DT) ? response.DT : []);
        } catch (error) {
            showError('Lỗi khi tải danh sách xe');
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
            ben_xe: '',
        });
        setDisplayAssignDialog(true);
    };

    const editXe = (xe) => {
        setFormData({ ...xe });
        setIsNew(false);
        setDisplayDialog(true);
    };

    const confirmDeleteXe = (id) => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa xe này không?',
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteXe(id),
            reject: () => showError('Hủy thao tác xóa')
        });
    };

    const deleteXe = async (id) => {
        try {
            await VehicleService.deleteVehicle(id);
            fetchXe();
            showSuccess('Xóa xe thành công');
        } catch (error) {
            showError('Lỗi khi xóa xe');
        }
    };

    const saveXe = async () => {
        const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
        try {
            if (isNew) {
                await VehicleService.createVehicle(formData);
            } else {
                await VehicleService.updateVehicle(filteredData.id, filteredData);
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
        // const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
        // try {
        //     if (isNew) {
        //         await VehicleService.createVehicle(formData);
        //     } else {
        //         await VehicleService.updateVehicle(filteredData.id, filteredData);
        //     }
        //     fetchXe();
        //     setDisplayDialog(false);
        //     showSuccess(isNew ? 'Thêm xe thành công' : 'Cập nhật xe thành công');
        // } catch (error) {
        //     showError(isNew ? 'Lỗi khi thêm xe' : 'Lỗi khi cập nhật xe');
        // }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setFormData((prevData) => ({
            ...prevData,
            [name]: val
        }));
    };

    return (
        <div className="p-grid">
            <Toast ref={toast} />
            <div className="p-col-12">
                <div className="card">
                    <h1>Danh Sách Xe</h1>
                    <div style={{ marginBottom: '10px' }}>
                        <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginRight: '10px' }} />
                        <Button label="Phân công địa điểm" icon="pi pi-file" className="p-button-info" onClick={openPhanCongForm} />
                    </div>
                    <DataTable value={xeList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
                        <Column field="bien_so" header="Biển Số"></Column>
                        <Column field="suc_chua" header="Sức chứa"></Column>
                        <Column field="loai_xe" header="Loại Xe"></Column>
                        <Column field="trang_thai" header="Trạng Thái"></Column>
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
            <PhanCongDialog visible={displayAssignDialog} onHide={() => setDisplayAssignDialog(false)} formData={formData} onInputChange={onInputChange} onSave={savePhanCong} />
        </div>
    );
};

export default DanhSachXe;
