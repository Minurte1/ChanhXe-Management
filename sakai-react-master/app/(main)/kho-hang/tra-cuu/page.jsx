'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import OrderService from '../../../services/donHangSevices';
import TraCuuOrderDialog from '../../../modal/TraCuuFullDonHang';
import { useAxios } from '../../../authentication/useAxiosClient';
import spServices from '../../../share/share-services/sp-services';

const DanhSachDonHangTrongKho = () => {
  const [orders, setOrders] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(''); // Search mã vận đơn
  const [trangThaiFilter, setTrangThaiFilter] = useState(null); // Filter trạng thái
  const [loaiHangHoaFilter, setLoaiHangHoaFilter] = useState(null); // Filter loại hàng hóa
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

  const trangThaiOptions = [
    { label: 'Chờ xử lý', value: 'cho_xu_ly' },
    { label: 'Đang vận chuyển', value: 'dang_van_chuyen' },
    { label: 'Giao thành công', value: 'giao_thanh_cong' },
    { label: 'Giao thất bại', value: 'giao_that_bai' },
    { label: 'Đã cập bến', value: 'da_cap_ben' }
  ];

  const loaiHangHoaOptions = [
    { label: 'Hàng dễ vỡ', value: 'hang_de_vo' },
    { label: 'Hàng khô', value: 'hang_kho' },
    { label: 'Hàng đông lạnh', value: 'hang_dong_lanh' },
    { label: 'Hàng nguy hiểm', value: 'hang_nguy_hiem' },
    { label: 'Hàng thông thường', value: 'hang_thong_thuong' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [trangThaiFilter, loaiHangHoaFilter, globalFilter]); // Thêm globalFilter vào dependency

  const fetchOrders = async () => {
    try {
      const filters = {};
      if (trangThaiFilter) filters.trang_thai = trangThaiFilter;
      if (loaiHangHoaFilter) filters.loai_hang_hoa = loaiHangHoaFilter;
      if (globalFilter.trim()) filters.ma_van_don = globalFilter.trim(); // Chỉ thêm nếu có giá trị
      filters.trang_thai = 'da_cap_ben';
      const response = await orderService.getAllOrders(filters);
      const data = response?.DT;

      if (!data) {
        setOrders([]);
        return;
      }

      const output = spServices.formatData(data);
      setOrders(Array.isArray(output) ? output : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Lỗi khi tải danh sách đơn hàng');
      setOrders([]);
    }
  };

  const showError = (message) => {
    toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
  };

  const showSuccess = (message) => {
    toast.current?.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
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

  const xemOrder = (order) => {
    const { id, id_ben_xe_gui, id_ben_xe_nhan, id_nguoi_cap_nhat, khach_hang_id, khach_hang_id_nguoi_cap_nhat, nguoi_gui_id, labelTrangThai, trang_thai, ...filteredData } = order || {};
    setFormData(filteredData);
    setIsNew(false);
    setDisplayDialog(true);
  };

  const saveOrder = async () => {
    const { ngay_tao, ngay_cap_nhat, id_nguoi_cap_nhat, ...filteredData } = formData;
    try {
      if (isNew) {
        await orderService.createOrder(filteredData);
      } else {
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
      }
      fetchOrders();
      setDisplayDialog(false);
      showSuccess('Thêm đơn hàng và khách hàng thành công');
    } catch (error) {
      showError('Lỗi khi thêm đơn hàng và khách hàng');
    }
  };

  const StatusLabel = React.memo(
    ({ status }) => {
      const styles = React.useMemo(() => {
        const { text, background } = spServices.getColorTrangThai(status || '');
        return {
          color: text,
          backgroundColor: background,
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block',
          fontWeight: 'bold'
        };
      }, [status]);
      return <span style={styles}>{status || ''}</span>;
    },
    (prevProps, nextProps) => prevProps.status === nextProps.status
  );

  const header = (
    <div className="p-d-flex p-ai-center p-jc-between">
      <div className="p-d-flex p-ai-center">
        <span className="p-input-icon-left" style={{ marginRight: '10px' }}>
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)} // Cập nhật giá trị search
            placeholder="Tìm theo mã vận đơn"
            className="p-inputtext-sm" // Thu nhỏ input nếu cần
            tooltip="Nhấn Enter để tìm hoặc xóa để hiển thị tất cả"
            onKeyPress={(e) => {
              if (e.key === 'Enter') fetchOrders(); // Tìm khi nhấn Enter
            }}
          />
          {/* Nút xóa search */}
          {globalFilter && (
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-sm p-ml-2"
              onClick={() => {
                setGlobalFilter(''); // Xóa search
                fetchOrders(); // Fetch lại toàn bộ dữ liệu
              }}
            />
          )}
        </span>

        {/* <Dropdown value={trangThaiFilter} options={trangThaiOptions} onChange={(e) => setTrangThaiFilter(e.value)} placeholder="Lọc trạng thái" showClear style={{ width: '200px', marginRight: '10px' }} /> */}

        <Dropdown value={loaiHangHoaFilter} options={loaiHangHoaOptions} onChange={(e) => setLoaiHangHoaFilter(e.value)} placeholder="Lọc loại hàng hóa" showClear style={{ width: '200px' }} />
      </div>
    </div>
  );

  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h3>Danh Sách Đơn Hàng Trong Kho</h3>
          <DataTable value={orders || []} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} header={header}>
            <Column field="ma_van_don" header="Mã Vận Đơn" />
            <Column field="ten_nguoi_nhan" header="Tên Người Nhận" />
            <Column field="so_dien_thoai_nhan" header="Số Điện Thoại Nhận" />
            <Column field="labelLoaiHangHoa" header="Loại Hàng Hóa" sortable body={(rowData) => <StatusLabel status={rowData?.labelLoaiHangHoa} />} />
            <Column field="labelTrangThaiDonHang" header="Trạng Thái" sortable body={(rowData) => <StatusLabel status={rowData?.labelTrangThaiDonHang} />} />
            <Column body={(rowData) => <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => xemOrder(rowData)} />} />
          </DataTable>
        </div>
      </div>
      <TraCuuOrderDialog visible={displayDialog} onHide={() => setDisplayDialog(false)} formData={formData} onInputChange={onInputChange} onSave={saveOrder} isNew={isNew} saveWithCustomer={SaveWithCustomer} />
    </div>
  );
};

export default DanhSachDonHangTrongKho;
