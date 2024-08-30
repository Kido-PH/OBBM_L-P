// src/components/Home.js
import React from 'react';
import Content from './components/Content';

import Header from './components/Home-header';

import Footer from './components/Home-footer';

const Home = () => {
  return (
    <React.Fragment>
      <Header />
      <Content />
      <Footer />
    </React.Fragment>
  );
};

export default Home;
