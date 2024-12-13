import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/support/notices`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await fetchNotices();
        setNotices(data);
      } catch (error) {
        console.error('Failed to load notices:', error);
      }
    };

    loadNotices();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-20">
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
              <tr key={notice.noticeId} className="text-center">
                <td className="px-4 py-3 text-[#252422] text-xl">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-[#252422] text-xl hover:underline text-left">
                  <Link to={`/support/notice/${notice.noticeId}`}>
                    {notice.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#252422] text-center text-xl">
                  {format(new Date(notice.createdAt), 'yyyy-MM-dd')}
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
