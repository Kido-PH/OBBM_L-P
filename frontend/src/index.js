// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Thay đổi từ 'react-dom' sang 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import ContractGuest from './views/Contract-guest';
import Home from './views/Home';
import Login from './views/Login';
import Menu from './views/Menu';
import Account from './views/Account';

const App = () => {
  const location = useLocation();

  return (
    <>
      
      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/resetpassword' && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contract" element={<ContractGuest />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/resetpassword" element={<Login />} />
      </Routes>

      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/resetpassword' && <Footer />}
    </>
  );
};

const RootApp = () => (
  <Router>
    <App />
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
