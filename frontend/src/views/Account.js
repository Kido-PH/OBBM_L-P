import { useEffect, useState } from "react";
import jsQR from "jsqr";
import "../assets/css/customStyle.css";
import "../assets/css/mainStyle.css";

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
  const [imageSrc, setImageSrc] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullname: "",
    dob: "",
    gender: null, // ban đầu chưa có giới tính
    address: "",
    citizenIdentity: "",
  });
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullname: userDetails.fullname || "",
    gender: userDetails.gender ? "Male" : "Female",
    residence: userDetails.residence || "",
    email: userDetails.email || "",
    phone: userDetails.phone || "",
    citizenIdentity: userDetails.citizenIdentity || "",
    dob: userDetails.dob || "",
  });

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

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

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Chỉ cho phép 10 chữ số.
    if (!phone) {
      setError("Phone number is required.");
    } else if (!phoneRegex.test(phone)) {
      setError("Invalid phone number. It must be 10 digits.");
    } else {
      setError("");
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file)); // Tạo URL cho ảnh tải lên để hiển thị
      scanIdCard(file); // Gọi API để quét ảnh CCCD
    }
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-4); // Lấy 2 chữ số cuối của năm
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng có thể là 1 chữ số, thêm 0 ở đầu nếu cần
    const day = date.getDate().toString().padStart(2, "0"); // Ngày có thể là 1 chữ số, thêm 0 ở đầu nếu cần
    return `${year}-${month}-${day}`; // Trả về chuỗi ngày theo định dạng YY-MM-DD
  };
  const scanIdCard = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    fetch("https://api.fpt.ai/vision/idr/vnm", {
      method: "POST",
      headers: {
        "api-key": "ss1bW3eunWJ2zBr6i2js7LR8fM12O6y2", // API key của bạn
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errorCode === 0) {
          const info = data.data[0]; // Dữ liệu trả về từ API
          const genderValue =
            info.sex === "NAM" ? true : info.sex === "NỮ" ? false : null;
          const formattedDob = formatDate(info.dob);
          // Cập nhật thông tin vào form
          setUserDetails({
            fullname: info.name,
            dob: formattedDob,
            gender: genderValue,
            residence: info.address,
            citizenIdentity: info.id,
          });
        } else {
          setError("Lỗi khi quét ảnh CCCD.");
        }
      })
      .catch((err) => {
        setError("Lỗi kết nối API: " + err.message);
      });
  };

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate("/login");
    }

    getUserDetails(accessToken);
  }, [navigate]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    // Chuẩn bị dữ liệu cần gửi
    const updatedData = {
      fullname: document.getElementById("fullname").value,
      email: document.getElementById("email_address").value,
      phone: document.getElementById("phone").value,
      residence: document.getElementById("address").value,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,
      citizenIdentity: document.getElementById("IdCard").value,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/obbm/users/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Cập nhật thông tin thành công!");
        console.log(data);
      } else {
        alert("Cập nhật không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã xảy ra lỗi trong quá trình cập nhật.");
    }
  };

  const handleGenderChange = (event) => {
    // Cập nhật userDetail.gender theo lựa chọn của người dùng
    const genderValue =
      event.target.value === "true"
        ? true
        : event.target.value === "false"
        ? false
        : null;
    setUserDetails({ ...userDetails, gender: genderValue });
  };

  const handleLogout = (event) => {
    // Clear all data in localStorage
    localStorage.clear();

    // Call your logout function if you have one
    logOut();

    // Redirect the user to the login page
    window.location.href = "/login";
  };

  return (
    <main style={{ marginTop: "50px" }}>
      {userDetails ? (
        <section
          className="section section-divider white account-section"
          id="blog"
          style={{ paddingTop: "60px", paddingBottom: "60px" }}
        >
          <div className="container pt-4">
            <p className="section-subtitle">Tài khoản</p>
            <div className="profile-container">
              <div className="profile-photo">
                <img src={userDetails.image} />
              </div>
              <p className="profile-name">{`${userDetails.fullname}`}</p>
              {/* <p className="join-date section-title">
              Registration Date: <span className="span">26/05/2024</span>
            </p> */}
            </div>

            <div className="container w-75">
              <form id="userInfoForm" className="footer-form form-account">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <p className="footer-list-title account-form-title">
                    Thông tin cá nhân
                  </p>
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
                    placeholder="Họ và tên"
                    className="input-field"
                    value={userDetails.fullname}
                    disabled
                  />

                  <input
                    type="text"
                    name="user_name"
                    id="user_name"
                    required
                    placeholder="UserName"
                    aria-label="UserName"
                    className="input-field"
                    value={userDetails.username}
                    disabled
                  />
                  <input
                    type="text"
                    id="IdCard"
                    name="IdCard"
                    placeholder="Căn cước công dân"
                    aria-label="IdCard"
                    className="input-field"
                    value={userDetails.citizenIdentity || ""}
                    disabled
                  />
                  <input
                    type="email"
                    name="email_address"
                    id="email_address"
                    required
                    placeholder="Email"
                    aria-label="Email"
                    className="input-field"
                    value={userDetails.email}
                    disabled
                  />
                  <input
                    type="text"
                    name="dob"
                    id="dob"
                    placeholder="Ngày sinh"
                    className="input-field"
                    value={userDetails.dob}
                    disabled
                  />
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    placeholder="Phone Number"
                    aria-label="Phone Number"
                    className={`input-field ${isEditing ? "highlight" : ""}`}
                    value={userDetails.phone || ""}
                    disabled={!isEditing}
                    onChange={(e) => {
                      // Regular expression to allow only digits and restrict the length to 10 digits
                      const phoneValue = e.target.value;
                      if (/^\d{0,10}$/.test(phoneValue)) {
                        // Allow only numbers and a max of 10 digits
                        setUserDetails({ ...userDetails, phone: phoneValue });
                      }
                    }}
                    pattern="\d{10}" // Optional, for additional HTML5 validation
                    title="Please enter a valid 10-digit phone number"
                  />
                  <select
                    name="gender"
                    aria-label="Total person"
                    id="gender"
                    style={{ height: "40px", color: "hsl(0deg 0% 24.88%)" }}
                    className="input-field"
                    value={userDetails.gender} // Đảm bảo giá trị của select phù hợp với state
                    
                    disabled
                  >
                    <option value="" disabled={false}>
                      -- Chọn giới tính --
                    </option>
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                    <option value="null">Khác</option>
                  </select>
                  <label
                    style={{
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      borderRadius: "3px",
                    }}
                    htmlFor="avatar-upload"
                    className="custom-file-upload btn btn-secondary"
                  >
                    Căn cước công dân
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload" // Make sure this matches the label's htmlFor
                    onChange={handleImageUpload}
                    style={{ display: "none" }} // Hide the input element
                  />

                  <input
                  style={{height:"40px"}}
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Địa chỉ"
                    className="input-field"
                    value={userDetails.residence}
                    disabled
                  />

                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="Selected"
                      style={{ maxWidth: "300px", marginTop: "10px" , marginLeft:"140px"}}
                    />
                  )}
                </div>

                <div className="input-wrapper">
                  <div className="input-wrapper" style={{ marginTop: "7px" }}>
                    <canvas id="canvas" style={{ display: "none" }}></canvas>
                    <div
                      id="result"
                      className="mt-3"
                      style={{ display: "none" }}
                    ></div>
                  </div>

                  <div className="input-wrapper"></div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="submit"
                    className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover"
                    style={{ margin: "10px auto" }}
                    onClick={handleUpdate}
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="edit-profile-btn navbar-link bi bi-pencil-square"
                    onClick={toggleEdit}
                  >
                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                  </button>
                </div>
              </form>
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <button
                onClick={handleLogout}
                className="d-flex align-items-center me-5 mb-2 btn btn-hover"
                style={{
                  fontSize: "14px",
                  margin: "10px auto",
                  marginTop: "10px",
                  borderRadius: "3px",
                }}
              >
                Đăng xuất
              </button>
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
