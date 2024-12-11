import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const inquiries = [
  {
    id: 1,
    title: 'Website Maintenance Announcement',
    date: 'December 10, 2024',
    status: '처리 중',
  },
  {
    id: 2,
    title: 'New Feature Release: Dark Mode',
    date: 'December 8, 2024',
    status: '처리 완료',
  },
  {
    id: 3,
    title: 'Holiday Support Hours',
    date: 'December 5, 2024',
    status: '처리 완료',
  },
];

const InquiryList = () => {
  return (
    <div className="min-h-screen bg-[#FFFCF2] py-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-end mb-2">
          <Link
            to="/inquirypage"
            className="bg-white py-3  text-[#403D39] border border-[#403D39] rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
          >
            문의하기
          </Link>
        </div>
        <hr className="h-0.5 my-4 bg-black border-0"></hr>
        <div className="text-center py-4"></div>
        <table className="w-full bg-transparent rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-transparent text-center">
              <th className="px-4 py-5 text-[#252422] text-2xl">제목</th>
              <th className="px-4 py-5 text-[#252422] text-2xl">등록일</th>
              <th className="px-4 py-5 text-[#252422] text-2xl">진행 상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry, index) => (
              <tr key={inquiry.id} className="text-center">
                <td className="px-4 py-3 text-[#252422] text-xl hover:underline text-left">
                  <Link to={`/inquiry/${inquiry.id}`}>{inquiry.title}</Link>
                </td>
                <td className="px-4 py-3 text-[#252422] text-center text-xl">
                  {format(new Date(inquiry.date), 'yyyy-MM-dd')}
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
