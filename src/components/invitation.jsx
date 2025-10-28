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
    <div className="flex items-center gap-3">
      <img src={koreaMap} alt="Korea Map" className="w-15 h-15" />
      <div className="flex flex-col gap-2">
        <button
          onClick={handleInvite}
          className={`px-6 py-3 text-base text-primary rounded-full transition-all duration-200 ${neumorphStyles.small} ${neumorphStyles.hover}`}
        >
          친구 초대하기
        </button>
        {invitationCode && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 p-3  rounded-lg">
              <span className="text-gray-600 text-sm font-medium">
                초대 코드:
              </span>
              <span className="text-primary font-bold tracking-wider">
                {invitationCode}
              </span>
            </div>
            {showCopiedMessage && (
              <div
                className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                  showCopiedMessage
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2'
                }`}
              >
                <span className="text-sm text-[#FF8C4B] font-medium">
                  클립보드에 복사되었습니다!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitation;
