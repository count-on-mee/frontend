import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const InquiryDetailsPage = () => {
  const { id: inquiryId } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!inquiryId) {
      setError('Invalid inquiry ID');
      setLoading(false);
      return;
    }

    const fetchInquiryDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8888/support/inquiries/${inquiryId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );
        setInquiry(response.data);
      } catch (err) {
        setError('Failed to load inquiry details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiryDetails();
  }, [inquiryId]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!inquiry) {
    return <div className="text-center py-20">No inquiry found</div>;
  }

  const formattedDate = format(new Date(inquiry.date), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#252422]">
              {inquiry.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              등록일: {formattedDate}
            </p>
            <p className="text-sm text-gray-500">진행 상태: {inquiry.status}</p>
          </div>
          <hr className="my-4" />
          <div className="text-lg text-[#252422]">{inquiry.content}</div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailsPage;
