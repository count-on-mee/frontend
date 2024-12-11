import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const notices = [
  {
    id: 1,
    title: 'Website Maintenance Announcement',
    date: 'December 10, 2024',
    content:
      'Our website will be undergoing scheduled maintenance on December 15th, 2024, from 12:00 AM to 6:00 AM. During this time, the site may be temporarily unavailable.',
  },
  {
    id: 2,
    title: 'New Feature Release: Dark Mode',
    date: 'December 8, 2024',
    content:
      'We are excited to announce the launch of Dark Mode! You can enable it from the settings menu to enjoy a new, visually comfortable experience.',
  },
  {
    id: 3,
    title: 'Holiday Support Hours',
    date: 'December 5, 2024',
    content:
      'During the holiday season, our support team will be available from 9:00 AM to 5:00 PM, Monday through Friday. Thank you for your understanding!',
  },
];

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notice = notices.find(n => n.id === parseInt(id, 10));

  if (!notice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Notice Not Found</h1>
          <p className="mt-4 text-gray-600">
            The notice you are looking for does not exist.
          </p>
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate('/notice')}
          >
            Go Back to Notices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF2] py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">{notice.title}</h1>
          <p className="text-sm text-gray-500">{notice.date}</p>
          <div className="mt-4 text-gray-700">{notice.content}</div>
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate('/notice')}
          >
            Back to Notices
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
