import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import "./style/authForm.scss";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { login } from "../redux/authSlice";
import logoGG from "../public/asset/google.png";
const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false); // Chuyển đổi giữa đăng nhập/đăng ký
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false); // Kiểm tra đã gửi OTP chưa
  const [otpDialog, setOtpDialog] = useState(false); // Hiển thị Dialog nhập OTP
  const [user, setUser] = useState(null);
  const [tokenGoogle, setTokenGoogle] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setTokenGoogle(tokenResponse.access_token);

      // Lấy thông tin người dùng từ Google API
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        setUser(userInfo.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_URL_SERVER}/login/google`,
            { email: user.email, HO_TEN: user.name }
          );

          if (response.data.EC === 200) {
            localStorage.setItem("THEMES", response.data.DT.userInfo.THEMES);
            Cookies.remove("accessToken");
            const accessToken = response.data.DT.accessToken;
            Cookies.set("accessToken", accessToken, { expires: 7 });
            sessionStorage.setItem("userPicture", user.picture);
            dispatch(
              login({
                accessToken,
                userInfo: response.data.DT.userInfo, // Thông tin người dùng
              })
            );

            // loginIs();
            navigate("/");
          } else {
          }
        } catch (error) {
          console.error("Đã xảy ra lỗi:", error);
        }
      };

      fetchData();
    }
  }, [user, navigate, dispatch]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý gửi OTP
  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpDialog(true); // Mở dialog nhập OTP
  };

  // Xử lý đăng nhập hoặc đăng ký
  const handleSubmit = () => {
    if (isRegister) {
      if (!otpSent) {
        alert("Vui lòng nhập OTP!");
      } else {
        alert("Đăng ký thành công!");
      }
    } else {
      alert("Đăng nhập thành công!");
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
            value={formData.email}
            onChange={handleChange}
            className="p-inputtext-lg w-full"
          />
        </div>

        <div className="p-field">
          <label>Mật khẩu</label>
          <Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full"
            feedback={false}
            toggleMask
          />
        </div>

        {isRegister && (
          <Button
            label="Gửi OTP"
            icon="pi pi-send"
            onClick={handleSendOtp}
            className="p-button-sm p-button-outlined auth-button button-otp"
          />
        )}

        <Button
          label={isRegister ? "Đăng Ký" : "Đăng Nhập"}
          onClick={handleSubmit}
          className="p-button-lg auth-button"
          // disabled
        />
        {!isRegister && (
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
        )}

        <p>
          {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="toggle-text"
          >
            {isRegister ? "Đăng nhập" : "Đăng ký"}
          </span>
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
              value={formData.otp}
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
              onClick={() => alert("Xác nhận thành công!")}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default AuthForm;
