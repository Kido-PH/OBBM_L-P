import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Divider, Select } from "antd";
import toast from "react-hot-toast";
import { FormControl } from "react-bootstrap";

// Modal style
const modalStyle = {
  width: "490px",
  margin: "auto",
  mt: "8%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AddUserModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    dob: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // Vai trò hiện tại
  const [roles, setRoles] = useState([]); // Dữ liệu vai trò từ API
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Danh sách quyền

  useEffect(() => {
    fetchRoles();
  }, []);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý việc gửi biểu mẫu
  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ username: "", password: "", fullname: "", dob: "" });
    onClose();
  };

  const hienThiMatKhau = () => {
    setShowPassword(!showPassword);
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8080/obbm/roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();

        // Lọc ADMIN và các vai trò liên quan đến STAFF
        const fillterRoles = data?.result?.filter((role) =>
          role.name.startsWith("STAFF")
        );

        setRoles(fillterRoles); // Lưu danh sách vai trò
      } else {
        console.error("Failed to fetch roles:", response.status);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Khi chọn vai trò
  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);

    // Lấy danh sách quyền của vai trò được chọn
    const selectedRole = roles.find((role) => role.name === roleName);

    // Cập nhật danh sách quyền đã chọn từ vai trò
    if (selectedRole && selectedRole.permissions) {
      setSelectedPermissions(selectedRole.permissions); // Gán toàn bộ quyền của vai trò
    } else {
      setSelectedPermissions([]); // Nếu không có quyền nào, reset
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Thêm người dùng mới
        </Typography>

        <Divider></Divider>

        {/* Tên đăng nhập */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            Tên đăng nhập{" "}
            <span style={{ color: "red", marginLeft: "4px" }}>*</span>
          </Typography>
          <TextField
            sx={{
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "1.2rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "1.2rem",
              },
            }}
            fullWidth
            variant="outlined"
            name="username"
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
          />
        </Box>

        {/* Mật khẩu */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            Mật khẩu <span style={{ color: "red", marginLeft: "4px" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="password"
            placeholder="Nhập mật khẩu"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={hienThiMatKhau}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "1.2rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "1.2rem",
              },
            }}
          />
        </Box>

        {/* Họ và tên */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            Họ và tên <span style={{ color: "red", marginLeft: "4px" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="fullname"
            placeholder="Nhập họ và tên"
            value={formData.fullname}
            onChange={handleChange}
            sx={{
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "1.2rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "1.2rem",
              },
            }}
          />
        </Box>

        {/* Ngày sinh */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            Ngày sinh <span style={{ color: "red", marginLeft: "4px" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            name="dob"
            placeholder="YYYY-MM-DD"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            sx={{
              height: "40px",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "1.2rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "1.2rem",
              },
            }}
          />
        </Box>

        <Divider></Divider>

        {/* Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "10px 20px",
              borderRadius: "8px",
              boxShadow: 3,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Thêm
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "10px 20px",
              borderRadius: "8px",
              boxShadow: 3,
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const AddUserStaff = ({ onUserAdded }) => {
  const [open, setOpen] = useState(false);

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle API submission
  const handleAddUser = async (formData) => {
    try {
      // Chuẩn hóa ngày tháng năm
      if (formData) {
        const date = new Date(formData.dob);
        formData.dob = date.toISOString().split("T")[0]; // Format thành YYYY-MM-DD
      }

      console.log("Dữ liệu gửi đi:", formData); // Kiểm tra dữ liệu

      const response = await fetch(`http://localhost:8080/obbm/users/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const responseBody = await response.json();

      if (response.ok) {
        // console.log("User added successfully:", responseBody);
        onUserAdded(responseBody.result); // Cập nhật danh sách người dùng
        toast.success("Người dùng mới đã được thêm thành công!");
      } else {
        console.error("Failed to add user:", response.status, responseBody);
        toast.error(
          `Không thể thêm người dùng. Lỗi: ${
            responseBody.message || response.status
          }`
        );
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontSize: "1.2rem",
          textTransform: "none",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
        onClick={handleOpen}
      >
        + Thêm người dùng
      </Button>
      <AddUserModal
        open={open}
        onClose={handleClose}
        onSubmit={handleAddUser}
      />
    </Box>
  );
};

export default AddUserStaff;
