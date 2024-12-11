import React from 'react';
import { Outlet } from 'react-router-dom';
import SupportNavbar from '../components/SupportNavbar';
import Footer from '../components/Footer';

const SupportLayout = () => {
  return (
    <div>
      <SupportNavbar />
      <div className=" mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default SupportLayout;
