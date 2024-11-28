import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getToken, setToken } from "../services/localStorageService";
const RegisterForm = ({ toggleForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const goToRegisterStep2 = () => {
    document.getElementById("registerStep1").style.display = "none";
    document.getElementById("registerStep2").style.display = "block";
  };
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = getToken();

    if (accessToken) {
      navigate("/account");
    }
  }, [navigate]);

  const handleRegister = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    const data = {
      username: username,
      password: password,
      email: email,
    };
  
    fetch("http://localhost:8080/obbm/users/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code !== 1000) throw new Error(data.message);
  
        // Đăng ký thành công - Hiển thị SweetAlert
        Swal.fire({
          title: "Đăng ký thành công!",
          text: "Bạn muốn làm gì tiếp theo?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Đăng nhập ngay",
          cancelButtonText: "Về trang chủ",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Điều hướng tới trang đăng nhập
            navigate("/login");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Điều hướng tới trang chủ
            navigate("/");
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Đăng ký thất bại",
          text: error.message,
          icon: "error",
        });
      });
  };

  return (
    <div className="login-form" id="registerForm">
      <h1>Register</h1>
      <form id="registerForm" method="post" onSubmit={handleRegister}>
        <div id="registerStep1">
          <input type="text" placeholder="Username"
          name="username"
          required
          style={{ height: "41.2px" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}  />
          <input type="email"
          placeholder="email"
          name="email"
          required
          style={{ height: "41.2px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
          <input
            type="button"
            value="Receive Code"
            onClick={goToRegisterStep2}
          />
        </div>
        <div id="registerStep2" style={{ display: "none" }}>
          {/* <input
            type="text"
            placeholder="Verification Code"
            name="email-code"
            required
            maxLength="6"
            pattern="[0-9]{6}"
            title="Please enter a 6-digit code"
          /> */}
          <input
        type="password"
        placeholder="Password"
        name="password"
        required
        style={{ height: "41.2px" }}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(""); // Xóa lỗi nếu người dùng nhập lại
        }}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirm-password"
        required
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setError(""); // Xóa lỗi nếu người dùng nhập lại
        }}
      />
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <input type="submit" value="Register" />
        </div>
      </form>
      {/* <div className="social-login">
        // <a href="#" className="google-login">Sign up with Google</a>
        <a href="#" className="facebook-login">Sign up with Facebook</a>
      </div> */}
      <div className="register-link" onClick={() => toggleForm("login")}>
        Return to Login
      </div>
    </div>
  );
};

export default RegisterForm;
