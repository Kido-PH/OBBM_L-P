// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Thay đổi từ 'react-dom' sang 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import StepContext from "./StepContext";
import GuestContractList from "./components/GuestContract/GuestContractList";
import GuestContractInfo from "./components/GuestContract/GuestContractInfo";
import Home from "./views/Home";
import Login from "./views/Login";
import Menu from "./views/Menu";
import Account from "./views/Account";
import DashboardPage from "./views/Admin-DashboardPage";
import ManageContracts from "./views/Admin-Contracts";
import ManageStockRequests from "./views/Admin-StockRequests";
import ServiceManager from "./views/Admin-Services";
import EventManager from "./views/Admin-Events";
import LocationManager from "./views/Admin-Location";
import AccountManager from "./views/Admin-Account";
import InvoiceManager from "./views/Admin-Invoices";
import AdminAnalytics from "./views/Admin-Analytics";
import AccessControl from "./views/Admin-AccessControl";

const App = () => {
  const location = useLocation();

  // Kiểm tra nếu trang không phải là admin hoặc các trang cần ẩn Header/Footer
  const shouldShowHeaderFooter =
    !location.pathname.startsWith("/admin") &&
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/resetpassword";

  return (
    <>
      {shouldShowHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contract" element={<StepContext />} />
        <Route path="/user/contract-list" element={<GuestContractList />} />
        <Route path="/contract/info/:id" element={<GuestContractInfo />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/account" element={<Account />} />   
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/resetpassword" element={<Login />} />
        <Route path="/admin/*" element={<DashboardPage />}>
          <Route path="ManageContracts" element={<ManageContracts />} />
          <Route path="ManageStockRequests" element={<ManageStockRequests />} />
          <Route path="ManageServices" element={<ServiceManager />} />
          <Route path="ManageEvents" element={<EventManager />} />
          <Route path="ManageLocation" element={<LocationManager />} />
          <Route path="ManageAccounts" element={<AccountManager />} />
          <Route path="ManageInvoice" element={<InvoiceManager />} />
          <Route path="DashboardAnalytics" element={<AdminAnalytics />} />
          <Route path="AccessControl" element={<AccessControl />} />
        </Route>
      </Routes>

      {shouldShowHeaderFooter && <Footer />}
    </>
  );
};

const RootApp = () => (
  <Router>
    <App />
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);