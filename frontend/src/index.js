// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Thay đổi từ 'react-dom' sang 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import ContractGuest from "./views/Contract-guest";
import Home from "./views/Home"; // Import Home component
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
const LayoutWithHeaderFooter = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
const App = () => {
  
  return (
    <Router>
      <Routes>
        {/* Các route có header và footer */}
        <Route element={<LayoutWithHeaderFooter />}>
          <Route path="/" element={<Home />} />
          <Route path="/contract" element={<ContractGuest />} />
        </Route>

        {/* Route admin không có header và footer */}
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
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      ;
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")); // Sử dụng createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);