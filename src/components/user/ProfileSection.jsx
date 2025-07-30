import ProfileImage from './ProfileImage';
import UploadImages from '../ui/UploadImages';
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import userAtom from '../../recoil/user';
import { useRecoilValue } from 'recoil';

export default function ProfileSection({
  handleImageChange,
  handleNicknameChange,
  handleEdit,
  handleSave,
  isEditing,
  nickname,
  error,
  setSelectedMenu,
}) {
  const user = useRecoilValue(userAtom);
  return (
    <div className="font-mixed box-content w-1/4 border-background-gray border-r-1 text-center text-2xl pt-10">
      My page
      <div className="relative w-1/2 mx-auto h-1/5">
        <ProfileImage user={user} />
        <div className="absolute top-25 left-30">
          <UploadImages mode="single" onUpload={handleImageChange} />
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="inline-flex flex-row items-center mx-auto">
          {user && isEditing ? (
            <>
              <input
                className="w-2/3 ml-10 border-b-2 bg-[#FFFCF2] border-[#403D39]"
                type="text"
                name="nickname"
                value={nickname}
                onChange={handleNicknameChange}
              />
            </>
          ) : (
            <div className="text-3xl font-bold font-mixed">
              {user?.nickname}
            </div>
          )}
          <button
            className="flex-shrink-0 ml-2"
            onClick={isEditing ? handleSave : handleEdit}
          >
            {isEditing ? (
              <CheckIcon className="w-6 h-6" />
            ) : (
              <PencilSquareIcon className="w-6 h-6" />
            )}
          </button>
        </div>
        {error && <p className="block mt-3 text-sm text-red-500">{error}</p>}
      </div>
      <div className="w-full pt-5">
        <button
          className="w-full mt-5"
          onClick={() => setSelectedMenu('scrap')}
        >
          나의 스크랩
        </button>
        <button
          className="w-full mt-2"
          onClick={() => setSelectedMenu('triplist')}
        >
          내 여행 이력
        </button>
      </div>
    </div>
  );
}
