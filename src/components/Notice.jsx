import React, { useState } from 'react';

const Notice = [
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

const NoticePage = () => {
  const [activeNotice, setActiveNotice] = useState(null);

  const toggleNotice = id => {
    setActiveNotice(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 sm:text-4xl">
          Announcements
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Stay updated with the latest news and announcements.
        </p>
        <div className="mt-10 space-y-6 max-w-4xl mx-auto">
          {notices.map(notice => (
            <div
              key={notice.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleNotice(notice.id)}
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {notice.title}
                  </h2>
                  <p className="text-sm text-gray-500">{notice.date}</p>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-400 transform transition-transform ${
                    activeNotice === notice.id ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeNotice === notice.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700">{notice.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notice;
