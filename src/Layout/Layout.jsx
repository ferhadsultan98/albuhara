// MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const MainLayout = () => {
  return (
    <div className="mainLayout">
      <Header />
      <main className="mainContent">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;