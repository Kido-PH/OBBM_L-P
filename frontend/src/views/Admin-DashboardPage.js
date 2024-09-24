import React, { useState } from "react";
import "../assets/css/DashboardPage.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  // UploadOutlined,
  UserOutlined,
  ContactsOutlined,
  LogoutOutlined,
  ShopOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  UsergroupAddOutlined,
  // PieChartOutlined,
  StarOutlined,
  BarChartOutlined,
  BellOutlined,
  SisternodeOutlined,
} from "@ant-design/icons";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Avatar, Col, Layout, Menu, Row, theme } from "antd";
import { MdFormatListBulleted, MdHome, MdRequestPage } from "react-icons/md";

// import Home from "../components/home/Home";
// import ListContracts from "./../components/contracts/ListContracts";
// import AddorEditAccount from "./../components/accounts/AddorEditAccount";
// import AddorEditStockRequest from "../components/stockrequests/AddorEditStockRequest";
// import AddorEditServices from "../components/services/AddorEditServices";
// import AddorEditEvents from "../components/events/AddorEditEvents";
// import AddorEditLocation from "../components/locations/AddorEditLocation";
// import AddorEditInvoices from "../components/invoices/AddorEditInvoices";
import ManageContracts from "./Admin-Contracts";
import ManageStockRequests from "./Admin-StockRequests";
const { Header, Sider, Content, Footer } = Layout;

function DashboardPage() {
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const siteLayoutStyle = { marginLeft: marginLeft };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
          <h2>{collapsed ? "OM" : "OBBM"}</h2>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <MdHome />,
              label: "Home",
              onClick: () => navigate("/"),
            },
            // {
            //   key: "2",
            //   icon: <ContactsOutlined />,
            //   label: "Contracts",
            //   children: [
            //     // {
            //     // key: "21",
            //     //  icon: <MdAddCircleOutline />,
            //     //  label: "Add Contracts",
            //     // onClick: () => navigate("/contracts/add"),
            //     // },
            //     {
            //       key: "21",
            //       icon: <MdFormatListBulleted />,
            //       label: "List Contracts",
            //       onClick: () => navigate("/contracts/list"),
            //     },
            //   ],
            // },
            {
              key: "3",
              icon: <ShopOutlined />,
              label: "Contracts",
              onClick: () => navigate("/admin/ManageContracts"),
            },
            {
              key: "4",
              icon: <CustomerServiceOutlined />,
              label: "Services",
              onClick: () => navigate("/admin/ManageServices"),
            },
            {
              key: "5",
              icon: <StarOutlined />,
              label: "Events",
              onClick: () => navigate("/admin/ManageEvents"),
            },
            {
              key: "6",
              icon: <EnvironmentOutlined />,
              label: "Location",
              onClick: () => navigate("/admin/ManageLocation"),
            },
            {
              key: "7",
              icon: <UsergroupAddOutlined />,
              label: "Customer Accounts",
              onClick: () => navigate("/admin/ManageAccounts"),
            },
            {
              key: "8",
              icon: <MdRequestPage />,
              label: "Invoices",
              onClick: () => navigate("/admin/ManageInvoice"),
            },
            {
              key: "9",
              icon: <BellOutlined />,
              label: "Stock Requests",
              onClick: () => navigate("/admin/ManageStockRequests"),
            },
            {
              key: "10",
              icon: <BarChartOutlined />,
              label: "Analytics Dashboard",
              onClick: () => navigate("/admin/DashboardAnalytics"),
            },
            {
              key: "11",
              icon: <SisternodeOutlined />,
              label: "Access Control",
              onClick: () => navigate("/admin/AccessControl"),
            },
            {
              key: "12",
              icon: <LogoutOutlined />,
              label: "Logout",
            },  
          ]}
        />
      </Sider>
      <Layout style={siteLayoutStyle}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            right: 16,
            left: marginLeft + 16,
            top: 0,
            position: "fixed",
            height: 70,
          }}
        >
          <Row>
            <Col md={21}>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
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
              <div>
                <Avatar size="default" icon={<UserOutlined />}></Avatar> Do Minh
                Phi
              </div>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "80px 24px 16px 24px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="content-panel">
            <Routes>
              <Route
                path="/admin/ManageContracts"
                element={<ManageContracts />}
              ></Route>
              <Route
                path="/admin/ManageStockRequests"
                element={<ManageStockRequests />}
              ></Route>

              {/* Các Route khác */}
            </Routes>
            <Outlet></Outlet>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",           
          }}
        >
          OBBM ©{new Date().getFullYear()} Created by L&P
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DashboardPage;