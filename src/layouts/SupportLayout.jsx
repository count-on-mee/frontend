import React from 'react';
import { Outlet } from 'react-router-dom';
import SupportNavbar from '../components/SupportNavbar';

const SupportLayout = () => {
  return (
    <div>
      <SupportNavbar />
      <div className="container mx-auto mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SupportLayout;
