import ProfileImage from './ProfileImage';
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

  const getSelectedMenu = () => {
    const path = location.pathname;
    if (path === '/mypage/triplist') return 'triplist';
    if (path === '/mypage/scrap') return 'scrap';
    if (path === '/mypage/curation') return 'curation';
    if (path === '/mypage/review') return 'review';
    return 'scrap';
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
        <div className="w-1/2 mx-auto mb-8">
          <ProfileImage user={user} onImageChange={handleImageChange} />
        </div>

        <div className="flex justify-center w-full mb-6">
          <div className="inline-flex flex-row items-center mx-auto">
            {user && isEditing ? (
              <div className="flex items-center bg-[#f0f0f3] rounded-xl p-2 shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff]">
                <input
                  className="bg-[#f0f0f3] border-none outline-none text-2xl font-bold font-mixed text-gray-700 px-3 py-1 rounded-lg shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-200"
                  type="text"
                  name="nickname"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 입력하세요"
                />
                <button
                  className="flex-shrink-0 ml-2 p-1.5 rounded-full shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] transition-all duration-200"
                  onClick={handleSave}
                >
                  <CheckIcon className="w-5 h-5 text-[#FF8C4B]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-[#f0f0f3] rounded-xl p-2 shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff]">
                <div className="text-2xl font-bold font-mixed text-gray-700 px-3 py-1">
                  {user?.nickname}
                </div>
                <button
                  className="flex-shrink-0 ml-2 p-1.5 rounded-full shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] transition-all duration-200"
                  onClick={handleEdit}
                >
                  <PencilSquareIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
          {error && (
            <p className="block mt-2 text-base text-red-500">{error}</p>
          )}
        </div>

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
                  className="text-xl font-bold text-gray-700"
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
                      <span className="text-base font-medium text-gray-600">
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
