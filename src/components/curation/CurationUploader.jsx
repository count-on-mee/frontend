import Modal from 'react-modal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Searchbar from '../ui/Searchbar';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../../recoil/auth';
import api from '../../utils/axiosInstance';
import { useRecoilState } from 'recoil';
import scrappedSpotsAtom from '../../recoil/scrapedSpot';
import SpotCart from './SpotCart';
import defaultImage from '../../assets/icon.png';
// import { useSpotSearch } from '../../hooks/useSearch';

Modal.setAppElement('#root');

export default function CurationUploader({ isOpen, onClose }) {
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [scrapedSpots, setScrapedSpots] = useRecoilState(scrappedSpotsAtom);
  const [cartSpots, setCartSpots] = useState([]);
  const categories = ['여행', '식당', '카페', '자연'];

  const handleAddToCart = (spot) => {
    setCartSpots((prev) => {
      const alreadyIn = prev.some((s) => s.spotScrapId === spot.spotScrapId);
      if (alreadyIn) {
        return prev.filter((s) => s.spotScrapId !== spot.spotScrapId); // 제거
      } else {
        return [...prev, spot]; // 추가
      }
    });
    // console.log(cartSpots);
  };

  const handleDelete = (spotScrapId) => {
    setCartSpots((prev) =>
      prev.filter((spot) => spot.spotScrapId !== spotScrapId),
    );
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
    // console.log(selectedCategories);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedCategories([]);
    setCartSpots([]);
    onClose();
  };

  const handleSubmit = async () => {
    const refinedSpots = cartSpots.map((spot, index) => ({
      spotId: spot.spotId,
      order: index + 1,
    }));

    const payload = {
      name,
      description,
      categories: selectedCategories,
      spots: refinedSpots,
    };

    if (refinedSpots.length < 2) {
      alert('스팟은 최소 2개 이상 선택해야 합니다.');
      return;
    }

    if (categories < 1) {
      alert('카테고리는 최소 1개 이상 선택해야 합니다.');
      return;
    }

    // console.log(payload);

    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.post('/curations', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleClose();
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 1000) {
      setError(true);
    } else {
      setError(false);
      setDescription(value);
    }
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
      //   console.log(data);
      setScrapedSpots(data);
    } catch (error) {
      console.error('Failed to fetch scraped spots:', error);
    }
  };

  useEffect(() => {
    fetchScrapedSpots();
  }, []);

  return !isOpen ? null : (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-[100vh] max-h-[90vh] p-6 bg-background-light rounded-lg shadow-lg">
          <div className="flex pl-5 justify-between">
            <p className="text-2xl font-bold">Post Curation</p>
            <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="gap-2">
              <Searchbar
                //   value={searchTerm}
                //   onChange={handleSearch}
                placeholder="spot search"
                className="mt-5 w-1/2"
              />
              {scrapedSpots.length > 0 && (
                <div>
                  <div className="max-h-[40vh] overflow-y-auto mt-5">
                    {scrapedSpots.map((spot) => (
                      <div
                        key={spot.spotScrapId}
                        onClick={() => handleAddToCart(spot)}
                        className={`${cartSpots.some((s) => s.spotScrapId === spot.spotScrapId) ? 'border border-charcoal' : ''}`}
                      >
                        <div className="flex py-2">
                          <img
                            src={spot.imgUrls[0] || defaultImage}
                            alt={spot.title}
                            className="w-15 h-15 rounded-lg object-cover"
                          />
                          <div className="ml-5 my-auto truncate">
                            <p>{spot.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-5 mb-2 text-md font-mixed">
                2개 이상의 spot을 선택해 주세요!
              </div>
              <SpotCart spots={cartSpots} onDelete={handleDelete} />
            </div>
            <div>
              <div className="mt-5 text-xl font-mixed">Curation Title</div>
              <textarea
                className="w-full border-b-2 h-6 resize-none overflow-hidden"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="mt-5 text-xl font-mixed">상세 설명</div>
              <textarea
                value={description}
                onChange={handleChange}
                className={`resize-none outline-none w-full h-70 mt-5 border-2 p-5 ${error ? 'border-red-500' : 'border-black'}`}
                placeholder="-리뷰 작성 시 유의사항 한 번 확인하기! &#13;&#13;-리뷰를 보는 모든 사용자와 사업자에게 상처가 되는 욕설, 비방, 명예훼손성 표현은 사용하지 말아주세요."
              />
              <p className="text-right">{description.length}/1000</p>
              {error && (
                <div className="text-sm text-red-500">
                  1000자 이내로 입력해주세요
                </div>
              )}
              <div className="flex">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`box-shadow mr-5 px-2 py-1  rounded-2xl ${selectedCategories.includes(category) ? 'bg-primary' : ''}`}
                  >
                    {category}
                  </button>
                ))}
                {/* <button className={`box-shadow mr-5 px-2 py-1  rounded-2xl ${selectedCategories.includes("여행" ? "bg-primary" : "")}`}
                onClick={() => handleCategoryClick("여행")}
                >여행</button>
                <button className={`box-shadow mr-5 px-2 py-1  rounded-2xl ${selectedCategories.includes("식당" ? "bg-primary" : "")}`}
                onClick={() => handleCategoryClick("식당")}
                >식당</button>
                <button className={`box-shadow mr-5 px-2 py-1  rounded-2xl ${selectedCategories.includes("카페" ? "bg-primary" : "")}`}
                onClick={() => handleCategoryClick("카페")}
                >카페</button>
                <button className={`box-shadow mr-5 px-2 py-1  rounded-2xl ${selectedCategories.includes("자연" ? "bg-primary" : "")}`}
                onClick={() => handleCategoryClick("자연")}
                >자연</button> */}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="w-20 bg-[#EB5E28] font-mixed text-white py-2 rounded-2xl hover:bg-red-500"
              onClick={() => handleSubmit()}
            >
              작성 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
