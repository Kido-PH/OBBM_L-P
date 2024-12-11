import React, { useState, useEffect } from "react";
import "../assets/css/DashboardPage.css";
import {
  CustomerServiceOutlined,
  EnvironmentOutlined,
  UsergroupAddOutlined,
  StarOutlined,
  BarChartOutlined,
  SisternodeOutlined,
  MenuOutlined,
  FileDoneOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ForkOutlined,
} from "@ant-design/icons";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Col, Layout, Menu, Row, theme } from "antd";
import ManageContracts from "../components/Admin/Admin-Contracts";
import AdminUserAvatar from "components/Admin/Admin-UserAvatar";

const { Header, Sider, Content, Footer } = Layout;

function DashboardPage() {
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false); // Trạng thái hiển thị Footer
  const navigate = useNavigate();
  const siteLayoutStyle = { marginLeft: marginLeft };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

<<<<<<< HEAD
  // Xử lý khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Nếu cuộn xuống hơn 100px
        setFooterVisible(true); // Hiển thị Footer
      } else {
        setFooterVisible(false); // Ẩn Footer khi cuộn lên
      }
    };

    // Thêm sự kiện scroll
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
=======
  const userRole = localStorage.getItem("roles") ? JSON.parse(localStorage.getItem("roles")).name : null;
>>>>>>> main

  const menuItems = [

<<<<<<< HEAD
    {
      key: "3",
      icon: <UnorderedListOutlined />,
      label: "DANH MỤC",
      path: "/admin/ManageCategoryDish",
    },

    {
      key: "4",
      icon: <ForkOutlined />,
      label: "MÓN ĂN",
      path: "/admin/ManageDish",
    },

    {
      key: "5",
      icon: <CustomerServiceOutlined />,
      label: "DỊCH VỤ",
      path: "/admin/ManageServices",
    },
    {
      key: "6",
      icon: <StarOutlined />,
      label: "SỰ KIỆN",
      path: "/admin/ManageEvents",
    },
    {
      key: "7",
      icon: <EnvironmentOutlined />,
      label: "ĐỊA ĐIỂM",
      path: "/admin/ManageLocation",
    },
    {
      key: "8",
      icon: <UsergroupAddOutlined />,
      label: "KHÁCH HÀNG",
      path: "/admin/ManageAccounts",
    },
    {
      key: "9",
      icon: <AppstoreOutlined />,
      label: "THỰC ĐƠN",
      path: "/admin/MenuManagement",
    },
    {
      key: "10",
      icon: <ShoppingCartOutlined  />,
      label: "NGUYÊN LIỆU",
      path: "/admin/ManagerIngredient",
    },
    {
      key: "11",
      icon: <SisternodeOutlined />,
      label: "PHÂN QUYỀN",
      path: "/admin/AccessControl",
    },
=======

    { key: "1", icon: <BarChartOutlined />, label: "TỔNG QUAN", path: "/admin" },
    { key: "2", icon: <FileDoneOutlined />, label: "HỢP ĐỒNG", path: "/admin/ManageContracts" },
    { key: "3", icon: <UnorderedListOutlined />, label: "DANH MỤC MÓN ĂN", path: "/admin/ManageCategoryDish" },
    { key: "4", icon: <CoffeeOutlined />, label: "MÓN ĂN", path: "/admin/ManageDish" },
    { key: "5", icon: <CustomerServiceOutlined />, label: "DỊCH VỤ", path: "/admin/ManageServices" },
    { key: "6", icon: <StarOutlined />, label: "SỰ KIỆN", path: "/admin/ManageEvents" },
    { key: "7", icon: <EnvironmentOutlined />, label: "ĐỊA ĐIỂM", path: "/admin/ManageLocation" },
    // Các mục chỉ dành cho ADMIN
    
    { key: "9", icon: <MenuOutlined />, label: "THỰC ĐƠN", path: "/admin/MenuManagement" },
    { key: "10", icon: <BellOutlined />, label: "NGUYÊN LIỆU", path: "/admin/ManagerIngredient" },
    ...(userRole === "ADMIN"
      ? [
          { key: "8", icon: <UsergroupAddOutlined />, label: "KHÁCH HÀNG", path: "/admin/ManageAccounts" },
          { key: "11", icon: <SisternodeOutlined />, label: "PHÂN QUYỀN", path: "/admin/AccessControl" },
        ]
      : []),
    { key: "12", icon: <LogoutOutlined />, label: "ĐĂNG XUẤT", onclick: handleLogout },
    
>>>>>>> main
  ];
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo">
          <h2>{collapsed ? "OM." : "OBBM."}</h2>
        </div>

        <Menu
          style={{ fontWeight: "bold", fontSize: "12px" }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.path),
          }))}
        />
      </Sider>
      <Layout style={siteLayoutStyle}>
        {/* Header */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            left: marginLeft + 2 /* Đảm bảo trừ đi phần sidebar */,
            top: 0,
            position: "fixed",
            width: `calc(100% - ${
              marginLeft + 6
            }px)` /* Trừ khoảng cách cho sidebar */,
            height: 65,
            zIndex: 1000 /* Đảm bảo Header luôn nằm trên cùng */,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" /* Bóng đổ nhẹ */,
          }}
        >
          <Row>
            <Col md={21}>
              {React.createElement(collapsed ? MenuOutlined : MenuOutlined, {
                className: "trigger",
                onClick: () => {
                  const sts = !collapsed;
                  setCollapsed(sts);
                  setMarginLeft(sts ? 80 : 200);
                },
              })}
            </Col>
            <Col
              md={3}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div style={{ paddingRight: 16 }}>
                <AdminUserAvatar />
              </div>
            </Col>
          </Row>
        </Header>

        {/* Content */}
        <Content
          style={{
            marginTop: 66 /* Đẩy nội dung xuống dưới Header */,
            padding: 10 /* Padding để tạo khoảng cách */,
            minHeight:
              "100%" /* Chiếm toàn bộ chiều cao còn lại trừ Header và Footer */,
            background: colorBgContainer,
            borderRadius: 0,
            overflow: "auto" /* Đảm bảo cuộn khi nội dung dài */,
          }}
        >
          <div className="content-panel">
            <Routes>
              <Route
                path="/admin/ManageContracts"
                element={<ManageContracts />}
              />
            </Routes>
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: "center",
            fontFamily: "circular std book, sans-serif",
            color: "#858796",
            height: "0px",
            background: "#f0f2f5",
            position: "fixed",
            bottom: footerVisible ? "0" : "-60px", // Chỉnh sửa vị trí của Footer
            width: `calc(100% - ${marginLeft + 32}px)`,
            left: marginLeft + 16,
            transition: "bottom 0.3s ease", // Thêm hiệu ứng chuyển động mượt mà khi Footer xuất hiện/ẩn
          }}
        >
          OBBM ©{new Date().getFullYear()} Created by L&P
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DashboardPage;
