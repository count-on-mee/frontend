import Spot from './Spot';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ReviewUploader from './ReviewUploader';
import PhotoDump from './PhotoDump';
import { getRecoil } from 'recoil-nexus';
import authAtom from '../../recoil/auth';
import api from '../../utils/axiosInstance';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

export default function SpotDetail({
  selectedSpot,
  setSelectedSpot,
  handleSpotScrap,
}) {
  const [photoDump, setPhotoDump] = useState([]);
  const spot = selectedSpot;
  const auth = useRecoilValue(authAtom);
  const navigate = useNavigate();

  const fetchPhotoDump = async () => {
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api(`spots/${spot.spotId}/reviews`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.data;
      setPhotoDump(data);
    } catch (error) {
      console.error('Failed to fetch photo dump:', error);
    }
  };

  useEffect(() => {
    if (spot.spotId) {
      fetchPhotoDump();
    }
  }, [spot?.spotId]);

  const handleClose = () => {
    setSelectedSpot(null);
  };
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const handleUploaderOpen = () => {
    if (!auth.accessToken) {
      navigate('/login-notice');
      return;
    }
    setIsUploaderOpen(true);
  };
  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 flex justify-between items-center border-b border-gray-200 px-6 py-4">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="font-semibold text-lg text-[#252422] truncate flex-1 text-center px-4">
          {selectedSpot.name}
        </h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Spot
            varient="detail"
            spot={selectedSpot}
            handleScrapClick={handleSpotScrap}
          />

          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#252422]">후기</h3>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#f0f0f3] text-[#252422] rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:bg-[#EB5E28] hover:text-white"
              onClick={handleUploaderOpen}
            >
              <FaRegPenToSquare className="w-4 h-4" />
              <span>후기 등록</span>
            </button>
          </div>

          <ReviewUploader
            isOpen={isUploaderOpen}
            selectedSpot={selectedSpot}
            setSelectedSpot={setSelectedSpot}
            onClose={() => setIsUploaderOpen(false)}
            fetchPhotoDump={fetchPhotoDump}
          />

          <div className="mt-6">
            <PhotoDump
              selectedSpot={selectedSpot}
              photoDump={photoDump}
              setPhotoDump={setPhotoDump}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
