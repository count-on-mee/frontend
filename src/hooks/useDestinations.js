import { useState, useEffect } from 'react';

const useDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(
          'http://localhost:8888/trips/destinations',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || '목적지 데이터를 가져오는데 실패했습니다.',
          );
        }

        const data = await response.json();
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
