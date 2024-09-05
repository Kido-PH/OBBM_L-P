// src/components/Home.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Home-header';
import Footer from './components/Home-footer';
import Content from './components/Content';
import Login from './components/Login';
import Account from './components/Account';
import Menu from './components/Menu';
import Pay from './components/pay';
import OrderTracking from './components/odertracking';

const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /><Content /><Footer /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<><Header /><Account /><Footer /></>} />
        <Route path="/menu" element={<><Header /><Menu /><Footer /></>} />
        <Route path="/pay" element={<><Header /><Pay /><Footer /></>} />
        <Route path="/order-tracking" element={<><Header /><OrderTracking /><Footer /></>} />
      </Routes>
    </Router>
  );
};

export default Home;
