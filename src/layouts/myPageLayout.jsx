import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Outlet } from 'react-router-dom';
import userAtom from '../recoil/user';
import ProfileSection from '../components/user/ProfileSection';
import updateUser from '../components/user/UpdateUser';
import { neumorphStyles } from '../utils/style';
import TripJoinCode from '../components/common/tripJoinCode';

export default function MyPageLayout() {
  const [user, setUser] = useRecoilState(userAtom);
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const validateNickname = (value) => {
    if (!value) return;
    if (value.length > 30) {
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f0f0f3] font-prompt">
      {/* 페이지 상단 제목 */}
      <div className="w-full bg-[#f0f0f3] pt-4 sm:pt-6 lg:pt-8">
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

      <TripJoinCode />
    </div>
  );
}
