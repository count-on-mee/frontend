import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const NoticeDetailsPage = () => {
  const { id: noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Notice ID:', noticeId);
    if (!noticeId) {
      setError('Invalid notice ID');
      setLoading(false);
      return;
    }

    const fetchNoticeDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8888/support/notices/${noticeId}`,
        );
        console.log('Fetched notice:', response.data); // 추가된 로그
        setNotice(response.data);
      } catch (err) {
        setError('Failed to load notice details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetails();
  }, [noticeId]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!notice) {
    return <div className="text-center py-20">No notice found</div>;
  }
  let formattedDate = '';
  if (notice.createdAt) {
    const parsedDate = new Date(notice.createdAt);

    if (!isNaN(parsedDate.getTime())) {
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } else {
      console.error('Invalid date format:', notice.createdAt);
      formattedDate = 'Invalid date';
    }
  } else {
    formattedDate = 'No date available';
  }

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#252422]">
              {notice.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Registered on: {formattedDate}
            </p>
          </div>
          <hr className="my-4" />
          <div className="text-lg text-[#252422]">{notice.content}</div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailsPage;
