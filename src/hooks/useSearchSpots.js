import { useRecoilValue, useSetRecoilState } from 'recoil';
import api from '../utils/axiosInstance';
import markersAtom from '../recoil/spotMarkers';
import scrapStateAtom from '../recoil/scrapState';

export default function useSearchSpots() {
  const setMarkers = useSetRecoilState(markersAtom);
  const setScrapState = useSetRecoilState(scrapStateAtom);
  const scrapState = useRecoilValue(scrapStateAtom);

  return async function handleSearch(center, zoom) {
    try {
      const response = await api.get('/spots', {
        params: { lat: center.lat, lng: center.lng, zoom },
        validateStatus: () => true,
      });

      const data = response.data;

      setMarkers(
        data.map((place) => ({
          spotId: place.spotId,
          position: new naver.maps.LatLng(
            place.location.lat,
            place.location.lng,
          ),
          name: place.name,
          address: place.address,
          imgUrls: place.imgUrls,
          businessHours: place.businessHours,
          isOpen: place.isOpen,
          isScraped: place.isScraped,
          categories: place.categories,
          localScrapedCount: place.scrapedCount,
        })),
      );

      const initialScrap = data.reduce((acc, place) => {
        acc[place.spotId] = {
          isScraped: place.isScraped,
          scrapCount: place.scrapedCount,
        };
        return acc;
      }, {});
      setScrapState(initialScrap);
    } catch (error) {
      console.error('Search error:', error);
    }
  };
}
