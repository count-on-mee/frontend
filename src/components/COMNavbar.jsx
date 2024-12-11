import { Link, useLocation, useParams } from 'react-router-dom';

const COMNavbar = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const basePath = tripId ? `/com/${tripId}` : '/com';

  return (
    <nav className="bg-[#FFFCF2]">
      <div className="max-w-screen-xl px-10 py-7 mx-auto">
        <div className="flex items-center">
          <ul className="flex flex-row font-mixed font-medium mt-0 space-x-40 rtl:space-x-reverse text-base">
            <li>
              <Link
                to={`${basePath}/itinerary`}
                className={
                  location.pathname.endsWith('/itinerary') ? 'active' : ''
                }
              >
                Itinerary
              </Link>
            </li>
            <li>
              <Link
                to={`${basePath}/details`}
                className={
                  location.pathname.endsWith('/details') ? 'active' : ''
                }
              >
                Details
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default COMNavbar;
