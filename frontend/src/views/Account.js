import { useEffect, useState } from "react";
import jsQR from 'jsqr';
import '../assets/css/customStyle.css';
import '../assets/css/mainStyle.css';

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

import { logOut } from "../services/authenticationService";
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

  useEffect(() => {
    const fileInput = document.getElementById('avatar-upload');
    if (fileInput) {
      fileInput.addEventListener('change', handleFile);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (fileInput) {
        fileInput.removeEventListener('change', handleFile);
      }
    };
  }, []);
  const handleLogout = (event) => {
    logOut();
    window.location.href = "/login";
  };
  return (
    <main style={{marginTop:'50px'}}>
      {userDetails ? (
      <section
        className="section section-divider white account-section"
        id="blog"
        style={{ paddingTop: '60px', paddingBottom: '60px' }}
      >
        <div className="container pt-4">
          <p className="section-subtitle">Tài khoản</p>
          <div className="profile-container">
            <div className="profile-photo">
              <img
                src="https://pbs.twimg.com/profile_images/1674815862879178752/nTGMV1Eo_400x400.jpg"
                alt="Profile"
              />
            </div>
            <p className="profile-name">{`${userDetails.fullname}`}</p>
            {/* <p className="join-date section-title">
              Registration Date: <span className="span">26/05/2024</span>
            </p> */}
          </div>

          <div className="container w-75">
            <form id="userInfoForm" className="footer-form form-account">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <p className="footer-list-title account-form-title">Thông tin cá nhân</p>
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
                    -- Chọn giới tính --
                  </option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>

                <div className="input-wrapper" style={{marginTop: '7px'}}>
                  <div className="upload-wrapper">
                    <label style={{paddingTop: '10px', paddingBottom: '10px',borderRadius: '3px'}}
                      htmlFor="avatar-upload"
                      className="custom-file-upload btn btn-secondary "
                    >
                      Căn cước công dân
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      className="file-input"
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div className="file-info">
                    <div id="file-name" className="file-name"></div>
                    <div id="file-size" className="file-size"></div>
                  </div>

                  <canvas id="canvas" style={{ display: 'none' }}></canvas>
                  <div id="result" className="mt-3" style={{ display: 'none' }}></div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover"
                  style={{ margin: '10px auto' }}
                  disabled
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>

          <div className="d-flex flex-wrap fw-bold fs-3 mt-4 pe-2 justify-content-center">
            <a
              onClick={handleLogout}
              className="d-flex align-items-center me-5 mb-2 btn btn-hover"
              style={{ marginLeft: '505px',width: '160px', fontSize:'14px', paddingTop:'10px ',paddingLeft: '47px', paddingRight: '47px', marginTop:'10px ',borderRadius:'3px ' }}
            >
              <i className="bi bi-door-open me-3"></i>
              Đăng xuất
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

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            const qrCodeImage = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(qrCodeImage.data, qrCodeImage.width, qrCodeImage.height);
            if (code) {
                document.getElementById('result').innerText = `Thông tin từ mã QR: ${code.data}`;
                
                // Split the QR code data based on the expected delimiter (e.g., "||")
                const userInfo = code.data.split('||')[1].split('|');

                // Extracting data from the split array
                const [fullname, birthdate, gender, address] = userInfo;

                // Set the values to the form fields
                document.getElementById('fullname').value = fullname;
                
                // Convert birthdate from DDMMYYYY to YYYY-MM-DD format (if needed)
                const formattedBirthdate = `${birthdate.slice(4)}-${birthdate.slice(2, 4)}-${birthdate.slice(0, 2)}`;
                document.getElementById('birthdate').value = formattedBirthdate;

                // Set the address
                document.getElementById('address').value = address;

                // Set the gender
                const genderSelect = document.getElementById('gender');
                if (gender === "Nam") {
                    genderSelect.value = "Male";
                } else if (gender === "Nữ") {
                    genderSelect.value = "Female";
                } else {
                    genderSelect.value = "Other";
                }
            } else {
                document.getElementById('result').innerText = 'Không tìm thấy mã QR.';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);

    document.getElementById('file-name').innerText = file.name;
}
