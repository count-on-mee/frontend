import { getRecoil } from 'recoil-nexus';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authAtom from '../recoil/auth';
import api from '../utils/axiosInstance';
import centerAtom from '../recoil/center';
import zoomAtom from '../recoil/zoom';
import markersAtom from '../recoil/spotMarkers';
import scrapStateAtom from '../recoil/scrapState';

export default function useSearchSpots() {
  const center = useRecoilValue(centerAtom);
  const zoom = useRecoilValue(zoomAtom);
  const setMarkers = useSetRecoilState(markersAtom);
  const setScrapState = useSetRecoilState(scrapStateAtom);
  const scrapState = useRecoilValue(scrapStateAtom);

  return async function handleSearch() {
    const token = getRecoil(authAtom).accessToken;
    try {
      const response = await api.get('/spots', {
        params: { lat: center.lat, lng: center.lng, zoom },
        // headers: { Authorization: `Bearer ${token}` },
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
      // console.log(scrapState);
    } catch (error) {
      console.error('Search error:', error);
    }
  };
}
