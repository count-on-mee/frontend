import { getRecoil } from "recoil-nexus";
import authAtom from "../../recoil/auth";
import api from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      console.log(data);
      setTripList(data);
    } catch (error) {
      console.error('Failed to fetch trip list:', error);
    }
  }
  useEffect(() => {
    fetchTripList();
  }, []) 
  return(
    <div>
      <div className="px-3 py-2 mt-5 mx-auto font-mixed text-2xl text-center text-shadow">TRIP LIST</div>
      <div>
        {tripList.map(trip => 
          <div key={trip.tripId} className="grid grid-cols-[1fr_2fr_1fr] bg-background-gray my-2 py-2 rounded-2xl box-shadow mx-5" onClick={() => navigate(`/trip/${trip.tripId}/itinerary`)}>
            <div className="pl-5">{trip.tripId}</div>
            <div className="">{trip.title}</div>
            <div className="">{trip.startDate}~{trip.endDate}</div>
          </div>
        )}
        
      </div>
    </div>

  )
}