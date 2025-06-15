import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../recoil/user';
import { XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { FaRegPenToSquare } from 'react-icons/fa6';
import ProfileSection from '../components/user/ProfileSection';
import updateUser from '../components/user/UpdateUser';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../recoil/auth';
import api from '../utils/axiosInstance';
import defaultImage from '../assets/logo.png';
import MyTripList from '../components/user/MyTripList';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

export default function MyPage () {  
  const [user,setUser] = useRecoilState(userAtom);
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [selectedMenu, setSelectedMenu] = useState("scrap");
  
  const [scrapedSpots, setScrapedSpots] = useState([]);
  const [scrapedCurations, setScrapedCurations] = useState([]);
  const [visibleSpotCount, setVisibleSpotCount] = useState(3);
  const [visibleCurationCount, setVisibleCurationCount] = useState(5);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const navigate = useNavigate();

  const openModal = () => {
    setInviteModalOpen(true);
  };

  const closeModal = () => {
    setInviteModalOpen(false);
  };

  const fetchScrapedSpots = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.get('/scraps/spots', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      console.log(data);
      setScrapedSpots(data);
    } catch (error) {
      console.error('Failed to fetch scraped spots:', error);
    }
  };

  const fetchScrapedCurations = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.get('/scraps/curations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
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
        const token = getRecoil(authAtom).accessToken;
        const response = await api.delete(`/scraps/spots/${spotId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isDeleted: true })
        });
        fetchScrapedSpots();
      } catch (error) {
        console.error('스크랩 취소 에러:', error);
      }
    }

    const handleCurationScrap = async ( event, curationId ) => {
      event.stopPropagation();
      try {
        const token = getRecoil(authAtom).accessToken;
        const response = await api.delete(`/scraps/curations/${curationId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isDeleted: true })
        });
        fetchScrapedCurations();
      } catch (error) {
        console.error('스크랩 취소 에러:', error);
      }
    }

  const validateNickname = () => {
    if (!nickname) return;
    if (nickname.length > 30){
      return '닉네임을 30글자를 초과할 수 없습니다.';
    }
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
      imgUrl: uploadImageUrl,
    }))
    updateUser({ uploadImage: uploadImage[0]});
    }
  }
  
  const handleShowMoreSpot = () => {
    setVisibleSpotCount((prev) => prev + 3);
  }

  const handleShowMoreCuration = () => {
    setVisibleCurationCount((prev) => prev + 5);
  }

    const handleJoinTrip = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.post(`/trips/invitations/${inviteCode}`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })
      const data = await response.data;
      setInviteModalOpen(false);
      setInviteCode('');
      navigate(`/trip/${data.tripId}/itinerary`);
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('참여하는 중 문제가 발생했습니다.');
    }
  };

  return(
    <div className="w-full flex flex-col bg-background-light">
      <div className="flex flex-grow flex-nowrap">
          <ProfileSection handleImageChange={handleImageChange} handleNicknameChange={handleNicknameChange} isEditing={isEditing} handleSave={handleSave} handleEdit={handleEdit} error={error} nickname={nickname} setSelectedMenu={setSelectedMenu}/>
          <div className="flex-1 w-3/4">
            {selectedMenu === "scrap" && 
            <>
              <div className="w-full">
              <div 
                className="px-3 py-2 mt-5 mx-auto font-mixed text-2xl text-center text-shadow">
                SPOT      
              </div>
              {scrapedSpots.length > 0 && (
                <div className="grid grid-cols-3 gap-5">
                {scrapedSpots.slice(0, visibleSpotCount).map(spot => (
                  <div 
                    key={spot.spotScrapId}
                  >
                    <div className="relative mx-3">
                      <img 
                        src={spot.imgUrls || defaultImage}
                        alt={spot.title}
                        className="relative object-cover flex mt-2 rounded-md w-full aspect-16/9"
                        onError={(e) => {e.target.src = defaultImage;}}
                      />
                      <BookmarkIcon
                        className={`absolute top-3 right-3 w-5 h-5 ${spot.isDeleted ? '' : 'fill-[#EB5E28] stroke-[#EB5E28]'}`} onClick={(event) => handleSpotScrap(event, spot.spotId)}
                      />
                    </div>
                    <div className="w-56 font-light truncate font-mixed text-md">{spot.name}</div>
                  </div>  
                ))}
                <div></div>
                {visibleSpotCount < scrapedSpots.length && (
                  <button 
                    onClick={handleShowMoreSpot}
                    className="w-30 text-bold mx-auto bg-background-gray box-shadow py-2 rounded-2xl"
                  >
                    더보기
                  </button>
                )}
              </div>
              )}
            </div>
            <div className="w-full">
              <div 
                className="px-3 py-2 mt-5 mx-auto font-mixed text-2xl text-center text-shadow">
                CURATION     
              </div>
              {scrapedCurations.length > 0 && (
                <div className="grid grid-cols-5 gap-2 w-full">
                {scrapedCurations.slice(0, visibleCurationCount).map(curation => (
                  <div key={curation.curationScrapId}>
                    <div className="relative">
                      <img 
                        src={curation.imgUrl}
                        alt={curation.name}
                        className="relative object-cover flex mt-2 rounded-md w-full aspect-3/4"
                      />
                      <BookmarkIcon
                        className={`absolute top-3 right-3 w-5 h-5 ${curation.isDeleted ? '' : 'fill-[#EB5E28] stroke-[#EB5E28]'}`} onClick={(event) => handleCurationScrap(event, curation.curationId)}
                      />
                      <div className="absolute font-bold text-white truncate font-mixed left-2 bottom-1 text-md text-shadow">{curation.name}</div>
                    </div>
                  </div>  
                ))}
                <div></div>
                <div></div>
                {visibleCurationCount < scrapedCurations.length && (
                  <button 
                    onClick={handleShowMoreCuration}
                    className="w-30 mx-auto text-bold bg-background-gray box-shadow py-2 rounded-2xl"
                  >
                    더보기
                  </button>
                )}
              </div>
            )}
          </div>
            </>
            }
          {selectedMenu === "triplist" && <MyTripList />}
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
         onChange={e => setInviteCode(e.target.value)}
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