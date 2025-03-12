'use client';
import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';

import { useAxios } from '../../authentication/useAxiosClient';
import { ReduxExportServices } from '../../redux/redux-services/services-redux-export';
import UserService from '../../services/userAccountService';
import { useRouter } from 'next/navigation';

const ProfileUser = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    mat_khau_cu: '',
    mat_khau_moi: '',
    xac_nhan_mat_khau: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Toggle password fields
  const toast = useRef(null);
  const { userInfo } = ReduxExportServices();
  const axiosInstance = useAxios();
  const userService = UserService(axiosInstance);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = userInfo?.id;
        const data = await userService.getUserById(id);
        setUser(data.DT);
        setFormData({
          ho_ten: data.DT.ho_ten,
          so_dien_thoai: data.DT.so_dien_thoai,
          email: data.DT.email,
          mat_khau_cu: '',
          mat_khau_moi: '',
          xac_nhan_mat_khau: ''
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu user', error);
        toast.current.show({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu user!',
          life: 3000
        });
      }
    };

    if (userInfo) {
      fetchUser();
    } else {
      router.push('/');
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showPasswordFields && formData.mat_khau_moi !== formData.xac_nhan_mat_khau) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu mới và xác nhận mật khẩu không khớp.',
        life: 3000
      });
      return;
    }

    try {
      const response = await userService.updateUserProfile(userInfo.id, formData);
      if (response.EC === 1) {
        toast.current.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật thông tin thành công!',
          life: 3000
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Lỗi',
          detail: response.EM,
          life: 3000
        });
      }
    } catch (error) {
      console.log('error', error);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Cập nhật thông tin thất bại!',
        life: 3000
      });
    }
  };

  const header = (
    <div className="text-center">
      <i className="pi pi-user" style={{ fontSize: '2.5rem', color: '#4CAF50' }}></i>
      <h3 className="mt-2" style={{ color: '#333' }}>
        Thông tin cá nhân
      </h3>
    </div>
  );

  return (
    <div className="flex justify-content-center align-items-center min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Toast ref={toast} />
      <Card header={header} className="shadow-4 border-round-lg" style={{ width: '450px', padding: '1rem', background: '#fff' }}>
        {!user ? (
          <div className="flex flex-column gap-2">
            <Skeleton width="100%" height="2.5rem" />
            <Skeleton width="100%" height="2.5rem" />
            <Skeleton width="100%" height="2.5rem" />
            <Skeleton width="100%" height="2.5rem" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-column gap-3">
            {/* Basic Info */}
            <div className="field">
              <label htmlFor="ho_ten" className="block font-medium text-900 mb-1">
                Họ và Tên
              </label>
              <InputText id="ho_ten" name="ho_ten" value={formData.ho_ten} onChange={handleChange} className="w-full" style={{ padding: '0.75rem', borderRadius: '8px' }} />
            </div>

            <div className="field">
              <label htmlFor="so_dien_thoai" className="block font-medium text-900 mb-1">
                Số điện thoại
              </label>
              <InputText id="so_dien_thoai" name="so_dien_thoai" value={formData.so_dien_thoai} onChange={handleChange} className="w-full" style={{ padding: '0.75rem', borderRadius: '8px' }} />
            </div>

            <div className="field">
              <label htmlFor="email" className="block font-medium text-900 mb-1">
                Email
              </label>
              <InputText disabled id="email" name="email" value={formData.email} onChange={handleChange} className="w-full" style={{ padding: '0.75rem', borderRadius: '8px' }} />
            </div>

            {/* Password Toggle */}
            <div className="field flex align-items-center gap-2">
              <Checkbox inputId="changePassword" checked={showPasswordFields} onChange={(e) => setShowPasswordFields(e.checked)} />
              <label htmlFor="changePassword" className="font-medium text-900">
                Đổi mật khẩu
              </label>
            </div>

            {showPasswordFields && (
              <>
                <Divider />
                <div className="field">
                  <label htmlFor="mat_khau_cu" className="block font-medium text-900 mb-1">
                    Nhập mật khẩu cũ
                  </label>
                  <Password id="mat_khau_cu" name="mat_khau_cu" value={formData.mat_khau_cu} onChange={handleChange} feedback={false} toggleMask className="w-full" inputStyle={{ padding: '0.75rem', borderRadius: '8px' }} />
                </div>

                <div className="field">
                  <label htmlFor="mat_khau_moi" className="block font-medium text-900 mb-1">
                    Nhập mật khẩu mới
                  </label>
                  <Password id="mat_khau_moi" name="mat_khau_moi" value={formData.mat_khau_moi} onChange={handleChange} feedback toggleMask className="w-full" inputStyle={{ padding: '0.75rem', borderRadius: '8px' }} />
                </div>

                <div className="field">
                  <label htmlFor="xac_nhan_mat_khau" className="block font-medium text-900 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <Password id="xac_nhan_mat_khau" name="xac_nhan_mat_khau" value={formData.xac_nhan_mat_khau} onChange={handleChange} feedback={false} toggleMask className="w-full" inputStyle={{ padding: '0.75rem', borderRadius: '8px' }} />
                </div>
              </>
            )}

            <Button type="submit" label="Cập nhật" className="p-button-raised p-button-success w-full mt-2" style={{ borderRadius: '8px', padding: '0.75rem' }} />
          </form>
        )}
      </Card>
    </div>
  );
};

export default ProfileUser;
