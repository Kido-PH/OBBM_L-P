import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/localStorageService.js";
import { Box, CircularProgress, Typography } from "@mui/material";
import Swal from "sweetalert2";

const Authenticate = () => {
  const navigate = useNavigate();
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];
      fetch(
        `http://localhost:8080/obbm/auth/outbound/authentication?code=${authCode}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const refreshToken = data.result?.refreshToken;
          if (refreshToken && data.result?.accessToken) {
            document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
              7 * 24 * 60 * 60
            }; secure`;
            setToken(data.result?.accessToken);
            navigate("/");
          } else {
            Swal.fire({
              icon: "success",
              title: "Hoàn tất đăng ký",
              text: "Vui lòng đăng nhập lại",
              timer: 3000, // Tự động đóng sau 8 giây
              showConfirmButton: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error during authentication:", error);
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
