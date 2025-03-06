'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import OrderService from '../../../services/donHangSevices'; // Cập nhật tên service
import OrderDialog from '../../../modal/DonHangDialog';
import spServices from '@/app/share/share-services/sp-services';

const DanhSachDonHang = () => {
  const [orders, setOrders] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    ma_van_don: '',
    ma_qr_code: '',
    nguoi_gui_id: '',
    id_ben_xe_nhan: '',
    id_ben_xe_gui: '',
    loai_hang_hoa: '',
    trong_luong: '',
    kich_thuoc: '',
    so_kien: '',
    gia_tri_hang: '',
    cuoc_phi: '',
    phi_bao_hiem: '',
    phu_phi: '',
    trang_thai: '',
    ten_nguoi_nhan: '',
    so_dien_thoai_nhan: '',
    email_nhan: ''
  });

  const toast = useRef(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await OrderService.getAllOrders();
      const output = spServices.formatData(response?.DT);
      setOrders(Array.isArray(output) ? output : []);
    } catch (error) {
      showError('Lỗi khi tải danh sách đơn hàng');
    }
  };

  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
  };

  const showSuccess = (message) => {
    toast.current.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
  };

  const openNew = () => {
    setFormData({
      ma_van_don: '',
      ma_qr_code: '',
      nguoi_gui_id: '',
      id_ben_xe_nhan: '',
      id_ben_xe_gui: '',
      loai_hang_hoa: '',
      trong_luong: '',
      kich_thuoc: '',
      so_kien: '',
      gia_tri_hang: '',
      cuoc_phi: '',
      phi_bao_hiem: '',
      phu_phi: '',
      trang_thai: '',
      ten_nguoi_nhan: '',
      so_dien_thoai_nhan: '',
      email_nhan: ''
    });
    setIsNew(true);
    setDisplayDialog(true);
  };

  const editOrder = (order) => {
    setFormData({ ...order });
    setIsNew(false);
    setDisplayDialog(true);
  };

  const deleteOrder = async (id) => {
    try {
      await OrderService.deleteOrder(id);
      fetchOrders();
      showSuccess('Xóa đơn hàng thành công');
    } catch (error) {
      showError('Lỗi khi xóa đơn hàng');
    }
  };

  const saveOrder = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
    try {
      if (isNew) {
        await OrderService.createOrder(filteredData);
      } else {
        await OrderService.updateOrder(filteredData.id, filteredData);
      }
      fetchOrders();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm đơn hàng thành công' : 'Cập nhật đơn hàng thành công');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm đơn hàng' : 'Lỗi khi cập nhật đơn hàng');
    }
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
          <h1>Danh Sách Đơn Hàng</h1>
          <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} style={{ marginBottom: '10px' }} />
          <DataTable value={orders} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
            <Column field="ma_van_don" header="Mã Vận Đơn" />
            <Column field="ten_nguoi_nhan" header="Tên Người Nhận" />
            <Column field="so_dien_thoai_nhan" header="Số Điện Thoại Nhận" />
            <Column field="labelLoaiHangHoa" header="Loại Hàng Hóa" />
            <Column field="labelTrangThaiDonHang" header="Trạng Thái" />
            <Column
              body={(rowData) => (
                <>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editOrder(rowData)} />
                  <Button icon="pi pi-trash" style={{ marginLeft: '5px' }} className="p-button-rounded p-button-warning" onClick={() => deleteOrder(rowData.id)} />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <OrderDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isNew={isNew} formData={formData} onInputChange={onInputChange} onSave={saveOrder} />
    </div>
  );
};

export default DanhSachDonHang;
