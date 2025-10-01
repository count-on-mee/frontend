import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';
import api from '../utils/axiosInstance';
import CurationUploader from '../components/curation/CurationUploader';

export default function CurationEditPage() {
  const { curationId } = useParams();
  const navigate = useNavigate();
  const auth = useRecoilValue(authAtom);
  const [curation, setCuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchCuration();
  }, [curationId, auth.isAuthenticated, navigate]);

  const fetchCuration = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/curations/${curationId}`);
      setCuration(response.data);
    } catch (error) {
      console.error('Failed to fetch curation:', error);
      setError('큐레이션을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCuration = async (updateData) => {
    try {
      await api.patch(`/curations/${curationId}`, updateData);
      alert('큐레이션이 성공적으로 수정되었습니다.');
      navigate(`/curation/${curationId}`);
    } catch (error) {
      console.error('Failed to update curation:', error);
      alert('큐레이션 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!curation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">큐레이션을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">큐레이션 수정</h1>

          <CurationUploader
            isOpen={true}
            onClose={() => navigate(`/curation/${curationId}`)}
            isEdit={true}
            editData={curation}
            onSubmit={handleUpdateCuration}
          />
        </div>
      </div>
    </div>
  );
}
