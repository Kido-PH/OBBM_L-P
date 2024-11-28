import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Modal, Button, Input, message, Divider } from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  PhoneOutlined,
  UserSwitchOutlined,
  EditOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const AdminUserAvatar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    fullname: "",
    dob: "",
    email: "",
    phone: "",
    image: "",
    noPassword: false,
    citizenIdentity: "",
    roles: [],
  });
  const [editData, setEditData] = useState({});

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

      // Kiểm tra nếu không có `token`
      if (!token) {
        throw new Error("Token không tồn tại trong sessionStorage.");
      }

      const formattedDob = new Date(editData.dob || userData.dob)
        .toISOString()
        .split("T")[0];

      // Chuẩn bị `request body`
      const requestBody = {
        fullname: editData.fullname || userData.fullname,
        dob: formattedDob,
        roles: userData.roles.map((role) => role.name),
        password: userData.noPassword || "admin",
      };

      console.log("Request Body:", requestBody);

      const response = await fetch(
        `http://localhost:8080/obbm/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Kiểm tra trạng thái của phản hồi
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Phản hồi API:", data);

      // Nếu phản hồi thành công
      if (response.ok) {
        message.success("Cập nhật thông tin thành công.");
        setUserData((prev) => ({
          ...prev,
          fullname: requestBody.fullname,
          dob: requestBody.dob,
          password: requestBody.password,
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

  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Account Settings",
            },
            { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
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
              width: "50px",
              height: "50px",
            }}
          />
          <div>
            <h3>{userData.fullname}</h3>
            <p style={{ color: "gray" }}>Thông tin tài khoản</p>
          </div>
        </div>

        {/* Form chỉnh sửa thông tin người dùng */}
        <div style={{ marginBottom: 20 }}>
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
          <div style={{ marginBottom: 10 }}>
            <span>
              <PhoneOutlined /> Số điện thoại:
            </span>
            {isEditing ? (
              <Input
                value={editData.phone}
                onChange={(e) => handleInputChange(e, "phone")}
                style={{ marginTop: 5 }}
                disabled
              />
            ) : (
              <span style={{ marginLeft: 10 }}>{userData.phone}</span>
            )}
          </div>
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
