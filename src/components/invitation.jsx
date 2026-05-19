import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import koreaMap from '../assets/Korea.png';
import { neumorphStyles } from '../utils/style';

const Invitation = ({ tripId }) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleInvite = async () => {
    try {
      const res = await axiosInstance.post(`/trips/${tripId}/invitations`);
      if (res.data && res.data.invitationCode) {
        const code = res.data.invitationCode;
        setInvitationCode(code);
        navigator.clipboard.writeText(code);
        setShowCopiedMessage(true);
        setTimeout(() => {
          setShowCopiedMessage(false);
        }, 3000);
      } else {
        throw new Error('초대 코드를 받지 못했습니다.');
      }
    } catch (err) {
      console.error('초대 코드 생성 에러:', err);
      alert(err.response?.data?.message || '초대 코드 생성에 실패했습니다.');
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <img
        src={koreaMap}
        alt="Korea Map"
        className="hidden desktop:block w-14 h-14"
      />
      <div className="relative">
        <button
          onClick={handleInvite}
          className={`px-3 py-1.5 desktop:px-6 desktop:py-3 text-xs desktop:text-base text-primary rounded-full transition-all duration-200 whitespace-nowrap ${neumorphStyles.small} ${neumorphStyles.hover}`}
        >
          친구 초대하기
        </button>
        {invitationCode && (
          <div className="absolute left-0 top-full mt-1.5 z-50 bg-[#f0f0f3] rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.12),-2px_-2px_8px_rgba(255,255,255,0.8)] p-2.5 whitespace-nowrap min-w-max">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">초대 코드:</span>
              <span className="text-primary font-bold text-sm tracking-wider">
                {invitationCode}
              </span>
            </div>
            {showCopiedMessage && (
              <p className="text-[10px] text-[#FF8C4B] font-medium mt-1 text-center">
                클립보드에 복사되었습니다!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitation;
