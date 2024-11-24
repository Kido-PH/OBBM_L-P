import React, { useEffect, useState } from 'react';
import jsQR from 'jsqr';
import '../assets/css/customStyle.css';
import '../assets/css/mainStyle.css';
import { logOut } from "../services/authenticationService";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
const AccountSection = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
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

  const getUserDetails = async (accessToken) => {
    const response = await fetch(`http://localhost:8080/obbm/users/myInfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    console.log(data);

    setUserDetails(data.result);
  };

  const addPassword = (event) => {
    event.preventDefault();

    const body = {
      password: password,
    };

    fetch(`http://localhost:8080/obbm/users/create-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code != 1000) throw new Error(data.message);

        getUserDetails(getToken());
        showSuccess(data.message);
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  useEffect(() => {
    const accessToken = getToken();

    if (!accessToken) {
      navigate("/login");
    }

    getUserDetails(accessToken);
  }, [navigate]);
  const handleLogout = (event) => {
    logOut();
    window.location.href = "/login";
  };
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fileInput = document.getElementById('avatar-upload');
    if (fileInput) {
      fileInput.addEventListener('change', handleFile);
    }

    return () => {
      if (fileInput) {
        fileInput.removeEventListener('change', handleFile);
      }
    };
  }, []);

  const handleFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        const qrCodeImage = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(qrCodeImage.data, qrCodeImage.width, qrCodeImage.height);
        if (code) {
          document.getElementById('result').innerText = `Thông tin từ mã QR: ${code.data}`;
          
          const userInfo = code.data.split('||')[1].split('|');
          const [fullname, birthdate, gender, address] = userInfo;
          document.getElementById('fullname').value = fullname;

          const formattedBirthdate = `${birthdate.slice(4)}-${birthdate.slice(2, 4)}-${birthdate.slice(0, 2)}`;
          document.getElementById('birthdate').value = formattedBirthdate;
          document.getElementById('address').value = address;

          const genderSelect = document.getElementById('gender');
          genderSelect.value = gender === "Nam" ? "Male" : gender === "Nữ" ? "Female" : "Other";
        } else {
          document.getElementById('result').innerText = 'Không tìm thấy mã QR.';
        }
      };
      img.src = event.target.result;
      setImageSrc(event.target.result); // Set the image source
    };
    reader.readAsDataURL(file);
  };

  return (
    <main style={{ marginTop: '50px' }}>
        {userDetails ? (
      <section
        className="section section-divider white account-section"
        id="blog"
        style={{ paddingTop: '60px', paddingBottom: '60px' }}
      >
        <div className="container pt-4">
          <p className="section-subtitle">Account</p>
          <div className="profile-container">
            <div className="profile-photo">
              <img
                src="https://pbs.twimg.com/profile_images/1674815862879178752/nTGMV1Eo_400x400.jpg"
                alt="Profile"
              />
            </div>
            <p className="profile-name">{`${userDetails.fullname}`}</p>
            <p className="email">Ngày sinh: {userDetails.dob}</p>
              <ul>
                Vai trò: 
                {userDetails.roles?.map((item, index) => (
                  <li className="email" key={index}>
                    {item.name}
                  </li>
                ))}
              </ul>
          </div>

          <div className="container w-75">
            <form id="userInfoForm" className="footer-form form-account">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <p className="footer-list-title account-form-title">Profile info</p>
                <button
                  type="button"
                  className="edit-profile-btn navbar-link bi bi-pencil-square"
                ></button>
              </div>

              <div className="input-wrapper">
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  placeholder="Your Name"
                  aria-label="Full Name:"
                  className="input-field"
                  disabled
                  value={userDetails.fullname || ""}
                />
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  required
                  placeholder="UserName"
                  aria-label="UserName"
                  className="input-field"
                  value={userDetails.username || ""}
                  disabled
                />
              </div>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email_address"
                  id="email_address"
                  required
                  placeholder="Email"
                  aria-label="Email"
                  className="input-field"
                  value={userDetails.email || ""}
                  disabled
                />
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  required
                  placeholder="Phone Number"
                  aria-label="Phone Number"
                  className="input-field"
                  value={userDetails.phone || ""}
                  disabled
                />
              </div>

              <div className="input-wrapper">
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  aria-label="Address"
                  className="input-field"
                  // value={userDetails.address || ""}
                  disabled
                />
                <input
                  type="date"
                  name="birthdate"
                  id="birthdate"
                  placeholder="Birthdate"
                  aria-label="Date of Birth"
                  className="input-field"
                  value={userDetails.dob || ""}
                  disabled
                />
              </div>

              <div className="input-wrapper">
                <select
                  name="gender"
                  aria-label="Total person"
                  id="gender"
                  style={{ height: '40px' }}
                  className="input-field"
                >
                  <option value="" disabled>
                    -- Choose your gender --
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <div className="input-wrapper" style={{ marginTop: '7px' }}>
                  <div className="upload-wrapper">
                    <label
                      style={{ paddingTop: '10px', paddingBottom: '10px', borderRadius: '3px' }}
                      htmlFor="avatar-upload"
                      className="custom-file-upload btn btn-secondary"
                    >
                      ID card image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      className="file-input"
                      style={{ display: 'none' }}
                    />
                  </div>

                   {/* New Image Preview */}
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="Selected"
                  style={{ maxWidth: '300px', marginTop: '10px' }}
                />
              )}

                  <canvas id="canvas" style={{ display: 'none' }}></canvas>
                  <div id="result" className="mt-3" style={{ display: 'none' }}></div>
                </div>
              </div>
              
              {/* <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar> */}
              {/* {userDetails ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor={"#f0f2f5"}
        >
          <Card
            sx={{
              minWidth: 400,
              maxWidth: 500,
              boxShadow: 4,
              borderRadius: 2,
              padding: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%", // Ensure content takes full width
              }}
            >
              <img
                src={userDetails.image}
                alt={`${userDetails.fullname}'s profile`}
                className="profile-pic"
              />
              <p>Welcome back to Kido, {userDetails.fullname}</p>
              <h1 className="name">{`${userDetails.fullname}`}</h1>
              <p className="email">{userDetails.dob}</p>
              <ul>
                User's roles:
                {userDetails.roles?.map((item, index) => (
                  <li className="email" key={index}>
                    {item.name}
                  </li>
                ))}
              </ul>
              {userDetails.noPassword && (
                <Box
                  component="form"
                  onSubmit={addPassword}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Typography>Do you want to create password?</Typography>
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Create password
                  </Button>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      ) : (
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
          <CircularProgress></CircularProgress>
          <Typography>Loading ...</Typography>
        </Box>
      )} */}

             

              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover"
                  style={{ margin: '10px auto' }}
                  disabled
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="d-flex flex-wrap fw-bold fs-3 mt-4 pe-2 justify-content-center">
            <a
              href="/login"
              className="d-flex align-items-center me-5 mb-2 btn btn-hover"
              style={{ marginLeft: '54px', width: '160px', fontSize: '14px', paddingTop: '10px', paddingLeft: '47px', paddingRight: '47px', marginTop: '10px', borderRadius: '3px' }}
              onClick={handleLogout}
            >
              <i className="bi bi-door-open me-3"></i>
              Log out
            </a>
          </div>
        </div>
      </section>
      ) : (
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
          <CircularProgress></CircularProgress>
          <Typography>Loading ...</Typography>
        </Box>
      )}
    </main>
  );
};

export default AccountSection;
