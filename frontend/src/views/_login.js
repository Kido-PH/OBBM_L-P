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

const LoginForm = ({ toggleForm }) => {
  const navigate = useNavigate();

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
  
    const data = {
      username: username,
      password: password,
    };
  
    fetch("http://localhost:8080/obbm/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code !== 1000) throw new Error(data.message);
  
        const accessToken = data.result?.accessToken;
        setToken(accessToken);
  
        // Lấy thông tin người dùng
        return getUserDetails(accessToken);
      })
      .then((userDetails) => {
        // Lưu userId vào localStorage
        localStorage.setItem("userId", userDetails.userId);
  
        navigate("/");
      })
      .catch((error) => {
        showError(error.message);
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
  
    console.log("User details:", data.result);
    return data.result; // Trả về thông tin người dùng
  };
  

  return (
    <div className="login-form" id="loginForm">
      <h1>Log in</h1>
      <form component="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          style={{ height: "41.2px" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          style={{ height: "41.2px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Log in" onClick={handleLogin}/>
      </form>
      <div className="social-login">
        <a href="#" className="google-login" onClick={handleContinueWithGoogle}>
          Sign in with Google
        </a>
      </div>
      <div
        className="forgot-password"
        onClick={() => toggleForm("forgotPassword")}
      >
        <a href="#">Reset Password</a>
      </div>
      <div
        className="register-link"
        onClick={() => toggleForm("register")}
        style={{ color: "#3d4fc8" }}
      >
        Don't have an account? <strong>Create one</strong> 
      </div>
    </div>
  );
};

export default LoginForm;
