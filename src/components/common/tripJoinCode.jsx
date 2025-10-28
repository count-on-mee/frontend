import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../utils/axiosInstance';
import Modal from 'react-modal';
import { neumorphStyles } from '../../utils/style';
import peopleIcon from '../../assets/people.png';
import { motion } from 'framer-motion';

export default function TripJoinCode() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const navigate = useNavigate();

  const closeModal = () => {
    setInviteModalOpen(false);
  };

  const handleJoinTrip = async () => {
    try {
      const response = await api.post(`/trips/invitations/${inviteCode}`);
      const data = await response.data;
      setInviteModalOpen(false);
      setInviteCode('');
      navigate(`/trip/${data.tripId}/itinerary`);
    } catch (error) {
      alert('참여하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="fixed bottom-5 right-5">
        <motion.button
          className={`z-50 flex items-center gap-3 px-6 py-4 rounded-full ${neumorphStyles.medium} transition-all duration-200`}
          onClick={() => setInviteModalOpen(true)}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.08,
            y: -4,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <img src={peopleIcon} alt="People" className="w-6 h-6" />
          <span className="text-base font-semibold text-[#252422] whitespace-nowrap">
            여행 코드로 참여하기
          </span>
        </motion.button>
      </div>
      <Modal
        isOpen={inviteModalOpen}
        onRequestClose={closeModal}
        contentLabel="Trip Join Code Modal"
        className={`absolute top-1/2 left-1/2 max-w-md w-[90vw] ${neumorphStyles.base} rounded-2xl p-6 transform -translate-x-1/2 -translate-y-1/2 outline-none`}
        overlayClassName="fixed inset-0 bg-black/40 z-50 flex justify-center items-center"
      >
        <button
          onClick={closeModal}
          className={`absolute top-4 right-4 p-2 rounded-full ${neumorphStyles.small} ${neumorphStyles.hover} transition-all duration-200`}
          aria-label="Close modal"
        >
          <XMarkIcon className="w-5 h-5 text-[#252422]" />
        </button>
        <div className="text-lg font-bold pb-4 text-[#252422]">
          여행 코드로 참여하기
        </div>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className={`w-full p-3 rounded-full mb-4 ${neumorphStyles.small} focus:outline-none focus:ring-2 focus:ring-[#EB5E28]`}
          placeholder="초대 코드를 입력하세요"
        />
        <div className="flex justify-end">
          <button
            onClick={handleJoinTrip}
            className={`rounded-full px-6 py-2 ${neumorphStyles.medium} font-semibold text-[#252422] hover:bg-[#FF8C4B] hover:text-white transition-colors duration-200`}
          >
            참여하기
          </button>
        </div>
      </Modal>
    </>
  );
}
