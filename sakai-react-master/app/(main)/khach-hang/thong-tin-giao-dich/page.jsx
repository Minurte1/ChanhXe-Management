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
import { InputText } from 'primereact/inputtext';
import moment from 'moment';
import { QRCodeCanvas } from 'qrcode.react';

const ThongTinGiaoDich = () => {
  const [orders, setOrders] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [searchFilters, setSearchFilters] = useState(1);
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
  const { userInfo } = ReduxExportServices();

  const fetchOrders = async () => {
    try {
      let filter = {};

      filter.nguoi_gui_id = userInfo.id;

      if (trangThaiFilter) filter.trang_thai = trangThaiFilter;
      if (loaiHangHoaFilter) filter.loai_hang_hoa = loaiHangHoaFilter;
      if (globalFilter.trim()) filter.ma_van_don = globalFilter.trim(); // Chỉ thêm nếu có giá trị

      console.log('filter', filter);

      const response = await orderService.getAllOrders(filter);
      const data = response?.DT;

      if (!data) {
        setOrders([]);
        return;
      }

      const output = spServices.formatData(response?.DT);
      setOrders(Array.isArray(output) ? output : []);
    } catch (error) {
      showError('Lỗi khi tải danh sách đơn hàng');
    }
  };

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

  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
  };

  const showSuccess = (message) => {
    toast.current.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
  };

  const formatDate = (value) => {
    return moment(value).isValid() ? moment(value).format('HH:mm:ss DD/MM/YYYY') : value;
  };

  const [xemOrderDialog, setXemOrderDialog] = useState(false);

  const xemOrder = (order) => {
    const { id_ben_xe_gui, id_ben_xe_nhan, id_nguoi_cap_nhat, khach_hang_id, khach_hang_id_nguoi_cap_nhat, nguoi_gui_id, labelTrangThai, ...filteredData } = order || {};
    setFormData(filteredData);
    setIsNew(false);
    setXemOrderDialog(true);
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

        <Dropdown value={trangThaiFilter} options={trangThaiOptions} onChange={(e) => setTrangThaiFilter(e.value)} placeholder="Lọc trạng thái" showClear style={{ width: '200px', marginRight: '10px' }} />

        <Dropdown value={loaiHangHoaFilter} options={loaiHangHoaOptions} onChange={(e) => setLoaiHangHoaFilter(e.value)} placeholder="Lọc loại hàng hóa" showClear style={{ width: '200px' }} />
      </div>
    </div>
  );

  useEffect(() => {
    fetchOrders();
  }, [trangThaiFilter, loaiHangHoaFilter]);


  return (
    <div className="p-grid">
      <Toast ref={toast} />
      <div className="p-col-12">
        <div className="card">
          <h1>Danh Sách Đơn Hàng {userInfo?.ten_ben_xe ? `Tại ${userInfo.ten_ben_xe}` : ''} </h1>
          <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }}>
          </div>
          {/* <div>
            <QRCodeCanvas
              value={'https://viblo.asia/u/tranchien'} // Use the QR code value from the row data
              size={50} // Size of the QR code
              level="H" // Error correction level
            />
          </div> */}

          <DataTable
            value={orders}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} đơn hàng"
            header={header}
          >
            <Column field="ma_van_don" header="Mã Vận Đơn" />
            <Column
              field="ma_qr_code"
              header="Mã QR"
              body={(rowData) => (
                <QRCodeCanvas
                  value={rowData.ma_qr_code || 'N/A'} // Use the QR code value from the row data
                  size={50} // Size of the QR code
                  level="H" // Error correction level
                />
              )}
            />
            <Column field="khach_hang_ho_ten" header="Người gửi" />
            <Column field="ten_nguoi_nhan" header="Người Nhận" />
            <Column field="so_dien_thoai_nhan" header="Số Điện Thoại Người Nhận" />
            <Column field="ngay_tao" header="Ngày tạo" sortable body={(rowData) => formatDate(rowData.ngay_tao)} />
            <Column field="labelLoaiHangHoa" header="Loại Hàng Hóa" sortable body={(rowData) => <StatusLabel status={rowData.labelLoaiHangHoa} />} />
            <Column field="labelTrangThaiDonHang" header="Trạng Thái" sortable body={(rowData) => <StatusLabel status={rowData.labelTrangThaiDonHang} />} />
            <Column body={(rowData) => <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => xemOrder(rowData)} />} />
          </DataTable>

          <TraCuuOrderDialog confirmOrder={true} visible={xemOrderDialog} onHide={() => setXemOrderDialog(false)} formData={formData} isKhachHang={true} />
        </div>
      </div>
    </div>
  );
};

export default ThongTinGiaoDich;