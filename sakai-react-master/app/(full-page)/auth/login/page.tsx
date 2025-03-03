/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import Cookies from 'js-cookie';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/authSlice'; // Điều chỉnh đường dẫn nếu cần
import { fetchGoogleUserInfo, loginWithGoogle, servicesLoginUser } from '../../../services/googleAuthService'; // Điều chỉnh đường dẫn nếu cần
import { enqueueSnackbar } from 'notistack';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // Thông tin user từ Google
  const { layoutConfig } = useContext(LayoutContext);

  const router = useRouter();
  const dispatch = useDispatch();

  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

  // Xử lý đăng nhập Google
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
        setUser(userInfo);
      } catch (error) {
        console.error('Lỗi lấy thông tin Google:', error);
        enqueueSnackbar('Lỗi đăng nhập Google!', { variant: 'error' });
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      enqueueSnackbar('Đăng nhập Google thất bại!', { variant: 'error' });
    }
  });

  // Xử lý khi có thông tin user từ Google
  useEffect(() => {
    if (user) {
      const handleGoogleLogin = async () => {
        try {
          const loginData = await loginWithGoogle(user);
          if (loginData) {
            Cookies.set('accessToken', loginData.accessToken, { expires: 7 }); // Lưu token vào cookie
            dispatch(
              login({
                accessToken: loginData.accessToken,
                userInfo: loginData.userInfo
              })
            );
            router.push('/admin');
            enqueueSnackbar('Đăng nhập Google thành công!', { variant: 'success' });
          }
        } catch (error) {
          console.error('Lỗi khi đăng nhập Google:', error);
          enqueueSnackbar('Có lỗi xảy ra khi đăng nhập Google!', { variant: 'error' });
        }
      };
      handleGoogleLogin();
    }
  }, [user, router, dispatch]);

  // Xử lý đăng nhập bằng email/mật khẩu
  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      enqueueSnackbar('Vui lòng nhập đầy đủ thông tin!', { variant: 'info' });
      setLoading(false);
      return;
    }

    try {
      const data = await servicesLoginUser({ email, password });
      if (data.EC === 1) {
        Cookies.set('accessToken', data.DT.accessToken, { expires: 7 }); // Lưu token vào cookie
        dispatch(
          login({
            accessToken: data.DT.accessToken,
            userInfo: data.DT.userInfo
          })
        );
        enqueueSnackbar('Đăng nhập thành công!', { variant: 'success' });
        router.push('/'); // Chuyển hướng về trang chính
      } else {
        enqueueSnackbar(data.EM, { variant: 'info' });
      }
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra khi đăng nhập!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
          }}
        >
          <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
            <div className="text-center mb-5">
              <div className="text-900 text-3xl font-medium mb-3">Chào mừng, Hệ Thống Quản Lý Chành Xe</div>
              <span className="text-600 font-medium">Đăng nhập để tiếp tục</span>
            </div>

            <div>
              <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                Email
              </label>
              <InputText id="email1" type="text" placeholder="Địa chỉ email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

              <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                Mật khẩu
              </label>
              <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2" />
                  <label htmlFor="rememberme1">Ghi nhớ đăng nhập</label>
                </div>
                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                  Quên mật khẩu?
                </a>
              </div>

              <Button label="Đăng nhập" className="w-full p-3 text-xl mb-3" onClick={handleLogin} disabled={loading} icon={loading ? 'pi pi-spin pi-spinner' : undefined} />

              {/* Đăng nhập bằng Google */}
              <Button label="Đăng nhập với Google" className="w-full p-3 text-xl" onClick={() => loginGoogle()} disabled={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
