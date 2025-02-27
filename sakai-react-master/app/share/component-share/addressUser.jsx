import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';

const AddressSelector = ({ isEditing, selectedProvince, selectedDistrict, selectedWards, setSelectedProvince, setSelectedDistrict, setSelectedWards }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [isEditAddress, setIsEditAddress] = useState(isEditing);
    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const response = await axios.get('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
                setProvinces(response.data.data.data || []);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setLoadingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts when a province is selected
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                setLoadingDistricts(true);
                try {
                    const response = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince.code}&limit=-1`);
                    setDistricts(response.data.data.data || []);
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

    // Fetch wards when a district is selected
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                setLoadingWards(true);
                try {
                    const response = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict.code}&limit=-1`);
                    setWards(response.data.data.data || []);
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
            {!isEditAddress ? (
                <>
                    {/* Province Selector */}
                    <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
                        <label htmlFor="province">Chọn tỉnh</label>
                        {loadingProvinces ? (
                            <ProgressSpinner style={{ width: '40px', height: '40px', marginTop: '8px' }} strokeWidth="8" />
                        ) : (
                            <Dropdown
                                id="province"
                                value={selectedProvince}
                                options={provinces}
                                onChange={(e) => {
                                    setSelectedProvince(e.value);
                                    setSelectedDistrict(null);
                                    setSelectedWards(null);
                                }}
                                optionLabel="name_with_type"
                                placeholder="Chọn tỉnh"
                                showClear
                                className="p-inputtext-sm mt-2 h-10"
                            />
                        )}
                    </div>

                    {/* District Selector */}
                    <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
                        <label htmlFor="district">Chọn huyện</label>
                        {loadingDistricts ? (
                            <ProgressSpinner style={{ width: '40px', height: '40px', marginTop: '8px' }} strokeWidth="8" />
                        ) : (
                            <Dropdown
                                id="district"
                                value={selectedDistrict}
                                options={districts}
                                onChange={(e) => setSelectedDistrict(e.value)}
                                optionLabel="name_with_type"
                                placeholder="Chọn huyện"
                                showClear
                                className="p-inputtext-sm mt-2 h-10"
                                disabled={!selectedProvince}
                            />
                        )}
                    </div>

                    {/* Ward Selector */}
                    <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
                        <label htmlFor="ward">Chọn phường/xã</label>
                        {loadingWards ? (
                            <ProgressSpinner style={{ width: '40px', height: '40px', marginTop: '8px' }} strokeWidth="8" />
                        ) : (
                            <Dropdown
                                id="ward"
                                value={selectedWards}
                                options={wards}
                                onChange={(e) => setSelectedWards(e.value)}
                                optionLabel="name_with_type"
                                placeholder="Chọn phường/xã"
                                showClear
                                className="p-inputtext-sm mt-2 h-10"
                                disabled={!selectedDistrict}
                            />
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* Display selected values as disabled inputs */}
                    <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                            <label htmlFor="province">Tỉnh</label>
                            <Button style={{ width: '140px' }} label="Chỉnh sửa" icon="pi pi-pencil" className="p-button-sm p-button-outlined p-button-primary" onClick={() => setIsEditAddress(false)} />
                        </div>

                        <InputText id="province" value={selectedProvince?.name_with_type || 'Chưa chọn'} className="p-inputtext-sm mt-2 h-10" disabled />
                    </div>

                    <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
                        <label htmlFor="district">Huyện</label>
                        <InputText id="district" value={selectedDistrict?.name_with_type || 'Chưa chọn'} className="p-inputtext-sm mt-2 h-10" disabled />
                    </div>

                    <div className="p-field" style={{ margin: '8px 0', minHeight: '70px' }}>
                        <label htmlFor="ward">Phường/Xã</label>
                        <InputText id="ward" value={selectedWards?.name_with_type || 'Chưa chọn'} className="p-inputtext-sm mt-2 h-10" disabled />
                    </div>
                </>
            )}
        </div>
    );
};

export default AddressSelector;
