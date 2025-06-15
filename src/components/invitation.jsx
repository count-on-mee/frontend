import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { motion } from 'framer-motion';

const Invitation = ({ tripId }) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    try {
      const res = await axiosInstance.post(`/trips/${tripId}/invitations`);
      if (res.data && res.data.invitationCode) {
        setInvitationCode(res.data.invitationCode);
        setCopied(false);
      } else {
        throw new Error('초대 코드를 받지 못했습니다.');
      }
    } catch (err) {
      console.error('초대 코드 생성 에러:', err);
      alert(err.response?.data?.message || '초대 코드 생성에 실패했습니다.');
    }
  };

  const handleCopy = () => {
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode);
      setCopied(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <button
        onClick={handleInvite}
        className="w-full text-center px-4 py-1 bg-gray-100 text-primary rounded-md hover:bg-gray-200 transition-colors duration-200"
      >
        친구 초대하기
      </button>
      {invitationCode && (
        <div className="flex flex-col items-center mt-2">
          <span className="text-gray-700">초대 코드: {invitationCode}</span>
          <button
            onClick={handleCopy}
            className={`mt-2 px-4 py-2 rounded-md transition-all duration-200 ${
              copied
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-primary hover:bg-gray-200'
            }`}
          >
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Invitation;
