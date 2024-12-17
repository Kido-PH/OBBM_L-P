import React, { useState, useEffect } from "react";
import "../assets/css/DashboardPage.css";
import "../assets/css/404error.css";
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
  AppstoreOutlined,
  ForkOutlined,
  BellOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { Col, Layout, Menu, Row, theme } from "antd";
import AdminUserAvatar from "components/Admin/Admin-UserAvatar";

const { Header, Sider, Content, Footer } = Layout;

function DashboardPage() {
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const siteLayoutStyle = { marginLeft: marginLeft };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userRole = localStorage.getItem("roles")
    ? JSON.parse(localStorage.getItem("roles")).name
    : null;

  const userPermissions = localStorage.getItem("roles")
    ? JSON.parse(localStorage.getItem("roles")).permissions
    : [];

  const menuItems = [
    {
      key: "1",
      icon: <BarChartOutlined />,
      label: "TỔNG QUAN",
      path: "/admin/thongke",
      requiredPermission: "READ_DASHBOARD",
    },
    {
      key: "2",
      icon: <FileDoneOutlined />,
      label: "HỢP ĐỒNG",
      path: "/admin/ManageContracts",
      requiredPermission: "READ_CONTRACT",
    },
    {
      key: "3",
      icon: <UnorderedListOutlined />,
      label: "DANH MỤC MÓN ĂN",
      path: "/admin/ManageCategoryDish",
      requiredPermission: "READ_MENU",
    },
    {
      key: "4",
      icon: <ForkOutlined />,
      label: "MÓN ĂN",
      path: "/admin/ManageDish",
      requiredPermission: "READ_DISH",
    },
    {
      key: "5",
      icon: <CustomerServiceOutlined />,
      label: "DỊCH VỤ",
      path: "/admin/ManageServices",
      requiredPermission: "READ_SERVICES",
    },
    {
      key: "6",
      icon: <StarOutlined />,
      label: "SỰ KIỆN",
      path: "/admin/ManageEvents",
      requiredPermission: "READ_EVENT",
    },
    {
      key: "7",
      icon: <EnvironmentOutlined />,
      label: "ĐỊA ĐIỂM",
      path: "/admin/ManageLocation",
      requiredPermission: "READ_LOCATION",
    },
    {
      key: "9",
      icon: <AppstoreOutlined />,
      label: "THỰC ĐƠN",
      path: "/admin/MenuManagement",
      requiredPermission: "READ_MENU",
    },
    {
      key: "10",
      icon: <ShoppingCartOutlined />,
      label: "NGUYÊN LIỆU",
      path: "/admin/ManagerIngredient",
      requiredPermission: "READ_INGREDIENT",
    },
    {
      key: "8",
      icon: <UsergroupAddOutlined />,
      label: "KHÁCH HÀNG",
      path: "/admin/ManageAccounts",
      requiredPermission: "READ_ACCOUNTS",
    },
    ...(userRole === "ADMIN"
      ? [
          {
            key: "11",
            icon: <SisternodeOutlined />,
            label: "PHÂN QUYỀN",
            path: "/admin/AccessControl",
            requiredPermission: "READ_ROLE",
          },
        ]
      : []),
  ];

  const hasPermission = (permissionName) => {
    if (userRole === "ADMIN") {
      return true; // ADMIN có quyền truy cập tất cả
    }
    return userPermissions.some(permission => permission.name === permissionName);
  };
  
  // Lọc menu dựa trên quyền
  const filteredMenuItems = menuItems.filter(item => 
    userRole === "ADMIN" || hasPermission(item.requiredPermission)
  );

  useEffect(() => {
    const currentPath = window.location.pathname;

    // Check if the user has permission for the current path
    const menuItem = menuItems.find(item => item.path === currentPath);
    if (menuItem && !hasPermission(menuItem.requiredPermission)) {
      // If no permission, navigate to 404 page
      navigate("/error");
    }
  }, [navigate, userPermissions]);

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
          items={filteredMenuItems.map((item) => ({
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
            left: marginLeft + 2,
            top: 0,
            position: "fixed",
            width: `calc(100% - ${marginLeft + 6}px)`,
            height: 65,
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
            marginTop: 66,
            padding: 10,
            minHeight: "100%",
            background: colorBgContainer,
            borderRadius: 0,
            overflow: "auto",
          }}
        >
          <div className="content-panel">
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
            bottom: "0",
            width: `calc(100% - ${marginLeft + 32}px)`,
            left: marginLeft + 16,
            transition: "bottom 0.3s ease",
          }}
        >
          OBBM ©{new Date().getFullYear()} Created by L&P
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DashboardPage;
