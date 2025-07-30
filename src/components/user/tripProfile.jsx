import React, { useState } from 'react';

const ParticipantImage = ({ participant }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      {participant.imgUrl ? (
        <img
          src={participant.imgUrl}
          alt={participant.nickname}
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
      ) : (
        <div
          className="w-14 h-14 rounded-full bg-gray-300 border-2 border-white shadow-md cursor-pointer flex items-center justify-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <svg
            className="w-7 h-7 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10">
          <div className="font-medium">{participant.name}</div>
          <div className="text-xs text-gray-300">{participant.email}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

const TripProfile = ({ participants, loading }) => {
  console.log('TripProfile props:', { participants, loading });

  if (loading) {
    return <div className="text-gray-400 text-sm">로딩 중...</div>;
  }

  if (!participants || participants.length === 0) {
    return <div className="text-gray-400 text-sm">참가자 없음</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-3">
        {participants.map((participant, index) => (
          <ParticipantImage
            key={participant.userId}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
};

export default TripProfile;
