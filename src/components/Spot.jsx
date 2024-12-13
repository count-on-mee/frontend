import { BookmarkIcon } from '@heroicons/react/24/outline';
import Carousel from './Carousel';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import markersAtom from '../recoil/markers';
import selectedSpotAtom from '../recoil/selectedSpot';
import userAtom from '../recoil/user';

export default function Spot({ spot, onClick }) {
  const setMarkers = useSetRecoilState(markersAtom);
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const user = useRecoilValue(userAtom);

  const handleScrapClick = async event => {
    event.stopPropagation();
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const method = spot.isScraped ? 'DELETE' : 'POST';
      await fetch(`http://localhost:8888/scraps/spots/${spot.id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      setMarkers(prev => {
        const updatedMarkers = Array.isArray(prev) ? prev : [];
        return updatedMarkers.map(marker =>
          marker.id === spot.id
            ? { ...marker, isScraped: !marker.isScraped }
            : marker,
        );
      });
      if (selectedSpot && selectedSpot.id === spot.id) {
        setSelectedSpot(prev => ({ ...prev, isScraped: !prev.isScraped }));
      }
    } catch (error) {
      console.error('Failed to update scrap status', error);
    }
  };

  return (
    <div className="pb-5 border-b-2 border-[#403D39] mt-5" onClick={onClick}>
      <div className="relative">
        <Carousel imgUrls={spot.imgUrl} spot={spot} />
        <BookmarkIcon
          className={`absolute top-3 right-10 w-5 h-5 ${spot.isScraped ? 'fill-[#EB5E28] stroke-[#EB5E28]' : ''}`}
          onClick={handleScrapClick}
        />
      </div>
      <p className="mx-7 mt-3 text-md font-mixed">{spot.title}</p>
      {/* TODO: isOpen */}
      <p className="mx-7 text-xs font-mixed text-[#FFFCF2] w-12 bg-[#EB5E28] rounded-full text-center">
        영업중
      </p>
      <p className="mx-7 text-sm font-mixed text-gray-400">{spot.address}</p>
    </div>
  );
}
