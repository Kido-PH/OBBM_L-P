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
import Swal from "sweetalert2";
const AccountSection = () => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullname: "",
    gender: null,
  });
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const [isEditing, setIsEditing] = useState(false);
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

  

  const handleFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();

      img.onload = function () {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        const qrCodeImage = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(
          qrCodeImage.data,
          qrCodeImage.width,
          qrCodeImage.height
        );

        if (code) {
          console.log(`Thông tin từ mã QR: ${code.data}`);

          const [IdCard, userInfo] = code.data.split("||"); // Tách phần trước và phần sau dấu '||'
          const [fullname, birthdate, gender, address] = userInfo.split("|");

          console.log("ID Card:", IdCard);
          console.log("Full name:", fullname);
          console.log("Birthdate:", birthdate);
          console.log("Gender:", gender);
          console.log("Address:", address);

          // Cập nhật giá trị vào form
          document.getElementById("IdCard").value = IdCard;
          document.getElementById("fullname").value = fullname;

          // Định dạng lại ngày sinh
          const formattedBirthdate = `${birthdate.slice(4)}-${birthdate.slice(
            2,
            4
          )}-${birthdate.slice(0, 2)}`;
          document.getElementById("birthdate").value = formattedBirthdate;
          document.getElementById("address").value = address;

          // Xử lý gender và gán giá trị boolean
          const genderValue =
            gender === "Nam" ? true : gender === "Nữ" ? false : null;

          // Cập nhật giá trị vào trường select (Nam -> true, Nữ -> false)
          const genderSelect = document.getElementById("gender");
          genderSelect.value = genderValue;

          // Tại đây bạn có thể gọi API để gửi userData vào backend hoặc CSDL
        } else {
          console.log("Không tìm thấy mã QR.");
        }
      };

      img.src = event.target.result;
      setImageSrc(event.target.result); // Set the image source (nếu cần hiển thị ảnh)
    };

    reader.readAsDataURL(file);
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
    const fileInput = document.getElementById("avatar-upload");
    if (fileInput) {
      fileInput.addEventListener("change", handleFile);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (fileInput) {
        fileInput.removeEventListener("change", handleFile);
      }
    };
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();

    // Chuẩn bị dữ liệu cần gửi
    const updatedData = {
      fullname: document.getElementById("fullname").value,
      email: document.getElementById("email_address").value,
      phone: document.getElementById("phone").value,
      residence: document.getElementById("address").value,
      dob: document.getElementById("birthdate").value,
      gender: document.getElementById("gender").value,
      citizenIdentity: document.getElementById("IdCard").value,
    };
    console.log("data gửi đi API:", updatedData);

    try {
      const response = await fetch(
        `http://localhost:8080/obbm/users/user/${userDetails.userId}`,
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
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật thông tin thành công",
          timer: 2000,
          showConfirmButton: true,
        });
        console.log(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Lỗi không rõ",
          timer: 2000,
          showConfirmButton: true,
        });
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
                </div>

                <div className="input-wrapper">
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    placeholder="Your Name"
                    aria-label="Full Name:"
                    className="input-field"
                    value={userDetails.fullname || ""}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
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
                    value={userDetails.residence || ""}
                    disabled={!isEditing}
                  />
                  <input
                    type="date"
                    name="birthdate"
                    id="birthdate"
                    placeholder="Birthdate"
                    aria-label="Date of Birth"
                    className="input-field"
                    value={userDetails.dob || ""}
                    disabled={!isEditing}
                  />
                </div>

                <div className="input-wrapper">
                  <select
                    name="gender"
                    aria-label="Total person"
                    id="gender"
                    style={{ height: "40px" }}
                    className="input-field"
                    value={
                      userDetails.gender === null
                        ? ""
                        : userDetails.gender.toString()
                    } // Đảm bảo giá trị của select phù hợp với state
                  >
                    <option value="" disabled={false}>
                      -- Chọn giới tính --
                    </option>
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                    <option value="null">Khác</option>
                  </select>

                  <div className="input-wrapper" style={{ marginTop: "7px" }}>
                    <div className="upload-wrapper">
                      <label
                        style={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          borderRadius: "3px",
                        }}
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
                        style={{ display: "none" }}
                      />
                    </div>

                    {imageSrc && (
                      <img
                        src={imageSrc}
                        alt="Selected"
                        style={{ maxWidth: "300px", marginTop: "10px" }}
                      />
                    )}

                    <canvas id="canvas" style={{ display: "none" }}></canvas>
                    <div
                      id="result"
                      className="mt-3"
                      style={{ display: "none" }}
                    ></div>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="IdCard"
                      name="IdCard"
                      placeholder="Căn cước công dân"
                      aria-label="IdCard"
                      className="input-field"
                      value={userDetails.citizenIdentity || ""}
                      disabled={!isEditing}
                    />
                  </div>
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
