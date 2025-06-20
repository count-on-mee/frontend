import { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';
import axiosInstance from '../utils/axiosInstance';

export default function useCuration(curationId) {
  const [curationSpots, setCurationSpots] = useState([]);
  const [curation, setCuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useRecoilValue(authAtom);

  const fetchCuration = useCallback(
    async (id) => {
      if (!id || !auth.isAuthenticated) return;

      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get(`/curations/${id}`);

        if (!data) {
          throw new Error('큐레이션 데이터가 없습니다.');
        }

        // 큐레이션 기본 정보 설정
        setCuration({
          name: data.name || '제목 없음',
          description: data.description || '',
          imgUrl: data.imgUrl || '',
        });

        // 데이터 구조에 따라 spots 배열 설정
        if (data.curationSpots && Array.isArray(data.curationSpots)) {
          setCurationSpots(data.curationSpots);
        } else if (data.spots && Array.isArray(data.spots)) {
          setCurationSpots(data.spots);
        } else {
          console.warn(
            '큐레이션 스팟 데이터가 없거나 잘못된 형식입니다:',
            data,
          );
          setCurationSpots([]);
        }
      } catch (err) {
        console.error('큐레이션 데이터 가져오기 실패:', err);
        setError(err.message || '큐레이션을 불러오는 중 오류가 발생했습니다.');
        setCurationSpots([]);
        setCuration(null);
      } finally {
        setLoading(false);
      }
    },
    [auth.isAuthenticated],
  );

  useEffect(() => {
    if (curationId && auth.isAuthenticated) {
      fetchCuration(curationId);
    }
  }, [curationId, fetchCuration, auth.isAuthenticated]);

  return {
    curationSpots,
    curation,
    loading,
    error,
    fetchCuration,
  };
}
