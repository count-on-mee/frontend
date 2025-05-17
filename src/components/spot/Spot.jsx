import Card from '../ui/Card';
import api from '../../utils/axiosInstance';
import selectedSpotAtom from '../../recoil/selectedSpot';
import markersAtom from '../../recoil/markers';
import userAtom from '../../recoil/user';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

export default function Spot({ spot, onClick }) {
  const setMarkers = useSetRecoilState(markersAtom);
  const [selectedSpot, setSelectedSpot] = useRecoilState(selectedSpotAtom);
  const user = useRecoilValue(userAtom);
  
  const handleSpotScrap = async event => {
    event.stopPropagation();

    if(!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const method = spot.isScraped ? 'delete' : 'post';
      await api({
        url: `/scraps/spots/${spot.id}`,
        method,
      });

      setMarkers(prev => {
        const updateMarkers = Array.isArray(prev) ? prev : [];
        return updateMarkers.map(marker =>
          marker.id === spot.id
            ? {...marker, isScraped: !marker.isScraped }
            : marker
        );
      });
      if (selectedSpot && selectedSpot.id === spot.id) {
        setSelectedSpot(prev => ({ ...prev, isScraped: !prev.isScraped}));
      }
    } catch (error) {
      console.error('Failed to update scrap status', error);
    }
  }

  return (
    <Card 
      type="spot"
      spot={spot}
      onScrapClick={() => handleSpotScrap(spot.id)}
    />
    // <div className="w-8/9 justify-center mx-auto rounded-2xl mt-5 box-shadow">
    //   <img
    //     alt="logo"
    //     src="/src/assets/icon.png"
    //     className="border-2 border-charcoal rounded-t-2xl opacity-20"
    //   />
    //   <div className="pb-5">
    //     <div className="relative">
    //       <BookmarkIcon className="absolute top-1 right-5 size-5" />
    //     </div>
    //     <p className="mx-5 mt-3 text-md">title</p>
    //     <p className="mx-5 text-sm font-mixed text-charcoal pb-1">address</p>
    //     <Hashtag />
    //   </div>
    // </div>
  );
}
