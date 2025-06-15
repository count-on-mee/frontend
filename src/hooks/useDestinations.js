import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await axiosInstance.get('/trips/destinations');
        setDestinations(data || []);
      } catch (err) {
        console.error('목적지 데이터 가져오기 실패:', err);
        setError(err.message || '목적지 데이터를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return { destinations, loading, error };
};

export default useDestinations;
