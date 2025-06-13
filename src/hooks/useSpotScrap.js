import { useRecoilValue, useRecoilState, useRecoilCallback } from 'recoil';
import { useCallback } from 'react';
import authAtom from '../recoil/auth';
import userAtom from '../recoil/user';
import api from '../utils/axiosInstance';
import scrapStateAtom from '../recoil/scrapState';

export const useSpotScrap = ({
  setSpotMarkers,
  selectedSpot,
  setSelectedSpot,
}) => {
  const token = useRecoilValue(authAtom)?.accessToken;
  const user = useRecoilValue(userAtom);
  // const [scrapState, setScrapState] = useRecoilState(scrapStateAtom);

  const handleSpotScrap = useRecoilCallback(
    ({ snapshot, set }) =>
      async (spotId) => {
        const scrapState = await snapshot.getPromise(scrapStateAtom);
        const currentScrap = scrapState[spotId];
        // console.log(currentScrap);
        const isScraped = currentScrap?.isScraped ?? false;
        const scrapCount = currentScrap?.scrapCount ?? 0;

        // console.log('spotId:', spotId);
        // console.log('scrapState:', scrapState);
        // console.log('currentScrap:', currentScrap);

        if (!user) {
          alert('로그인이 필요한 서비스입니다.');
          return;
        }

        try {
          const method = isScraped ? 'delete' : 'post';
          await api({
            url: `/scraps/spots/${spotId}`,
            method,
            headers: { Authorization: `Bearer ${token}` },
          });

          if (setSpotMarkers) {
            setSpotMarkers((prev) => {
              const updateMarkers = Array.isArray(prev) ? prev : [];
              return updateMarkers.map((marker) =>
                marker.spotId === spotId
                  ? { ...marker, isScraped: !marker.isScraped }
                  : marker,
              );
            });
          }

          set(scrapStateAtom, (prev) => ({
            ...prev,
            [spotId]: {
              isScraped: !isScraped,
              scrapCount: scrapCount + (isScraped ? -1 : 1),
            },
          }));

          // 선택된 Spot 업데이트
          if (selectedSpot && selectedSpot.spotId === spotId) {
            setSelectedSpot((prev) => ({
              ...prev,
              isScraped: !prev.isScraped,
            }));
          }
        } catch (err) {
          console.error('스크랩 실패:', err);
        }
      },
  );

  return { handleSpotScrap };
};
