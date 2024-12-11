import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { OAuthConfig } from "../configurations/configuration";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../services/localStorageService";
import Cookies from "js-cookie";
import axios from "axios";

const LoginForm = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiClient = axios.create({
    baseURL: "http://localhost:8080/obbm",
    headers: {
      "Content-Type": "application/json",
    },
  });
  

  const handleContinueWithGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const [error, setError] = useState("");
  const getRefreshToken = () => Cookies.get("refreshToken");
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const showError = (message) => {
    setSnackType("error");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const showSuccess = (message) => {
    setSnackType("success");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(""); // Reset lỗi khi bắt đầu đăng nhập

    // Kiểm tra dữ liệu người dùng nhập vào
    if (!username.trim() || !password.trim()) {
      setError("Tài khoản và mật khẩu không được để trống!");
      setIsSubmitting(false); // Dừng trạng thái submitting
      return;
    }

    const data = {
      username: username,
      password: password,
    };

    // Gửi yêu cầu đăng nhập tới server
    apiClient
      .post("/auth/token", data)
      .then((response) => {
        const responseData = response.data;

        if (responseData.code !== 1000) {
          setError(responseData.message || "Đăng nhập không thành công");
          return;
        }

        const refreshToken = responseData.result?.refreshToken;
        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
            7 * 24 * 60 * 60
          }; secure`;
        }

        const accessToken = responseData.result?.accessToken;
        setToken(accessToken); // Lưu token vào localStorage

        // Lấy thông tin người dùng nếu token hợp lệ
        return getUserDetails(accessToken);
      })
      .then((userDetails) => {
        if (!userDetails) {
          setError("Không thể lấy thông tin người dùng.");
          return;
        }

        // Lưu thông tin người dùng vào localStorage
        sessionStorage.setItem("userId", userDetails.userId);
        localStorage.setItem("userId", userDetails.userId);

        // Lấy `currentEventId` từ localStorage
        const currentEventId = sessionStorage.getItem("currentEventId");

        // Chuyển hướng sau khi đăng nhập
        if (currentEventId) {
          navigate(`/menu/${currentEventId}`);
        } else {
          navigate("/account"); // Nếu không có `currentEventId`, chuyển hướng mặc định
        }
      })
      .catch((error) => {
        setError(error.message || "Có lỗi xảy ra trong quá trình đăng nhập.");
      })
      .finally(() => {
        setIsSubmitting(false); // Đặt lại trạng thái submitting khi kết thúc
      });
  };

  const getUserDetails = async (accessToken) => {
    console.log("Sử dụng accessToken:", accessToken); // Log accessToken
    const response = await apiClient.get("/users/myInfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  
    const data = response.data;
    if (data.code !== 1000) {
      throw new Error(data.message);
    }
    return data.result;
  };
  

  return (
    <div className="login-form" id="loginForm">
      <h1>Đăng nhập</h1>
      <form component="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          name="username"
          
          style={{ height: "41.2px" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setError("")} 
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          name="password"
          
          style={{ height: "41.2px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setError("")} 
        />
         {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <input type="submit" value="Đăng nhập"/>
    
      </form>
  
      
  
      <div className="social-login">
        <a href="#" className="google-login" onClick={handleContinueWithGoogle}>
          Tiếp tục với Google
        </a>
      </div>
      <div
        className="forgot-password"
        onClick={() => toggleForm("forgotPassword")}
      >
        <a href="#">Đổi mật khẩu</a>
      </div>
      <div
        className="register-link"
        onClick={() => toggleForm("register")}
        style={{ color: "#3d4fc8" }}
      >
        Bạn chưa có tài khoản? Hãy <strong>tạo tài khoản</strong> 
      </div>
      <div
        
        style={{ color: "hsl(32, 100%, 59%)", textAlign: "center", marginTop:"15px", fontSize:"15px" }}
      >
        <a href="/">Về trang chủ</a>
      </div>
    </div>
  );
};

export default LoginForm;