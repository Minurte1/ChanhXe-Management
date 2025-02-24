import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";
import "./style/authForm.scss";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import logoGG from "../public/asset/google.png";
import {
  checkOtp,
  fetchGoogleUserInfo,
  loginWithGoogle,
  sendOtp,
  servicesLoginUser,
  servicesRegisterUser,
} from "../services/googleAuthService";
import { enqueueSnackbar } from "notistack";
import spService from "../share/share-services/sp-services";
const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false); // Chuyển đổi giữa đăng nhập/đăng ký
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Kiểm tra đã gửi OTP chưa
  const [otpDialog, setOtpDialog] = useState(false); // Hiển thị Dialog nhập OTP
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
        setUser(userInfo);
      } catch (error) {
        console.error("Lỗi lấy thông tin Google:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  useEffect(() => {
    if (user) {
      const handleLogin = async () => {
        try {
          const loginData = await loginWithGoogle(user);
          if (loginData) {
            dispatch(
              login({
                accessToken: loginData.accessToken,
                userInfo: loginData.userInfo,
              })
            );
            navigate("/admin");
          }
        } catch (error) {
          console.error("Lỗi khi đăng nhập:", error);
        }
      };

      handleLogin();
    }
  }, [user, navigate, dispatch]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý gửi OTP
  const handleSendOtp = async () => {
    const { email } = formData;
    if (!email) {
      enqueueSnackbar("Vui lòng nhập email!", { variant: "info" });
      return;
    } else {
      const response = await sendOtp(email);

      if (response.EC === 1) {
        enqueueSnackbar("Đã gửi mã OTP!", { variant: "success" });
        setOtpSent(true);
        setOtpDialog(true); // Mở dialog nhập OTP
      } else {
        enqueueSnackbar("Có lỗi xảy ra!", { variant: "info" });
      }
    }
  };

  const handleCheckOtp = async () => {
    const { email, otp, name, phone } = formData;
    if (!email || !otp || !name || !phone) {
      enqueueSnackbar("Vui lòng nhập đầy đủ thông tin", { variant: "info" });
      return;
    } else {
      const response = await checkOtp(email, otp);
      if (response) {
        if (response.EC === 1) {
          enqueueSnackbar(response.EM, { variant: "success" });
          setOtpSent(true);

          setIsRegister(true);
          setOtpDialog(false); // Đóng
          registerUser();
        } else {
          enqueueSnackbar(response.EM, { variant: "info" });
        }
      }
    }
  };

  const registerUser = async () => {
    setLoading(true);
    const { email, name, phone, password } = formData;
    if (!email || !password || !name || !phone) {
      enqueueSnackbar("Vui lòng nhập đầy đủ thông tin", { variant: "info" });
      return;
    }
    try {
      const data = await servicesRegisterUser(formData); // Gọi API từ service

      if (data.EC === 1) {
        enqueueSnackbar(data.EM, { variant: "success" });
        setIsRegister(false);
      } else {
        alert(data.EM);
      }
    } catch (error) {
      // enqueueSnackbar("Có lỗi xảy ra!", { variant: "info" });
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    setLoading(true);
    if (!formData.email || !formData.password) {
      enqueueSnackbar("Vui lòng nhập đầy đủ thông tin", { variant: "info" });
      return;
    }
    try {
      const data = await servicesLoginUser(formData); // Gọi API từ service

      if (data.EC === 1) {
        const test = spService.createSlug(data.DT.userInfo.vai_tro);
        console.log(test);
        enqueueSnackbar(data.EM, { variant: "success" });
        navigate(`/${spService.createSlug(data.DT.userInfo.vai_tro)}`);
        dispatch(
          login({
            accessToken: data.DT.accessToken,
            userInfo: data.DT.userInfo,
          })
        );
        setIsRegister(false);
      } else {
        enqueueSnackbar(data.EM, { variant: "info" });
      }
    } catch (error) {
      // enqueueSnackbar("Có lỗi xảy ra!", { variant: "info" });
    } finally {
      setLoading(false);
    }
  };
  // Xử lý đăng nhập hoặc đăng ký
  const handleSubmit = async () => {
    setLoading(true); // Bắt đầu hiệu ứng loading
    try {
      if (isRegister) {
        if (!otpSent) {
          setOtpDialog(true);
          await handleSendOtp();
        } else {
          await registerUser(formData);
        }
      } else {
        loginUser();
      }
    } finally {
      setLoading(false); // Tắt loading khi xong
    }
  };

  return (
    <div className="auth-Form">
      <div className="auth-container">
        <h2>{isRegister ? "Đăng Ký" : "Đăng Nhập"}</h2>
        <div className="p-field">
          <label>Email</label>
          <InputText
            name="email"
            value={formData?.email}
            onChange={handleChange}
            className="p-inputtext-lg w-full"
          />
        </div>
        {isRegister && (
          <>
            {" "}
            <div className="p-field">
              <label>Họ tên</label>
              <InputText
                name="name"
                value={formData?.name}
                onChange={handleChange}
                className="p-inputtext-lg w-full"
              />
            </div>{" "}
            <div className="p-field">
              <label>Số điện thoại</label>
              <InputText
                name="phone"
                value={formData?.phone}
                onChange={handleChange}
                className="p-inputtext-lg w-full"
              />
            </div>
          </>
        )}
        <div className="p-field">
          <label>Mật khẩu</label>
          <Password
            name="password"
            value={formData?.password}
            onChange={handleChange}
            className="w-full"
            feedback={false}
            toggleMask
          />
        </div>

        <Button
          label={isRegister ? "Đăng Ký" : "Đăng Nhập"}
          onClick={handleSubmit}
          className="p-button-lg auth-button"
          disabled={loading}
        >
          {loading ? (
            <i className="pi pi-spin pi-spinner" />
          ) : isRegister ? (
            ""
          ) : (
            ""
          )}
        </Button>

        {/* {!isRegister && (
          <div className="admin-login mt-2">
            <div>
              <button className="Button-gg" onClick={() => loginGoogle()}>
                <img src={logoGG} alt="Logo" className="logo-gg" />
                <div className="content-sign">
                  <p>Sign in with Google</p>
                </div>
              </button>
            </div>
          </div>
        )} */}
        <p>
          {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          {/* <span
            onClick={() => setIsRegister(!isRegister)}
            className="toggle-text"
          >
            {isRegister ? "Đăng nhập" : "Đăng ký"}
          </span> */}
        </p>
        <Dialog
          header="Nhập Mã OTP"
          visible={otpDialog}
          onHide={() => setOtpDialog(false)}
          className="otp-dialog"
        >
          <div className="p-field">
            <label>Mã OTP</label>
            <InputText
              name="otp"
              value={formData?.otp}
              onChange={handleChange}
              className="w-full input-otp"
              style={{ marginLeft: "10px" }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              label="Xác Nhận"
              className="p-button-sm otp-button"
              style={{ marginTop: "10px" }}
              onClick={handleCheckOtp}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default AuthForm;
