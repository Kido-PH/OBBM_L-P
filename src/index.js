// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Thay đổi từ 'react-dom' sang 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import ContractGuest from "./views/Guest-Contract";
import Home from "./views/Home"; // Import Home component
import StepContext from "./StepContext";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/contract" element={<StepContext/>} />
      </Routes>

      <Footer />
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")); // Sử dụng createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
