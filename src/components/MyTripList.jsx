import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function MyTripList() {
  const navigate = useNavigate();
  const goBack = () => navigate('/map');
  const handleNext = () => navigate('/com/calendar');
  const [myTrips, setMyTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await fetch('http://localhost:8888/trips', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMyTrips(data);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#FFFCF2] font-mixed px-10 py-7">
      <div className="flex items-center justify-between p-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#252422"
          className="size-10 cursor-pointer"
          onClick={goBack}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        <h2 className="text-4xl font-semibold text-[#252422]">내 여행 일정</h2>
        <div className="size-10"></div>
      </div>

      <div
        className="overflow-y-auto rounded-lg mb-10"
        style={{ maxHeight: '400px' }}
      >
        {myTrips.length === 0 ? (
          <p className="text-center text-[#252422]">
            아직 생성된 여행이 없어요
          </p>
        ) : (
          <table className="w-full">
            <tbody className="text-[#252422]">
              {myTrips.map((myTrip, idx) => (
                <tr key={myTrip.tripId}>
                  <td className="border-b border-[#252422] bg-[#FFFCF2] px-5 py-5 text-base">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-full w-full rounded-full"
                          src={`https://loremflickr.com/100/100?random=${5 * idx}`}
                          alt={myTrip.title}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="whitespace-no-wrap">{myTrip.title}</p>
                        <p className="text-sm text-gray-500">
                          {myTrip.startDate} ~ {myTrip.endDate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#252422] bg-[#FFFCF2] px-5 py-5">
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          navigate(`/com/${myTrip.tripId}/itinerary`)
                        }
                        className={
                          'rounded-full px-5 py-2 text-base font-semibold transition-colors duration-200 ease-in-out bg-[#FFFCF2] border border-[#252422] text-[#252422] hover:bg-gray-200'
                        }
                      >
                        바로가기
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleNext}
          className="bg-[#EB5E28] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#D64E1E] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          새 여행 일정 만들기
        </button>
      </div>
    </div>
  );
}

function MyTripListPopup() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[#FFFCF2] opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] relative z-10 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <MyTripList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTripListPopup;
