import { Outlet } from 'react-router-dom';
import SupportNavbar from '../components/SupportNavbar';
import Footer from '../components/Footer';

const SupportLayout = () => {
  return (
    <div className="w-screen min-h-screen bg-[#FFFCF2]">
      <SupportNavbar />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default SupportLayout;
