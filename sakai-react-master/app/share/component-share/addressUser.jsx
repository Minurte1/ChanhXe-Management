import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;
const AddressSelector = ({ selectedProvince, selectedDistrict, selectedWards, setSelectedProvince, setSelectedDistrict, setSelectedWards }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await axios.get(`${API_URL}/provinces`);
        setProvinces(response.data.data || []);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        try {
          const response = await axios.get(`${API_URL}/districts/${selectedProvince.code}`);
          setDistricts(response.data.data || []);
        } catch (error) {
          console.error('Error fetching districts:', error);
        } finally {
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        setLoadingWards(true);
        try {
          const response = await axios.get(`${API_URL}/wards/${selectedDistrict.code}`);
          setWards(response.data.data || []);
        } catch (error) {
          console.error('Error fetching wards:', error);
        } finally {
          setLoadingWards(false);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  return (
    <div className="p-fluid">
      <div className="field">
        <label>Chọn tỉnh</label>
        {loadingProvinces ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : null}
        <Dropdown
          value={selectedProvince}
          options={provinces}
          onChange={(e) => {
            setSelectedProvince(e.value);
            setSelectedDistrict(null);
            setSelectedWards(null);
          }}
          optionLabel="full_name"
          placeholder="Chọn tỉnh"
          disabled={loadingProvinces}
          filter // Thêm filter để bật tính năng search
          filterPlaceholder="Tìm kiếm tỉnh"
        />
      </div>

      <div className="field">
        <label>Chọn huyện</label>
        {loadingDistricts ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : null}
        <Dropdown
          value={selectedDistrict}
          options={districts}
          onChange={(e) => {
            setSelectedDistrict(e.value);
            setSelectedWards(null);
          }}
          optionLabel="full_name"
          placeholder="Chọn huyện"
          disabled={!selectedProvince || loadingDistricts}
          filter
          filterPlaceholder="Tìm kiếm huyện"
        />
      </div>

      <div className="field">
        <label>Chọn phường xã</label>
        {loadingWards ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : null}
        <Dropdown value={selectedWards} options={wards} onChange={(e) => setSelectedWards(e.value)} optionLabel="full_name" placeholder="Chọn phường xã" disabled={!selectedDistrict || loadingWards} filter filterPlaceholder="Tìm kiếm phường xã" />
      </div>
    </div>
  );
};

export default AddressSelector;
