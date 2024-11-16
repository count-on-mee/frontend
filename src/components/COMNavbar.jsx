import { Link, useLocation } from 'react-router-dom';

const COMNavbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-[#FFFCF2]">
      <div className="max-w-screen-xl px-10 py-7 mx-auto">
        <div className="flex items-center">
          <ul className="flex flex-row font-mixed font-medium mt-0 space-x-40 rtl:space-x-reverse text-base">
            <li>
              <Link to="/com/itinerary">일정</Link>
            </li>
            <li>
              <Link to="/com/details">DETAILS</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default COMNavbar;
