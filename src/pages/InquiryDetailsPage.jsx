import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const InquiryDetailsPage = () => {
  const { inquiryId } = useParams();
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
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `http://localhost:8888/support/inquiries/${inquiryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setInquiry(data);
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

  const formattedDate = inquiry.createdAt
    ? format(new Date(inquiry.createdAt), 'yyyy-MM-dd')
    : 'No date available';

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#252422]">
              {inquiry.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              작성일자: {formattedDate}
            </p>
            <p className="text-sm text-gray-500">진행 상태: {inquiry.status}</p>
          </div>
          <hr className="my-4" />
          <div className="text-lg text-[#252422]">
            <p className="font-semibold">문의 내용:</p>
            <p>{inquiry.content}</p>
          </div>
          {inquiry.reply && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-[#252422]">답변:</p>
              <p>{inquiry.reply}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailsPage;
