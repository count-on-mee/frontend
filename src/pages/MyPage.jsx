import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { PencilSquareIcon, CheckIcon, BookmarkIcon } from '@heroicons/react/24/outline';
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
  
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [scrapedCurations, setScrapedCurations] = useState([]);


  const fetchScrapedSpots = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8888/scraps/spots', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setScrapedSpots(data);
    } catch (error) {
      console.error('Failed to fetch scraped spots:', error);
    }
  };

  const fetchScrapedCurations = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8888/scraps/curations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setScrapedCurations(data);
    } catch (error) {
      console.error('Failed to fetch scraped curations:', error);
    }
  };

  useEffect(() => {
      fetchScrapedSpots();
      fetchScrapedCurations();
    }, []);

    const handleSpotScrap = async ( event, spotId ) => {
      event.stopPropagation();
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8888/scraps/spots/${spotId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isDeleted: true })
        });
        if (!response.ok) {
          throw new Error('Failed to cancel scrap');
        }
        fetchScrapedSpots();
      } catch (error) {
        console.error('스크랩 취소 에러:', error);
      }
    }

    const handleCurationScrap = async ( event, curationId ) => {
      event.stopPropagation();
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8888/scraps/curations/${curationId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isDeleted: true })
        });
        if (!response.ok) {
          throw new Error('Failed to cancel scrap');
        }
        fetchScrapedCurations();
      } catch (error) {
        console.error('스크랩 취소 에러:', error);
      }
    }
  
  // const handleSpotNavigate = (spot) => {
  //   setSelectedSpot(spot);
  //   console.log(selectedSpotAtom);
  //   navigate('/map/spot');
  // }

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
    setUser((prevUser) => ({
      ...prevUser,
      profileImgUrl: uploadImageUrl,
    }))
    updateUser({ uploadImage: uploadImage[0]});
    }
  }

  return(
    <div className="w-full flex flex-col bg-[#FFFCF2]">
      <div className="flex flex-nowrap flex-grow">
        <div className="font-mixed box-content w-1/4 border-[#403D39] border-r-2 text-center text-2xl pt-5">
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
          <div className="flex-1 w-3/4">
            <div className="inline">
              <div 
                className="inline-block px-3 py-2 mt-5 ml-10 font-mixed rounded-tl-lg rounded-br-lg bg-[#CCC5B9]">
                spot      
              </div>
              <div className="h-1 bg-black rounded-lg mx-10"></div>
              {scrapedSpots.length > 0 && (
                <div className="flex h-52 mx-10 overflow-x-auto">
                {scrapedSpots.map(spot => (
                  <div 
                    key={spot.spotScrapId} onClick={() => handleSpotNavigate(spot)} className="mx-3 cursor-pointer"
                  >
                    <div className="relative">
                      <img 
                        src={spot.imgUrl}
                        alt={spot.title}
                        className="flex relative h-36 w-60 rounded-md mt-2"
                      />
                      <BookmarkIcon
                        className={`absolute top-3 right-3 w-5 h-5 ${spot.isDeleted ? '' : 'fill-[#EB5E28] stroke-[#EB5E28]'}`} onClick={(event) => handleSpotScrap(event, spot.spotId)}
                      />
                    </div>
                    <div className="font-mixed truncate w-56 font-light text-md">{spot.title}</div>

                  </div>  
                ))}
              </div>
              )}
            </div>
            <div className="inline">
              <div 
                className="inline-block px-3 py-2 mt-5 ml-10 font-mixed rounded-tl-lg rounded-br-lg bg-[#CCC5B9]">
                curation     
              </div>
              <div className="h-1 bg-black rounded-lg mx-10"></div>
              {scrapedCurations.length > 0 && (
                <div className="flex h-72 mx-10 overflow-x-auto">
                {scrapedCurations.map(curation => (
                  <div key={curation.curationScrapId} className="mx-3 cursor-pointer w-40">
                    <div className="relative w-40">
                      <img 
                        src={curation.imgUrl}
                        alt={curation.title}
                        className="flex h-60 w-40 rounded-md mt-2 object-cover"
                      />
                      <BookmarkIcon
                        className={`absolute top-3 right-3 w-5 h-5 ${curation.isDeleted ? '' : 'fill-[#EB5E28] stroke-[#EB5E28]'}`} onClick={(event) => handleCurationScrap(event, curation.curationId)}
                      />
                      <div className="absolute font-mixed text-white truncate w-40 left-1 bottom-1 text-md font-bold">{curation.title}</div>
                    </div>
                    

                  </div>  
                ))}
              </div>
              )}
            </div>
          </div>
        </div>
      <Footer />
    </div>
    );
}