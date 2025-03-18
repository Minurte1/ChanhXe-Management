import axios from 'axios';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';

export const fetchGoogleUserInfo = async (accessToken) => {
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};

export const loginWithGoogle = async (user) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/login/google`, { email: user.email, ho_ten: user.name });

        if (response.data.EC === 200) {
            enqueueSnackbar(response.data.EM, { variant: 'success' });
            Cookies.remove('accessToken');
            const accessToken = response.data.DT.accessToken;
            Cookies.set('accessToken', accessToken, { expires: 7 });
            sessionStorage.setItem('userPicture', user.picture);

            return {
                accessToken,
                userInfo: response.data.DT.userInfo
            };
        }
        return null;
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
    }
};
export const sendOtp = async (email) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/send-otp`, {
            email: email
        });
        return response.data;
    } catch (error) {
        enqueueSnackbar(error.response.data.EM, { variant: 'info' });
        console.error('Error fetching user info:', error);
    }
};
export const checkOtp = async (email, otp) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/check-otp`, {
            email: email,
            otp: otp
        });
        return response.data;
    } catch (error) {
        enqueueSnackbar(error.response.data.EM, { variant: 'info' });
        console.error('Error fetching user info:', error);
    }
};

export const servicesRegisterUser = async (formData) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/register`, {
            so_dien_thoai: formData.phone,
            email: formData.email,
            password: formData.password,
            ho_ten: formData.name
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        enqueueSnackbar(error.response.data.EM, { variant: 'info' });
    }
};
export const servicesLoginUser = async (formData) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/login`, {
            email: formData.email,
            password: formData.password
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        enqueueSnackbar(error.response.data.EM, { variant: 'info' });
    }
};
export const servicesLoginCustomer = async (formData) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/login-customer`, {
            so_dien_thoai: formData.soDienThoai,
            password: formData.password
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        enqueueSnackbar(error.response.data.EM, { variant: 'info' });
    }
};
