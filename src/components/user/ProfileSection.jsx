import ProfileImage from './ProfileImage';
import UploadImages from '../ui/UploadImages';
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import userAtom from '../../recoil/user';
import { useRecoilValue } from 'recoil';
import { useNavigate, useLocation } from 'react-router-dom';
import triplistIcon from '../../assets/triplist.png';
import scrapIcon from '../../assets/scrap.png';
import reviewIcon from '../../assets/review.png';

export default function ProfileSection({
  handleImageChange,
  handleNicknameChange,
  handleEdit,
  handleSave,
  isEditing,
  nickname,
  error,
}) {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에서 선택된 메뉴 결정
  const getSelectedMenu = () => {
    const path = location.pathname;
    if (path === '/mypage/triplist') return 'triplist';
    if (path === '/mypage/scrap') return 'scrap';
    if (path === '/mypage/curation') return 'curation';
    if (path === '/mypage/review') return 'review';
    return 'scrap'; // 기본값
  };

  const selectedMenu = getSelectedMenu();

  const menuItems = [
    {
      category: 'trip',
      title: '나의 여행 정보',
      icon: triplistIcon,
      color: '#FF8C4B',
      items: [{ id: 'triplist', title: '나의 여행' }],
    },
    {
      category: 'interest',
      title: '나의 관심',
      icon: scrapIcon,
      color: '#FF8C4B',
      items: [{ id: 'scrap', title: '나의 스크랩' }],
    },
    {
      category: 'activity',
      title: '나의 활동',
      icon: reviewIcon,
      color: '#FF8C4B',
      items: [
        { id: 'curation', title: 'Curation 작성' },
        { id: 'review', title: 'Review 작성' },
      ],
    },
  ];

  return (
    <div className="font-mixed box-content w-1/4 text-center text-2xl bg-[#f0f0f3] min-h-screen">
      <div className="px-8 py-12">
        <div className="relative w-1/2 mx-auto h-1/5 mb-8">
          <ProfileImage user={user} />
          <div className="absolute top-25 left-30">
            <UploadImages mode="single" onUpload={handleImageChange} />
          </div>
        </div>

        <div className="flex justify-center w-full mb-8">
          <div className="inline-flex flex-row items-center mx-auto">
            {user && isEditing ? (
              <>
                <input
                  className="w-2/3 ml-10 border-b-2 bg-[#FFFCF2] border-[#403D39] rounded-lg px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  type="text"
                  name="nickname"
                  value={nickname}
                  onChange={handleNicknameChange}
                />
              </>
            ) : (
              <div className="text-3xl font-bold font-mixed text-gray-700">
                {user?.nickname}
              </div>
            )}
            <button
              className="flex-shrink-0 ml-2 p-2 rounded-full shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-200"
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? (
                <CheckIcon className="w-6 h-6 text-green-600" />
              ) : (
                <PencilSquareIcon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
          {error && <p className="block mt-3 text-sm text-red-500">{error}</p>}
        </div>

        {/* 새로운 메뉴 구조 */}
        <div className="space-y-6">
          {menuItems.map((category) => (
            <div
              key={category.category}
              className="bg-[#f0f0f3] rounded-2xl p-4 shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-200"
            >
              <div className="flex items-center mb-3">
                <img
                  src={category.icon}
                  alt={category.title}
                  className="w-6 h-6 mr-3"
                />
                <h3
                  className="text-lg font-bold text-gray-700"
                  style={{ color: category.color }}
                >
                  {category.title}
                </h3>
              </div>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      selectedMenu === item.id
                        ? 'shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]'
                        : 'hover:shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff]'
                    }`}
                    onClick={() => navigate(`/mypage/${item.id}`)}
                    style={{
                      borderLeft: `4px solid ${category.color}`,
                      backgroundColor:
                        selectedMenu === item.id ? '#f0f0f3' : 'transparent',
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-600">
                        {item.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
