import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { OAuthConfig } from "../configurations/configuration";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../services/localStorageService";
import Cookies from "js-cookie";

const LoginForm = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  useEffect(() => {
    const accessToken = getToken();

    if (accessToken) {
      navigate("/account");
    }
  }, [navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const [error, setError] = useState("");

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
      return;
    }

    const data = {
      username: username,
      password: password,
    };

    // Gửi yêu cầu đăng nhập tới server
    fetch("http://localhost:8080/obbm/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code !== 1000) {
          // Kiểm tra nếu thông báo lỗi liên quan đến tài khoản hoặc mật khẩu sai
          if (data.message.includes("Invalid credentials")) {
            setError("Tài khoản hoặc mật khẩu không đúng!");
          } else {
            setError(data.message || "Đăng nhập không thành công");
          }
          return;
        }
        
        const accessToken = data.result?.accessToken;
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
        localStorage.setItem("userId", userDetails.userId);
        
        navigate("/"); // Điều hướng về trang chính sau khi đăng nhập thành công
      })
      .catch((error) => {
        setError(error.message || "Có lỗi xảy ra trong quá trình đăng nhập.");
      })
      .finally(() => {
        setIsSubmitting(false); // Đặt lại trạng thái submitting khi kết thúc
      });
  };
  const getUserDetails = async (accessToken) => {
    const response = await fetch(`http://localhost:8080/obbm/users/myInfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.code !== 1000) {
      throw new Error(data.message);
    }

    return data.result;
  };

  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refreshToken"); // Lấy refreshToken từ cookies
  
    if (!refreshToken) {
      throw new Error("Không có refreshToken.");
    }
  
    try {
      // Gửi yêu cầu đến API /refresh để lấy accessToken mới
      const response = await fetch("http://localhost:8080/obbm/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }), // Gửi refreshToken
      });
  
      const data = await response.json();
  
      // Nếu API trả về accessToken mới, lưu nó vào localStorage
      if (data.code === 1000 && data.result?.accessToken) {
        const newAccessToken = data.result.accessToken;
  
        setToken(newAccessToken); // Lưu accessToken mới vào localStorage
        console.log("Mới nhận accessToken:", newAccessToken); // Log accessToken mới
        return newAccessToken; // Trả về accessToken mới
      }
  
      throw new Error("Không thể lấy accessToken mới.");
  
    } catch (error) {
      console.error("Lỗi khi làm mới accessToken:", error.message);
      throw error;
    }
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