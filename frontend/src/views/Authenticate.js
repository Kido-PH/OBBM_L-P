import axios from 'axios';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/localStorageService.js";
import { Box, CircularProgress, Typography } from "@mui/material";
import Swal from "sweetalert2";
const Authenticate = () => {
  const navigate = useNavigate();
  const apiClient = axios.create({
      baseURL: "http://59.153.218.244:8080/obbm",
      headers: {
        "Content-Type": "application/json",
      },
    });
  // Hàm lấy thông tin người dùng
  const getUserDetails = async (accessToken) => {
    console.log("Sử dụng accessToken:", accessToken); // Log accessToken
    const response = await apiClient.get("/users/myInfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = response.data;
    if (data.code !== 1000) {
      throw new Error(data.message); // Xử lý lỗi từ API
    }
    return data.result; // Trả về thông tin người dùng
  };

  useEffect(() => {
    console.log(window.location.href);
    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);
  
    if (isMatch) {
      const authCode = isMatch[1];
  
      axios
        .post(
          `http://59.153.218.244:8080/obbm/auth/outbound/authentication?code=${authCode}`
        )
        .then((response) => {
          const data = response.data;
          console.log(data);
  
          const refreshToken = data.result?.refreshToken;
          const accessToken = data.result?.accessToken;
  
          if (refreshToken && accessToken) {
            document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
              7 * 24 * 60 * 60
            }; secure`;
            setToken(accessToken);

  
            // Kiểm tra nếu có currentEventId và điều hướng đến menu/eventId
            const currentEventId = localStorage.getItem("currentEventId");
            if (currentEventId) {
              navigate(`/menu/${currentEventId}`);
            } else {
              navigate("/"); // Điều hướng về trang chủ nếu không có currentEventId
            }


            // Lấy thông tin người dùng
            return getUserDetails(accessToken);

          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi đăng nhập",
              text: "Không nhận được dữ liệu đăng nhập. Vui lòng thử lại.",
              showConfirmButton: true,
            });
            throw new Error("Không nhận được refreshToken hoặc accessToken");
          }
        })
        .then((userDetails) => {
          console.log("Thông tin người dùng:", userDetails);

          // Lưu userId vào localStorage
          localStorage.setItem("userId", userDetails.userId);

          const currentEventId = localStorage.getItem("currentEventId");
          if (currentEventId) {
            navigate(`/menu/${currentEventId}`);
          } else {
            navigate("/"); // Điều hướng về trang chủ nếu không có currentEventId
          }
        })
        .catch((error) => {
          console.error("Error during authentication:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại.",
            showConfirmButton: true,
          });
        });
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography>Authenticating...</Typography>
    </Box>
  );
};

export default Authenticate;
