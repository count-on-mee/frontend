import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8888/support/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const data = await fetchInquiries();
        setInquiries(data);
      } catch (error) {
        console.error('Failed to load inquiries:', error);
      }
    };
    loadInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-9">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-end mb-2">
          <Link
            to="/support/inquirypage"
            className="bg-white py-3  text-[#403D39] border border-[#403D39] rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
          >
            문의하기
          </Link>
        </div>
        <hr className="h-0.5 my-1 bg-black border-0"></hr>
        <div className="text-center"></div>
        <table className="w-full bg-transparent rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-transparent text-center">
              <th className="px-4 py-5 text-[#252422] text-2xl">제목</th>
              <th className="px-4 py-5 text-[#252422] text-2xl">등록일</th>
              <th className="px-4 py-5 text-[#252422] text-2xl">진행 상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inquiry => (
              <tr key={inquiry.inquiryId} className="text-center">
                <td className="px-4 py-3 text-[#252422] text-xl hover:underline text-left">
                  <Link to={`/support/inquiry/${inquiry.inquiryId}`}>
                    {inquiry.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#252422] text-center text-xl">
                  {format(new Date(inquiry.createdAt), 'yyyy-MM-dd')}
                </td>
                <td className="px-4 py-3 text-[#252422] text-center text-xl">
                  {inquiry.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InquiryList;
