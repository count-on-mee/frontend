import Footer from '../components/Footer';
import { useState } from 'react';
import { PencilSquareIcon, PlusCircleIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../recoil/user';
import ProfileImage from '../components/ProfileImage';
import UploadImages from '../components/UploadImages';
import { updateUser } from '../services/userService';


export default function MyPage () {  
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);

  const [nickname, setNickname] = useState(user?.nickname);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const validateNickname = () => {
    if (nickname.length > 30){
      return '닉네임을 30글자를 초과할 수 없습니다.';
    }
    return '';
  };

  const handleSave = () => {
    const errorMessage = validateNickname(nickname);
    if(errorMessage) {
      setError(errorMessage);
      return;
    }
    updateUser({nickname});
    setUser( {...user, nickname });
    setIsEditing(false);
  }

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
    setUser((prevUSer) => ({
      ...prevUSer,
      profileImgUrl: uploadImageUrl,
    }))
    updateUser({ uploadImage: uploadImage[0]});
    }
  }

  return(
    <div className="w-full flex flex-col bg-[#FFFCF2]">
      <div className="flex flex-nowrap flex-grow">
        <div className="font-mixed w-1/4 border-[#403D39] border-r-2 text-center text-2xl pt-5">
          My page
            <div className="relative">
              <div className="w-1/2 h-1/2 mx-auto">
                <ProfileImage  
                user={user} />
              </div>
                <UploadImages
                  className="absolute top-24 left-60"
                  mode="single" 
                  onUpload={handleImageChange}/>
            </div>
            <div className="flex flex-col justify-center w-full">
              <div className="inline-flex flex-row items-center mx-auto">
                { user && isEditing ? ( 
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
                  <div className="text-3xl font-mixed font-bold">{ user?.nickname }</div>
                  )
                }
                <button 
                  className="ml-2 flex-shrink-0"
                  onClick={isEditing ? handleSave : handleEdit}
                >
                  { isEditing ? (<CheckIcon 
                      className="w-6 h-6"
                    />) : (<PencilSquareIcon className="w-6 h-6" />)}
                </button>
               </div>
               {error && (
                    <p className="block text-red-500 text-sm mt-3">{error}</p>
                  )}
            </div>
          </div>
          <div className="flex-1">
            <div className="inline">
              <div 
                className="inline-block px-3 py-2 mt-5 ml-10 font-mixed rounded-tl-lg rounded-br-lg bg-[#CCC5B9]">
                spot      
              </div>
              <div className="h-1 bg-black rounded-lg mx-10 mb-52"></div>
            </div>
            <div className="inline">
              <div 
                className="inline-block px-3 py-2 mt-5 ml-10 font-mixed rounded-tl-lg rounded-br-lg bg-[#CCC5B9]">
                curation     
              </div>
              <div className="h-1 bg-black rounded-lg mx-10"></div>
            </div>
          </div>
        </div>
      <Footer />
    </div>
    );
}