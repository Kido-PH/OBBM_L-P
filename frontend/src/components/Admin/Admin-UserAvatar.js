import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Modal, Button, Input, message, Divider, Row, Col, Select } from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  PhoneOutlined,
  UserSwitchOutlined,
  EditOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { EmailOutlined } from "@mui/icons-material";

const AdminUserAvatar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    fullname: "",
    gender: null,
    residence: "",
    dob: "",
    email: "",
    phone: "",
    image: "",
    noPassword: false,
    citizenIdentity: "",
    roles: [],
  });
  const [editData, setEditData] = useState({});
  const navigate = useNavigate(); // Khai báo hook navigate

  // Fetch thông tin người dùng từ API
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token không tìm thấy trong localStorage.");
      }

      const response = await fetch("http://localhost:8080/obbm/users/myInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dữ liệu nè: ", data);

      // Cập nhật thông tin userData
      if (data.code === 1000) {
        const result = data.result;
        setUserData({
          userId: result.userId,
          username: result.username,
          fullname: result.fullname,
          dob: result.dob,
          email: result.email,
          phone: result.phone,
          image: result.image,
          password: result.noPassword,
          citizenIdentity: result.citizenIdentity,
          gender: result.gender,
          residence: result.residence,
          roles: result.roles || [],
        });
      } else {
        message.error("Không tải được dữ liệu.");
      }
    } catch (error) {
      message.error("Không tải được dữ liệu.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setEditData({
      fullname: userData.fullname,
      phone: userData.phone,
      dob: userData.dob,
      email: userData.email,
      gender: userData.gender,
      residence: userData.residence,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({}); //Reset data
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = userData.userId;
  
      if (!token) {
        throw new Error("Token không tồn tại trong sessionStorage.");
      }
  
      const formattedDob = new Date(editData.dob || userData.dob)
        .toISOString()
        .split("T")[0];
  
      // Chuẩn bị request body
      const requestBody = {
        fullname: editData.fullname || userData.fullname,
        gender: editData.gender === true ? 1 : 0, // Chuyển true => 1 (Nam), false => 0 (Nữ)
        residence: editData.residence || userData.residence,
        email: editData.email || userData.email,
        phone: editData.phone || userData.phone,
        image: editData.image || userData.image,
        citizenIdentity: userData.citizenIdentity,
        dob: formattedDob,
      };
  
      console.log("Request Body:", requestBody);
  
      const response = await fetch(
        `http://localhost:8080/obbm/users/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Phản hồi API:", data);
  
      if (response.ok) {
        message.success("Cập nhật thông tin thành công.");
        setUserData((prev) => ({
          ...prev,
          fullname: requestBody.fullname,
          dob: requestBody.dob,
          gender: requestBody.gender === 1, // Convert từ 1 thành true (Nam), 0 thành false (Nữ)
          residence: requestBody.residence,
          email: requestBody.email,
          image: requestBody.image,
          citizenIdentity: requestBody.citizenIdentity,
          phone: requestBody.phone,
        }));
        setIsEditing(false);
      } else {
        message.error("Không thể cập nhật thông tin.");
      }
    } catch (error) {
      message.error("Không thể cập nhật thông tin.");
    }
  };
  

  const handleInputChange = (e, field) => {
    setEditData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Hàm xử lý logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // Nếu không có token
      if(!token) {
        message.error("Không tìm thấy token.");
        return;
      }

      const response = await fetch("http://localhost:8080/obbm/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.ok) {
        // Xóa token và điều hướng tới trang đăng nhập
        localStorage.removeItem("accessToken");
        message.success("Đăng xuất thành công.");
        navigate("/login");
      } else {
        message.error("Đăng xuất thất bại.");
      }

    } catch (error) {
      message.error("Đã xảy ra lỗi khi đăng xuất.");
    }
  }

  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Cài đặt tài khoản",
            },
            { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
          ],
          onClick: (e) => {
            if (e.key === "settings") {
              setIsSettingsOpen(true);
            } else if (e.key === "logout") {
              localStorage.removeItem("accessToken");
              message.info("Đăng xuất thành công.");
              window.location.href = "/login";
            }
          },
        }}
        trigger={["click"]}
      >
        <Avatar
          size="default"
          src={userData?.image}
          alt="User Avatar"
          style={{
            cursor: "pointer",
            width: "50px",
            height: "50px",
          }}
        />
      </Dropdown>

      {/* Modal Account Settings */}
      <Modal
        title="Cài đặt tài khoản"
        open={isSettingsOpen}
        onCancel={() => setIsSettingsOpen(false)}
        footer={null}
        width={1000}  // Tăng độ rộng modal
      >
        <Divider />

        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
        >
          <Avatar
            size={64}
            src={userData?.image}
            icon={!userData.image && <UserOutlined />}
            style={{
              marginRight: 16,
              cursor: "pointer",
              width: "100px",
              height: "100px",
            }}
          />
          <div>
            <h1>{userData.fullname}</h1>
            <p style={{ color: "gray" }}>Thông tin tài khoản</p>
          </div>
        </div>

        {/* Form chỉnh sửa thông tin người dùng */}
        <div style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 10 }}>
                <span>
                  <UserSwitchOutlined /> Họ và tên:
                </span>
                {isEditing ? (
                  <Input
                    value={editData.fullname}
                    onChange={(e) => handleInputChange(e, "fullname")}
                    style={{ marginTop: 5 }}
                  />
                ) : (
                  <span style={{ marginLeft: 10 }}>{userData.fullname}</span>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 10 }}>
                <span>
                  <PhoneOutlined /> Số điện thoại:
                </span>
                {isEditing ? (
                  <Input
                    value={editData.phone}
                    onChange={(e) => handleInputChange(e, "phone")}
                    style={{ marginTop: 5 }}
                  />
                ) : (
                  <span style={{ marginLeft: 10 }}>{userData.phone}</span>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 10 }}>
                <span>
                  <SolutionOutlined /> Ngày tháng năm sinh:
                </span>
                {isEditing ? (
                  <Input
                    value={editData.dob}
                    onChange={(e) => handleInputChange(e, "dob")}
                    style={{ marginTop: 5 }}
                  />
                ) : (
                  <span style={{ marginLeft: 10 }}>{userData.dob}</span>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 10 }}>
                <span>
                  <EmailOutlined /> Email:
                </span>
                {isEditing ? (
                  <Input
                    value={editData.email}
                    onChange={(e) => handleInputChange(e, "email")}
                    style={{ marginTop: 5 }}
                  />
                ) : (
                  <span style={{ marginLeft: 10 }}>{userData.email}</span>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 10 }}>
                <span>
                  <UserOutlined /> Giới tính:
                </span>
                {isEditing ? (
                  <Select
                    value={editData.gender} 
                    onChange={(value) => handleInputChange({ target: { value } }, "gender")}
                    style={{ marginTop: 5 }}
                  >
                    <Select.Option value={true}>Nam</Select.Option>
                    <Select.Option value={false}>Nữ</Select.Option>
                  </Select>
                ) : (
                  <span style={{ marginLeft: 10 }}>{userData.gender === true ? "Nam" : "Nữ"}</span>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 10 }}>
                <span>
                  <SolutionOutlined /> Nơi cư trú:
                </span>
                {isEditing ? (
                  <Input
                    value={editData.residence}
                    onChange={(e) => handleInputChange(e, "residence")}
                    style={{ marginTop: 5 }}
                  />
                ) : (
                  <span style={{ marginLeft: 10 }}>{userData.residence}</span>
                )}
              </div>
            </Col>
          </Row>
        </div>

        {isEditing ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: 20,
            }}
          >
            <Button onClick={handleCancelEdit}>Hủy</Button>
            <Button type="primary" onClick={handleSaveEdit}>
              Lưu
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditClick}
            style={{ display: "block", margin: "0 auto" }}
          >
            Chỉnh sửa thông tin
          </Button>
        )}
      </Modal>
    </>
  );
};

export default AdminUserAvatar;
