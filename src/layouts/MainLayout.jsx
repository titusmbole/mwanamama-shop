// MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BannerCarousel from '../components/BannerCarousel';

const MainLayout = () => {
  const location = useLocation();
  
  // Only display banner on homepage
  const isHome = location.pathname === '/';
  
  return (
    <>
      <Header />
      
      {/* Main content wrapper with proper spacing for fixed header */}
      <div className="main-content-wrapper">
        {isHome && <BannerCarousel />}
        
        <main style={{ minHeight: '50vh' }}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </>
  );
};

export default MainLayout;