import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import userAtom from '../recoil/user';
import ProfileSection from '../components/user/ProfileSection';
import ProfileImage from '../components/user/ProfileImage';
import updateUser from '../components/user/UpdateUser';
import { neumorphStyles } from '../utils/style';
import TripJoinCode from '../components/common/tripJoinCode';
import { useIsDesktop } from '../hooks/useMediaQuery';
import clsx from 'clsx';
import triplistIcon from '../assets/triplist.png';
import scrapIcon from '../assets/scrap.png';
import reviewIcon from '../assets/review.png';
import {
  PencilSquareIcon,
  CheckIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const mobileMenuItems = [
  { id: 'triplist', label: '나의 여행', icon: triplistIcon },
  { id: 'scrap', label: '스크랩', icon: scrapIcon },
  { id: 'curation', label: 'Curation', icon: reviewIcon },
  { id: 'review', label: 'Review', icon: reviewIcon },
];

export default function MyPageLayout() {
  const [user, setUser] = useRecoilState(userAtom);
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu = (() => {
    const path = location.pathname;
    if (path.includes('triplist')) return 'triplist';
    if (path.includes('scrap')) return 'scrap';
    if (path.includes('curation')) return 'curation';
    if (path.includes('review')) return 'review';
    return 'scrap';
  })();

  const validateNickname = (value) => {
    if (!value) return;
    if (value.length > 30) return '닉네임을 30글자를 초과할 수 없습니다.';
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

  const handleEdit = () => setIsEditing(true);

  const handleImageChange = (uploadImage) => {
    if (uploadImage) {
      const uploadImageUrl = URL.createObjectURL(uploadImage[0]);
      setUser((prevUser) => ({ ...prevUser, imgUrl: uploadImageUrl }));
      updateUser({ uploadImage: uploadImage[0] });
    }
  };

  if (!isDesktop) {
    return (
      <div className="bg-background-gray font-prompt">
        <div className="bg-background-gray border-b border-charcoal/10 sticky top-14 z-30 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <div className="flex overflow-x-auto">
            {mobileMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/mypage/${item.id}`)}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-3 whitespace-nowrap text-sm font-medium transition-all duration-200 border-b-2 flex-shrink-0',
                  activeMenu === item.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-charcoal/50',
                )}
              >
                <img src={item.icon} alt={item.label} className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pt-4 pb-3 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {user?.imgUrl ? (
              <img
                src={user.imgUrl}
                className="w-[60px] h-[60px] rounded-full object-cover"
                alt="profile"
              />
            ) : (
              <UserCircleIcon className="w-[60px] h-[60px] text-charcoal/30" />
            )}
            <label className="absolute bottom-0 right-0 cursor-pointer">
              <PlusCircleIcon className="w-5 h-5 text-white bg-primary rounded-full shadow" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) handleImageChange([e.target.files[0]]);
                }}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-background-gray rounded-lg px-3 py-1.5 text-[15px] font-semibold text-charcoal shadow-[inset_2px_2px_5px_#d1d1d1,inset_-2px_-2px_5px_#ffffff] outline-none min-w-0"
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="flex-shrink-0 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold"
                >
                  저장
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-charcoal truncate">
                  {user?.nickname}
                </span>
                <button onClick={handleEdit}>
                  <PencilSquareIcon className="w-4 h-4 text-charcoal/40" />
                </button>
              </div>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>
        <div className="px-4 pt-2 pb-4">
          <div className={`w-full ${neumorphStyles.base} rounded-2xl p-4`}>
            <Outlet />
          </div>
        </div>

        <TripJoinCode />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-gray font-prompt">
      <div className="w-full bg-background-gray pt-4 sm:pt-6 lg:pt-8">
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
          <div className="flex-1 w-3/4 bg-background-gray ml-8">
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
