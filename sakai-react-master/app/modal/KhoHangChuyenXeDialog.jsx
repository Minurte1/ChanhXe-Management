import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useAxios } from '../authentication/useAxiosClient';
import spServices from '../share/share-services/sp-services';
import chuyenXeService from '../services/chuyenXeServices';

const KhoHangChuyenXeModal = ({ chuyenXeId, visible, onHide }) => {
  const [donHangList, setDonHangList] = useState([]);
  const [filteredDonHangList, setFilteredDonHangList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState(null);
  const [selectedLoaiHang, setSelectedLoaiHang] = useState(null);
  const axiosInstance = useAxios();
  const ChuyenXeService = chuyenXeService(axiosInstance);

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
    if (visible && chuyenXeId) {
      fetchDonHang(chuyenXeId);
    }
  }, [visible, chuyenXeId]);

  useEffect(() => {
    let filtered = donHangList;
    if (searchTerm) {
      filtered = filtered.filter((item) => item.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedTrangThai) {
      filtered = filtered.filter((item) => item.trang_thai === selectedTrangThai);
    }
    if (selectedLoaiHang) {
      filtered = filtered.filter((item) => item.loai_hang_hoa === selectedLoaiHang);
    }
    setFilteredDonHangList(filtered);
  }, [searchTerm, selectedTrangThai, selectedLoaiHang, donHangList]);

  const fetchDonHang = async (chuyenXeId) => {
    try {
      const response = await ChuyenXeService.getTripAndOrders(chuyenXeId);
      const output = spServices.formatData(response?.data);
      setDonHangList(Array.isArray(output) ? output : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng', error);
    }
  };

  return (
    <Dialog header="Danh Sách Đơn Hàng" visible={visible} style={{ width: '90vw' }} onHide={onHide}>
      <div className="p-grid p-justify-between p-mb-3" style={{ display: 'flex' }}>
        <div className="p-col-4">
          <InputText placeholder="Tìm kiếm theo tên người gửi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="p-col-4" style={{ marginLeft: '8px' }}>
          <Dropdown value={selectedTrangThai} options={trangThaiOptions} onChange={(e) => setSelectedTrangThai(e.value)} placeholder="Chọn Trạng Thái" showClear />
        </div>
        <div className="p-col-4" style={{ marginLeft: '8px' }}>
          <Dropdown value={selectedLoaiHang} options={loaiHangHoaOptions} onChange={(e) => setSelectedLoaiHang(e.value)} placeholder="Chọn Loại Hàng" showClear />
        </div>
      </div>

      <DataTable value={filteredDonHangList} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
        <Column field="ma_van_don" header="Mã Vận Đơn" sortable />
        <Column field="ho_ten" header="Người Gửi" sortable />
        <Column field="ten_nguoi_nhan" header="Người Nhận" sortable />
        <Column field="labelLoaiHangHoa" header="Loại Hàng Hóa" sortable />
        <Column field="trong_luong" header="Trọng Lượng (kg)" sortable />
        <Column
          field="labelTrangThaiDonHang"
          header="Trạng Thái"
          sortable
          body={(rowData) => {
            const { text, background } = spServices.getColorTrangThai(rowData.labelTrangThaiDonHang);
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
                {rowData.labelTrangThaiDonHang}
              </span>
            );
          }}
        />{' '}
        <Column field="ngay_tao" header="Ngày Tạo" sortable body={(rowData) => new Date(rowData.ngay_tao).toLocaleString('vi-VN')} />
      </DataTable>
    </Dialog>
  );
};

export default KhoHangChuyenXeModal;
