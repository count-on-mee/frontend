import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/mypage/scrap', { replace: true });
  }, [navigate]);

  return null;
}
