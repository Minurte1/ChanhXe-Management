'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import OrderService from '../../../services/donHangSevices'; // Cập nhật tên service
import OrderDialog from '../../../modal/DonHangDialog';
import spServices from '@/app/share/share-services/sp-services';
import { useAxios } from '@/app/authentication/useAxiosClient';
import { ReduxExportServices } from '@/app/redux/redux-services/services-redux-export';
import TraCuuOrderDialog from '../../../modal/TraCuuFullDonHang';
const DanhSachDonHang = () => {
  const [orders, setOrders] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [searchFilters, setSearchFilters] = useState(1);

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
  const axiosInstance = useAxios();
  const orderService = OrderService(axiosInstance);
  const { userInfo } = ReduxExportServices();
  useEffect(() => {
    fetchOrders();
  }, [searchFilters]);

  const fetchOrders = async () => {
    try {
      let filter = {};

      if (searchFilters === 1 && filter !== 'admin') {
        filter.id_ben_xe_gui = userInfo.id_ben;
      } else if (searchFilters === 2 && filter !== 'admin') {
        filter.id_ben_xe_nhan = userInfo.id_ben;
        filter.trang_thai = ['da_cap_ben', 'giao_thanh_cong'];
      }
      console.log('filter', filter);
      const response = await orderService.getAllOrders(filter);
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
      await orderService.deleteOrder(id);
      fetchOrders();
      showSuccess('Xóa đơn hàng thành công');
    } catch (error) {
      showError('Lỗi khi xóa đơn hàng');
    }
  };

  const saveOrder = async (key) => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
    try {
      if (isNew) {
        filteredData.trang_thai = 'cho_xu_ly';
        await orderService.createOrder(filteredData);
      } else {
        if (key === 'success') {
          filteredData.trang_thai = 'giao_thanh_cong';
        }

        await orderService.updateOrder(filteredData.id, filteredData);
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

  const SaveWithCustomer = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
    try {
      if (isNew) {
        await orderService.createOrderAndCustomer(filteredData);
      } else {
        console.log('Chỉ tạo mới đơn hàng và khách hàng');
      }
      fetchOrders();
      setDisplayDialog(false);
      showSuccess(isNew ? 'Thêm đơn hàng và khách hàng thành công' : '');
    } catch (error) {
      showError(isNew ? 'Lỗi khi thêm đơn hàng và khách hàng ' + error : '');
    }
  };
  const StatusLabel = React.memo(
    ({ status }) => {
      const styles = React.useMemo(() => {
        const { text, background } = spServices.getColorTrangThai(status);
        return {
          color: text,
          backgroundColor: background,
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block',
          fontWeight: 'bold'
        };
      }, [status]);

      return <span style={styles}>{status}</span>;
    },
    (prevProps, nextProps) => prevProps.status === nextProps.status
  );
  StatusLabel.displayName = 'StatusLabel';

  const benXeOptions = [
    { label: 'Đơn sắp gửi', value: 1 },
    { label: 'Đơn đã nhận', value: 2 }
  ];
  const [xemOrderDialog, setXemOrderDialog] = useState(false);
  const xemOrder = (order) => {
    const { id_ben_xe_gui, id_ben_xe_nhan, id_nguoi_cap_nhat, khach_hang_id, khach_hang_id_nguoi_cap_nhat, nguoi_gui_id, labelTrangThai, ...filteredData } = order || {};
    setFormData(filteredData);
    setIsNew(false);
    setXemOrderDialog(true);
  };

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Đơn Hàng {userInfo?.ten_ben_xe ? `Tại ${userInfo.ten_ben_xe}` : ''} </h1>
          <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }}>
            <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success" onClick={openNew} />

            <label style={{ marginLeft: '10px', marginRight: '10px' }}>Chọn Bến Xe Gửi:</label>
            <Dropdown name="id_ben_xe_gui" value={searchFilters} options={benXeOptions} onChange={(e) => setSearchFilters(e.target.value)} placeholder="Chọn Bến Xe" style={{ width: '200px' }} />
          </div>

          <DataTable
            value={orders}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} đơn hàng"
          >
            <Column field="ma_van_don" header="Mã Vận Đơn" />
            <Column field="ten_nguoi_nhan" header="Tên Người Nhận" />
            <Column field="so_dien_thoai_nhan" header="Số Điện Thoại Nhận" />
            <Column field="labelLoaiHangHoa" header="Loại Hàng Hóa" sortable body={(rowData) => <StatusLabel status={rowData.labelLoaiHangHoa} />} />
            <Column field="labelTrangThaiDonHang" header="Trạng Thái" sortable body={(rowData) => <StatusLabel status={rowData.labelTrangThaiDonHang} />} />
            <Column
              body={(rowData) => (
                <>
                  {rowData.trang_thai === 'cho_xu_ly' && (
                    <>
                      {' '}
                      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editOrder(rowData)} />
                      <Button icon="pi pi-trash" style={{ marginLeft: '5px' }} className="p-button-rounded p-button-warning" onClick={() => deleteOrder(rowData.id)} />
                    </>
                  )}
                  {(rowData.trang_thai === 'da_cap_ben' || rowData.trang_thai === 'giao_thanh_cong') && <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => xemOrder(rowData)} />}
                </>
              )}
            />{' '}
          </DataTable>
        </div>
      </div>
      <TraCuuOrderDialog confirmOrder={true} visible={xemOrderDialog} onHide={() => setXemOrderDialog(false)} formData={formData} onInputChange={onInputChange} onSave={saveOrder} isNew={isNew} saveWithCustomer={SaveWithCustomer} />

      <OrderDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} isNew={isNew} formData={formData} onInputChange={onInputChange} onSave={saveOrder} onSave2={SaveWithCustomer} />
    </div>
  );
};

export default DanhSachDonHang;
