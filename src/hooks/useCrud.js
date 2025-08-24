import { useState, useCallback } from 'react';
import api from '../utils/axiosInstance';

/**
 * 공통 CRUD 작업을 위한 커스텀 훅
 * @param {string} endpoint - API 엔드포인트 (예: '/support/faqs', '/support/notices')
 * @param {string} resourceName - 리소스 이름 (예: 'FAQ', '공지사항')
 */
const useCrud = (endpoint, resourceName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post(endpoint, data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || `${resourceName} 등록에 실패했습니다.`;
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, resourceName],
  );

  const update = useCallback(
    async (id, updateData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.patch(`${endpoint}/${id}`, updateData);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || `${resourceName} 수정에 실패했습니다.`;
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, resourceName],
  );

  const remove = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        await api.delete(`${endpoint}/${id}`);
        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || `${resourceName} 삭제에 실패했습니다.`;
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, resourceName],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createFaq = resourceName === 'FAQ' ? create : undefined;
  const updateFaq = resourceName === 'FAQ' ? update : undefined;
  const deleteFaq = resourceName === 'FAQ' ? remove : undefined;

  const createNotice = resourceName === '공지사항' ? create : undefined;
  const updateNotice = resourceName === '공지사항' ? update : undefined;
  const deleteNotice = resourceName === '공지사항' ? remove : undefined;

  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError,

    createFaq,
    updateFaq,
    deleteFaq,

    createNotice,
    updateNotice,
    deleteNotice,
  };
};

export default useCrud;
