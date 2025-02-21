import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false); // Chuyển đổi giữa đăng nhập/đăng ký
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false); // Kiểm tra đã gửi OTP chưa
  const [otpDialog, setOtpDialog] = useState(false); // Hiển thị Dialog nhập OTP

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
    <div
      className="p-d-flex p-flex-column p-ai-center"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
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
        <>
          <Button
            label="Gửi OTP"
            icon="pi pi-send"
            onClick={handleSendOtp}
            className="p-button-sm p-button-outlined p-mb-2"
          />
        </>
      )}

      <Button
        label={isRegister ? "Đăng Ký" : "Đăng Nhập"}
        icon="pi pi-check"
        onClick={handleSubmit}
        className="p-button-lg w-full"
      />

      <p className="p-mt-3">
        {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
        <span
          onClick={() => setIsRegister(!isRegister)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isRegister ? "Đăng nhập" : "Đăng ký"}
        </span>
      </p>

      {/* Dialog Nhập OTP */}
      <Dialog
        header="Nhập Mã OTP"
        visible={otpDialog}
        onHide={() => setOtpDialog(false)}
      >
        <div className="p-field">
          <label>Mã OTP</label>
          <InputText
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <Button
          label="Xác Nhận"
          onClick={() => alert("Xác nhận thành công!")}
          className="p-button-sm w-full"
        />
      </Dialog>
    </div>
  );
};

export default AuthForm;
