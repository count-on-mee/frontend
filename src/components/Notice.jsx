import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const notices = [
  {
    id: 1,
    title: 'Website Maintenance Announcement',
    date: 'December 10, 2024',
  },
  {
    id: 2,
    title: 'New Feature Release: Dark Mode',
    date: 'December 8, 2024',
  },
  {
    id: 3,
    title: 'Holiday Support Hours',
    date: 'December 5, 2024',
  },
];

const NoticeList = () => {
  return (
    <div className="min-h-screen bg-[#FFFCF2] py-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="h-0.5 my-1 bg-black border-0"></hr>
        <table className="w-full bg-transparent rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-transparent text-center">
              <th className="px-4 py-5 text-[#252422] text-2xl ">번호</th>
              <th className="px-4 py-5 text-[#252422] text-2xl">제목</th>
              <th className="px-4 py-5 text-[#252422] text-2xl">등록일</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, index) => (
              <tr key={notice.id} className=" text-center">
                <td className="px-4 py-3 text-[#252422] text-xl">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-[#252422] text-xl hover:underline text-left">
                  <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                </td>
                <td className="px-4 py-3 text-[#252422] text-center text-xl">
                  {format(new Date(notice.date), 'yyyy-MM-dd')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeList;
