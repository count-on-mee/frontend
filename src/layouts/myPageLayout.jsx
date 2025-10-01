import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Outlet, useNavigate } from 'react-router-dom';
import userAtom from '../recoil/user';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaRegPenToSquare } from 'react-icons/fa6';
import ProfileSection from '../components/user/ProfileSection';
import updateUser from '../components/user/UpdateUser';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../recoil/auth';
import api from '../utils/axiosInstance';
import Modal from 'react-modal';
import { neumorphStyles } from '../utils/style';

Modal.setAppElement('#root');

export default function MyPageLayout() {
  const [user, setUser] = useRecoilState(userAtom);
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const navigate = useNavigate();

  const openModal = () => {
    setInviteModalOpen(true);
  };

  const closeModal = () => {
    setInviteModalOpen(false);
  };

  const validateNickname = () => {
    if (!nickname) return;
    if (nickname.length > 30) {
      return '닉네임을 30글자를 초과할 수 없습니다.';
    }
  };

  const handleSave = () => {
    const errorMessage = validateNickname(nickname);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    updateUser({ nickname });
    setUser({ ...user, nickname });
    setIsEditing(false);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setError(validateNickname(value));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageChange = (uploadImage) => {
    if (uploadImage) {
      const uploadImageUrl = URL.createObjectURL(uploadImage[0]);
      setUser((prevUser) => ({
        ...prevUser,
        imgUrl: uploadImageUrl,
      }));
      updateUser({ uploadImage: uploadImage[0] });
    }
  };

  const handleJoinTrip = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.post(`/trips/invitations/${inviteCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setInviteModalOpen(false);
      setInviteCode('');
      navigate(`/trip/${data.tripId}/itinerary`);
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('참여하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f3] font-prompt">
      {/* 페이지 상단 제목 */}
      <div className="w-full bg-[#f0f0f3]pt-8 sm:pt-12 lg:pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-[#252422]">
              My Page
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-grow flex-nowrap">
          <ProfileSection
            handleImageChange={handleImageChange}
            handleNicknameChange={handleNicknameChange}
            isEditing={isEditing}
            handleSave={handleSave}
            handleEdit={handleEdit}
            error={error}
            nickname={nickname}
          />
          <div className="flex-1 w-3/4 bg-[#f0f0f3] ml-8">
            <div
              className={`w-full ${neumorphStyles.base} ${neumorphStyles.hover} rounded-2xl p-6`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 right-5">
        <button
          className="flex z-50 p-3 text-xl font-bold bg-background-light box-shadow rounded-2xl text-charcoal px-2 hover:bg-primary hover:text-background-light hover:p-5"
          onClick={() => setInviteModalOpen(true)}
        >
          <FaRegPenToSquare className="mx-1 my-1" />
          <div>여행 초대 코드로 참여하기</div>
        </button>
      </div>

      {/* 모달 */}
      <Modal
        isOpen={inviteModalOpen}
        onRequestClose={closeModal}
        contentLabel="Review Images Modal"
        className="absolute top-1/2 left-1/2 max-w-4xl max-h-[90vh] w-[100vw] bg-white rounded-lg p-6 transform -translate-x-1/2 -translate-y-1/2 outline-none"
        overlayClassName="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-charcoal font-bold text-lg z-200"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>
        <div className="text-lg font-bold pb-3">여행 초대 코드 입력하기</div>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="초대 코드를 입력하세요"
        />
        <div className="flex justify-end">
          <button
            onClick={handleJoinTrip}
            className="bg-primary text-white rounded-2xl px-4 py-2"
          >
            참여하기
          </button>
        </div>
      </Modal>
    </div>
  );
}
