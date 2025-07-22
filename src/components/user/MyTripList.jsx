import { getRecoil } from "recoil-nexus";
import authAtom from "../../recoil/auth";
import api from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function MyTripList() {
  const [tripList, setTripList] = useState([]);
  const navigate = useNavigate();
  const fetchTripList = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.get('/trips', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      // console.log(data);
      setTripList(data);
    } catch (error) {
      console.error('Failed to fetch trip list:', error);
    }
  }
  const deleteTripList = async (event, tripId) => {
    event.stopPropagation();
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;  // 취소 누르면 삭제 취소
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.delete(`/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Failed to delete trip list:', error);
    }
  }
  useEffect(() => {
    fetchTripList();
  }, [tripList]) 
  return(
    <div>
      <div className="px-3 py-2 mt-5 mx-auto font-mixed text-2xl text-center text-shadow">TRIP LIST</div>
      <div>
        {tripList.map((trip, index) =>
          <div key={trip.tripId} className="flex items-center justify-between bg-background-gray my-2 py-2 rounded-2xl box-shadow mx-5">
            <div className="grid grid-cols-[1fr_2fr_1fr] my-2 py-2 mx-5" onClick={() => navigate(`/trip/${trip.tripId}/itinerary`)}>
              <div className="pl-5">{index + 1}</div>
              <div className="">{trip.title}</div>
              <div className="">{trip.startDate}~{trip.endDate}</div>
            </div>
            <XMarkIcon className="w-6 h-6 mr-3" onClick={(event) => deleteTripList(event, trip.tripId)}></XMarkIcon>
          </div>
        )}
        
      </div>
    </div>

  )
}