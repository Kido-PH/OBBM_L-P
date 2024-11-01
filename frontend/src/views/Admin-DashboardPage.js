import React, { useState } from "react";
import "../assets/css/DashboardPage.css";
import {
  UserOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  UsergroupAddOutlined,
  StarOutlined,
  BarChartOutlined,
  BellOutlined,
  SisternodeOutlined,
  MenuOutlined,
  FileDoneOutlined,
  UnorderedListOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Avatar, Col, Layout, Menu, Row, theme } from "antd";
import { MdHome } from "react-icons/md";
import ManageContracts from "../components/Admin/Admin-Contracts";
import ManageStockRequests from "../components/Admin/Admin-StockRequests";

const { Header, Sider, Content, Footer } = Layout;

function DashboardPage() {
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const siteLayoutStyle = { marginLeft: marginLeft };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    { key: "1", icon: <MdHome />, label: "HOME", path: "/" },
    {
      key: "2",
      icon: <FileDoneOutlined /> ,
      label: "CONTRACTS",
      path: "/admin/ManageContracts",
    },

    {
      key: "3",
      icon: <UnorderedListOutlined />,
      label: "CATEGORY DISH",
      path: "/admin/ManageCategoryDish",
    },

    {
      key: "4",
      icon: <CoffeeOutlined />,
      label: "DISH",
      path: "/admin/ManageDish",
    },

    {
      key: "5",
      icon: <CustomerServiceOutlined />,
      label: "SERVICES",
      path: "/admin/ManageServices",
    },
    {
      key: "6",
      icon: <StarOutlined />,
      label: "EVENTS",
      path: "/admin/ManageEvents",
    },
    {
      key: "7",
      icon: <EnvironmentOutlined />,
      label: "LOCATION",
      path: "/admin/ManageLocation",
    },
    {
      key: "8",
      icon: <UsergroupAddOutlined />,
      label: "ACCOUNTS",
      path: "/admin/ManageAccounts",
    },
    {
      key: "9",
      icon: <BellOutlined />,
      label: "STOCK REQUESTS",
      path: "/admin/ManageStockRequests",
    },
    {
      key: "10",
      icon: <BarChartOutlined />,
      label: "ANLYTICS",
      path: "/admin/DashboardAnalytics",
    },
    {
      key: "11",
      icon: <SisternodeOutlined />,
      label: "ACCESS CONTROL",
      path: "/admin/AccessControl",
    },
    { key: "12", icon: <LogoutOutlined />, label: "LOGOUT", path: "/login" },
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
              {React.createElement(
                collapsed ? MenuOutlined : MenuOutlined,
                {
                  className: "trigger",
                  onClick: () => {
                    const sts = !collapsed;
                    setCollapsed(sts);
                    setMarginLeft(sts ? 80 : 200);
                  },
                }
              )}
            </Col>
            <Col md={3}>
              <div style={{ paddingRight: 16, textAlign: "right" }}>
                <Avatar size="default" icon={<UserOutlined />}></Avatar> Admin
              </div>
            </Col>
          </Row>
        </Header>

        {/* Content */}
        <Content
          style={{
            marginTop: 65 /* Đẩy nội dung xuống dưới Header */,
            padding: 24 /* Padding để tạo khoảng cách */,
            minHeight: "100%" /* Chiếm toàn bộ chiều cao còn lại trừ Header và Footer */,
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
              <Route
                path="/admin/ManageStockRequests"
                element={<ManageStockRequests />}
              />
              {/* Các Route khác */}
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
            height: 65 /* Chiều cao cố định của Footer */,
            background: colorBgContainer /* Màu nền nhẹ cho Footer */,
            position: "fixed" /* Cố định Footer */,
            bottom: 0,
            width: `calc(100% - ${
              marginLeft + 32
            }px)` /* Đảm bảo căn giữa với phần content */,
            left: marginLeft + 16,
          }}
        >
          OBBM ©{new Date().getFullYear()} Created by L&P
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DashboardPage;