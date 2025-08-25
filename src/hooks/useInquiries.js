import { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../recoil/user';
import api from '../utils/axiosInstance';

function useInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useRecoilValue(userAtom);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/support/inquiries/categories');
      setCategories(response.data || []);
    } catch (err) {
      console.error('문의 카테고리 조회 실패:', err);
      setError('문의 카테고리를 불러오는데 실패했습니다.');
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        user.role === 'admin'
          ? '/support/inquiries'
          : `/support/inquiries?userId=${user.userId}`;

      const response = await api.get(endpoint);
      setInquiries(response.data || []);
    } catch (err) {
      console.error('문의 목록 조회 실패:', err);

      const status = err.response?.status;
      let errorMessage = '문의 목록을 불러오는데 실패했습니다.';

      if (status === 401) {
        errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.';
      } else if (status === 403) {
        errorMessage = '접근 권한이 없습니다.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
    fetchInquiries();
  }, [fetchCategories, fetchInquiries]);

  const createInquiry = async (inquiryData) => {
    try {
      const response = await api.post('/support/inquiries', inquiryData);
      await fetchInquiries();
      return response.data;
    } catch (err) {
      console.error('문의 생성 실패:', err);
      throw err;
    }
  };

  const replyToInquiry = async (inquiryId, replyData) => {
    try {
      const response = await api.post(`/support/inquiries/${inquiryId}/reply`, {
        reply: replyData.reply,
      });
      await fetchInquiries();
      return response.data;
    } catch (err) {
      console.error('문의 답변 실패:', err);
      throw err;
    }
  };

  const deleteInquiry = async (inquiryId) => {
    try {
      await api.delete(`/support/inquiries/${inquiryId}`);
      await fetchInquiries();
    } catch (err) {
      console.error('문의 삭제 실패:', err);
      throw err;
    }
  };

  return {
    inquiries,
    categories,
    loading,
    error,
    fetchInquiries,
    createInquiry,
    replyToInquiry,
    deleteInquiry,
    isAdmin: user?.role === 'admin',
  };
}

export default useInquiries;
